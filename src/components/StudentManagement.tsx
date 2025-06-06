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

interface Student {
  id: string;
  name: string;
  nim: string;
  university: string;
  faculty: string;
  major: string;
  semester: number;
  email: string;
  phone: string;
  address: string;
  group: string;
  position:
    | "coordinator"
    | "vice-coordinator"
    | "secretary"
    | "treasurer"
    | "member";
  joinDate: string;
  status: "active" | "inactive" | "graduated";
  avatar?: string;
}

const StudentManagement = () => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "Ahmad Rizki",
      nim: "2021001",
      university: "Universitas ABC",
      faculty: "Teknik",
      major: "Informatika",
      semester: 6,
      email: "rizki@email.com",
      phone: "08123456789",
      address: "Jl. Merdeka No. 123",
      group: "Kelompok A",
      position: "coordinator",
      joinDate: "2024-07-01",
      status: "active",
    },
    {
      id: "2",
      name: "Siti Nurhaliza",
      nim: "2021002",
      university: "Universitas ABC",
      faculty: "Ekonomi",
      major: "Manajemen",
      semester: 6,
      email: "siti@email.com",
      phone: "08234567890",
      address: "Jl. Sudirman No. 456",
      group: "Kelompok A",
      position: "secretary",
      joinDate: "2024-07-01",
      status: "active",
    },
    {
      id: "3",
      name: "Budi Santoso",
      nim: "2021003",
      university: "Universitas XYZ",
      faculty: "Pertanian",
      major: "Agroteknologi",
      semester: 6,
      email: "budi@email.com",
      phone: "08345678901",
      address: "Jl. Gatot Subroto No. 789",
      group: "Kelompok B",
      position: "member",
      joinDate: "2024-07-01",
      status: "active",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: "",
    nim: "",
    university: "",
    faculty: "",
    major: "",
    semester: 6,
    email: "",
    phone: "",
    address: "",
    group: "",
    position: "member",
    status: "active",
  });

  const groups = [...new Set(students.map((s) => s.group))];
  const positions = [
    { value: "coordinator", label: "Koordinator" },
    { value: "vice-coordinator", label: "Wakil Koordinator" },
    { value: "secretary", label: "Sekretaris" },
    { value: "treasurer", label: "Bendahara" },
    { value: "member", label: "Anggota" },
  ];

  const statusOptions = [
    { value: "active", label: "Aktif", color: "bg-green-100 text-green-800" },
    {
      value: "inactive",
      label: "Tidak Aktif",
      color: "bg-red-100 text-red-800",
    },
    { value: "graduated", label: "Lulus", color: "bg-blue-100 text-blue-800" },
  ];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nim.includes(searchTerm) ||
      student.university.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup =
      selectedGroup === "all" || student.group === selectedGroup;
    const matchesStatus =
      selectedStatus === "all" || student.status === selectedStatus;

    return matchesSearch && matchesGroup && matchesStatus;
  });

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.nim && newStudent.university) {
      const student: Student = {
        id: Date.now().toString(),
        joinDate: new Date().toISOString().split("T")[0],
        ...(newStudent as Student),
      };

      setStudents([...students, student]);
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
        group: "",
        position: "member",
        status: "active",
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setNewStudent(student);
    setIsAddDialogOpen(true);
  };

  const handleUpdateStudent = () => {
    if (
      editingStudent &&
      newStudent.name &&
      newStudent.nim &&
      newStudent.university
    ) {
      setStudents(
        students.map((s) =>
          s.id === editingStudent.id
            ? { ...editingStudent, ...(newStudent as Student) }
            : s
        )
      );
      setEditingStudent(null);
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
        group: "",
        position: "member",
        status: "active",
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter((s) => s.id !== id));
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
                    <Label htmlFor="group">Kelompok</Label>
                    <Input
                      id="group"
                      value={newStudent.group || ""}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, group: e.target.value })
                      }
                      placeholder="Kelompok A"
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
                        group: "",
                        position: "member",
                        status: "active",
                      });
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
                          <AvatarImage src={student.avatar} />
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
                                {student.group} -{" "}
                                {getPositionLabel(student.position)}
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
