"use client";
import { MetricsOutput } from "@/application/dtos/metrics.dto";
import { Copy, Eye, Star, TrendingUp, Video } from "lucide-react";

export function MetricsDashboard({ metrics }: { metrics: MetricsOutput }) {
  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de Visualizações"
          value={metrics.totalViews.toString()}
          icon={<Eye className="w-5 h-5 text-red-500" />}
        />
        <MetricCard
          title="Nota Média Geral"
          value={metrics.averageRating > 0 ? metrics.averageRating.toFixed(1) : "—"}
          icon={<Star className="w-5 h-5 text-amber-400" />}
          subtitle="de 5.0"
        />
        <MetricCard
          title="Pratos Ativos"
          value={`${metrics.activeDishes} / ${metrics.totalDishes}`}
          icon={<Video className="w-5 h-5 text-purple-400" />}
          subtitle="com vídeo"
        />
        <MetricCard
          title="Prato Mais Visto"
          value={metrics.dishRanking[0]?.viewCount.toString() || "0"}
          icon={<TrendingUp className="w-5 h-5 text-rose-500" />}
          subtitle={metrics.dishRanking[0]?.name || "Nenhum prato"}
        />
      </div>

      {/* Ranking Table */}
      <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-purple-600/5 pointer-events-none"></div>
        <div className="p-6 border-b border-white/5 flex justify-between items-center relative z-10">
          <h2 className="text-xl font-bold tracking-tight text-white">Ranking de Pratos</h2>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-all">
            <Copy className="w-3.5 h-3.5" />
            Exportar CSV
          </button>
        </div>
        
        {metrics.dishRanking.length > 0 ? (
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase text-zinc-400 bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Prato</th>
                  <th className="px-6 py-4 font-medium">Visualizações</th>
                  <th className="px-6 py-4 font-medium">Avaliações</th>
                  <th className="px-6 py-4 font-medium text-right">Nota Média</th>
                </tr>
              </thead>
              <tbody>
                {metrics.dishRanking.map((dish, i) => (
                  <tr key={dish.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                      <span className="text-zinc-500 font-mono w-4 group-hover:text-red-400 transition-colors">{i + 1}.</span>
                      {dish.name}
                    </td>
                    <td className="px-6 py-4 text-red-400 font-semibold group-hover:text-red-300 transition-colors">
                      {dish.viewCount}
                    </td>
                    <td className="px-6 py-4 text-zinc-300">
                      {dish.ratingCount}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-1.5">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-white">
                        {dish.averageRating > 0 ? dish.averageRating.toFixed(1) : "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Video className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-300">Nenhum prato com vídeo</h3>
            <p className="text-zinc-500 mt-1">
              Adicione pratos e faça upload de vídeos para ver as métricas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, subtitle, trend }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl shadow-xl relative overflow-hidden group hover:border-white/20 transition-all">
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-2 -translate-y-2 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
        {icon}
      </div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-sm font-medium text-zinc-400">{title}</h3>
        {icon}
      </div>
      
      <div className="flex flex-col relative z-10">
        <span className="text-3xl font-bold tracking-tight text-white mb-1 group-hover:translate-x-1 transition-transform">{value}</span>
        {subtitle && <span className="text-xs text-zinc-500">{subtitle}</span>}
        {trend && <span className="text-xs text-green-400 font-medium inline-flex items-center gap-1 mt-1">{trend}</span>}
      </div>
      
      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-purple-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}
