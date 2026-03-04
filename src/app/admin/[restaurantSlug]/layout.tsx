import { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Video, List, Settings, LogOut, ChefHat } from "lucide-react";
import { RestaurantSwitcher } from "@/components/RestaurantSwitcher";
import { createClient } from "@/lib/supabase/server";
import { PrismaRestaurantRepository } from "@/infrastructure/database/prisma-restaurant-repository";
import { logoutAction } from "@/lib/server-actions/auth.actions";

export default async function AdminLayout({ 
  children,
  params 
}: { 
  children: ReactNode;
  params: Promise<{ restaurantSlug: string }>;
}) {
  const { restaurantSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const restaurantRepo = new PrismaRestaurantRepository();
  const userRestaurants = user?.email 
    ? await restaurantRepo.findByAdminEmail(user.email) 
    : [];

  // Verifica se o usuário tem acesso a este slug específico
  const hasAccess = userRestaurants.some(r => r.slug === restaurantSlug);
  if (!hasAccess && userRestaurants.length > 0) {
    redirect(`/admin/${userRestaurants[0].slug}/dashboard`);
  } else if (!hasAccess) {
    redirect("/admin");
  }

  const adminBaseUrl = `/admin/${restaurantSlug}`;

  return (
    <div className="flex h-screen w-full bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 p-1.5 rounded-lg flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Menu<span className="text-red-500">Flix</span>
            </h1>
          </div>
          <span className="ml-2 text-[10px] font-bold px-2 py-0.5 border border-red-500/20 bg-red-500/10 rounded-full text-red-400 tracking-wider">
            ADMIN
          </span>
        </div>

        <div className="px-3 py-4 border-b border-white/5">
          <RestaurantSwitcher 
            restaurants={userRestaurants.map(r => ({ id: r.id, name: r.name, slug: r.slug }))} 
            currentSlug={restaurantSlug} 
          />
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
          <NavItem href={`${adminBaseUrl}/dashboard`} icon={<LayoutDashboard className="w-5 h-5" />}>
            Dashboard
          </NavItem>
          <NavItem href={`${adminBaseUrl}/dishes`} icon={<Video className="w-5 h-5" />}>
            Pratos & Vídeos
          </NavItem>
          <NavItem href={`${adminBaseUrl}/categories`} icon={<List className="w-5 h-5" />}>
            Categorias
          </NavItem>
          <NavItem href={`${adminBaseUrl}/settings`} icon={<Settings className="w-5 h-5" />}>
            Configurações
          </NavItem>
        </nav>

        <div className="p-4 border-t border-white/5">
          <form action={logoutAction}>
            <button 
              type="submit"
              className="flex w-full items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white rounded-md transition-colors hover:bg-white/5"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-black relative">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-red-600/20 blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[30%] h-[40%] rounded-full bg-purple-600/15 blur-[120px]" />
        </div>
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, children }: { href: string; icon: ReactNode; children: ReactNode }) {
  // In a real app we'd use usePathname from next/navigation to set active class
  const isActive = false;
  
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
        isActive
          ? "bg-red-500/10 text-red-500 border-l-2 border-red-500 pl-2.5"
          : "text-zinc-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}
