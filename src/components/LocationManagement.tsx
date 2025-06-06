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
  MapPin,
  Users,
  Clock,
  Phone,
  Mail,
  Building,
  Navigation,
  Star,
  Calendar,
  Filter,
  Eye,
  Map,
} from "lucide-react";

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

interface Activity {
  id: string;
  title: string;
  date: string;
  locationId: string;
}

const LocationManagement = () => {
  // State untuk data lokasi
  const [locations, setLocations] = useState<Location[]>([]);

  // Mock data untuk kegiatan yang menggunakan lokasi
  const mockActivities: Activity[] = [];

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterAvailability, setFilterAvailability] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    type: "balai" as
      | "desa"
      | "balai"
      | "sekolah"
      | "puskesmas"
      | "masjid"
      | "lapangan"
      | "kantor"
      | "lainnya",
    address: "",
    village: "",
    district: "",
    capacity: "",
    facilities: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    availability: "available" as
      | "available"
      | "busy"
      | "maintenance"
      | "unavailable",
    operatingStart: "",
    operatingEnd: "",
    description: "",
    latitude: "",
    longitude: "",
  });

  const locationTypes = [
    { value: "desa", label: "Kantor Desa" },
    { value: "balai", label: "Balai Desa" },
    { value: "sekolah", label: "Sekolah" },
    { value: "puskesmas", label: "Puskesmas" },
    { value: "masjid", label: "Masjid/Mushola" },
    { value: "lapangan", label: "Lapangan" },
    { value: "kantor", label: "Kantor" },
    { value: "lainnya", label: "Lainnya" },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "desa":
        return "bg-blue-100 text-blue-800";
      case "balai":
        return "bg-green-100 text-green-800";
      case "sekolah":
        return "bg-yellow-100 text-yellow-800";
      case "puskesmas":
        return "bg-red-100 text-red-800";
      case "masjid":
        return "bg-purple-100 text-purple-800";
      case "lapangan":
        return "bg-orange-100 text-orange-800";
      case "kantor":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-yellow-100 text-yellow-800";
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      case "unavailable":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case "available":
        return "Tersedia";
      case "busy":
        return "Sedang Digunakan";
      case "maintenance":
        return "Maintenance";
      case "unavailable":
        return "Tidak Tersedia";
      default:
        return availability;
    }
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
    if (!formData.name || !formData.address) return;

    const newLocation: Location = {
      id: (locations.length + 1).toString(),
      name: formData.name,
      type: formData.type,
      address: formData.address,
      village: formData.village,
      district: formData.district,
      coordinates:
        formData.latitude && formData.longitude
          ? {
              latitude: parseFloat(formData.latitude),
              longitude: parseFloat(formData.longitude),
            }
          : undefined,
      capacity: parseInt(formData.capacity) || 0,
      facilities: formData.facilities
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f),
      contactPerson: formData.contactPerson,
      contactPhone: formData.contactPhone,
      contactEmail: formData.contactEmail,
      availability: formData.availability,
      operatingHours: {
        start: formData.operatingStart,
        end: formData.operatingEnd,
      },
      description: formData.description,
      rating: 0,
      totalActivities: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLocations([...locations, newLocation]);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditLocation = () => {
    if (!editingLocation || !formData.name) return;

    const updatedLocations = locations.map((location) =>
      location.id === editingLocation.id
        ? {
            ...location,
            name: formData.name,
            type: formData.type,
            address: formData.address,
            village: formData.village,
            district: formData.district,
            coordinates:
              formData.latitude && formData.longitude
                ? {
                    latitude: parseFloat(formData.latitude),
                    longitude: parseFloat(formData.longitude),
                  }
                : location.coordinates,
            capacity: parseInt(formData.capacity) || location.capacity,
            facilities: formData.facilities
              .split(",")
              .map((f) => f.trim())
              .filter((f) => f),
            contactPerson: formData.contactPerson,
            contactPhone: formData.contactPhone,
            contactEmail: formData.contactEmail,
            availability: formData.availability,
            operatingHours: {
              start: formData.operatingStart,
              end: formData.operatingEnd,
            },
            description: formData.description,
            updatedAt: new Date().toISOString(),
          }
        : location
    );

    setLocations(updatedLocations);
    setEditingLocation(null);
    resetForm();
  };

  const handleDeleteLocation = (id: string) => {
    setLocations(locations.filter((location) => location.id !== id));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "balai",
      address: "",
      village: "",
      district: "",
      capacity: "",
      facilities: "",
      contactPerson: "",
      contactPhone: "",
      contactEmail: "",
      availability: "available",
      operatingStart: "",
      operatingEnd: "",
      description: "",
      latitude: "",
      longitude: "",
    });
  };

  const openEditDialog = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      type: location.type,
      address: location.address,
      village: location.village,
      district: location.district,
      capacity: location.capacity.toString(),
      facilities: location.facilities.join(", "),
      contactPerson: location.contactPerson,
      contactPhone: location.contactPhone,
      contactEmail: location.contactEmail || "",
      availability: location.availability,
      operatingStart: location.operatingHours.start,
      operatingEnd: location.operatingHours.end,
      description: location.description,
      latitude: location.coordinates?.latitude.toString() || "",
      longitude: location.coordinates?.longitude.toString() || "",
    });
  };

  const getLocationStats = () => {
    const total = locations.length;
    const available = locations.filter(
      (l) => l.availability === "available"
    ).length;
    const busy = locations.filter((l) => l.availability === "busy").length;
    const totalCapacity = locations.reduce((sum, l) => sum + l.capacity, 0);

    return { total, available, busy, totalCapacity };
  };

  const getLocationActivities = (locationId: string) => {
    return mockActivities.filter(
      (activity) => activity.locationId === locationId
    );
  };

  const stats = getLocationStats();

  return (
    <div className="space-y-6">
      {/* Header dengan Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Lokasi
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.total}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tersedia</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.available}
                </p>
              </div>
              <Building className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Sedang Digunakan
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.busy}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Kapasitas
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.totalCapacity}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
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
                  placeholder="Cari lokasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    {locationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filterAvailability}
                  onValueChange={setFilterAvailability}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Ketersediaan" />
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
                  Tambah Lokasi
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingLocation ? "Edit Lokasi" : "Tambah Lokasi Baru"}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nama Lokasi *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Nama lokasi"
                      />
                    </div>

                    <div>
                      <Label htmlFor="type">Tipe Lokasi</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: any) =>
                          setFormData({ ...formData, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe" />
                        </SelectTrigger>
                        <SelectContent>
                          {locationTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Alamat *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="Alamat lengkap"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="village">Desa</Label>
                      <Input
                        id="village"
                        value={formData.village}
                        onChange={(e) =>
                          setFormData({ ...formData, village: e.target.value })
                        }
                        placeholder="Nama desa"
                      />
                    </div>

                    <div>
                      <Label htmlFor="district">Kecamatan</Label>
                      <Input
                        id="district"
                        value={formData.district}
                        onChange={(e) =>
                          setFormData({ ...formData, district: e.target.value })
                        }
                        placeholder="Nama kecamatan"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="capacity">Kapasitas</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) =>
                          setFormData({ ...formData, capacity: e.target.value })
                        }
                        placeholder="Jumlah orang"
                      />
                    </div>

                    <div>
                      <Label htmlFor="availability">Status</Label>
                      <Select
                        value={formData.availability}
                        onValueChange={(value: any) =>
                          setFormData({ ...formData, availability: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Tersedia</SelectItem>
                          <SelectItem value="busy">Sedang Digunakan</SelectItem>
                          <SelectItem value="maintenance">
                            Maintenance
                          </SelectItem>
                          <SelectItem value="unavailable">
                            Tidak Tersedia
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="operatingStart">Jam Buka</Label>
                      <Input
                        id="operatingStart"
                        type="time"
                        value={formData.operatingStart}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            operatingStart: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="operatingEnd">Jam Tutup</Label>
                      <Input
                        id="operatingEnd"
                        type="time"
                        value={formData.operatingEnd}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            operatingEnd: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="facilities">Fasilitas</Label>
                    <Input
                      id="facilities"
                      value={formData.facilities}
                      onChange={(e) =>
                        setFormData({ ...formData, facilities: e.target.value })
                      }
                      placeholder="Pisahkan dengan koma (misal: AC, Proyektor, Toilet)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="contactPerson">Narahubung</Label>
                      <Input
                        id="contactPerson"
                        value={formData.contactPerson}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
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
                        value={formData.contactPhone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactPhone: e.target.value,
                          })
                        }
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactEmail">Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactEmail: e.target.value,
                          })
                        }
                        placeholder="email@domain.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        value={formData.latitude}
                        onChange={(e) =>
                          setFormData({ ...formData, latitude: e.target.value })
                        }
                        placeholder="-6.2088"
                      />
                    </div>

                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        value={formData.longitude}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            longitude: e.target.value,
                          })
                        }
                        placeholder="106.8456"
                      />
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
                      placeholder="Deskripsi lokasi dan keterangan tambahan"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setEditingLocation(null);
                        resetForm();
                      }}
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={
                        editingLocation ? handleEditLocation : handleAddLocation
                      }
                      disabled={!formData.name || !formData.address}
                    >
                      {editingLocation ? "Simpan Perubahan" : "Tambah Lokasi"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Daftar Lokasi */}
      <div className="grid gap-4">
        {filteredLocations.map((location) => (
          <Card key={location.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {location.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {location.address}
                      </p>
                      <p className="text-sm text-gray-500 mb-3">
                        {location.village}, {location.district}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={getTypeColor(location.type)}>
                          {
                            locationTypes.find((t) => t.value === location.type)
                              ?.label
                          }
                        </Badge>
                        <Badge
                          className={getAvailabilityColor(
                            location.availability
                          )}
                        >
                          {getAvailabilityText(location.availability)}
                        </Badge>
                        {location.rating > 0 && (
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {location.rating}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <div>
                        <p className="font-medium">Kapasitas</p>
                        <p>{location.capacity} orang</p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <div>
                        <p className="font-medium">Jam Operasional</p>
                        <p>
                          {location.operatingHours.start} -{" "}
                          {location.operatingHours.end}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <div>
                        <p className="font-medium">Kontak</p>
                        <p>{location.contactPerson}</p>
                        <p className="text-xs">{location.contactPhone}</p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <div>
                        <p className="font-medium">Total Kegiatan</p>
                        <p>{location.totalActivities} kegiatan</p>
                      </div>
                    </div>
                  </div>

                  {location.facilities.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Fasilitas:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {location.facilities
                          .slice(0, 5)
                          .map((facility, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {facility}
                            </Badge>
                          ))}
                        {location.facilities.length > 5 && (
                          <Badge
                            variant="outline"
                            className="text-xs text-gray-400"
                          >
                            +{location.facilities.length - 5} lainnya
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {location.description && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">
                        {location.description}
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
                        onClick={() => setSelectedLocation(location)}
                        className="flex-1 lg:flex-none"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Detail
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{selectedLocation?.name}</DialogTitle>
                      </DialogHeader>
                      {selectedLocation && (
                        <Tabs defaultValue="overview" className="space-y-4">
                          <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="facilities">
                              Fasilitas
                            </TabsTrigger>
                            <TabsTrigger value="contact">Kontak</TabsTrigger>
                            <TabsTrigger value="activities">
                              Kegiatan
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="overview" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Informasi Lokasi
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium">Tipe:</span>{" "}
                                    {
                                      locationTypes.find(
                                        (t) => t.value === selectedLocation.type
                                      )?.label
                                    }
                                  </div>
                                  <div>
                                    <span className="font-medium">Status:</span>{" "}
                                    {getAvailabilityText(
                                      selectedLocation.availability
                                    )}
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      Kapasitas:
                                    </span>{" "}
                                    {selectedLocation.capacity} orang
                                  </div>
                                  <div>
                                    <span className="font-medium">Rating:</span>{" "}
                                    {selectedLocation.rating}/5
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Lokasi & Alamat
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium">Alamat:</span>{" "}
                                    {selectedLocation.address}
                                  </div>
                                  <div>
                                    <span className="font-medium">Desa:</span>{" "}
                                    {selectedLocation.village}
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      Kecamatan:
                                    </span>{" "}
                                    {selectedLocation.district}
                                  </div>
                                  {selectedLocation.coordinates && (
                                    <div>
                                      <span className="font-medium">
                                        Koordinat:
                                      </span>{" "}
                                      {selectedLocation.coordinates.latitude},{" "}
                                      {selectedLocation.coordinates.longitude}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">
                                Jam Operasional
                              </h4>
                              <p className="text-sm text-gray-600">
                                {selectedLocation.operatingHours.start} -{" "}
                                {selectedLocation.operatingHours.end}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Deskripsi</h4>
                              <p className="text-sm text-gray-600">
                                {selectedLocation.description}
                              </p>
                            </div>
                          </TabsContent>

                          <TabsContent value="facilities">
                            <div>
                              <h4 className="font-semibold mb-4">
                                Fasilitas yang Tersedia
                              </h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {selectedLocation.facilities.map(
                                  (facility, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center p-2 border rounded-lg"
                                    >
                                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                      <span className="text-sm">
                                        {facility}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="contact">
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start p-4 border rounded-lg">
                                  <Users className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                                  <div>
                                    <p className="font-medium">Narahubung</p>
                                    <p className="text-sm text-gray-600">
                                      {selectedLocation.contactPerson}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-start p-4 border rounded-lg">
                                  <Phone className="h-5 w-5 text-green-600 mr-3 mt-1" />
                                  <div>
                                    <p className="font-medium">Telepon</p>
                                    <p className="text-sm text-gray-600">
                                      {selectedLocation.contactPhone}
                                    </p>
                                  </div>
                                </div>
                                {selectedLocation.contactEmail && (
                                  <div className="flex items-start p-4 border rounded-lg">
                                    <Mail className="h-5 w-5 text-purple-600 mr-3 mt-1" />
                                    <div>
                                      <p className="font-medium">Email</p>
                                      <p className="text-sm text-gray-600">
                                        {selectedLocation.contactEmail}
                                      </p>
                                    </div>
                                  </div>
                                )}
                                {selectedLocation.coordinates && (
                                  <div className="flex items-start p-4 border rounded-lg">
                                    <Navigation className="h-5 w-5 text-red-600 mr-3 mt-1" />
                                    <div>
                                      <p className="font-medium">
                                        Koordinat GPS
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {selectedLocation.coordinates.latitude},{" "}
                                        {selectedLocation.coordinates.longitude}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="activities">
                            <div>
                              <h4 className="font-semibold mb-4">
                                Kegiatan di Lokasi Ini
                              </h4>
                              {getLocationActivities(selectedLocation.id)
                                .length > 0 ? (
                                <div className="space-y-2">
                                  {getLocationActivities(
                                    selectedLocation.id
                                  ).map((activity) => (
                                    <div
                                      key={activity.id}
                                      className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                      <div>
                                        <p className="font-medium">
                                          {activity.title}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          {new Date(
                                            activity.date
                                          ).toLocaleDateString("id-ID", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          })}
                                        </p>
                                      </div>
                                      <Badge variant="outline">Terjadwal</Badge>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500 text-center py-8">
                                  Belum ada kegiatan terjadwal di lokasi ini
                                </p>
                              )}
                            </div>
                          </TabsContent>
                        </Tabs>
                      )}
                    </DialogContent>
                  </Dialog>

                  {location.coordinates && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `https://maps.google.com/?q=${
                            location.coordinates!.latitude
                          },${location.coordinates!.longitude}`,
                          "_blank"
                        )
                      }
                      className="flex-1 lg:flex-none"
                    >
                      <Map className="h-4 w-4 mr-2" />
                      Maps
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      openEditDialog(location);
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
                    onClick={() => handleDeleteLocation(location.id)}
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

        {filteredLocations.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tidak ada lokasi ditemukan
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ||
                filterType !== "all" ||
                filterAvailability !== "all"
                  ? "Coba ubah filter atau kata kunci pencarian"
                  : "Belum ada lokasi yang terdaftar"}
              </p>
              {!searchTerm &&
                filterType === "all" &&
                filterAvailability === "all" && (
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Lokasi Pertama
                  </Button>
                )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LocationManagement;
