import { PrismaRestaurantRepository } from "@/infrastructure/database/prisma-restaurant-repository";
import { Copy, Link2 } from "lucide-react";
import { MembersManagement } from "@/components/admin/members-management";
import { QRCodeDownloader } from "@/components/admin/qr-code-downloader";
import { notFound } from "next/navigation";

export default async function SettingsPage({
  params
}: {
  params: Promise<{ restaurantSlug: string }>;
}) {
  const { restaurantSlug } = await params;
  const repo = new PrismaRestaurantRepository();
  const restaurant = await repo.findBySlug(restaurantSlug);

  if (!restaurant) {
    return notFound();
  }

  const members = await repo.listAdmins(restaurant.id);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://menuflix.app";
  const publicUrl = `${baseUrl}/${restaurant.slug}`;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Configurações</h1>
        <p className="text-zinc-400">
          Gerencie o acesso ao seu cardápio, membros da equipe e informações públicas.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-purple-600/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h2 className="text-xl font-bold tracking-tight text-white mb-1 relative z-10">Link do Cardápio</h2>
          <p className="text-sm text-zinc-400 mb-6 relative z-10">O link público para acessar o seu cardápio.</p>
          
          <div className="flex flex-col gap-3 relative z-10">
            <div className="flex items-center justify-between p-3 bg-black rounded-lg border border-white/10">
              <span className="text-red-400 font-medium truncate pr-4">{publicUrl}</span>
            </div>
            
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-600/20 active:scale-95">
                <Copy className="w-4 h-4" /> Copiar Link
              </button>
              <a 
                href={publicUrl}
                target="_blank"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-medium transition-colors"
                rel="noreferrer"
              >
                <Link2 className="w-4 h-4" /> Visualizar
              </a>
            </div>
          </div>
        </div>

        <QRCodeDownloader 
          restaurantSlug={restaurantSlug} 
          restaurantName={restaurant.name} 
        />
      </div>

      <MembersManagement 
        restaurantSlug={restaurantSlug} 
        initialMembers={JSON.parse(JSON.stringify(members))} 
      />

      <div className="rounded-2xl border border-white/10 bg-black/40 p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
        <h2 className="text-xl font-bold tracking-tight text-white mb-6 relative z-10">Informações do Restaurante</h2>
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-purple-600/5 pointer-events-none"></div>
        
        <form className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Nome</label>
            <input 
              type="text" 
              defaultValue={restaurant.name}
              className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Slug (Link)</label>
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
