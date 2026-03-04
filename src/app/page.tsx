import Link from "next/link";
import { ArrowRight, Play, Video, Zap, QrCode, Sparkles, ChefHat, Check } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-500/30 font-sans overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-600/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[40%] rounded-full bg-purple-600/15 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <nav className="container mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 p-2 rounded-xl">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Menu<span className="text-red-500">Flix</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
            <Link href="#recursos" className="hover:text-white transition-colors">Recursos</Link>
            <Link href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</Link>
            <Link href="#precos" className="hover:text-white transition-colors">Preços</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link href="/register" className="text-sm font-medium bg-white text-black px-5 py-2.5 rounded-full hover:bg-zinc-200 transition-all active:scale-95 flex items-center gap-2">
              Começar Agora
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </nav>

        <main className="container mx-auto px-6 pt-24 pb-32 text-center md:pt-32 md:pb-40">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-red-500" />
            <span>A revolução do cardápio digital chegou</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1] max-w-4xl mx-auto">
            Seus pratos como as <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-purple-600">
              estrelas do show
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Abandone os PDFs chatos. O MenuFlix transforma sua experiência de restaurante em uma vitrine em vídeo estilo TikTok que gera desejo e aumenta suas vendas na hora.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-all active:scale-95 shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)] flex items-center justify-center gap-2 text-lg">
              <Play className="w-5 h-5 fill-current" />
              Começar Agora
            </Link>
            <Link href="#demo" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-medium transition-all active:scale-95 flex items-center justify-center gap-2 text-lg backdrop-blur-md">
              Ver Demonstração
            </Link>
          </div>

          <div className="mt-20 relative mx-auto max-w-5xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl blur opacity-20"></div>
            <div className="relative aspect-video bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center group cursor-pointer">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)]">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </div>
              <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&h=900&fit=crop&q=80" alt="MenuFlix Interface" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          </div>
        </main>

        <section id="recursos" className="py-24 bg-black/50 border-t border-white/5 relative">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Por que escolher o MenuFlix?</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
                Nossa plataforma foi desenhada para dar água na boca. Combine a conveniência do digital com o poder visual do vídeo.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-red-500/30 transition-colors group">
                <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Video className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Cardápio em Vídeo</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Experiência imersiva estilo Reels. Mostre o queijo derretendo, o vapor subindo e o molho caindo. Venda desejo, não apenas nomes de pratos.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-purple-500/30 transition-colors group">
                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Alterações Instantâneas</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Sem taxas de impressão e sem espera. Mude preços, oculte produtos em falta e adicione novidades em segundos pelo seu painel.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/30 transition-colors group">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <QrCode className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">QR Code na Mesa</h3>
                <p className="text-zinc-400 leading-relaxed">
                  O cliente escaneia o código e o espetáculo começa imediatamente no navegador do celular dele. Sem baixar apps, zero fricção.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="precos" className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Planos para todos os tamanhos</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
                Escolha o plano ideal para transformar a experiência do seu restaurante.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Plano Starter */}
              <div className="p-8 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 backdrop-blur-md flex flex-col hover:border-white/10 transition-all">
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-zinc-300 mb-2">Basic</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">R$ 47</span>
                    <span className="text-zinc-500 text-sm">/mês</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-zinc-400 text-sm">
                    <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    Até 10 pratos em vídeo
                  </li>
                  <li className="flex items-center gap-3 text-zinc-400 text-sm">
                    <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    QR Code fixo
                  </li>
                  <li className="flex items-center gap-3 text-zinc-400 text-sm">
                    <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    Auto-gestão completa
                  </li>
                  <li className="flex items-center gap-3 text-zinc-400 text-sm">
                    <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    Suporte via e-mail
                  </li>
                </ul>
                <Link href="/register" className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-medium transition-all text-center">
                  Começar agora
                </Link>
              </div>

              {/* Plano Pro */}
              <div className="p-8 rounded-[2.5rem] bg-gradient-to-b from-zinc-900/60 to-zinc-900/40 border-2 border-red-600/50 backdrop-blur-md flex flex-col relative scale-105 shadow-[0_0_80px_-20px_rgba(220,38,38,0.3)] z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-[10px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-full shadow-lg">
                  Mais Popular
                </div>
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-2">Pro Business</h3>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">R$ 97</span>
                      <span className="text-zinc-500 text-sm">/mês</span>
                    </div>
                    <span className="text-[10px] text-red-400 font-medium uppercase tracking-wider">
                      + R$ 1.800 implantação única*
                    </span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-zinc-300 text-sm">
                    <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    Captação e cadastro de 30 pratos
                  </li>
                  <li className="flex items-center gap-3 text-zinc-300 text-sm">
                    <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    Pratos ilimitados (auto-gestão)
                  </li>
                  <li className="flex items-center gap-3 text-zinc-300 text-sm">
                    <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    Analytics básico de acessos
                  </li>
                  <li className="flex items-center gap-3 text-zinc-300 text-sm">
                    <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    QR Code personalizado
                  </li>
                  <li className="flex items-center gap-3 text-zinc-300 text-sm">
                    <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    Suporte prioritário
                  </li>
                </ul>
                <div className="space-y-3">
                  <Link href="/register" className="block w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all text-center shadow-[0_0_30px_-5px_rgba(220,38,38,0.5)]">
                    Assinar agora
                  </Link>
                  <p className="text-[9px] text-center text-zinc-500 italic">
                    *Inclui configuração da plataforma + captação profissional
                  </p>
                </div>
              </div>

              {/* Plano Enterprise */}
              <div className="p-8 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 backdrop-blur-md flex flex-col hover:border-white/10 transition-all">
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-zinc-300 mb-2">Enterprise</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">Sob consulta</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-zinc-400 text-sm">
                    <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    Multi-estabelecimentos
                  </li>
                  <li className="flex items-center gap-3 text-zinc-400 text-sm">
                    <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    Integração com PDV
                  </li>
                  <li className="flex items-center gap-3 text-zinc-400 text-sm">
                    <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    Gerente de conta dedicado
                  </li>
                  <li className="flex items-center gap-3 text-zinc-400 text-sm">
                    <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    SLA garantido
                  </li>
                </ul>
                <Link href="/contact" className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-medium transition-all text-center">
                  Falar com especialista
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-red-600/5"></div>
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-red-900/20 to-transparent pointer-events-none"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-12 md:p-20 rounded-[3rem] shadow-2xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Pronto para modernizar seu restaurante?</h2>
              <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                Junte-se a centenas de estabelecimentos que já aumentaram seu ticket médio usando menus em vídeo altamente persuasivos.
              </p>
              <Link href="/register" className="inline-flex px-10 py-5 bg-white text-black hover:bg-zinc-200 rounded-full font-bold transition-all active:scale-95 text-lg items-center gap-3">
                Começar agora
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/5 bg-black">
          <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-red-500" />
              <span className="text-xl font-bold tracking-tight">Menu<span className="text-red-500">Flix</span></span>
            </div>
            <p className="text-zinc-500 text-sm">
              © {new Date().getFullYear()} MenuFlix. Inovando a experiência gastronômica.
            </p>
            <div className="flex gap-6 text-sm text-zinc-400">
              <Link href="#" className="hover:text-white transition-colors">Instagram</Link>
              <Link href="#" className="hover:text-white transition-colors">Termos</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacidade</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
