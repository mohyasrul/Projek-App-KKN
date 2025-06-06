import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { formatCurrency } from "@/utils/formatters";
import DataBackup from "./DataBackup";
import SecurityStatus from "./SecurityStatus";
import {
  Plus,
  Minus,
  Wallet,
  FileText,
  TrendingUp,
  TrendingDown,
  Shield,
  Settings,
  Eye,
  EyeOff,
  Users,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  Target,
  Activity,
} from "lucide-react";

const Dashboard = () => {
  const {
    transactions,
    programs,
    getTotalIncome,
    getTotalExpense,
    getBalance,
  } = useApp();

  const [showBackup, setShowBackup] = useState(false);
  const [showDataManagement, setShowDataManagement] = useState(true);

  const totalIncome = getTotalIncome();
  const totalExpense = getTotalExpense();
  const balance = getBalance();
  const recentTransactions = transactions.slice(-5).reverse();

  // Mock data untuk fitur KKN yang baru
  const mockStudents = 15;
  const mockActivities = 8;
  const mockCompletedActivities = 5;
  const mockUpcomingActivities = [
    {
      id: 1,
      title: "Penyuluhan Kesehatan",
      date: "2025-06-10",
      status: "planned",
    },
    {
      id: 2,
      title: "Gotong Royong Desa",
      date: "2025-06-12",
      status: "planned",
    },
    {
      id: 3,
      title: "Pelatihan Komputer",
      date: "2025-06-15",
      status: "planned",
    },
  ];

  const stats = [
    {
      title: "Total Pemasukan",
      value: totalIncome,
      icon: Plus,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Total Pengeluaran",
      value: totalExpense,
      icon: Minus,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Saldo Kas",
      value: balance,
      icon: Wallet,
      color: balance >= 0 ? "text-blue-600" : "text-red-600",
      bg: balance >= 0 ? "bg-blue-50" : "bg-red-50",
    },
    {
      title: "Program Kerja",
      value: programs.length,
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-50",
      isCount: true,
    },
    {
      title: "Total Peserta",
      value: mockStudents,
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      isCount: true,
    },
    {
      title: "Kegiatan Selesai",
      value: mockCompletedActivities,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      isCount: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* KKN Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Program KKN Periode 2025
                </h3>
                <p className="text-blue-100 mb-4">Juli - Agustus 2025</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-blue-200">Durasi</p>
                    <p className="font-semibold">45 Hari</p>
                  </div>
                  <div>
                    <p className="text-blue-200">Lokasi</p>
                    <p className="font-semibold">Desa Makmur</p>
                  </div>
                  <div>
                    <p className="text-blue-200">Progress</p>
                    <p className="font-semibold">62%</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Activity className="h-12 w-12 text-blue-200 mb-2" />
                <Badge className="bg-white text-blue-600">Aktif</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Pencapaian Minggu Ini
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">3 kegiatan selesai</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">2 kegiatan berlangsung</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4" />
                    <span className="text-sm">Target tercapai 85%</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">85%</div>
                <p className="text-emerald-200 text-sm">Target Mingguan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                      {stat.isCount ? stat.value : formatCurrency(stat.value)}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Transaksi Terbaru</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.length === 0 ? (
                <p className="text-gray-500 text-center">Belum ada transaksi</p>
              ) : (
                recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === "income"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString(
                            "id-ID"
                          )}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`font-semibold ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Status Program Kerja</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {programs.length === 0 ? (
                <p className="text-gray-500 text-center">
                  Belum ada program kerja
                </p>
              ) : (
                programs.map((program) => {
                  const percentage =
                    program.allocatedBudget > 0
                      ? (program.usedBudget / program.allocatedBudget) * 100
                      : 0;

                  return (
                    <div key={program.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{program.name}</span>
                        <span className="text-sm text-gray-500">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            percentage > 100
                              ? "bg-red-500"
                              : percentage > 80
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>
                          Terpakai: {formatCurrency(program.usedBudget)}
                        </span>
                        <span>
                          Alokasi: {formatCurrency(program.allocatedBudget)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Kegiatan Mendatang</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockUpcomingActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(activity.date).toLocaleDateString("id-ID", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.status === "planned"
                      ? "Direncanakan"
                      : activity.status}
                  </Badge>
                </div>
              ))}
              {mockUpcomingActivities.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Tidak ada kegiatan mendatang
                </p>
              )}
              <div className="pt-2 border-t">
                <Button variant="outline" size="sm" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Lihat Semua Kegiatan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Management & Security Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Data Management & Security</h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowDataManagement(!showDataManagement)}
              variant="outline"
              className="flex items-center gap-2"
            >
              {showDataManagement ? <EyeOff size={16} /> : <Eye size={16} />}
              {showDataManagement ? "Hide" : "Show"} Section
            </Button>
            {showDataManagement && (
              <Button
                onClick={() => setShowBackup(!showBackup)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Settings size={16} />
                {showBackup ? "Hide" : "Show"} Backup
              </Button>
            )}
          </div>
        </div>

        {showDataManagement && (
          <>
            {/* Security Status - Always visible when section is shown */}
            <div className="mb-4">
              <SecurityStatus />
            </div>

            {showBackup && <DataBackup />}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
