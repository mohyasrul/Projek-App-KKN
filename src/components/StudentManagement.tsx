import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  UserCheck,
  GraduationCap,
} from "lucide-react";
import { useData, type Student } from "@/contexts/DataContext";

const StudentManagement = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useData();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState({
    name: "",
    nim: "",
    university: "",
    faculty: "",
    major: "",
    semester: 6,
    email: "",
    phone: "",
    address: "",
    program: "",
    position: "member" as Student["position"],
    status: "active" as Student["status"],
    gpa: 0,
    joinDate: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    skills: [] as string[],
    interests: [] as string[],
  });

  // Define status options and positions
  const statusOptions = [
    { value: "active", label: "Aktif", color: "bg-green-100 text-green-800" },
    {
      value: "inactive",
      label: "Tidak Aktif",
      color: "bg-red-100 text-red-800",
    },
    { value: "alumni", label: "Alumni", color: "bg-blue-100 text-blue-800" },
  ];

  const positions = [
    { value: "coordinator", label: "Koordinator" },
    { value: "vice_coordinator", label: "Wakil Koordinator" },
    { value: "secretary", label: "Sekretaris" },
    { value: "treasurer", label: "Bendahara" },
    { value: "member", label: "Anggota" },
  ];

  const groups = [...new Set(students.map((s) => s.program || "General"))];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nim.includes(searchTerm) ||
      student.university.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup =
      selectedGroup === "all" ||
      (student.program || "General") === selectedGroup;
    const matchesStatus =
      selectedStatus === "all" || student.status === selectedStatus;

    return matchesSearch && matchesGroup && matchesStatus;
  });

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.nim && newStudent.university) {
      addStudent({
        ...newStudent,
        joinDate: newStudent.joinDate || new Date().toISOString().split("T")[0],
      });
      resetForm();
      setIsAddDialogOpen(false);
    }
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setNewStudent({
      name: student.name,
      nim: student.nim,
      university: student.university,
      faculty: student.faculty,
      major: student.major,
      semester: student.semester,
      email: student.email,
      phone: student.phone,
      address: student.address,
      program: student.program || "",
      position: student.position || "member",
      status: student.status,
      gpa: student.gpa || 0,
      joinDate: student.joinDate || "",
      emergencyContact: student.emergencyContact || {
        name: "",
        relationship: "",
        phone: "",
      },
      skills: student.skills || [],
      interests: student.interests || [],
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateStudent = () => {
    if (
      editingStudent &&
      newStudent.name &&
      newStudent.nim &&
      newStudent.university
    ) {
      updateStudent(editingStudent.id, newStudent);
      setEditingStudent(null);
      resetForm();
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteStudent = (id: string) => {
    deleteStudent(id);
  };

  const resetForm = () => {
    setNewStudent({
      name: "",
      nim: "",
      university: "",
      faculty: "",
      major: "",
      semester: 6,
      email: "",
      phone: "",
      address: "",
      program: "",
      position: "member" as Student["position"],
      status: "active" as Student["status"],
      gpa: 0,
      joinDate: "",
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
      skills: [],
      interests: [],
    });
    setEditingStudent(null);
  };

  const getPositionLabel = (position: string) => {
    const pos = positions.find((p) => p.value === position);
    return pos ? pos.label : position;
  };

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find((s) => s.value === status);
    return statusOption ? statusOption : statusOptions[0];
  };
  const stats = [
    {
      title: "Total Peserta",
      value: students.length,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Peserta Aktif",
      value: students.filter((s) => s.status === "active").length,
      icon: UserCheck,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Total Kelompok",
      value: groups.length,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Koordinator",
      value: students.filter((s) => s.position === "coordinator").length,
      icon: GraduationCap,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bg}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari nama, NIM, atau universitas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Kelompok" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelompok</SelectItem>
                  {groups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingStudent(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Peserta
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingStudent ? "Edit Peserta" : "Tambah Peserta Baru"}
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      value={newStudent.name || ""}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, name: e.target.value })
                      }
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nim">NIM</Label>
                    <Input
                      id="nim"
                      value={newStudent.nim || ""}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, nim: e.target.value })
                      }
                      placeholder="Masukkan NIM"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="university">Universitas</Label>
                    <Input
                      id="university"
                      value={newStudent.university || ""}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          university: e.target.value,
                        })
                      }
                      placeholder="Nama universitas"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="faculty">Fakultas</Label>
                    <Input
                      id="faculty"
                      value={newStudent.faculty || ""}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          faculty: e.target.value,
                        })
                      }
                      placeholder="Nama fakultas"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="major">Jurusan</Label>
                    <Input
                      id="major"
                      value={newStudent.major || ""}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, major: e.target.value })
                      }
                      placeholder="Nama jurusan"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Input
                      id="semester"
                      type="number"
                      value={newStudent.semester || 6}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          semester: parseInt(e.target.value),
                        })
                      }
                      min="1"
                      max="14"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newStudent.email || ""}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, email: e.target.value })
                      }
                      placeholder="email@domain.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor HP</Label>
                    <Input
                      id="phone"
                      value={newStudent.phone || ""}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, phone: e.target.value })
                      }
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="program">Program/Kelompok</Label>
                    <Input
                      id="program"
                      value={newStudent.program || ""}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          program: e.target.value,
                        })
                      }
                      placeholder="KKN15 A"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Posisi</Label>
                    <Select
                      value={newStudent.position || "member"}
                      onValueChange={(value) =>
                        setNewStudent({ ...newStudent, position: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih posisi" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map((pos) => (
                          <SelectItem key={pos.value} value={pos.value}>
                            {pos.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newStudent.status || "active"}
                      onValueChange={(value) =>
                        setNewStudent({ ...newStudent, status: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gpa">IPK</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      value={newStudent.gpa || 0}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          gpa: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="3.50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Textarea
                    id="address"
                    value={newStudent.address || ""}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, address: e.target.value })
                    }
                    placeholder="Alamat lengkap"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setEditingStudent(null);
                      resetForm();
                    }}
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={
                      editingStudent ? handleUpdateStudent : handleAddStudent
                    }
                  >
                    {editingStudent ? "Update" : "Tambah"} Peserta
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Daftar Peserta KKN</span>
            <Badge variant="secondary">{filteredStudents.length} peserta</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Tidak ada peserta ditemukan</p>
              </div>
            ) : (
              filteredStudents.map((student) => {
                const statusBadge = getStatusBadge(student.status);

                return (
                  <div
                    key={student.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-lg">
                              {student.name}
                            </h3>
                            <Badge variant="outline">{student.nim}</Badge>
                            <Badge
                              variant="secondary"
                              className={statusBadge.color}
                            >
                              {statusBadge.label}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <GraduationCap className="h-4 w-4" />
                              <span>{student.university}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>
                                {student.program || "General"} -{" "}
                                {getPositionLabel(student.position || "member")}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Mail className="h-4 w-4" />
                              <span>{student.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="h-4 w-4" />
                              <span>{student.phone}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {student.faculty} - {student.major}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Semester {student.semester}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditStudent(student)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentManagement;
