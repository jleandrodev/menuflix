import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PrismaRestaurantRepository } from "@/infrastructure/database/prisma-restaurant-repository";

export default async function AdminRootPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const restaurantRepo = new PrismaRestaurantRepository();
  const userRestaurants = user.email 
    ? await restaurantRepo.findByAdminEmail(user.email) 
    : [];

  if (userRestaurants.length > 0) {
    redirect(`/admin/${userRestaurants[0].slug}/dashboard`);
  }

  // Se o admin não tem restaurantes, talvez mostrar uma tela de "Bem-vindo" ou "Criar primeiro restaurante"
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-red-600/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-purple-600/15 blur-[120px]" />
      </div>

      <div className="relative z-10 text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo ao MenuFlix</h1>
        <p className="text-zinc-400 mb-8 text-lg">
          Sua conta está ativa, mas você ainda não tem nenhum restaurante vinculado. Comece agora mesmo!
        </p>
        <Link 
          href="/admin/new"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-600/25 transform hover:scale-105"
        >
          Criar Meu Primeiro Restaurante
        </Link>
      </div>
    </div>
  );
}
