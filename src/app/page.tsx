'use client';

import { useState } from 'react';
import Hero from './components/Hero';
import Creadores from './components/Creadores';
import Catalogo from './components/Catalogo';

export default function HomePage() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);

  return (
    <main className="min-h-screen flex flex-col">
      <div id="hero">
        <Hero />
      </div>


      {!categoriaSeleccionada && <Creadores />}

      <Catalogo
        categoriaSeleccionada={categoriaSeleccionada}
        onSeleccionarCategoria={setCategoriaSeleccionada}
      />
    </main>
  );
}
