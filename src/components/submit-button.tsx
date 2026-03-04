"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
    >
      {pending ? "Entrando..." : "Entrar no Painel"}
    </button>
  );
}
