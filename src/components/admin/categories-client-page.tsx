"use client";

import { useState } from "react";
import { Plus, GripVertical, Pencil, Trash2, Loader2 } from "lucide-react";
import { CategorySnapshot } from "@/domain/entities/category";
import { 
  createCategoryAction, 
  updateCategoryAction, 
  deleteCategoryAction 
} from "@/lib/server-actions/category.actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CategoriesClientPageProps {
  categories: CategorySnapshot[];
  restaurantId: string;
  restaurantSlug: string;
}

export function CategoriesClientPage({ 
  categories, 
  restaurantId, 
  restaurantSlug 
}: CategoriesClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategorySnapshot | null>(null);
  const [name, setName] = useState("");

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: CategorySnapshot) => {
    setEditingCategory(category);
    setName(category.name);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      let result;
      if (editingCategory) {
        result = await updateCategoryAction(restaurantSlug, editingCategory.id, name);
      } else {
        result = await createCategoryAction(restaurantId, restaurantSlug, name);
      }

      if (result.success) {
        toast.success(editingCategory ? "Categoria atualizada!" : "Categoria criada!");
        setIsModalOpen(false);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao processar categoria");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria? Os pratos vinculados ficarão sem categoria.")) return;

    try {
      const result = await deleteCategoryAction(restaurantSlug, id);
      if (result.success) {
        toast.success("Categoria excluída!");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao excluir categoria");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 font-display uppercase">Categorias</h1>
          <p className="text-zinc-400">
            Gerencie as categorias do seu cardápio e ordene como elas aparecem.
          </p>
        </div>
        
        <button 
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Nova Categoria
        </button>
      </div>

      <div className="rounded-3xl border border-white/5 bg-zinc-900/30 backdrop-blur-xl shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-purple-600/5 pointer-events-none"></div>
        {categories.length === 0 ? (
          <div className="py-24 text-center relative z-10 flex flex-col items-center gap-4">
             <div className="bg-white/5 p-4 rounded-full border border-white/5">
                <Plus className="w-8 h-8 text-zinc-600" />
             </div>
             <div className="space-y-1">
                <h3 className="text-white font-bold">Nenhuma categoria cadastrada</h3>
                <p className="text-zinc-500 text-sm">Comece criando uma categoria para seus pratos.</p>
             </div>
             <Button 
               variant="outline" 
               onClick={handleOpenCreateModal}
               className="mt-4 border-white/10 hover:bg-white/5 text-zinc-300"
             >
                Criar categoria agora
             </Button>
          </div>
        ) : (
          <ul className="divide-y divide-white/5 relative z-10">
            {categories.map((category) => (
              <li 
                key={category.id} 
                className="group flex items-center justify-between p-5 hover:bg-white/5 transition-all duration-300 border-l-2 border-transparent hover:border-red-600/50"
              >
                <div className="flex items-center gap-5">
                  <div className="cursor-grab active:cursor-grabbing p-2 text-zinc-600 hover:text-zinc-400 transition-colors">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  
                  <div className="space-y-0.5">
                    <span className="text-white text-lg font-bold tracking-tight">{category.name}</span>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">
                          {category.displayOrder + 1}º no menu
                       </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button 
                    onClick={() => handleOpenEditModal(category)}
                    className="p-2.5 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                    title="Editar nome"
                  >
                    <Pencil className="w-4.5 h-4.5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    className="p-2.5 text-zinc-500 hover:text-red-500 rounded-xl hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/10"
                    title="Excluir categoria"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal Criar/Editar */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white sm:rounded-[24px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-display uppercase tracking-tight">
              {editingCategory ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name" className="text-zinc-500 font-black uppercase text-[10px] tracking-widest">
                Nome da Categoria
              </Label>
              <Input
                id="cat-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Pizzas, Bebidas, Sobremesas..."
                className="bg-white/5 border-white/10 focus:border-red-600/50 h-14 rounded-xl text-lg font-medium"
                required
              />
            </div>

            <DialogFooter className="gap-3 sm:gap-0">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-red-600 hover:bg-red-700 text-white font-bold h-12 px-8 rounded-xl"
                disabled={loading || !name.trim()}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingCategory ? "Salvar Alterações" : "Criar Categoria"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
