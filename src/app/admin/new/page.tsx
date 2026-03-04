"use client";

import { useState } from "react";
import { ChefHat, Store, Globe, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { createRestaurantAction } from "@/lib/server-actions/restaurant.actions";

export default function NewRestaurantPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    // Auto-generate slug from name if slug hasn't been manually edited or is empty
    const generatedSlug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generatedSlug);
  };

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    
    const result = await createRestaurantAction(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-red-600/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-purple-600/15 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="bg-red-600 p-2.5 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Menu<span className="text-red-500">Flix</span>
          </h1>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-purple-600/5 rounded-[2.5rem] pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Novo Restaurante</h2>
            <p className="text-zinc-400 mb-8">Comece a criar seu cardápio digital em segundos.</p>

            <form action={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Nome do Restaurante
                </label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    name="name"
                    type="text"
                    required
                    onChange={handleNameChange}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all font-medium"
                    placeholder="Ex: Pizzaria do Mario"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  URL (Slug)
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    name="slug"
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all font-mono text-sm"
                    placeholder="pizzaria-mario"
                  />
                </div>
                <p className="mt-2 text-xs text-zinc-500">
                  Seu cardápio será: <span className="text-red-400">menuglif.com/{slug || "seu-nome"}</span>
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                  {error}
                </div>
              )}

              <div className="pt-2 flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-red-600/25 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    "Criar Restaurante"
                  )}
                </button>

                <Link
                  href="/admin"
                  className="w-full text-center text-zinc-500 hover:text-white text-sm font-medium transition-colors py-2 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Link>
              </div>
            </form>
          </div>
        </div>

        <p className="mt-8 text-center text-zinc-500 text-sm">
          &copy; {new Date().getFullYear()} MenuFlix. Feito para crescer seu negócio.
        </p>
      </div>
    </div>
  );
}
