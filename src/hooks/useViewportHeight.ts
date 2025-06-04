// src/hooks/useViewportHeight.ts
import { useEffect } from 'react';

export function useViewportHeight() {
  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);
}
