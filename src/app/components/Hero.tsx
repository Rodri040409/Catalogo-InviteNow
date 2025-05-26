'use client';

import { usePathname } from 'next/navigation';
import Hero from '@/components/text/Hero';

export default function Header() {
  const pathname = usePathname(); // Para que la key cambie si navegás entre rutas (opcional)

  return (
    <header>
      {/* Cada vez que se renderiza, se remonta */}
      <Hero
        key={`hero-${Date.now()}`} // <– Esto lo fuerza a animar cada vez
        title="Bienvenido a"
        highlight="InviteNow"
        subtitle="Invitaciones para ti"
      />
    </header>
  );
}
