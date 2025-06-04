'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Planes, { categorias } from "@/components/Secciones/Planes"; // 👈 Importa categorias
import afiliadosData from "@/data/afiliados.json";

interface CatalogoProps {
  categoriaSeleccionada: string | null;
  onSeleccionarCategoria: (cat: string | null) => void;
  afiliado: keyof typeof afiliadosData;
}

type EventoTipo = 'boda' | 'xv' | 'cumpleaños' | 'evento' | 'bautizo' | 'confirmacion' | 'personalizado';

const eventos: { key: EventoTipo | null; label: string }[] = [
  { key: null, label: "Todos los eventos" },
  { key: "boda", label: "Boda" },
  { key: "xv", label: "XV Años" },
  { key: "cumpleaños", label: "Cumpleaños" },
  { key: "bautizo", label: "Bautizo" },
  { key: "confirmacion", label: "Confirmación" },
  { key: "evento", label: "Evento general" },
  { key: "personalizado", label: "Personalizado" },
];

export default function Catalogo({ categoriaSeleccionada, onSeleccionarCategoria, afiliado }: CatalogoProps) {
  const [fadeOverlay, setFadeOverlay] = useState(false);
  const [heroKey, setHeroKey] = useState(Date.now());
  const [eventoSeleccionado, setEventoSeleccionado] = useState<EventoTipo | null>(null);

  const handleSeleccionarCategoria = (cat: string | null) => {
    setFadeOverlay(true);

    setTimeout(() => {
      window.scrollTo({ top: 0 });

      if (cat === "volver-home") {
        onSeleccionarCategoria(null);
        setEventoSeleccionado(null); // limpia también el filtro de eventos
        setHeroKey(Date.now());
      } else {
        onSeleccionarCategoria(cat);
      }

      setFadeOverlay(false);
    }, 500);
  };

  const transition = { duration: 0.5, ease: "easeInOut" };

  return (
    <>
      <AnimatePresence>
        {fadeOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black z-[9999] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {categoriaSeleccionada ? (
          <motion.div
            key={`filtrado-${categoriaSeleccionada}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
          >
            <Planes
              key={categoriaSeleccionada}
              idUnica="catalogo-filtrado"
              categoria={categoriaSeleccionada}
              titulo={categorias[categoriaSeleccionada as keyof typeof categorias] ?? "Nuestro catálogo"}
              mostrarForma={false}
              afiliado={afiliado}
              onSeleccionarCategoria={handleSeleccionarCategoria}
            />
          </motion.div>
        ) : (
          <motion.div
            key={`vista-completa-${heroKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
          >
            {/* Mostrar productos con categoria='all' para incluir todo el catálogo de invitaciones */}
          <Planes
            key="catalogo"
            idUnica="catalogo"
            categoria="all"
            titulo="Nuestro catálogo"
            mostrarForma={false}
            afiliado={afiliado}
            onSeleccionarCategoria={handleSeleccionarCategoria}
          />

          <Planes
            key="planes"
            idUnica="planes"
            categoria={undefined} // ⛳ Forzar lectura de planes.json
            titulo="Conoce nuestros planes para Invitaciones"
            mostrarForma={true}
            afiliado={afiliado}
            onSeleccionarCategoria={handleSeleccionarCategoria}
          />

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
