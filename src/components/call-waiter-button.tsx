"use client";
// src/components/call-waiter-button.tsx
// Floating call waiter button

import { useState } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { callWaiterAction } from "@/lib/server-actions/waiter.actions";

interface CallWaiterButtonProps {
  slug: string;
  tableIdentifier?: string;
}

export function CallWaiterButton({ slug, tableIdentifier = "QR" }: CallWaiterButtonProps) {
  const [state, setState] = useState<"idle" | "confirming" | "loading" | "success">("idle");

  const handleClick = async () => {
    if (state === "idle") {
      setState("confirming");
      return;
    }

    if (state === "confirming") {
      setState("loading");
      try {
        await callWaiterAction({ slug, tableIdentifier });
        setState("success");
        setTimeout(() => setState("idle"), 3000);
      } catch {
        setState("idle");
      }
    }
  };

  const handleCancel = () => {
    if (state === "confirming") setState("idle");
  };

  return (
    <div className="fixed bottom-6 right-5 z-40 flex items-center gap-2">
      {/* Confirmation/Cancel */}
      {state === "confirming" && (
        <button
          onClick={handleCancel}
          className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/70 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-200 hover:bg-white/20 transition-colors"
        >
          Cancelar
        </button>
      )}

      {/* Main button */}
      <button
        onClick={handleClick}
        disabled={state === "loading" || state === "success"}
        className={`
          relative flex items-center gap-2.5 px-5 py-3.5 rounded-full font-semibold text-sm whitespace-nowrap
          shadow-2xl transition-all duration-300 active:scale-95
          ${
            state === "success"
              ? "bg-emerald-500 text-white shadow-emerald-500/30"
              : state === "confirming"
              ? "bg-amber-500 text-white shadow-amber-500/30 animate-pulse"
              : "bg-white text-black shadow-white/20 hover:shadow-white/40 hover:scale-105"
          }
          disabled:cursor-not-allowed
        `}
      >
        {state === "loading" ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : state === "success" ? (
          <Check className="w-5 h-5" />
        ) : (
          <Bell className={`w-5 h-5 ${state === "confirming" ? "animate-bounce" : ""}`} />
        )}
        <span>
          {state === "idle" && "Chamar Garçom"}
          {state === "confirming" && "Confirmar Chamada"}
          {state === "loading" && "Chamando..."}
          {state === "success" && "Garçom Chamado!"}
        </span>
      </button>
    </div>
  );
}
