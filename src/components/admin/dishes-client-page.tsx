"use client";

import { useState } from "react";
import { Plus, Search, Video, Star, MoreVertical, Pencil, Trash2, Eye } from "lucide-react";
import { CreateDishModal } from "@/components/admin/create-dish-modal";
import { DishSnapshot } from "@/domain/entities/dish";
import { CategorySnapshot } from "@/domain/entities/category";
import { deleteDishAction } from "@/lib/server-actions/dish.actions";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DishesClientPageProps {
  dishes: DishSnapshot[];
  categories: CategorySnapshot[];
  restaurantId: string;
  restaurantSlug: string;
}

export function DishesClientPage({ 
  dishes, 
  categories, 
  restaurantId, 
  restaurantSlug 
}: DishesClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<DishSnapshot | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || dish.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreateModal = () => {
    setEditingDish(null);
    setIsModalOpen(true);
  };

  const handleEdit = (dish: DishSnapshot) => {
    setEditingDish(dish);
    setIsModalOpen(true);
  };

  const handleDelete = async (dishId: string) => {
    if (!confirm("Tem certeza que deseja excluir este prato?")) return;
    
    try {
      const result = await deleteDishAction(restaurantSlug, dishId);
      if (result.success) {
        toast.success("Prato excluído com sucesso!");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao excluir prato");
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 font-display uppercase">Pratos & Vídeos</h1>
          <p className="text-zinc-400">
            Gerencie o seu cardápio, faça upload de vídeos e destaque pratos.
          </p>
        </div>
        
        <button 
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Novo Prato
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Buscar por nome do prato..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/50 border border-white/5 backdrop-blur-md rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50 transition-all font-medium"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 hidden md:block">Filtrar por:</span>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-zinc-900/50 border border-white/5 backdrop-blur-md rounded-xl text-sm text-zinc-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500/30 transition-all font-medium min-w-[160px]"
          >
            <option value="all">Todas as categorias</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <div className="h-10 w-px bg-white/5 hidden sm:block mx-1" />
          <span className="text-sm font-medium text-zinc-400 whitespace-nowrap">
            {filteredDishes.length} {filteredDishes.length === 1 ? 'prato encontrado' : 'pratos encontrados'}
          </span>
        </div>
      </div>

      {/* Grid of Dishes - Compact Mode (No Images) */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredDishes.length === 0 ? (
          <div className="col-span-full py-32 text-center border border-dashed border-white/10 rounded-3xl bg-zinc-900/20 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="bg-zinc-900/50 p-6 rounded-full border border-white/5 mb-6">
              <Video className="w-12 h-12 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Nenhum prato encontrado</h3>
            <p className="text-zinc-500 max-w-xs mx-auto mb-8">
              {searchQuery || selectedCategory !== 'all' 
                ? "Não encontramos pratos com os filtros selecionados. Tente limpar sua busca."
                : "Seu cardápio ainda está vazio. Comece adicionando seu primeiro prato hoje mesmo!"}
            </p>
            {!searchQuery && selectedCategory === 'all' && (
              <button 
                onClick={handleOpenCreateModal}
                className="px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 transition-colors shadow-xl"
              >
                Cadastrar Primeiro Prato
              </button>
            )}
          </div>
        ) : (
          filteredDishes.map((dish) => (
            <DishCard 
              key={dish.id} 
              dish={dish} 
              onEdit={() => handleEdit(dish)}
              onDelete={() => handleDelete(dish.id)}
            />
          ))
        )}
      </div>

      <CreateDishModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingDish(null);
        }} 
        restaurantId={restaurantId}
        restaurantSlug={restaurantSlug}
        categories={categories}
        dish={editingDish}
      />
    </div>
  );
}

interface DishCardProps {
  dish: DishSnapshot;
  onEdit: () => void;
  onDelete: () => void;
}

function DishCard({ dish, onEdit, onDelete }: DishCardProps) {
  return (
    <div className="group relative p-5 rounded-3xl border border-white/5 bg-zinc-900/30 backdrop-blur-xl flex flex-col hover:border-red-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/5">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col gap-2">
          {dish.highlighted && (
            <span className="w-fit inline-flex items-center gap-1 bg-amber-500/10 text-amber-500 text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded border border-amber-500/20">
              <Star className="w-3 h-3 fill-amber-500" /> Destaque
            </span>
          )}
          <span className="w-fit text-[9px] uppercase font-black tracking-widest bg-white/5 text-zinc-500 px-2 py-0.5 rounded border border-white/5">
            {dish.categoryId ? "Com Categoria" : "Sem Categoria"}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 text-zinc-500 hover:text-white transition-colors hover:bg-white/5 rounded-xl">
              <MoreVertical className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-zinc-900 border-white/10 text-white min-w-[160px] rounded-xl p-1.5 shadow-2xl">
            <DropdownMenuItem 
              onClick={onEdit}
              className="flex items-center gap-2 p-2.5 cursor-pointer rounded-lg hover:bg-white/5 focus:bg-white/5 focus:text-white transition-colors"
            >
              <Pencil className="w-4 h-4 text-zinc-400" />
              <span className="font-bold text-sm">Editar Detalhes</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onDelete}
              className="flex items-center gap-2 p-2.5 cursor-pointer rounded-lg hover:bg-red-500/10 focus:bg-red-500/10 text-red-400 focus:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="font-bold text-sm">Excluir Prato</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-1 mb-6">
        <h3 className="text-white text-lg font-black line-clamp-1 group-hover:text-red-500 transition-colors font-display" title={dish.name}>
          {dish.name}
        </h3>
        <p className="text-zinc-500 text-sm line-clamp-2 min-h-[40px] leading-relaxed">
          {dish.description || "Nenhuma descrição informada."}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
        <p className="text-white font-black text-lg">
          {(dish.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
        
        <div className="flex items-center gap-3">
          {dish.videoUrl && (
             <div className="p-2 bg-red-500/10 rounded-lg text-red-500" title="Tem vídeo">
                <Video className="w-4 h-4" />
             </div>
          )}
          <span className="text-zinc-500 text-[11px] flex items-center gap-1.5 font-black uppercase tracking-widest">
            <Eye className="w-3.5 h-3.5" /> {dish.viewCount}
          </span>
        </div>
      </div>
    </div>
  );
}
