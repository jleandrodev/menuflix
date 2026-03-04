import { PrismaRestaurantRepository } from "@/infrastructure/database/prisma-restaurant-repository";
import { Copy, Download, Link2, QrCode } from "lucide-react";

export default async function SettingsPage() {
  const repo = new PrismaRestaurantRepository();
  const restaurant = await repo.findById("mock-id-for-now");

  if (!restaurant) {
    return <div className="p-8 text-white">Restaurante não encontrado</div>;
  }

  const publicUrl = `https://videomenu.app/${restaurant.slug}`;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Configurações</h1>
        <p className="text-zinc-400">
          Gerencie o acesso ao seu cardápio, QR Code e informações públicas.
        </p>
      </div>

      {/* Access Card */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* URL Card */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-purple-600/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h2 className="text-xl font-bold tracking-tight text-white mb-1 relative z-10">Seu Link</h2>
          <p className="text-sm text-zinc-400 mb-6 relative z-10">O link público para acessar o seu cardápio.</p>
          
          <div className="flex flex-col gap-3 relative z-10">
            <div className="flex items-center justify-between p-3 bg-black rounded-lg border border-white/10">
              <span className="text-red-400 font-medium truncate pr-4">{publicUrl}</span>
            </div>
            
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-600/20 active:scale-95">
                <Copy className="w-4 h-4" /> Copiar Link
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-medium transition-colors">
                <Link2 className="w-4 h-4" /> Acessar
              </button>
            </div>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl flex items-center justify-between group hover:border-white/20 transition-all relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-purple-600/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold tracking-tight text-white mb-1">QR Code na Mesa</h2>
            <p className="text-sm text-zinc-400 mb-6">Imprima e coloque nas mesas.</p>
            
            <button className="flex items-center justify-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-600/20 active:scale-95">
              <Download className="w-4 h-4" /> Baixar PDF
            </button>
          </div>
          
          <div className="w-32 h-32 bg-white rounded-2xl p-2 flex items-center justify-center relative z-10 shadow-xl group-hover:scale-105 transition-transform duration-500">
            <QrCode className="w-full h-full text-black" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Info Form */}
      <div className="rounded-2xl border border-white/10 bg-black/40 p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
        <h2 className="text-xl font-bold tracking-tight text-white mb-6 relative z-10">Informações Básicas</h2>
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-purple-600/5 pointer-events-none"></div>
        
        <form className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Nome do Restaurante</label>
            <input 
              type="text" 
              defaultValue={restaurant.name}
              className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Slug (URL)</label>
            <input 
              type="text" 
              defaultValue={restaurant.slug}
              className="w-full px-4 py-3 bg-black border border-white/5 text-zinc-600 rounded-xl focus:outline-none cursor-not-allowed"
              disabled
            />
          </div>
          
          <div className="pt-6 flex justify-end">
            <button type="button" className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl font-medium transition-colors active:scale-95">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
