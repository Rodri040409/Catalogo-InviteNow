'use client';

import { useEffect, useState } from 'react';
import Hero from '@/components/text/Hero';
import Creadores from './components/Creadores';
import Catalogo from './components/Catalogo';
import afiliadosData from '@/data/afiliados.json';

type AfiliadoKey = keyof typeof afiliadosData;

export default function HomePage() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [afiliado, setAfiliado] = useState<AfiliadoKey>('default');

  useEffect(() => {
    const host = typeof window !== 'undefined' ? window.location.hostname : '';
    const match = host.match(/^invitenow-([\w\d_-]+)\./i);
    const posibleAfiliado = match?.[1]?.toString(); // 👈 Fuerza string

    if (posibleAfiliado && posibleAfiliado in afiliadosData) {
      setAfiliado(posibleAfiliado as AfiliadoKey);
    } else {
      setAfiliado('default');
    }
  }, []);

  const mostrarCreadores = afiliado === 'default';

  return (
    <main className="min-h-screen flex flex-col">
      <div id="hero">
        <Hero
          key={`hero-${Date.now()}`}
          title="Bienvenido a"
          highlight="InviteNow"
          subtitle="Invitaciones para ti"
          afiliado={afiliado as string} // 👈 Solución aquí
        />
      </div>

      {mostrarCreadores && !categoriaSeleccionada && <Creadores />}

      <Catalogo
        categoriaSeleccionada={categoriaSeleccionada}
        onSeleccionarCategoria={setCategoriaSeleccionada}
        afiliado={afiliado}
      />
    </main>
  );
}
