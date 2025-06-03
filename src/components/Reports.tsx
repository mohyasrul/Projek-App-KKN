import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApp } from "@/contexts/AppContext";
import type { Transaction } from "@/contexts/AppContext";
import { formatCurrency, formatDate } from "@/utils/formatters";
import {
  Download,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const {
    transactions,
    programs,
    getTotalIncome,
    getTotalExpense,
    getBalance,
  } = useApp();
  const { toast } = useToast();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [reportType, setReportType] = useState("comprehensive");
  const [selectedProgram, setSelectedProgram] = useState("");

  const filterTransactionsByDate = (transactions: Transaction[]) => {
    if (!dateFrom && !dateTo) return transactions;

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const fromDate = dateFrom ? new Date(dateFrom) : new Date("2000-01-01");
      const toDate = dateTo ? new Date(dateTo) : new Date("2099-12-31");

      return transactionDate >= fromDate && transactionDate <= toDate;
    });
  };

  const filteredTransactions = filterTransactionsByDate(transactions);
  const filteredIncome = filteredTransactions.filter(
    (t) => t.type === "income"
  );
  const filteredExpenses = filteredTransactions.filter(
    (t) => t.type === "expense"
  );

  const totalIncome = filteredIncome.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filteredExpenses.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // Income summary by category
  const incomeByCategory = filteredIncome.reduce((acc, transaction) => {
    const category = transaction.category || "Tidak Dikategorikan";
    acc[category] = (acc[category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  // Expense summary by category
  const expenseByCategory = filteredExpenses.reduce((acc, transaction) => {
    const category = transaction.category || "Tidak Dikategorikan";
    acc[category] = (acc[category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  // Program-wise expense breakdown
  const programExpenses = programs.map((program) => {
    const expenses = filteredExpenses.filter((t) => t.programId === program.id);
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
    const percentage =
      program.allocatedBudget > 0
        ? (totalExpense / program.allocatedBudget) * 100
        : 0;

    return {
      ...program,
      expenses,
      totalExpense,
      percentage,
      remainingBudget: program.allocatedBudget - totalExpense,
    };
  });

  // General expenses (not assigned to any program)
  const generalExpenses = filteredExpenses.filter((t) => !t.programId);
  const totalGeneralExpenses = generalExpenses.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  const generateCSV = () => {
    let csvContent = "";
    let filename = "";

    if (reportType === "comprehensive") {
      // Comprehensive Report with all details
      csvContent = "=== LAPORAN KEUANGAN KOMPREHENSIF ===\n\n";

      // Summary Section
      csvContent += "RINGKASAN KEUANGAN\n";
      csvContent += "Kategori,Jumlah Transaksi,Total (Rp)\n";
      csvContent += `Total Pemasukan,${
        filteredIncome.length
      },"${totalIncome.toLocaleString("id-ID")}"\n`;
      csvContent += `Total Pengeluaran,${
        filteredExpenses.length
      },"${totalExpense.toLocaleString("id-ID")}"\n`;
      csvContent += `Saldo Akhir,-,"${balance.toLocaleString("id-ID")}"\n\n`;

      // Income Breakdown
      csvContent += "RINCIAN PEMASUKAN PER KATEGORI\n";
      csvContent += "Kategori,Jumlah (Rp),Persentase dari Total\n";
      Object.entries(incomeByCategory).forEach(([category, amount]) => {
        const percentage =
          totalIncome > 0 ? ((amount / totalIncome) * 100).toFixed(2) : "0";
        csvContent += `"${category}","${amount.toLocaleString(
          "id-ID"
        )}","${percentage}%"\n`;
      });
      csvContent += "\n";

      // Expense Breakdown
      csvContent += "RINCIAN PENGELUARAN PER KATEGORI\n";
      csvContent += "Kategori,Jumlah (Rp),Persentase dari Total\n";
      Object.entries(expenseByCategory).forEach(([category, amount]) => {
        const percentage =
          totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(2) : "0";
        csvContent += `"${category}","${amount.toLocaleString(
          "id-ID"
        )}","${percentage}%"\n`;
      });
      csvContent += "\n";

      // Program Analysis
      csvContent += "ANALISIS PROGRAM KERJA\n";
      csvContent +=
        "Nama Program,Alokasi Dana (Rp),Dana Terpakai (Rp),Sisa Dana (Rp),Persentase Penggunaan,Status,Jumlah Transaksi\n";
      programExpenses.forEach((program) => {
        const status =
          program.percentage > 100
            ? "Over Budget"
            : program.percentage > 80
            ? "Hampir Habis"
            : "Aman";
        csvContent += `"${
          program.name
        }","${program.allocatedBudget.toLocaleString(
          "id-ID"
        )}","${program.totalExpense.toLocaleString(
          "id-ID"
        )}","${program.remainingBudget.toLocaleString(
          "id-ID"
        )}","${program.percentage.toFixed(2)}%","${status}","${
          program.expenses.length
        }"\n`;
      });

      // General expenses
      csvContent += `"Pengeluaran Umum","-","${totalGeneralExpenses.toLocaleString(
        "id-ID"
      )}","-","-","Umum","${generalExpenses.length}"\n\n`;

      // Detailed Transactions
      csvContent += "DETAIL SEMUA TRANSAKSI\n";
      csvContent +=
        "Tanggal,Jenis,Jumlah (Rp),Keterangan,Kategori,Program Kerja,Dibuat Oleh,Bukti Transaksi\n";
      filteredTransactions.forEach((transaction) => {
        const programName = transaction.programId
          ? programs.find((p) => p.id === transaction.programId)?.name ||
            "Tidak Diketahui"
          : "Umum";

        csvContent += `"${formatDate(transaction.date)}",`;
        csvContent += `"${
          transaction.type === "income" ? "Pemasukan" : "Pengeluaran"
        }",`;
        csvContent += `"${transaction.amount.toLocaleString("id-ID")}",`;
        csvContent += `"${transaction.description}",`;
        csvContent += `"${transaction.category || "Tidak Ada"}",`;
        csvContent += `"${programName}",`;
        csvContent += `"${transaction.createdBy}",`;
        csvContent += `"${transaction.receipt || "Tidak Ada"}"\n`;
      });

      filename = "laporan-keuangan-komprehensif.csv";
    } else if (reportType === "income") {
      // Income-focused report
      csvContent = "LAPORAN PEMASUKAN DETAIL\n\n";
      csvContent += "RINGKASAN PEMASUKAN\n";
      csvContent +=
        "Total Pemasukan (Rp),Jumlah Transaksi,Rata-rata per Transaksi (Rp)\n";
      const avgIncome =
        filteredIncome.length > 0 ? totalIncome / filteredIncome.length : 0;
      csvContent += `"${totalIncome.toLocaleString("id-ID")}","${
        filteredIncome.length
      }","${avgIncome.toLocaleString("id-ID")}"\n\n`;

      csvContent += "PEMASUKAN PER KATEGORI\n";
      csvContent +=
        "Kategori,Jumlah (Rp),Jumlah Transaksi,Persentase dari Total\n";
      Object.entries(incomeByCategory).forEach(([category, amount]) => {
        const count = filteredIncome.filter(
          (t) => (t.category || "Tidak Dikategorikan") === category
        ).length;
        const percentage =
          totalIncome > 0 ? ((amount / totalIncome) * 100).toFixed(2) : "0";
        csvContent += `"${category}","${amount.toLocaleString(
          "id-ID"
        )}","${count}","${percentage}%"\n`;
      });
      csvContent += "\n";

      csvContent += "DETAIL TRANSAKSI PEMASUKAN\n";
      csvContent += "Tanggal,Jumlah (Rp),Keterangan,Kategori,Dibuat Oleh\n";
      filteredIncome.forEach((transaction) => {
        csvContent += `"${formatDate(
          transaction.date
        )}","${transaction.amount.toLocaleString("id-ID")}","${
          transaction.description
        }","${transaction.category || "Tidak Ada"}","${
          transaction.createdBy
        }"\n`;
      });

      filename = "laporan-pemasukan-detail.csv";
    } else if (reportType === "expenses") {
      // Expense-focused report
      csvContent = "LAPORAN PENGELUARAN DETAIL\n\n";
      csvContent += "RINGKASAN PENGELUARAN\n";
      csvContent +=
        "Total Pengeluaran (Rp),Jumlah Transaksi,Rata-rata per Transaksi (Rp)\n";
      const avgExpense =
        filteredExpenses.length > 0
          ? totalExpense / filteredExpenses.length
          : 0;
      csvContent += `"${totalExpense.toLocaleString("id-ID")}","${
        filteredExpenses.length
      }","${avgExpense.toLocaleString("id-ID")}"\n\n`;

      csvContent += "PENGELUARAN PER KATEGORI\n";
      csvContent +=
        "Kategori,Jumlah (Rp),Jumlah Transaksi,Persentase dari Total\n";
      Object.entries(expenseByCategory).forEach(([category, amount]) => {
        const count = filteredExpenses.filter(
          (t) => (t.category || "Tidak Dikategorikan") === category
        ).length;
        const percentage =
          totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(2) : "0";
        csvContent += `"${category}","${amount.toLocaleString(
          "id-ID"
        )}","${count}","${percentage}%"\n`;
      });
      csvContent += "\n";

      csvContent += "PENGELUARAN PER PROGRAM KERJA\n";
      csvContent +=
        "Program,Jumlah (Rp),Jumlah Transaksi,Persentase dari Total Pengeluaran\n";
      programExpenses.forEach((program) => {
        const percentage =
          totalExpense > 0
            ? ((program.totalExpense / totalExpense) * 100).toFixed(2)
            : "0";
        csvContent += `"${program.name}","${program.totalExpense.toLocaleString(
          "id-ID"
        )}","${program.expenses.length}","${percentage}%"\n`;
      });
      csvContent += `"Pengeluaran Umum","${totalGeneralExpenses.toLocaleString(
        "id-ID"
      )}","${generalExpenses.length}","${
        totalExpense > 0
          ? ((totalGeneralExpenses / totalExpense) * 100).toFixed(2)
          : "0"
      }%"\n\n`;

      csvContent += "DETAIL TRANSAKSI PENGELUARAN\n";
      csvContent +=
        "Tanggal,Jumlah (Rp),Keterangan,Kategori,Program Kerja,Dibuat Oleh,Bukti Transaksi\n";
      filteredExpenses.forEach((transaction) => {
        const programName = transaction.programId
          ? programs.find((p) => p.id === transaction.programId)?.name ||
            "Tidak Diketahui"
          : "Umum";

        csvContent += `"${formatDate(
          transaction.date
        )}","${transaction.amount.toLocaleString("id-ID")}","${
          transaction.description
        }","${transaction.category || "Tidak Ada"}","${programName}","${
          transaction.createdBy
        }","${transaction.receipt || "Tidak Ada"}"\n`;
      });

      filename = "laporan-pengeluaran-detail.csv";
    }

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Berhasil",
      description: "Laporan berhasil diunduh",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Laporan Keuangan Komprehensif
        </h2>
        <Button
          onClick={generateCSV}
          className="bg-green-600 hover:bg-green-700"
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Filter Laporan</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Jenis Laporan
            </label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comprehensive">Komprehensif</SelectItem>
                <SelectItem value="income">Fokus Pemasukan</SelectItem>
                <SelectItem value="expenses">Fokus Pengeluaran</SelectItem>
                <SelectItem value="programs">Program Kerja</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Dari Tanggal
            </label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Sampai Tanggal
            </label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setDateFrom("");
                setDateTo("");
                setSelectedProgram("");
              }}
              className="w-full"
            >
              Reset Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Pemasukan
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalIncome)}
                </p>
                <p className="text-xs text-gray-500">
                  {filteredIncome.length} transaksi
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Pengeluaran
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalExpense)}
                </p>
                <p className="text-xs text-gray-500">
                  {filteredExpenses.length} transaksi
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-50">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saldo</p>
                <p
                  className={`text-2xl font-bold ${
                    balance >= 0 ? "text-blue-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(balance)}
                </p>
                <p className="text-xs text-gray-500">
                  Total: {filteredTransactions.length} transaksi
                </p>
              </div>
              <div
                className={`p-3 rounded-full ${
                  balance >= 0 ? "bg-blue-50" : "bg-red-50"
                }`}
              >
                <DollarSign
                  className={`h-6 w-6 ${
                    balance >= 0 ? "text-blue-600" : "text-red-600"
                  }`}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Program Aktif
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {programs.length}
                </p>
                <p className="text-xs text-gray-500">
                  {
                    programs.filter((p) => p.usedBudget < p.allocatedBudget)
                      .length
                  }{" "}
                  masih dalam budget
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Content Based on Type */}
      {reportType === "comprehensive" && (
        <>
          {/* Income by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Pemasukan per Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-right">
                      Jumlah Transaksi
                    </TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Persentase</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(incomeByCategory).map(
                    ([category, amount]) => {
                      const count = filteredIncome.filter(
                        (t) =>
                          (t.category || "Tidak Dikategorikan") === category
                      ).length;
                      const percentage =
                        totalIncome > 0
                          ? ((amount / totalIncome) * 100).toFixed(1)
                          : "0";
                      return (
                        <TableRow key={category}>
                          <TableCell className="font-medium">
                            {category}
                          </TableCell>
                          <TableCell className="text-right">{count}</TableCell>
                          <TableCell className="text-right text-green-600 font-semibold">
                            {formatCurrency(amount)}
                          </TableCell>
                          <TableCell className="text-right">
                            {percentage}%
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Expense by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Pengeluaran per Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-right">
                      Jumlah Transaksi
                    </TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Persentase</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(expenseByCategory).map(
                    ([category, amount]) => {
                      const count = filteredExpenses.filter(
                        (t) =>
                          (t.category || "Tidak Dikategorikan") === category
                      ).length;
                      const percentage =
                        totalExpense > 0
                          ? ((amount / totalExpense) * 100).toFixed(1)
                          : "0";
                      return (
                        <TableRow key={category}>
                          <TableCell className="font-medium">
                            {category}
                          </TableCell>
                          <TableCell className="text-right">{count}</TableCell>
                          <TableCell className="text-right text-red-600 font-semibold">
                            {formatCurrency(amount)}
                          </TableCell>
                          <TableCell className="text-right">
                            {percentage}%
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Program Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Analisis Program Kerja</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program</TableHead>
                    <TableHead className="text-right">Alokasi</TableHead>
                    <TableHead className="text-right">Terpakai</TableHead>
                    <TableHead className="text-right">Sisa</TableHead>
                    <TableHead className="text-right">Persentase</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programExpenses.map((program) => {
                    const status =
                      program.percentage > 100
                        ? "Over Budget"
                        : program.percentage > 80
                        ? "Hampir Habis"
                        : "Aman";
                    const statusColor =
                      program.percentage > 100
                        ? "text-red-600"
                        : program.percentage > 80
                        ? "text-yellow-600"
                        : "text-green-600";

                    return (
                      <TableRow key={program.id}>
                        <TableCell className="font-medium">
                          {program.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(program.allocatedBudget)}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {formatCurrency(program.totalExpense)}
                        </TableCell>
                        <TableCell className="text-right text-blue-600">
                          {formatCurrency(program.remainingBudget)}
                        </TableCell>
                        <TableCell
                          className={`text-right font-semibold ${statusColor}`}
                        >
                          {program.percentage.toFixed(1)}%
                        </TableCell>
                        <TableCell
                          className={`text-right font-semibold ${statusColor}`}
                        >
                          {status}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow className="border-t-2">
                    <TableCell className="font-medium">
                      Pengeluaran Umum
                    </TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right text-red-600">
                      {formatCurrency(totalGeneralExpenses)}
                    </TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right text-gray-600">
                      Umum
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {reportType === "income" && (
        <Card>
          <CardHeader>
            <CardTitle>Detail Pemasukan</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Dibuat Oleh</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncome.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {transaction.category || "Tidak Dikategorikan"}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.createdBy}</TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      +{formatCurrency(transaction.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {reportType === "expenses" && (
        <Card>
          <CardHeader>
            <CardTitle>Detail Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Dibuat Oleh</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((transaction) => {
                  const programName = transaction.programId
                    ? programs.find((p) => p.id === transaction.programId)
                        ?.name || "Tidak Diketahui"
                    : "Umum";

                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          {transaction.category || "Tidak Dikategorikan"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {programName}
                        </span>
                      </TableCell>
                      <TableCell>{transaction.createdBy}</TableCell>
                      <TableCell className="text-right font-semibold text-red-600">
                        -{formatCurrency(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {reportType === "programs" && (
        <Card>
          <CardHeader>
            <CardTitle>Laporan Program Kerja</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Program</TableHead>
                  <TableHead className="text-right">Alokasi</TableHead>
                  <TableHead className="text-right">Terpakai</TableHead>
                  <TableHead className="text-right">Sisa</TableHead>
                  <TableHead className="text-right">Persentase</TableHead>
                  <TableHead className="text-right">Transaksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programExpenses.map((program) => {
                  const percentage =
                    program.allocatedBudget > 0
                      ? (program.totalExpense / program.allocatedBudget) * 100
                      : 0;

                  return (
                    <TableRow key={program.id}>
                      <TableCell className="font-medium">
                        {program.name}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(program.allocatedBudget)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(program.totalExpense)}
                      </TableCell>
                      <TableCell className="text-right text-blue-600">
                        {formatCurrency(
                          program.allocatedBudget - program.totalExpense
                        )}
                      </TableCell>
                      <TableCell
                        className={`text-right font-semibold ${
                          percentage > 100
                            ? "text-red-600"
                            : percentage > 80
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {percentage.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right">
                        {program.expenses.length}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;
