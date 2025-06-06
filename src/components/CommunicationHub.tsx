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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  Send,
  MessageSquare,
  Megaphone,
  Users,
  Clock,
  Pin,
  AlertCircle,
  CheckCircle,
  Eye,
  Reply,
  Forward,
  MoreHorizontal,
  Bell,
  BellOff,
  Filter,
  Paperclip,
  Download,
} from "lucide-react";
import { useData, type Student } from "@/contexts/DataContext";

interface Message {
  id: string;
  type: "chat" | "announcement" | "urgent";
  title?: string;
  content: string;
  sender: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  recipients: string[]; // "all" or specific user IDs
  attachments?: {
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
  timestamp: string;
  isRead: boolean;
  isPinned: boolean;
  priority: "low" | "normal" | "high" | "urgent";
  replies?: Message[];
  readBy: string[];
}

interface User {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: string;
}

const CommunicationHub = () => {
  const { students } = useData();

  // Sample messages initialization
  const createSampleMessages = (): Message[] => [
    {
      id: "msg-1",
      type: "announcement",
      title: "Rapat Koordinasi Mingguan",
      content:
        "Assalamu'alaikum teman-teman. Besok hari Senin tanggal 22 Januari 2024 kita akan ada rapat koordinasi mingguan jam 19:00 WIB via Google Meet. Agenda: evaluasi kegiatan minggu lalu dan perencanaan minggu depan. Link meeting akan saya share 30 menit sebelum rapat. Mohon kehadiran semua anggota. Terima kasih 🙏",
      sender: {
        id: students[0]?.id || "user-1",
        name: students[0]?.name || "Ahmad Rizki Pratama",
        role: "coordinator",
        avatar: students[0]?.avatar,
      },
      recipients: ["all"],
      attachments: [],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      isRead: false,
      isPinned: true,
      priority: "high",
      replies: [],
      readBy: [students[0]?.id || "user-1"],
    },
    {
      id: "msg-2",
      type: "chat",
      content:
        "Hai semua! Ada yang tahu dimana lokasi rapat besok? Di balai desa atau di sekolah ya?",
      sender: {
        id: students[3]?.id || "user-4",
        name: students[3]?.name || "Nurul Aisyah Putri",
        role: "member",
        avatar: students[3]?.avatar,
      },
      recipients: ["all"],
      attachments: [],
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      isRead: true,
      isPinned: false,
      priority: "normal",
      replies: [
        {
          id: "reply-1",
          type: "chat",
          content: "Di balai desa ya Nur, seperti biasa. Jam 19:00 WIB.",
          sender: {
            id: students[1]?.id || "user-2",
            name: students[1]?.name || "Sari Dewi Lestari",
            role: "vice_coordinator",
            avatar: students[1]?.avatar,
          },
          recipients: ["all"],
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
          isRead: true,
          isPinned: false,
          priority: "normal",
          readBy: [students[1]?.id || "user-2", students[3]?.id || "user-4"],
        },
      ],
      readBy: [
        students[0]?.id || "user-1",
        students[1]?.id || "user-2",
        students[3]?.id || "user-4",
      ],
    },
    {
      id: "msg-3",
      type: "urgent",
      title: "URGENT: Perubahan Jadwal Kegiatan",
      content:
        "PENTING! Ada perubahan jadwal untuk kegiatan sosialisasi aplikasi desa besok. Karena ada acara mendadak di balai desa, kegiatan dipindah ke hari Rabu jam 14:00 WIB di SD Negeri 1 Makmur. Mohon segera konfirmasi kehadiran. Terima kasih!",
      sender: {
        id: students[0]?.id || "user-1",
        name: students[0]?.name || "Ahmad Rizki Pratama",
        role: "coordinator",
        avatar: students[0]?.avatar,
      },
      recipients: ["all"],
      attachments: [],
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      isRead: false,
      isPinned: true,
      priority: "urgent",
      replies: [],
      readBy: [students[0]?.id || "user-1"],
    },
  ];

  // State untuk data pesan
  const [messages, setMessages] = useState<Message[]>(() =>
    createSampleMessages()
  );

  // Convert students to users format for communication
  const users: User[] = students.map((student) => ({
    id: student.id,
    name: student.name,
    role: student.position || "member",
    avatar: student.avatar,
    isOnline: Math.random() > 0.5, // Mock online status - in real app this would come from actual presence data
    lastSeen: new Date(Date.now() - Math.random() * 3600000).toISOString(), // Random last seen within last hour
  }));

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [composeData, setComposeData] = useState({
    type: "chat" as "chat" | "announcement" | "urgent",
    title: "",
    content: "",
    recipients: "all",
    priority: "normal" as "low" | "normal" | "high" | "urgent",
  });

  const currentUserId = "1"; // ID user yang sedang login

  const getTypeColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "announcement":
        return "bg-blue-100 text-blue-800";
      case "chat":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertCircle className="h-4 w-4" />;
      case "announcement":
        return <Megaphone className="h-4 w-4" />;
      case "chat":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "normal":
        return "bg-blue-500";
      case "low":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (message.title &&
        message.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      message.sender.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || message.type === filterType;
    const matchesPriority =
      filterPriority === "all" || message.priority === filterPriority;

    return matchesSearch && matchesType && matchesPriority;
  });

