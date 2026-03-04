"use client";

import { Download, QrCode as QrCodeIcon, Loader2 } from "lucide-react";
import { useState } from "react";

interface QRCodeDownloaderProps {
  restaurantSlug: string;
  restaurantName: string;
}

export function QRCodeDownloader({ restaurantSlug, restaurantName }: QRCodeDownloaderProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://menuflix.app";
  const publicUrl = `${baseUrl}/${restaurantSlug}`;
  
  // Usando a API qrserver.com para gerar o QR Code sem dependências extras no node_modules
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(publicUrl)}`;

  async function handleDownload() {
    setIsDownloading(true);
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `qrcode-${restaurantSlug}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar QR Code:", error);
      alert("Erro ao baixar o QR Code. Tente novamente.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl flex items-center justify-between group hover:border-white/20 transition-all relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-purple-600/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative z-10">
        <h2 className="text-xl font-bold tracking-tight text-white mb-1">QR Code</h2>
        <p className="text-sm text-zinc-400 mb-6">Imprima e coloque nas mesas para seus clientes.</p>
        
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-600/20 active:scale-95"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Baixar QR Code (PNG)
        </button>
      </div>
      
      <div className="w-32 h-32 bg-white rounded-2xl p-2 flex items-center justify-center relative z-10 shadow-xl group-hover:scale-105 transition-transform duration-500">
        <img 
          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicUrl)}`}
          alt="QR Code"
          className="w-full h-full text-black"
        />
      </div>
    </div>
  );
}
