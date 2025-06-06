import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Database,
  Download,
  Upload,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Camera,
  MapPin,
  Clock,
  Users,
  Palette,
  Plus,
  Search,
  Edit,
  Phone,
  Star,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  university: string;
  nim: string;
  faculty: string;
  major: string;
  semester: number;
  address: string;
}

interface AppSettings {
  notifications: {
    email: boolean;
    push: boolean;
    announcements: boolean;
    activities: boolean;
    finance: boolean;
  };
  privacy: {
    profileVisible: boolean;
    contactVisible: boolean;
    activityVisible: boolean;
  };
  appearance: {
    theme: "light" | "dark" | "auto";
    language: "id" | "en";
    compactMode: boolean;
  };
  data: {
    autoBackup: boolean;
    backupFrequency: "daily" | "weekly" | "monthly";
    dataRetention: number;
  };
}

interface Location {
  id: string;
  name: string;
  type:
    | "desa"
    | "balai"
    | "sekolah"
    | "puskesmas"
    | "masjid"
    | "lapangan"
    | "kantor"
    | "lainnya";
  address: string;
  village: string;
  district: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  capacity: number;
  facilities: string[];
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  availability: "available" | "busy" | "maintenance" | "unavailable";
  operatingHours: {
    start: string;
    end: string;
  };
  description: string;
  images?: string[];
  rating: number;
  totalActivities: number;
  createdAt: string;
  updatedAt: string;
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "1",
    name: "Ahmad Wijaya",
    email: "ahmad.wijaya@student.ub.ac.id",
    phone: "08123456789",
    role: "coordinator",
    university: "Universitas Brawijaya",
    nim: "195150201111001",
    faculty: "Fakultas Ilmu Komputer",
    major: "Teknik Informatika",
    semester: 7,
    address: "Jl. Veteran, Malang, Jawa Timur",
  });

  // Password state
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // App settings state
  const [appSettings, setAppSettings] = useState<AppSettings>({
    notifications: {
      email: true,
      push: true,
      announcements: true,
      activities: true,
      finance: false,
    },
    privacy: {
      profileVisible: true,
      contactVisible: true,
      activityVisible: false,
    },
    appearance: {
      theme: "light",
      language: "id",
      compactMode: false,
    },
    data: {
      autoBackup: true,
      backupFrequency: "weekly",
      dataRetention: 12,
    },
  });

  // Location management state
  const [locations, setLocations] = useState<Location[]>([
    {
      id: "1",
      name: "Balai Desa Sukamaju",
      type: "balai",
      address: "Jl. Raya Desa No. 1",
      village: "Sukamaju",
      district: "Gondanglegi",
      coordinates: {
        latitude: -8.1545,
        longitude: 112.6304,
      },
      capacity: 150,
      facilities: ["Proyektor", "Sound System", "AC", "Toilet", "Parkir"],
      contactPerson: "Pak Suryanto",
      contactPhone: "081234567890",
      contactEmail: "balaidesa@sukamaju.id",
      availability: "available",
      operatingHours: {
        start: "08:00",
        end: "17:00",
      },
      description:
        "Balai desa yang sering digunakan untuk pertemuan dan kegiatan komunitas",
      rating: 4.5,
      totalActivities: 8,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: "2",
      name: "SD Negeri 1 Sukamaju",
      type: "sekolah",
      address: "Jl. Pendidikan No. 5",
      village: "Sukamaju",
      district: "Gondanglegi",
      capacity: 200,
      facilities: ["Kelas", "Lapangan", "Perpustakaan", "Kantin"],
      contactPerson: "Bu Siti Aminah",
      contactPhone: "081345678901",
      availability: "available",
      operatingHours: {
        start: "07:00",
        end: "15:00",
      },
      description:
        "Sekolah dasar dengan fasilitas yang memadai untuk kegiatan edukasi",
      rating: 4.2,
      totalActivities: 5,
      createdAt: "2024-01-16",
      updatedAt: "2024-01-16",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterAvailability, setFilterAvailability] = useState("all");
  const [isAddLocationDialogOpen, setIsAddLocationDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [locationFormData, setLocationFormData] = useState({
    name: "",
    type: "desa" as Location["type"],
    address: "",
    village: "",
    district: "",
    capacity: 50,
    facilities: [] as string[],
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    availability: "available" as Location["availability"],
    operatingHours: {
      start: "08:00",
      end: "17:00",
    },
    description: "",
    latitude: "",
    longitude: "",
  });

  const handleProfileUpdate = () => {
    setIsEditingProfile(false);
    alert("Profil berhasil diperbarui!");
  };

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      alert("Password baru dan konfirmasi tidak cocok!");
      return;
    }
    if (passwords.new.length < 6) {
      alert("Password baru minimal 6 karakter!");
      return;
    }
    setPasswords({ current: "", new: "", confirm: "" });
    alert("Password berhasil diubah!");
  };

  const handleSettingsUpdate = (
    category: keyof AppSettings,
    key: string,
    value: any
  ) => {
    setAppSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleExportData = () => {
    const data = {
      userProfile,
      appSettings,
      locations,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kkn-data-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.userProfile) setUserProfile(data.userProfile);
        if (data.appSettings) setAppSettings(data.appSettings);
        if (data.locations) setLocations(data.locations);
        alert("Data berhasil diimpor!");
      } catch (error) {
        alert("File tidak valid!");
      }
    };
    reader.readAsText(file);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "coordinator":
        return "Koordinator";
      case "secretary":
        return "Sekretaris";
      case "treasurer":
        return "Bendahara";
      default:
        return "Anggota";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "coordinator":
        return "bg-blue-100 text-blue-800";
      case "secretary":
        return "bg-green-100 text-green-800";
      case "treasurer":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Location management functions
  const getLocationTypeLabel = (type: Location["type"]) => {
    const types = {
      desa: "Desa",
      balai: "Balai",
      sekolah: "Sekolah",
      puskesmas: "Puskesmas",
      masjid: "Masjid",
      lapangan: "Lapangan",
      kantor: "Kantor",
      lainnya: "Lainnya",
    };
    return types[type];
  };

  const getAvailabilityLabel = (availability: Location["availability"]) => {
    const labels = {
      available: "Tersedia",
      busy: "Sedang Digunakan",
      maintenance: "Maintenance",
      unavailable: "Tidak Tersedia",
    };
    return labels[availability];
  };

  const getAvailabilityColor = (availability: Location["availability"]) => {
    const colors = {
      available: "bg-green-100 text-green-800",
      busy: "bg-yellow-100 text-yellow-800",
      maintenance: "bg-blue-100 text-blue-800",
      unavailable: "bg-red-100 text-red-800",
    };
    return colors[availability];
  };

  const filteredLocations = locations.filter((location) => {
    const matchesSearch =
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.village.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || location.type === filterType;
    const matchesAvailability =
      filterAvailability === "all" ||
      location.availability === filterAvailability;

    return matchesSearch && matchesType && matchesAvailability;
  });

  const handleAddLocation = () => {
    const newLocation: Location = {
      id: Date.now().toString(),
      name: locationFormData.name,
      type: locationFormData.type,
      address: locationFormData.address,
      village: locationFormData.village,
      district: locationFormData.district,
      coordinates:
        locationFormData.latitude && locationFormData.longitude
          ? {
              latitude: parseFloat(locationFormData.latitude),
              longitude: parseFloat(locationFormData.longitude),
            }
          : undefined,
      capacity: locationFormData.capacity,
      facilities: locationFormData.facilities,
      contactPerson: locationFormData.contactPerson,
      contactPhone: locationFormData.contactPhone,
      contactEmail: locationFormData.contactEmail,
      availability: locationFormData.availability,
      operatingHours: locationFormData.operatingHours,
      description: locationFormData.description,
      rating: 0,
      totalActivities: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLocations([...locations, newLocation]);
    setIsAddLocationDialogOpen(false);
    resetLocationForm();
  };

  const resetLocationForm = () => {
    setLocationFormData({
      name: "",
      type: "desa",
      address: "",
      village: "",
      district: "",
      capacity: 50,
      facilities: [],
      contactPerson: "",
      contactPhone: "",
      contactEmail: "",
      availability: "available",
      operatingHours: {
        start: "08:00",
        end: "17:00",
      },
      description: "",
      latitude: "",
      longitude: "",
    });
  };

  const handleDeleteLocation = (id: string) => {
    if (confirm("Yakin ingin menghapus lokasi ini?")) {
      setLocations(locations.filter((location) => location.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
          <p className="text-gray-600">
            Kelola profil, lokasi, dan konfigurasi aplikasi
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Lokasi</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifikasi</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Privasi</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Tampilan</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Data</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userProfile.avatar} />
                    <AvatarFallback className="text-2xl">
                      {userProfile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {userProfile.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{userProfile.email}</p>
                  <Badge className={getRoleBadgeColor(userProfile.role)}>
                    {getRoleLabel(userProfile.role)}
                  </Badge>
                </div>
                <Button
                  variant={isEditingProfile ? "outline" : "default"}
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                >
                  {isEditingProfile ? "Batal" : "Edit Profil"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      value={userProfile.name}
                      onChange={(e) =>
                        setUserProfile({ ...userProfile, name: e.target.value })
                      }
                      disabled={!isEditingProfile}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.email}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          email: e.target.value,
                        })
                      }
                      disabled={!isEditingProfile}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">No. Telepon</Label>
                    <Input
                      id="phone"
                      value={userProfile.phone}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          phone: e.target.value,
                        })
                      }
                      disabled={!isEditingProfile}
                    />
                  </div>

                  <div>
                    <Label htmlFor="university">Universitas</Label>
                    <Input
                      id="university"
                      value={userProfile.university}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          university: e.target.value,
                        })
                      }
                      disabled={!isEditingProfile}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nim">NIM</Label>
                    <Input
                      id="nim"
                      value={userProfile.nim}
                      onChange={(e) =>
                        setUserProfile({ ...userProfile, nim: e.target.value })
                      }
                      disabled={!isEditingProfile}
                    />
                  </div>

                  <div>
                    <Label htmlFor="faculty">Fakultas</Label>
                    <Input
                      id="faculty"
                      value={userProfile.faculty}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          faculty: e.target.value,
                        })
                      }
                      disabled={!isEditingProfile}
                    />
                  </div>

                  <div>
                    <Label htmlFor="major">Jurusan</Label>
                    <Input
                      id="major"
                      value={userProfile.major}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          major: e.target.value,
                        })
                      }
                      disabled={!isEditingProfile}
                    />
                  </div>

                  <div>
                    <Label htmlFor="semester">Semester</Label>
                    <Select
                      value={userProfile.semester.toString()}
                      onValueChange={(value) =>
                        setUserProfile({
                          ...userProfile,
                          semester: parseInt(value),
                        })
                      }
                      disabled={!isEditingProfile}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                          <SelectItem key={sem} value={sem.toString()}>
                            Semester {sem}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Alamat</Label>
                <Textarea
                  id="address"
                  value={userProfile.address}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, address: e.target.value })
                  }
                  disabled={!isEditingProfile}
                  rows={3}
                />
              </div>

              {isEditingProfile && (
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingProfile(false)}
                  >
                    Batal
                  </Button>
                  <Button onClick={handleProfileUpdate}>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Perubahan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Ubah Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Password Saat Ini</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords({ ...passwords, current: e.target.value })
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword">Password Baru</Label>
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">
                  Konfirmasi Password Baru
                </Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                />
              </div>

              <Button
                onClick={handlePasswordChange}
                disabled={
                  !passwords.current || !passwords.new || !passwords.confirm
                }
              >
                <Shield className="h-4 w-4 mr-2" />
                Ubah Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab - Location Management */}
        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manajemen Lokasi</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Kelola lokasi kegiatan KKN
                </p>
              </div>
              <Dialog
                open={isAddLocationDialogOpen}
                onOpenChange={setIsAddLocationDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Lokasi
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Tambah Lokasi Baru</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="locationName">Nama Lokasi</Label>
                        <Input
                          id="locationName"
                          value={locationFormData.name}
                          onChange={(e) =>
                            setLocationFormData({
                              ...locationFormData,
                              name: e.target.value,
                            })
                          }
                          placeholder="Contoh: Balai Desa Sukamaju"
                        />
                      </div>
                      <div>
                        <Label htmlFor="locationType">Jenis Lokasi</Label>
                        <Select
                          value={locationFormData.type}
                          onValueChange={(value: Location["type"]) =>
                            setLocationFormData({
                              ...locationFormData,
                              type: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="desa">Desa</SelectItem>
                            <SelectItem value="balai">Balai</SelectItem>
                            <SelectItem value="sekolah">Sekolah</SelectItem>
                            <SelectItem value="puskesmas">Puskesmas</SelectItem>
                            <SelectItem value="masjid">Masjid</SelectItem>
                            <SelectItem value="lapangan">Lapangan</SelectItem>
                            <SelectItem value="kantor">Kantor</SelectItem>
                            <SelectItem value="lainnya">Lainnya</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="locationAddress">Alamat</Label>
                      <Input
                        id="locationAddress"
                        value={locationFormData.address}
                        onChange={(e) =>
                          setLocationFormData({
                            ...locationFormData,
                            address: e.target.value,
                          })
                        }
                        placeholder="Alamat lengkap lokasi"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="locationVillage">Desa</Label>
                        <Input
                          id="locationVillage"
                          value={locationFormData.village}
                          onChange={(e) =>
                            setLocationFormData({
                              ...locationFormData,
                              village: e.target.value,
                            })
                          }
                          placeholder="Nama desa"
                        />
                      </div>
                      <div>
                        <Label htmlFor="locationDistrict">Kecamatan</Label>
                        <Input
                          id="locationDistrict"
                          value={locationFormData.district}
                          onChange={(e) =>
                            setLocationFormData({
                              ...locationFormData,
                              district: e.target.value,
                            })
                          }
                          placeholder="Nama kecamatan"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="locationCapacity">Kapasitas</Label>
                        <Input
                          id="locationCapacity"
                          type="number"
                          value={locationFormData.capacity}
                          onChange={(e) =>
                            setLocationFormData({
                              ...locationFormData,
                              capacity: parseInt(e.target.value) || 0,
                            })
                          }
                          placeholder="Jumlah orang"
                        />
                      </div>
                      <div>
                        <Label htmlFor="locationStartTime">Jam Buka</Label>
                        <Input
                          id="locationStartTime"
                          type="time"
                          value={locationFormData.operatingHours.start}
                          onChange={(e) =>
                            setLocationFormData({
                              ...locationFormData,
                              operatingHours: {
                                ...locationFormData.operatingHours,
                                start: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="locationEndTime">Jam Tutup</Label>
                        <Input
                          id="locationEndTime"
                          type="time"
                          value={locationFormData.operatingHours.end}
                          onChange={(e) =>
                            setLocationFormData({
                              ...locationFormData,
                              operatingHours: {
                                ...locationFormData.operatingHours,
                                end: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactPerson">Nama Kontak</Label>
                        <Input
                          id="contactPerson"
                          value={locationFormData.contactPerson}
                          onChange={(e) =>
                            setLocationFormData({
                              ...locationFormData,
                              contactPerson: e.target.value,
                            })
                          }
                          placeholder="Nama penanggung jawab"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactPhone">No. Telepon</Label>
                        <Input
                          id="contactPhone"
                          value={locationFormData.contactPhone}
                          onChange={(e) =>
                            setLocationFormData({
                              ...locationFormData,
                              contactPhone: e.target.value,
                            })
                          }
                          placeholder="Nomor telepon"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="locationDescription">Deskripsi</Label>
                      <Textarea
                        id="locationDescription"
                        value={locationFormData.description}
                        onChange={(e) =>
                          setLocationFormData({
                            ...locationFormData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Deskripsi lokasi dan fasilitas yang tersedia"
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsAddLocationDialogOpen(false);
                          resetLocationForm();
                        }}
                      >
                        Batal
                      </Button>
                      <Button
                        onClick={handleAddLocation}
                        disabled={
                          !locationFormData.name || !locationFormData.address
                        }
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Simpan Lokasi
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Cari nama lokasi, alamat, atau desa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Jenis Lokasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenis</SelectItem>
                    <SelectItem value="desa">Desa</SelectItem>
                    <SelectItem value="balai">Balai</SelectItem>
                    <SelectItem value="sekolah">Sekolah</SelectItem>
                    <SelectItem value="puskesmas">Puskesmas</SelectItem>
                    <SelectItem value="masjid">Masjid</SelectItem>
                    <SelectItem value="lapangan">Lapangan</SelectItem>
                    <SelectItem value="kantor">Kantor</SelectItem>
                    <SelectItem value="lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filterAvailability}
                  onValueChange={setFilterAvailability}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="available">Tersedia</SelectItem>
                    <SelectItem value="busy">Sedang Digunakan</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="unavailable">Tidak Tersedia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location List */}
              <div className="space-y-4">
                {filteredLocations.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchTerm ||
                      filterType !== "all" ||
                      filterAvailability !== "all"
                        ? "Tidak ada lokasi yang sesuai dengan filter"
                        : "Belum ada lokasi yang ditambahkan"}
                    </p>
                  </div>
                ) : (
                  filteredLocations.map((location) => (
                    <Card
                      key={location.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {location.name}
                              </h3>
                              <Badge variant="outline">
                                {getLocationTypeLabel(location.type)}
                              </Badge>
                              <Badge
                                className={getAvailabilityColor(
                                  location.availability
                                )}
                              >
                                {getAvailabilityLabel(location.availability)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>
                                  {location.address}, {location.village}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>
                                  Kapasitas: {location.capacity} orang
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {location.operatingHours.start} -{" "}
                                  {location.operatingHours.end}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">
                              {location.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                <span>
                                  {location.contactPerson} -{" "}
                                  {location.contactPhone}
                                </span>
                              </div>
                              {location.rating > 0 && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  <span>{location.rating}/5</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteLocation(location.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Notifikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotif">Notifikasi Email</Label>
                    <p className="text-sm text-gray-600">
                      Terima notifikasi melalui email
                    </p>
                  </div>
                  <Switch
                    id="emailNotif"
                    checked={appSettings.notifications.email}
                    onCheckedChange={(checked) =>
                      handleSettingsUpdate("notifications", "email", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotif">Notifikasi Push</Label>
                    <p className="text-sm text-gray-600">
                      Terima notifikasi push di browser
                    </p>
                  </div>
                  <Switch
                    id="pushNotif"
                    checked={appSettings.notifications.push}
                    onCheckedChange={(checked) =>
                      handleSettingsUpdate("notifications", "push", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="announcementNotif">
                      Notifikasi Pengumuman
                    </Label>
                    <p className="text-sm text-gray-600">
                      Notifikasi untuk pengumuman penting
                    </p>
                  </div>
                  <Switch
                    id="announcementNotif"
                    checked={appSettings.notifications.announcements}
                    onCheckedChange={(checked) =>
                      handleSettingsUpdate(
                        "notifications",
                        "announcements",
                        checked
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="activityNotif">Notifikasi Kegiatan</Label>
                    <p className="text-sm text-gray-600">
                      Notifikasi untuk jadwal kegiatan
                    </p>
                  </div>
                  <Switch
                    id="activityNotif"
                    checked={appSettings.notifications.activities}
                    onCheckedChange={(checked) =>
                      handleSettingsUpdate(
                        "notifications",
                        "activities",
                        checked
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="financeNotif">Notifikasi Keuangan</Label>
                    <p className="text-sm text-gray-600">
                      Notifikasi untuk transaksi keuangan
                    </p>
                  </div>
                  <Switch
                    id="financeNotif"
                    checked={appSettings.notifications.finance}
                    onCheckedChange={(checked) =>
                      handleSettingsUpdate("notifications", "finance", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Privasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profileVisible">Profil Terlihat</Label>
                    <p className="text-sm text-gray-600">
                      Izinkan anggota lain melihat profil Anda
                    </p>
                  </div>
                  <Switch
                    id="profileVisible"
                    checked={appSettings.privacy.profileVisible}
                    onCheckedChange={(checked) =>
                      handleSettingsUpdate("privacy", "profileVisible", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="contactVisible">Kontak Terlihat</Label>
                    <p className="text-sm text-gray-600">
                      Izinkan anggota lain melihat kontak Anda
                    </p>
                  </div>
                  <Switch
                    id="contactVisible"
                    checked={appSettings.privacy.contactVisible}
                    onCheckedChange={(checked) =>
                      handleSettingsUpdate("privacy", "contactVisible", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="activityVisible">Aktivitas Terlihat</Label>
                    <p className="text-sm text-gray-600">
                      Izinkan anggota lain melihat aktivitas Anda
                    </p>
                  </div>
                  <Switch
                    id="activityVisible"
                    checked={appSettings.privacy.activityVisible}
                    onCheckedChange={(checked) =>
                      handleSettingsUpdate(
                        "privacy",
                        "activityVisible",
                        checked
                      )
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Tampilan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="theme">Tema</Label>
                  <Select
                    value={appSettings.appearance.theme}
                    onValueChange={(value: any) =>
                      handleSettingsUpdate("appearance", "theme", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Terang</SelectItem>
                      <SelectItem value="dark">Gelap</SelectItem>
                      <SelectItem value="auto">Otomatis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">Bahasa</Label>
                  <Select
                    value={appSettings.appearance.language}
                    onValueChange={(value: any) =>
                      handleSettingsUpdate("appearance", "language", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">Bahasa Indonesia</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compactMode">Mode Kompak</Label>
                    <p className="text-sm text-gray-600">
                      Tampilan yang lebih padat dan efisien
                    </p>
                  </div>
                  <Switch
                    id="compactMode"
                    checked={appSettings.appearance.compactMode}
                    onCheckedChange={(checked) =>
                      handleSettingsUpdate("appearance", "compactMode", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoBackup">Backup Otomatis</Label>
                    <p className="text-sm text-gray-600">
                      Backup data secara otomatis
                    </p>
                  </div>
                  <Switch
                    id="autoBackup"
                    checked={appSettings.data.autoBackup}
                    onCheckedChange={(checked) =>
                      handleSettingsUpdate("data", "autoBackup", checked)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="backupFrequency">Frekuensi Backup</Label>
                  <Select
                    value={appSettings.data.backupFrequency}
                    onValueChange={(value: any) =>
                      handleSettingsUpdate("data", "backupFrequency", value)
                    }
                    disabled={!appSettings.data.autoBackup}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Harian</SelectItem>
                      <SelectItem value="weekly">Mingguan</SelectItem>
                      <SelectItem value="monthly">Bulanan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dataRetention">Retensi Data (bulan)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    value={appSettings.data.dataRetention}
                    onChange={(e) =>
                      handleSettingsUpdate(
                        "data",
                        "dataRetention",
                        parseInt(e.target.value) || 12
                      )
                    }
                    min="1"
                    max="120"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Data akan disimpan selama {appSettings.data.dataRetention}{" "}
                    bulan
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">
                  Ekspor & Impor Data
                </h4>
                <div className="space-y-3">
                  <Button
                    onClick={handleExportData}
                    className="w-full sm:w-auto"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Ekspor Data
                  </Button>

                  <div>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                      id="importFile"
                    />
                    <Button
                      variant="outline"
                      asChild
                      className="w-full sm:w-auto"
                    >
                      <label htmlFor="importFile" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Impor Data
                      </label>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
