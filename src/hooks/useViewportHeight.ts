// src/hooks/useViewportHeight.ts
import { useEffect } from 'react';

export function useViewportHeight() {
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();

    // Solo en móviles: escucha cambios de orientación
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);
}