  const handleSendMessage = () => {
    if (!composeData.content.trim()) return;

    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      type: composeData.type,
      title: composeData.title || undefined,
      content: composeData.content,
      sender: {
        id: currentUserId,
        name: "Ahmad Fadli",
        role: "coordinator",
      },
      recipients: [composeData.recipients],
      timestamp: new Date().toISOString(),
      isRead: false,
      isPinned: false,
      priority: composeData.priority,
      readBy: [],
    };

    setMessages([newMessage, ...messages]);
    setComposeData({
      type: "chat",
      title: "",
      content: "",
      recipients: "all",
      priority: "normal",
    });
    setIsComposeDialogOpen(false);
  };

  const handleReply = (messageId: string) => {
    if (!replyContent.trim()) return;

    const newReply: Message = {
      id: `${messageId}-${Date.now()}`,
      type: "chat",
      content: replyContent,
      sender: {
        id: currentUserId,
        name: "Ahmad Fadli",
        role: "coordinator",
      },
      recipients: ["all"],
      timestamp: new Date().toISOString(),
      isRead: false,
      isPinned: false,
      priority: "normal",
      readBy: [],
    };

    setMessages(
      messages.map((message) =>
        message.id === messageId
          ? { ...message, replies: [...(message.replies || []), newReply] }
          : message
      )
    );
    setReplyContent("");
  };

  const togglePin = (messageId: string) => {
    setMessages(
      messages.map((message) =>
        message.id === messageId
          ? { ...message, isPinned: !message.isPinned }
          : message
      )
    );
  };

  const markAsRead = (messageId: string) => {
    setMessages(
      messages.map((message) =>
        message.id === messageId
          ? {
              ...message,
              isRead: true,
              readBy: [...message.readBy, currentUserId],
            }
          : message
      )
    );
  };

  const getUnreadCount = () => {
    return messages.filter(
      (message) => !message.isRead && message.sender.id !== currentUserId
    ).length;
  };

  const getOnlineUsers = () => {
    return users.filter((user) => user.isOnline);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} menit yang lalu`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} jam yang lalu`;
    } else {
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header dengan Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pesan</p>
                <p className="text-2xl font-bold text-blue-600">
                  {messages.length}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Belum Dibaca
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {getUnreadCount()}
                </p>
              </div>
              <Bell className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dipinkan</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {messages.filter((m) => m.isPinned).length}
                </p>
              </div>
              <Pin className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Online</p>
                <p className="text-2xl font-bold text-green-600">
                  {getOnlineUsers().length}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Online Users */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Anggota Online ({getOnlineUsers().length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getOnlineUsers().map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
              ))}

              {users.filter((user) => !user.isOnline).length > 0 && (
                <>
                  <div className="border-t pt-3 mt-3">
                    {" "}
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Offline
                    </p>
                    {users
                      .filter((user) => !user.isOnline)
                      .map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-3 mb-2"
                        >
                          <div className="relative">
                            <Avatar className="h-8 w-8 opacity-60">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatTime(user.lastSeen)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Messages */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              {/* Controls */}
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Cari pesan..."
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
                        <SelectItem value="chat">Chat</SelectItem>
                        <SelectItem value="announcement">Pengumuman</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
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
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">Tinggi</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="low">Rendah</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Dialog
                  open={isComposeDialogOpen}
                  onOpenChange={setIsComposeDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Tulis Pesan
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Tulis Pesan Baru</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="messageType">Tipe Pesan</Label>
                          <Select
                            value={composeData.type}
                            onValueChange={(value: any) =>
                              setComposeData({ ...composeData, type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="chat">Chat</SelectItem>
                              <SelectItem value="announcement">
                                Pengumuman
                              </SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="priority">Prioritas</Label>
                          <Select
                            value={composeData.priority}
                            onValueChange={(value: any) =>
                              setComposeData({
                                ...composeData,
                                priority: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Rendah</SelectItem>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="high">Tinggi</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {(composeData.type === "announcement" ||
                        composeData.type === "urgent") && (
                        <div>
                          <Label htmlFor="title">Judul</Label>
                          <Input
                            id="title"
                            value={composeData.title}
                            onChange={(e) =>
                              setComposeData({
                                ...composeData,
                                title: e.target.value,
                              })
                            }
                            placeholder="Judul pesan"
                          />
                        </div>
                      )}

                      <div>
                        <Label htmlFor="recipients">Penerima</Label>
                        <Select
                          value={composeData.recipients}
                          onValueChange={(value) =>
                            setComposeData({
                              ...composeData,
                              recipients: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {" "}
                            <SelectItem value="all">Semua Anggota</SelectItem>
                            {users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="content">Isi Pesan</Label>
                        <Textarea
                          id="content"
                          value={composeData.content}
                          onChange={(e) =>
                            setComposeData({
                              ...composeData,
                              content: e.target.value,
                            })
                          }
                          placeholder="Tulis pesan Anda..."
                          rows={5}
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsComposeDialogOpen(false)}
                        >
                          Batal
                        </Button>
                        <Button
                          onClick={handleSendMessage}
                          disabled={!composeData.content.trim()}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Kirim
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Pinned Messages */}
              {messages.filter((m) => m.isPinned).length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Pin className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-700">
                      Pesan Penting
                    </span>
                  </div>
                  <div className="space-y-2">
                    {messages
                      .filter((m) => m.isPinned)
                      .map((message) => (
                        <div
                          key={`pinned-${message.id}`}
                          className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={getTypeColor(message.type)}>
                                  {getTypeIcon(message.type)}
                                  <span className="ml-1 capitalize">
                                    {message.type}
                                  </span>
                                </Badge>
                                <div
                                  className={`w-2 h-2 rounded-full ${getPriorityColor(
                                    message.priority
                                  )}`}
                                ></div>
                              </div>
                              {message.title && (
                                <h4 className="font-medium text-gray-900 mb-1">
                                  {message.title}
                                </h4>
                              )}
                              <p className="text-sm text-gray-700 mb-2">
                                {message.content}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>{message.sender.name}</span>
                                <span>•</span>
                                <span>{formatTime(message.timestamp)}</span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePin(message.id)}
                            >
                              <Pin className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Messages List */}
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`border rounded-lg p-4 ${
                      !message.isRead && message.sender.id !== currentUserId
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={message.sender.avatar} />
                        <AvatarFallback>
                          {message.sender.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {message.sender.name}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-xs capitalize"
                            >
                              {message.sender.role}
                            </Badge>
                            <Badge className={getTypeColor(message.type)}>
                              {getTypeIcon(message.type)}
                              <span className="ml-1 capitalize">
                                {message.type}
                              </span>
                            </Badge>
                            <div
                              className={`w-2 h-2 rounded-full ${getPriorityColor(
                                message.priority
                              )}`}
                            ></div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {formatTime(message.timestamp)}
                            </span>
                            {message.isPinned && (
                              <Pin className="h-4 w-4 text-yellow-600" />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePin(message.id)}
                            >
                              <Pin
                                className={`h-4 w-4 ${
                                  message.isPinned
                                    ? "text-yellow-600"
                                    : "text-gray-400"
                                }`}
                              />
                            </Button>
                          </div>
                        </div>

                        {message.title && (
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {message.title}
                          </h4>
                        )}

                        <p className="text-gray-700 mb-3">{message.content}</p>

                        {message.attachments &&
                          message.attachments.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                Lampiran:
                              </p>
                              <div className="space-y-2">
                                {message.attachments.map(
                                  (attachment, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 p-2 bg-gray-50 rounded border"
                                    >
                                      <Paperclip className="h-4 w-4 text-gray-400" />
                                      <span className="text-sm text-gray-700 flex-1">
                                        {attachment.name}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {formatFileSize(attachment.size)}
                                      </span>
                                      <Button variant="ghost" size="sm">
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {message.readBy.length > 0 && (
                          <div className="mb-3">
                            {" "}
                            <p className="text-xs text-gray-500">
                              Dibaca oleh {message.readBy.length} orang
                              {message.readBy.length < users.length &&
                                ` • ${
                                  users.length - message.readBy.length
                                } belum membaca`}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          {!message.isRead &&
                            message.sender.id !== currentUserId && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => markAsRead(message.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Tandai Dibaca
                              </Button>
                            )}

                          <Button variant="outline" size="sm">
                            <Reply className="h-4 w-4 mr-1" />
                            Balas
                          </Button>

                          <Button variant="outline" size="sm">
                            <Forward className="h-4 w-4 mr-1" />
                            Teruskan
                          </Button>
                        </div>

                        {/* Replies */}
                        {message.replies && message.replies.length > 0 && (
                          <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-3">
                            {message.replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="flex items-start gap-2"
                              >
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={reply.sender.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {reply.sender.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-gray-900">
                                      {reply.sender.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {formatTime(reply.timestamp)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply Form */}
                        <div className="mt-3 flex items-center gap-2">
                          <Input
                            placeholder="Tulis balasan..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="flex-1"
                            onKeyPress={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleReply(message.id);
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleReply(message.id)}
                            disabled={!replyContent.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredMessages.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Tidak ada pesan ditemukan
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm ||
                      filterType !== "all" ||
                      filterPriority !== "all"
                        ? "Coba ubah filter atau kata kunci pencarian"
                        : "Belum ada pesan dalam grup"}
                    </p>
                    {!searchTerm &&
                      filterType === "all" &&
                      filterPriority === "all" && (
                        <Button onClick={() => setIsComposeDialogOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Tulis Pesan Pertama
                        </Button>
                      )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunicationHub;
