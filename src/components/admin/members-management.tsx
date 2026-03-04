"use client";

import { useState } from "react";
import { UserPlus, Trash2, Mail, Loader2, ShieldCheck } from "lucide-react";
import { addMemberAction, removeMemberAction } from "@/lib/server-actions/restaurant.actions";

interface Member {
  id: string;
  email: string;
  name: string;
}

interface MembersManagementProps {
  restaurantSlug: string;
  initialMembers: Member[];
}

export function MembersManagement({ restaurantSlug, initialMembers }: MembersManagementProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    const result = await addMemberAction(restaurantSlug, email);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setEmail("");
      setIsLoading(false);
      // O revalidatePath cuidará da atualização da lista
    }
  }

  async function handleRemoveMember(adminId: string) {
    if (!confirm("Tem certeza que deseja remover este membro?")) return;

    setIsLoading(true);
    const result = await removeMemberAction(restaurantSlug, adminId);

    if (result.error) {
      setError(result.error);
    }
    setIsLoading(false);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-purple-600/5 pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Gerenciar Membros</h2>
          <p className="text-sm text-zinc-400">Adicione outros administradores ao seu restaurante.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      <form onSubmit={handleAddMember} className="flex gap-3 mb-8 relative z-10">
        <div className="relative flex-1">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="email"
            placeholder="email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all placeholder:text-zinc-600"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-xl font-medium transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-red-600/20"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
          Convidar
        </button>
      </form>

      <div className="space-y-3 relative z-10">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Administradores Atuais</h3>
        
        {initialMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl group hover:border-white/20 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600/20 to-purple-600/20 flex items-center justify-center border border-white/10">
                <ShieldCheck className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-white font-medium">{member.name}</p>
                <p className="text-xs text-zinc-500">{member.email}</p>
              </div>
            </div>
            
            <button
              onClick={() => handleRemoveMember(member.id)}
              disabled={isLoading}
              className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              title="Remover acesso"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
