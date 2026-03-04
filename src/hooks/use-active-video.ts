"use client";
// src/hooks/use-active-video.ts
// Hook to manage which video is currently playing

import { useState, useCallback } from "react";

export function useActiveVideo() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const setActive = useCallback((id: string) => {
    setActiveVideoId(id);
  }, []);

  const isActive = useCallback(
    (id: string) => activeVideoId === id,
    [activeVideoId]
  );

  return { activeVideoId, setActive, isActive };
}
