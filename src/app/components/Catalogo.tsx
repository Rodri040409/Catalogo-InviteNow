'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Planes from "@/components/Secciones/Planes";

interface CatalogoProps {
  categoriaSeleccionada: string | null;
  onSeleccionarCategoria: (cat: string | null) => void;
}

export default function Catalogo({ categoriaSeleccionada, onSeleccionarCategoria }: CatalogoProps) {
  const [fadeOverlay, setFadeOverlay] = useState(false);
  const [heroKey, setHeroKey] = useState(Date.now());

  const handleSeleccionarCategoria = (cat: string | null) => {
    setFadeOverlay(true);

    setTimeout(() => {
      window.scrollTo({ top: 0 });
      
      // Cambia a null si es "volver-home" para mostrar Hero
      if (cat === "volver-home") {
        onSeleccionarCategoria(null);
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
      {/* Overlay negro de transición */}
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
              titulo="Nuestro catálogo"
              mostrarForma={false}
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
            <Planes
              key="catalogo"
              idUnica="catalogo"
              categoria="all"
              titulo="Nuestro catálogo"
              mostrarForma={false}
              onSeleccionarCategoria={handleSeleccionarCategoria}
            />

            <Planes
              key="planes"
              idUnica="planes"
              titulo="Conoce nuestros planes para Invitaciones"
              mostrarForma={true}
              afiliado="default"
              onSeleccionarCategoria={handleSeleccionarCategoria}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
