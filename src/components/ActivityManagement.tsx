import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  MoreHorizontal,
  Eye,
  FileText,
  Target,
  Activity as ActivityIcon,
} from "lucide-react";
import { useData, type Student, type Activity } from "@/contexts/DataContext";

const ActivityManagement = () => {
  const { students, activities, addActivity, updateActivity, deleteActivity } =
    useData();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium" as "low" | "medium" | "high",
    startDate: "",
    endDate: "",
    location: "",
    coordinator: "",
    participants: [] as string[],
    budget: "",
    objectives: "",
  });

  const categories = [
    "Kesehatan",
    "Pendidikan",
    "Lingkungan",
    "Ekonomi",
    "Sosial",
    "Budaya",
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "planned":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Selesai";
      case "ongoing":
        return "Berlangsung";
      case "planned":
        return "Direncanakan";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "Tinggi";
      case "medium":
        return "Sedang";
      case "low":
        return "Rendah";
      default:
        return priority;
    }
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || activity.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || activity.category === filterCategory;
    const matchesPriority =
      filterPriority === "all" || activity.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });
  const handleAddActivity = () => {
    if (!formData.title || !formData.startDate || !formData.endDate) return;
    const newActivity = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      status: "planned" as const,
      startDate: formData.startDate,
      endDate: formData.endDate,
      location: formData.location,
      coordinator: formData.coordinator,
      participants: formData.participants,
      budget: parseFloat(formData.budget) || 0,
      usedBudget: 0,
      objectives: formData.objectives,
    };

    addActivity(newActivity);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditActivity = () => {
    if (!editingActivity || !formData.title) return;

    const updatedActivity = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      startDate: formData.startDate,
      endDate: formData.endDate,
      location: formData.location,
      coordinator: formData.coordinator,
      participants: formData.participants,
      budget: parseFloat(formData.budget) || editingActivity.budget,
      objectives: formData.objectives,
    };

    updateActivity(editingActivity.id, updatedActivity);
    setEditingActivity(null);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleDeleteActivity = (id: string) => {
    deleteActivity(id);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      priority: "medium",
      startDate: "",
      endDate: "",
      location: "",
      coordinator: "",
      participants: [],
      budget: "",
      objectives: "",
    });
  };
  const openEditDialog = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      description: activity.description,
      category: activity.category,
      priority: activity.priority,
      startDate: activity.startDate,
      endDate: activity.endDate,
      location: activity.location,
      coordinator: activity.coordinator,
      participants: activity.participants,
      budget: activity.budget.toString(),
      objectives: activity.objectives,
    });
  };

  const getActivityStats = () => {
    const total = activities.length;
    const completed = activities.filter((a) => a.status === "completed").length;
    const ongoing = activities.filter((a) => a.status === "ongoing").length;
    const planned = activities.filter((a) => a.status === "planned").length;
    const totalBudget = activities.reduce((sum, a) => sum + a.budget, 0);
    const usedBudget = activities.reduce((sum, a) => sum + a.usedBudget, 0);

    return { total, completed, ongoing, planned, totalBudget, usedBudget };
  };

  const stats = getActivityStats();

  return (
    <div className="space-y-6">
      {/* Header dengan Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Kegiatan
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.total}
                </p>
              </div>
              <ActivityIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Selesai</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.completed}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Berlangsung</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.ongoing}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Direncanakan
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.planned}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari kegiatan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="planned">Direncanakan</SelectItem>
                    <SelectItem value="ongoing">Berlangsung</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filterPriority}
                  onValueChange={setFilterPriority}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Prioritas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Prioritas</SelectItem>
                    <SelectItem value="high">Tinggi</SelectItem>
                    <SelectItem value="medium">Sedang</SelectItem>
                    <SelectItem value="low">Rendah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    resetForm();
                    setIsAddDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Kegiatan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingActivity ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Judul Kegiatan *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Masukkan judul kegiatan"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Kategori</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Deskripsi</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Deskripsi kegiatan"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="priority">Prioritas</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value: any) =>
                          setFormData({ ...formData, priority: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Rendah</SelectItem>
                          <SelectItem value="medium">Sedang</SelectItem>
                          <SelectItem value="high">Tinggi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="startDate">Tanggal Mulai *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="endDate">Tanggal Selesai *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Lokasi</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="Lokasi kegiatan"
                      />
                    </div>

                    <div>
                      <Label htmlFor="coordinator">Koordinator</Label>
                      <Select
                        value={formData.coordinator}
                        onValueChange={(value) =>
                          setFormData({ ...formData, coordinator: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih koordinator" />
                        </SelectTrigger>{" "}
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.name}>
                              {student.name} ({student.nim})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="budget">Anggaran (Rp)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="objectives">Tujuan Kegiatan</Label>
                    <Textarea
                      id="objectives"
                      value={formData.objectives}
                      onChange={(e) =>
                        setFormData({ ...formData, objectives: e.target.value })
                      }
                      placeholder="Masukkan setiap tujuan pada baris baru"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Pisahkan setiap tujuan dengan baris baru
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setEditingActivity(null);
                        resetForm();
                      }}
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={
                        editingActivity ? handleEditActivity : handleAddActivity
                      }
                      disabled={
                        !formData.title ||
                        !formData.startDate ||
                        !formData.endDate
                      }
                    >
                      {editingActivity ? "Simpan Perubahan" : "Tambah Kegiatan"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Daftar Kegiatan */}
      <div className="grid gap-4">
        {filteredActivities.map((activity) => (
          <Card key={activity.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {activity.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={getStatusColor(activity.status)}>
                          {getStatusText(activity.status)}
                        </Badge>
                        <Badge className={getPriorityColor(activity.priority)}>
                          Prioritas {getPriorityText(activity.priority)}
                        </Badge>
                        {activity.category && (
                          <Badge variant="outline">{activity.category}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <div>
                        <p className="font-medium">Periode</p>
                        <p>
                          {new Date(activity.startDate).toLocaleDateString(
                            "id-ID"
                          )}{" "}
                          -{" "}
                          {new Date(activity.endDate).toLocaleDateString(
                            "id-ID"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <div>
                        <p className="font-medium">Lokasi</p>
                        <p>{activity.location || "Belum ditentukan"}</p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <div>
                        <p className="font-medium">Koordinator</p>
                        <p>{activity.coordinator || "Belum ditentukan"}</p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Target className="h-4 w-4 mr-2" />
                      <div>
                        <p className="font-medium">Anggaran</p>
                        <p>Rp {activity.budget.toLocaleString("id-ID")}</p>
                        {activity.usedBudget > 0 && (
                          <p className="text-xs text-green-600">
                            Terpakai: Rp{" "}
                            {activity.usedBudget.toLocaleString("id-ID")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>{" "}
                  {activity.objectives && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Tujuan:
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.objectives.length > 100
                          ? activity.objectives.substring(0, 100) + "..."
                          : activity.objectives}
                      </p>
                    </div>
                  )}
                  {activity.results && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Hasil:
                      </p>
                      <p className="text-sm text-green-600">
                        {activity.results.length > 100
                          ? activity.results.substring(0, 100) + "..."
                          : activity.results}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex lg:flex-col gap-2 lg:w-auto w-full">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedActivity(activity)}
                        className="flex-1 lg:flex-none"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Detail
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{selectedActivity?.title}</DialogTitle>
                      </DialogHeader>
                      {selectedActivity && (
                        <Tabs defaultValue="overview" className="space-y-4">
                          <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="participants">
                              Peserta
                            </TabsTrigger>
                            <TabsTrigger value="budget">Anggaran</TabsTrigger>
                            <TabsTrigger value="achievements">
                              Pencapaian
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="overview" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Informasi Dasar
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium">
                                      Kategori:
                                    </span>{" "}
                                    {selectedActivity.category}
                                  </div>
                                  <div>
                                    <span className="font-medium">Status:</span>{" "}
                                    {getStatusText(selectedActivity.status)}
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      Prioritas:
                                    </span>{" "}
                                    {getPriorityText(selectedActivity.priority)}
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      Koordinator:
                                    </span>{" "}
                                    {selectedActivity.coordinator}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Jadwal & Lokasi
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium">Mulai:</span>{" "}
                                    {new Date(
                                      selectedActivity.startDate
                                    ).toLocaleDateString("id-ID", {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      Selesai:
                                    </span>{" "}
                                    {new Date(
                                      selectedActivity.endDate
                                    ).toLocaleDateString("id-ID", {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </div>
                                  <div>
                                    <span className="font-medium">Lokasi:</span>{" "}
                                    {selectedActivity.location}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Deskripsi</h4>
                              <p className="text-sm text-gray-600">
                                {selectedActivity.description}
                              </p>
                            </div>{" "}
                            <div>
                              <h4 className="font-semibold mb-2">
                                Tujuan Kegiatan
                              </h4>
                              <p className="text-sm text-gray-600">
                                {selectedActivity.objectives}
                              </p>
                            </div>
                          </TabsContent>
                          <TabsContent value="participants">
                            <div>
                              <h4 className="font-semibold mb-4">
                                Peserta ({selectedActivity.participants.length}{" "}
                                orang)
                              </h4>{" "}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedActivity.participants.map(
                                  (participantId) => {
                                    const student = students.find(
                                      (s) => s.id === participantId
                                    );
                                    return student ? (
                                      <div
                                        key={student.id}
                                        className="flex items-center p-3 border rounded-lg"
                                      >
                                        <div className="flex-1">
                                          <p className="font-medium">
                                            {student.name}
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            {student.nim}
                                          </p>
                                        </div>
                                        <Badge variant="outline">
                                          {student.position || "Member"}
                                        </Badge>
                                      </div>
                                    ) : null;
                                  }
                                )}
                              </div>
                            </div>
                          </TabsContent>
                          <TabsContent value="budget">
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                  <CardContent className="p-4">
                                    <p className="text-sm text-gray-600">
                                      Total Anggaran
                                    </p>
                                    <p className="text-xl font-bold text-blue-600">
                                      Rp{" "}
                                      {selectedActivity.budget.toLocaleString(
                                        "id-ID"
                                      )}
                                    </p>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4">
                                    <p className="text-sm text-gray-600">
                                      Terpakai
                                    </p>
                                    <p className="text-xl font-bold text-red-600">
                                      Rp{" "}
                                      {selectedActivity.usedBudget.toLocaleString(
                                        "id-ID"
                                      )}
                                    </p>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4">
                                    <p className="text-sm text-gray-600">
                                      Sisa
                                    </p>
                                    <p className="text-xl font-bold text-green-600">
                                      Rp{" "}
                                      {(
                                        selectedActivity.budget -
                                        selectedActivity.usedBudget
                                      ).toLocaleString("id-ID")}
                                    </p>
                                  </CardContent>
                                </Card>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className="bg-blue-600 h-3 rounded-full"
                                  style={{
                                    width: `${Math.min(
                                      (selectedActivity.usedBudget /
                                        selectedActivity.budget) *
                                        100,
                                      100
                                    )}%`,
                                  }}
                                />
                              </div>
                              <p className="text-sm text-gray-600 text-center">
                                {(
                                  (selectedActivity.usedBudget /
                                    selectedActivity.budget) *
                                  100
                                ).toFixed(1)}
                                % dari total anggaran
                              </p>
                            </div>
                          </TabsContent>{" "}
                          <TabsContent value="achievements">
                            <div>
                              <h4 className="font-semibold mb-4">
                                Hasil & Pencapaian
                              </h4>
                              {selectedActivity.results ? (
                                <div className="p-4 bg-green-50 rounded-lg">
                                  <p className="text-sm text-gray-700">
                                    {selectedActivity.results}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-gray-500 text-center py-8">
                                  Belum ada hasil yang dicatat
                                </p>
                              )}
                            </div>
                          </TabsContent>
                        </Tabs>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      openEditDialog(activity);
                      setIsAddDialogOpen(true);
                    }}
                    className="flex-1 lg:flex-none"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteActivity(activity.id)}
                    className="flex-1 lg:flex-none text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredActivities.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <ActivityIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tidak ada kegiatan ditemukan
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ||
                filterStatus !== "all" ||
                filterCategory !== "all" ||
                filterPriority !== "all"
                  ? "Coba ubah filter atau kata kunci pencarian"
                  : "Belum ada kegiatan yang dibuat"}
              </p>
              {!searchTerm &&
                filterStatus === "all" &&
                filterCategory === "all" &&
                filterPriority === "all" && (
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Kegiatan Pertama
                  </Button>
                )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ActivityManagement;
