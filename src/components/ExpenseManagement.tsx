
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { Minus, Trash2, Calendar, User, Camera } from 'lucide-react';

const ExpenseManagement = () => {
  const { transactions, programs, addTransaction, deleteTransaction, user } = useApp();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    programId: '',
    receipt: '',
  });

  const expenseCategories = [
    'Konsumsi',
    'Transportasi',
    'Alat dan Bahan',
    'Dokumentasi',
    'Administrasi',
    'Lainnya'
  ];

  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }

    addTransaction({
      type: 'expense',
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: formData.date,
      category: formData.category || 'Lainnya',
      programId: formData.programId === 'general' ? undefined : formData.programId || undefined,
      receipt: formData.receipt || undefined,
    });

    toast({
      title: "Berhasil",
      description: "Pengeluaran berhasil ditambahkan",
    });

    setFormData({
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      programId: '',
      receipt: '',
    });
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    toast({
      title: "Berhasil",
      description: "Pengeluaran berhasil dihapus",
    });
  };

  const canDelete = user?.role === 'treasurer';
  const getProgramName = (programId: string) => {
    const program = programs.find(p => p.id === programId);
    return program ? program.name : 'Umum';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manajemen Pengeluaran</h2>
        {user?.role === 'treasurer' && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Minus className="mr-2 h-4 w-4" />
                Tambah Pengeluaran
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Pengeluaran Baru</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Jumlah (Rp)</label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Kategori</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Program Kerja (Opsional)</label>
                  <Select value={formData.programId} onValueChange={(value) => setFormData(prev => ({ ...prev, programId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih program kerja" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Umum</SelectItem>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Keterangan</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Deskripsi pengeluaran..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tanggal</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bukti Transaksi (Opsional)</label>
                  <Input
                    type="text"
                    value={formData.receipt}
                    onChange={(e) => setFormData(prev => ({ ...prev, receipt: e.target.value }))}
                    placeholder="URL atau keterangan bukti"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Simpan Pengeluaran
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4">
        {expenseTransactions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Belum ada data pengeluaran</p>
            </CardContent>
          </Card>
        ) : (
          expenseTransactions.map((transaction) => (
            <Card key={transaction.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{transaction.description}</h3>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        {transaction.category}
                      </span>
                      {transaction.programId && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {getProgramName(transaction.programId)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDateTime(transaction.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{transaction.createdBy}</span>
                      </div>
                      {transaction.receipt && (
                        <div className="flex items-center space-x-1">
                          <Camera className="h-4 w-4" />
                          <span>Ada bukti</span>
                        </div>
                      )}
                    </div>

                    <p className="text-2xl font-bold text-red-600">
                      -{formatCurrency(transaction.amount)}
                    </p>
                  </div>

                  {canDelete && (
                    <Button
                      onClick={() => handleDelete(transaction.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseManagement;
