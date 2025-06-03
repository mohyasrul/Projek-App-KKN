
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
import { Plus, Trash2, Calendar, User } from 'lucide-react';

const IncomeManagement = () => {
  const { transactions, addTransaction, deleteTransaction, user } = useApp();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
  });

  const incomeCategories = [
    'Iuran Anggota',
    'Dana Universitas',
    'Sponsor',
    'Donasi',
    'Lainnya'
  ];

  const incomeTransactions = transactions.filter(t => t.type === 'income');

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
      type: 'income',
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: formData.date,
      category: formData.category || 'Lainnya',
    });

    toast({
      title: "Berhasil",
      description: "Pemasukan berhasil ditambahkan",
    });

    setFormData({
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
    });
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    toast({
      title: "Berhasil",
      description: "Pemasukan berhasil dihapus",
    });
  };

  const canDelete = user?.role === 'treasurer';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manajemen Pemasukan</h2>
        {user?.role === 'treasurer' && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Pemasukan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Pemasukan Baru</DialogTitle>
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
                  <label className="block text-sm font-medium mb-2">Sumber Dana</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih sumber dana" />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
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
                    placeholder="Deskripsi pemasukan..."
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

                <Button type="submit" className="w-full">
                  Simpan Pemasukan
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4">
        {incomeTransactions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Belum ada data pemasukan</p>
            </CardContent>
          </Card>
        ) : (
          incomeTransactions.map((transaction) => (
            <Card key={transaction.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{transaction.description}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {transaction.category}
                      </span>
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
                    </div>

                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(transaction.amount)}
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

export default IncomeManagement;
