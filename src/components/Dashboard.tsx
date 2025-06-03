import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  const totalIncome = getTotalIncome();
  const totalExpense = getTotalExpense();
  const balance = getBalance();
  const recentTransactions = transactions.slice(-5).reverse();

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
  ];

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      </div>

      {/* Data Backup Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Data Management & Security</h2>
          <Button
            onClick={() => setShowBackup(!showBackup)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Shield size={16} />
            {showBackup ? "Hide" : "Show"} Backup Options
          </Button>
        </div>

        {/* Security Status - Always visible */}
        <div className="mb-4">
          <SecurityStatus />
        </div>

        {showBackup && <DataBackup />}
      </div>
    </div>
  );
};

export default Dashboard;
