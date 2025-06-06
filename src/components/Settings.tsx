import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Palette,
  Globe,
  HelpCircle,
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
  joinDate: string;
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
    dataRetention: number; // in months
  };
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Mock user profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "1",
    name: "Ahmad Fadli",
    email: "ahmad.fadli@university.ac.id",
    phone: "081234567890",
    role: "coordinator",
    avatar: "/api/placeholder/96/96",
    university: "Universitas Indonesia",
    nim: "220101001",
    faculty: "Fakultas Teknik",
    major: "Teknik Informatika",
    semester: 6,
    address: "Jl. Margonda Raya No. 123, Depok",
    joinDate: "2025-05-01",
  });

  // Mock app settings
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

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleProfileUpdate = () => {
    // Simulate profile update
    setIsEditingProfile(false);
    console.log("Profile updated:", userProfile);
  };

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      alert("Password baru tidak cocok!");
      return;
    }
    if (passwords.new.length < 6) {
      alert("Password minimal 6 karakter!");
      return;
    }
    // Simulate password change
    setPasswords({ current: "", new: "", confirm: "" });
    alert("Password berhasil diubah!");
  };

  const handleSettingsUpdate = (section: keyof AppSettings, key: string, value: any) => {
    setAppSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleExportData = () => {
    // Simulate data export
    const data = {
      profile: userProfile,
      settings: appSettings,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kkn-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.profile) setUserProfile(data.profile);
          if (data.settings) setAppSettings(data.settings);
          alert("Data berhasil diimpor!");
        } catch (error) {
          alert("File tidak valid!");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetSettings = () => {
    if (confirm("Yakin ingin mengembalikan pengaturan ke default?")) {
      setAppSettings({
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
      alert("Pengaturan berhasil direset!");
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "coordinator": return "Koordinator";
      case "secretary": return "Sekretaris";
      case "treasurer": return "Bendahara";
      default: return "Anggota";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "coordinator": return "bg-blue-100 text-blue-800";
      case "secretary": return "bg-green-100 text-green-800";
      case "treasurer": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
          <p className="text-gray-600">Kelola profil dan konfigurasi aplikasi</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
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
                    <AvatarFallback className="text-2xl">{userProfile.name.charAt(0)}</AvatarFallback>
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
                  <h3 className="text-xl font-semibold text-gray-900">{userProfile.name}</h3>
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
                      onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                      disabled={!isEditingProfile}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                      disabled={!isEditingProfile}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">No. Telepon</Label>
                    <Input
                      id="phone"
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                      disabled={!isEditingProfile}
                    />
                  </div>

                  <div>
                    <Label htmlFor="university">Universitas</Label>
                    <Input
                      id="university"
                      value={userProfile.university}
                      onChange={(e) => setUserProfile({ ...userProfile, university: e.target.value })}
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
                      onChange={(e) => setUserProfile({ ...userProfile, nim: e.target.value })}
                      disabled={!isEditingProfile}
                    />
                  </div>

                  <div>
                    <Label htmlFor="faculty">Fakultas</Label>
                    <Input
                      id="faculty"
                      value={userProfile.faculty}
                      onChange={(e) => setUserProfile({ ...userProfile, faculty: e.target.value })}
                      disabled={!isEditingProfile}
                    />
                  </div>

                  <div>
                    <Label htmlFor="major">Jurusan</Label>
                    <Input
                      id="major"
                      value={userProfile.major}
                      onChange={(e) => setUserProfile({ ...userProfile, major: e.target.value })}
                      disabled={!isEditingProfile}
                    />
                  </div>

                  <div>
                    <Label htmlFor="semester">Semester</Label>
                    <Select
                      value={userProfile.semester.toString()}
                      onValueChange={(value) => setUserProfile({ ...userProfile, semester: parseInt(value) })}
                      disabled={!isEditingProfile}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                          <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
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
                  onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                  disabled={!isEditingProfile}
                  rows={3}
                />
              </div>

              {isEditingProfile && (
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
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
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword">Password Baru</Label>
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                />
              </div>

              <Button onClick={handlePasswordChange} disabled={!passwords.current || !passwords.new || !passwords.confirm}>
                <Shield className="h-4 w-4 mr-2" />
                Ubah Password
              </Button>
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
                    <p className="text-sm text-gray-600">Terima notifikasi melalui email</p>
                  </div>
                  <Switch
                    id="emailNotif"
                    checked={appSettings.notifications.email}
                    onCheckedChange={(checked) => handleSettingsUpdate("notifications", "email", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotif">Notifikasi Push</Label>
                    <p className="text-sm text-gray-600">Terima notifikasi push di browser</p>
                  </div>
                  <Switch
                    id="pushNotif"
                    checked={appSettings.notifications.push}
                    onCheckedChange={(checked) => handleSettingsUpdate("notifications", "push", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="announcementNotif">Notifikasi Pengumuman</Label>
                    <p className="text-sm text-gray-600">Notifikasi untuk pengumuman penting</p>
                  </div>
                  <Switch
                    id="announcementNotif"
                    checked={appSettings.notifications.announcements}
                    onCheckedChange={(checked) => handleSettingsUpdate("notifications", "announcements", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="activityNotif">Notifikasi Kegiatan</Label>
                    <p className="text-sm text-gray-600">Notifikasi untuk jadwal kegiatan</p>
                  </div>
                  <Switch
                    id="activityNotif"
                    checked={appSettings.notifications.activities}
                    onCheckedChange={(checked) => handleSettingsUpdate("notifications", "activities", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="financeNotif">Notifikasi Keuangan</Label>
                    <p className="text-sm text-gray-600">Notifikasi untuk transaksi keuangan</p>
                  </div>
                  <Switch
                    id="financeNotif"
                    checked={appSettings.notifications.finance}
                    onCheckedChange={(checked) => handleSettingsUpdate("notifications", "finance", checked)}
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
                    <p className="text-sm text-gray-600">Izinkan anggota lain melihat profil Anda</p>
                  </div>
                  <Switch
                    id="profileVisible"
                    checked={appSettings.privacy.profileVisible}
                    onCheckedChange={(checked) => handleSettingsUpdate("privacy", "profileVisible", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="contactVisible">Kontak Terlihat</Label>
                    <p className="text-sm text-gray-600">Izinkan anggota lain melihat kontak Anda</p>
                  </div>
                  <Switch
                    id="contactVisible"
                    checked={appSettings.privacy.contactVisible}
                    onCheckedChange={(checked) => handleSettingsUpdate("privacy", "contactVisible", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="activityVisible">Aktivitas Terlihat</Label>
                    <p className="text-sm text-gray-600">Izinkan anggota lain melihat aktivitas Anda</p>
                  </div>
                  <Switch
                    id="activityVisible"
                    checked={appSettings.privacy.activityVisible}
                    onCheckedChange={(checked) => handleSettingsUpdate("privacy", "activityVisible", checked)}
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
                    onValueChange={(value: any) => handleSettingsUpdate("appearance", "theme", value)}
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
                    onValueChange={(value: any) => handleSettingsUpdate("appearance", "language", value)}
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
                    <p className="text-sm text-gray-600">Tampilan yang lebih padat dan efisien</p>
                  </div>
                  <Switch
                    id="compactMode"
                    checked={appSettings.appearance.compactMode}
                    onCheckedChange={(checked) => handleSettingsUpdate("appearance", "compactMode", checked)}
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
                    <p className="text-sm text-gray-600">Backup data secara otomatis</p>
                  </div>
                  <Switch
                    id="autoBackup"
                    checked={appSettings.data.autoBackup}
                    onCheckedChange={(checked) => handleSettingsUpdate("data", "autoBackup", checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="backupFrequency">Frekuensi Backup</Label>
                  <Select
                    value={appSettings.data.backupFrequency}
                    onValueChange={(value: any) => handleSettingsUpdate("data", "backupFrequency", value)}
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
                    onChange={(e) => handleSettingsUpdate("data", "dataRetention", parseInt(e.target.value) || 12)}
                    min="1"
                    max="120"
                  />
                  <p className="text-sm text-gray-600 mt-1">Data akan disimpan selama {appSettings.data.dataRetention} bulan</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Ekspor & Impor Data</h4>
                <div className="space-y-3">
                  <Button onClick={handleExportData} className="w-full sm:w-auto">
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
                    <Button variant="outline" asChild className="w-full sm:w-auto">
                      <label htmlFor="importFile" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Impor Data
                      </label>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Reset Pengaturan</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Mengembalikan semua pengaturan ke default. Tindakan ini tidak dapat dibatalkan.
                </p>
                <Button variant="destructive" onClick={handleResetSettings}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset Pengaturan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Help Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-gray-900">Butuh Bantuan?</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4" />
              <span>support@kknapp.com</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-4 w-4" />
              <span>+62 800-1234-5678</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Globe className="h-4 w-4" />
              <span>docs.kknapp.com</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
