'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import afiliadosData from '@/data/afiliados.json';

interface HeroProps {
  title?: string;
  highlight?: string;
  subtitle?: string;
  afiliado?: keyof typeof afiliadosData; // 👈 en lugar de string
}

export default function Hero({
  title = 'Bienvenido a',
  highlight = 'InviteNow',
  subtitle = 'Invitaciones para ti',
  afiliado = 'default',
}: HeroProps) {
  const glowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const glowSpan = glowRef.current;
    if (glowSpan && !glowSpan.querySelector('.glow-inner')) {
      const before = document.createElement('span');
      before.textContent = highlight;
      before.className =
        'glow-inner absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-b from-[#dfe5ee] to-[#fffaf6] bg-clip-text text-transparent animate-glowOpacity';
      before.style.filter = 'url(#glow-4)';
      glowSpan.appendChild(before);
    }
  }, [highlight]);

  return (
    <section className="relative min-h-screen md:min-h-[100dvh] overflow-hidden bg-black flex items-center justify-center">
      {/* Background Circles */}
      <motion.div
        className="absolute lg:w-[110%] w-[140%] h-[120%] rounded-[30%] scale-[1.3] lg:left-[-7rem] -translate-x-1/2 shadow-[inset_0_0_4rem_3rem_rgba(238,200,175,0.2),inset_0_0_2rem_0.4rem_rgba(238,200,175,0.2),0_0_0.1rem_0.1rem_rgba(238,200,175,0.2),0_0_1rem_0.4rem_rgba(238,200,175,0.3)] opacity-60 z-0 top-[-27%] md:top-[-26%] lg:top-[-25%] xl:top-[-29%]"
        initial={{ y: '-50%', opacity: 0.3 }}
        animate={{ y: '-40%', opacity: 0.8 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute lg:w-[110%] w-[130%] h-[120%] rounded-[30%] scale-[1.3] lg:left-[-7rem] -translate-x-1/2 shadow-[inset_0_0_4rem_3rem_rgba(238,200,175,0.2),inset_0_0_2rem_0.4rem_rgba(238,200,175,0.2),0_0_0.1rem_0.1rem_rgba(238,200,175,0.2),0_0_1rem_0.4rem_rgba(238,200,175,0.3)] opacity-60 z-0 bottom-[-27%] md:bottom-[-26%] lg:bottom-[-25%] xl:bottom-[-29%]"
        initial={{ y: '50%', opacity: 0.3 }}
        animate={{ y: '40%', opacity: 0.8 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />

      {/* SVG Filter */}
      <svg className="absolute w-full h-[30rem] pointer-events-none">
        <defs>
          <filter id="glow-4" colorInterpolationFilters="sRGB" x="-50%" y="-200%" width="200%" height="500%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur4" />
            <feMerge>
              <feMergeNode in="blur4" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Text Block */}
      <motion.div
        className="text-[#c8c2bd] text-center font-semibold tracking-[-0.009em] z-10"
        initial={{ scale: 1 }}
        animate={{ scale: 1.02 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        aria-hidden="true"
      >
        <div className="text-[3rem] leading-[1.0625]">{title}</div>
        <div className="relative inline-block mt-2">
          <span
            ref={glowRef}
            data-text={highlight}
            className="relative inline-block text-[8rem] leading-[1.2] font-semibold glow-filter animate-glowScale"
          >
            {highlight}
          </span>
        </div>
        <div className="text-[3rem] leading-[1.0625] mt-2">{subtitle}</div>
      </motion.div>

      {/* Redes sociales fijas animadas en los extremos inferiores */}
      <motion.div
        className="absolute bottom-6 w-full px-8 flex items-center justify-between z-20"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
      >
        {/* Instagram */}
        <motion.a
          href="https://www.instagram.com/invitenowmx"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 hover:scale-105 transition-transform"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <picture>
            <source srcSet="/imagenes/2logos/instagram.avif" type="image/avif" />
            <source srcSet="/imagenes/2logos/instagram.webp" type="image/webp" />
            <img
              src="/imagenes/2logos/instagram.png"
              alt="Instagram"
              className="w-8 h-8 md:w-10 md:h-10"
            />
          </picture>
          <span className="text-white text-sm md:text-base">Síguenos en Instagram</span>
        </motion.a>

        {/* WhatsApp */}
        {afiliado === 'default' && (
          <motion.a
            href="https://wa.me/2285062080?text=Hola%2C%20estoy%20interesado%20en%20sus%20invitaciones%20digitales%20de%20InviteNow%2C%20%C2%BFPodr%C3%ADan%20brindarme%20m%C3%A1s%20informaci%C3%B3n%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:scale-105 transition-transform"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <span className="text-white text-sm md:text-base">Contáctanos vía WhatsApp</span>
            <picture>
              <source srcSet="/imagenes/2logos/whatsapp.avif" type="image/avif" />
              <source srcSet="/imagenes/2logos/whatsapp.webp" type="image/webp" />
              <img
                src="/imagenes/2logos/whatsapp.png"
                alt="WhatsApp"
                className="w-8 h-8 md:w-10 md:h-10"
              />
            </picture>
          </motion.a>
        )}
      </motion.div>

      {/* Local Animations */}
      <style>{`
        @keyframes onloadscale {
          24% { transform: scale(1); }
          100% { transform: scale(1.02); }
        }
        @keyframes onloadopacity {
          24% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-glowScale {
          animation: onloadscale 1s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
