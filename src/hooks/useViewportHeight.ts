// src/hooks/useViewportHeight.ts
import { useEffect } from 'react';

export function useViewportHeight() {
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH(); // Establecer al inicio
    window.addEventListener('resize', setVH); // Para rotación o resize

    return () => {
      window.removeEventListener('resize', setVH);
    };
  }, []);
}
