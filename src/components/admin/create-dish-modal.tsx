"use client";

import { useState, useRef, useEffect } from "react";
import { 
  X, 
  Upload, 
  Video, 
  Image as ImageIcon, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Currency,
  Paperclip,
  Film,
  Star
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CategorySnapshot } from "@/domain/entities/category";
import { DishSnapshot } from "@/domain/entities/dish";
import { createDishAction, updateDishAction } from "@/lib/server-actions/dish.actions";
import { toast } from "sonner";

interface CreateDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  restaurantSlug: string;
  categories: CategorySnapshot[];
  dish?: DishSnapshot | null;
}

export function CreateDishModal({ 
  isOpen, 
  onClose, 
  restaurantId, 
  restaurantSlug,
  categories,
  dish
}: CreateDishModalProps) {
  const [loading, setLoading] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(dish?.videoUrl || null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset preview when dish changes
  useEffect(() => {
    if (isOpen) {
      setVideoPreview(dish?.videoUrl || null);
      setVideoFile(null);
    }
  }, [dish, isOpen]);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error("O vídeo deve ter no máximo 50MB");
        return;
      }
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("restaurantId", restaurantId);
      formData.append("restaurantSlug", restaurantSlug);
      if (dish) {
        formData.append("dishId", dish.id);
      }
      if (videoFile) {
        formData.append("video", videoFile);
      }

      const result = dish 
        ? await updateDishAction(formData)
        : await createDishAction(formData);

      if (result.success) {
        toast.success(dish ? "Prato atualizado!" : "Prato criado!");
        onClose();
        setVideoPreview(null);
        setVideoFile(null);
      } else {
        toast.error(result.error || "Erro ao salvar prato");
      }
    } catch (error) {
      toast.error("Erro interno ao processar cadastro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !loading && !open && onClose()}>
      <DialogContent className="max-w-4xl lg:max-w-5xl bg-zinc-950 border-white/10 text-white overflow-hidden p-0 gap-0 sm:rounded-[32px] shadow-2xl shadow-red-900/20">
        <div className="flex flex-col md:flex-row h-full max-h-[90vh] w-full">
          {/* Left Side: Video Preview */}
          <div className="w-full md:w-[45%] lg:w-1/2 bg-black flex flex-col items-center justify-center p-6 lg:p-10 border-b md:border-b-0 md:border-r border-white/5 relative">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
               <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-red-600/20 to-purple-600/20 blur-3xl opacity-30" />
            </div>

            <div className="relative z-10 w-full aspect-[9/16] max-h-[60vh] md:max-h-none rounded-3xl border-2 border-dashed border-white/10 overflow-hidden flex flex-col items-center justify-center bg-zinc-900/50 hover:bg-zinc-900/80 transition-all group">
              {videoPreview ? (
                <>
                  <video 
                    src={videoPreview} 
                    className="w-full h-full object-cover" 
                    controls 
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      setVideoPreview(null);
                      setVideoFile(null);
                    }}
                    className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-red-600 rounded-full text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div 
                  className="cursor-pointer flex flex-col items-center p-8 text-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-red-500/10 transition-all border border-white/5 group-hover:border-red-500/20">
                    <Film className="w-8 h-8 text-zinc-500 group-hover:text-red-500 transition-colors" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">Upload do Vídeo</h3>
                  <p className="text-zinc-500 text-sm max-w-[200px]">
                    Arraste ou clique para selecionar um vídeo (MP4, max 50MB)
                  </p>
                  <div className="mt-6 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-400 group-hover:border-white/20 group-hover:text-white transition-all">
                    Selecionar Arquivo
                  </div>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="video/*"
                onChange={handleVideoChange}
              />
            </div>
            
            <div className="mt-6 w-full max-w-[280px]">
               <div className="flex items-start gap-3 p-3 bg-red-500/5 rounded-xl border border-red-500/10">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Vídeos verticais (9:16) proporcionam a melhor experiência para seus clientes estilo MenuFlix.
                  </p>
               </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="flex-1 p-6 lg:p-10 flex flex-col justify-between overflow-y-auto bg-zinc-950">
            <form id="create-dish-form" onSubmit={handleSubmit} className="space-y-6">
              <DialogHeader className="mb-8">
                <DialogTitle className="text-2xl font-black font-display uppercase tracking-tight">
                  {dish ? "Editar Prato" : "Novo Prato"}
                </DialogTitle>
                <DialogDescription className="text-zinc-500 text-base">
                  {dish ? "Atualize as informações do seu prato." : "Preencha os detalhes do prato para adicioná-lo ao seu cardápio."}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Nome do Prato</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Ex: Hambúrguer Artesanal Turbo" 
                    defaultValue={dish?.name}
                    required 
                    className="bg-white/5 border-white/10 focus:border-red-500/50 h-12 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Preço (R$)</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">R$</span>
                      <Input 
                        id="price" 
                        name="price" 
                        type="number" 
                        step="0.01" 
                        placeholder="0,00" 
                        defaultValue={dish ? (dish.price / 100).toFixed(2) : ""}
                        required 
                        className="bg-white/5 border-white/10 focus:border-red-500/50 h-12 rounded-xl pl-12 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoryId" className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Categoria</Label>
                    <Select name="categoryId" defaultValue={dish?.categoryId || undefined}>
                      <SelectTrigger className="bg-white/5 border-white/10 focus:border-red-500/50 h-12 rounded-xl text-sm">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Descrição</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="Descreva o que este prato tem de especial..." 
                    defaultValue={dish?.description || ""}
                    rows={4} 
                    className="bg-white/5 border-white/10 focus:border-red-500/50 rounded-xl resize-none py-3 text-sm"
                  />
                </div>

                <div className="flex items-center space-x-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer group/highlight">
                  <input 
                    type="checkbox" 
                    id="highlighted" 
                    name="highlighted" 
                    value="true"
                    defaultChecked={dish?.highlighted}
                    className="w-5 h-5 rounded border-white/10 bg-black text-red-600 focus:ring-red-500 focus:ring-offset-zinc-950 transition-all cursor-pointer" 
                  />
                  <Label htmlFor="highlighted" className="font-bold flex items-center gap-2 cursor-pointer text-sm">
                    <Star className="w-4 h-4 text-amber-500 group-hover/highlight:fill-amber-500 transition-all" />
                    Destacar na página inicial
                  </Label>
                </div>
              </div>
            </form>

            <DialogFooter className="mt-8 pt-6 border-t border-white/5 sm:justify-end gap-3">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onClose}
                disabled={loading}
                className="text-zinc-400 hover:text-white"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                form="create-dish-form"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-red-600/20 active:scale-95 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : "Cadastrar Prato"}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
