"use client";
// src/components/rating-popup.tsx
// Star rating popup/bottom-sheet

import { useState } from "react";
import { Star, X } from "lucide-react";
import { rateDishAction } from "@/lib/server-actions/rating.actions";

interface RatingPopupProps {
  dishId: string;
  dishName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function RatingPopup({
  dishId,
  dishName,
  isOpen,
  onClose,
}: RatingPopupProps) {
  const [selectedScore, setSelectedScore] = useState(0);
  const [hoveredScore, setHoveredScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (selectedScore === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await rateDishAction({ dishId, score: selectedScore });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setSelectedScore(0);
      }, 1500);
    } catch {
      // Silently handle errors
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayScore = hoveredScore || selectedScore;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="bg-zinc-900/95 backdrop-blur-xl border-t border-white/10 rounded-t-3xl p-6 pb-10 max-w-lg mx-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>

          {/* Handle indicator */}
          <div className="w-12 h-1 rounded-full bg-white/20 mx-auto mb-6" />

          {submitted ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-lg font-semibold text-white">Obrigado!</h3>
              <p className="text-sm text-white/60 mt-1">
                Sua avaliação foi registrada
              </p>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-white text-center mb-1">
                Avaliar prato
              </h3>
              <p className="text-sm text-white/50 text-center mb-6 line-clamp-1">
                {dishName}
              </p>

              {/* Stars */}
              <div className="flex justify-center gap-3 mb-6">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    onClick={() => setSelectedScore(score)}
                    onMouseEnter={() => setHoveredScore(score)}
                    onMouseLeave={() => setHoveredScore(0)}
                    className="transition-transform duration-150 hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`w-10 h-10 transition-colors duration-150 ${
                        score <= displayScore
                          ? "fill-amber-400 text-amber-400"
                          : "fill-transparent text-white/30"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Score label */}
              <p className="text-center text-sm text-white/40 mb-6 h-5">
                {displayScore > 0 &&
                  ["", "Ruim", "Regular", "Bom", "Ótimo", "Excelente"][
                    displayScore
                  ]}
              </p>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={selectedScore === 0 || isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-white text-black font-semibold text-base transition-all hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isSubmitting ? "Enviando..." : "Enviar avaliação"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
