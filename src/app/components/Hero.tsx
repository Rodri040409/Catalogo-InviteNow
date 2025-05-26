'use client';

import { usePathname } from 'next/navigation';
import Hero from '@/components/text/Hero';

export default function Header() {
  const pathname = usePathname(); // Para que la key cambie si navegás entre rutas (opcional)

  return (
    <header>
      {/* Cada vez que se renderiza, se remonta */}
      <Hero
        key={`hero-${Date.now()}`}
        title="Bienvenido a"
        highlight="InviteNow"
        subtitle="Invitaciones para ti"
        afiliado="default" // <- Más adelante puedes hacerlo dinámico
      />
    </header>
  );
}
