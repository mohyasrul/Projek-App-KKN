import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/contexts/AppContext";
import type { Program } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate } from "@/utils/formatters";
import {
  Plus,
  Trash2,
  Edit,
  FileText,
  Calendar,
  DollarSign,
} from "lucide-react";

const ProgramManagement = () => {
  const {
    programs,
    addProgram,
    updateProgram,
    deleteProgram,
    getExpensesByProgram,
    user,
  } = useApp();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    allocatedBudget: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.allocatedBudget) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }

    if (editingProgram) {
      updateProgram(editingProgram, {
        name: formData.name,
        allocatedBudget: parseFloat(formData.allocatedBudget),
        description: formData.description,
      });
      toast({
        title: "Berhasil",
        description: "Program kerja berhasil diperbarui",
      });
    } else {
      addProgram({
        name: formData.name,
        allocatedBudget: parseFloat(formData.allocatedBudget),
        description: formData.description,
      });
      toast({
        title: "Berhasil",
        description: "Program kerja berhasil ditambahkan",
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      allocatedBudget: "",
      description: "",
    });
    setIsDialogOpen(false);
    setEditingProgram(null);
  };

  const handleEdit = (program: Program) => {
    setFormData({
      name: program.name,
      allocatedBudget: program.allocatedBudget.toString(),
      description: program.description,
    });
    setEditingProgram(program.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteProgram(id);
    toast({
      title: "Berhasil",
      description: "Program kerja berhasil dihapus",
    });
  };

  const canEdit = user?.role === "treasurer";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Manajemen Program Kerja
        </h2>
        {canEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => setEditingProgram(null)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Program
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingProgram
                    ? "Edit Program Kerja"
                    : "Tambah Program Kerja Baru"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nama Program
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Nama program kerja"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Alokasi Dana (Rp)
                  </label>
                  <Input
                    type="number"
                    value={formData.allocatedBudget}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        allocatedBudget: e.target.value,
                      }))
                    }
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Deskripsi
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Deskripsi program kerja..."
                    required
                  />
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    {editingProgram ? "Update Program" : "Simpan Program"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Batal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4">
        {programs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Belum ada program kerja</p>
            </CardContent>
          </Card>
        ) : (
          programs.map((program) => {
            const expenses = getExpensesByProgram(program.id);
            const percentage =
              program.allocatedBudget > 0
                ? (program.usedBudget / program.allocatedBudget) * 100
                : 0;

            return (
              <Card
                key={program.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        {program.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {program.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress Dana</span>
                          <span
                            className={`font-medium ${
                              percentage > 100
                                ? "text-red-600"
                                : percentage > 80
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={Math.min(percentage, 100)}
                          className={`h-2 ${
                            percentage > 100
                              ? "[&>div]:bg-red-500"
                              : percentage > 80
                              ? "[&>div]:bg-yellow-500"
                              : "[&>div]:bg-green-500"
                          }`}
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>
                            Terpakai: {formatCurrency(program.usedBudget)}
                          </span>
                          <span>
                            Alokasi: {formatCurrency(program.allocatedBudget)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mt-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(program.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="h-4 w-4" />
                          <span>{expenses.length} transaksi</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>
                            Sisa:{" "}
                            {formatCurrency(
                              program.allocatedBudget - program.usedBudget
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {canEdit && (
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleEdit(program)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(program.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProgramManagement;
