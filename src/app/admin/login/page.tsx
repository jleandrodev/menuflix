import { ChefHat, Lock, Mail } from "lucide-react";
import { loginAction } from "@/lib/server-actions/auth.actions";
import { SubmitButton } from "@/components/submit-button"; // Iremos criar a seguir para form feedback!

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-red-600 p-2.5 rounded-xl flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Menu<span className="text-red-500">Flix</span>
          </h1>
        </div>
        <p className="text-zinc-400">Acesse seu painel administrativo.</p>
      </div>

      <div className="w-full max-w-md bg-black/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-purple-600/5 rounded-[2rem] pointer-events-none"></div>
        <form action={loginAction} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              E-mail do Restaurante
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                name="email"
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                placeholder="ola@restaurante.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                name="password"
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex justify-between mt-2">
              <span className="text-xs text-red-500 mt-1">{searchParams?.error || ""}</span>
              <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors ml-auto">Esqueceu a senha?</a>
            </div>
          </div>

          <SubmitButton />
        </form>
      </div>

      <div className="mt-12 text-zinc-600 text-sm">
        &copy; {new Date().getFullYear()} MenuFlix. Todos os direitos reservados.
      </div>
    </div>
  );
}
