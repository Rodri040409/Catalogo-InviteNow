'use client';

import { useEffect } from 'react';
import classNames from 'classnames';

const items = [
  { type: 'shape', color: 'bg-cyan-300', rounded: 'rounded-[50%_50%_0_50%]', index: 1 },
  { type: 'image', src: '/imagenes/1creadores/Rodrigo1.jpg', index: 2 },
  { type: 'shape', color: 'bg-green-400', rounded: 'rounded-full', index: 3 },
  { type: 'image', src: '/imagenes/1creadores/Fernando2.jpg', index: 4 },
  { type: 'image', src: '/imagenes/1creadores/fernando1.jpg', index: 10 },
  { type: 'shape', color: 'bg-purple-400', rounded: 'rounded-[0_50%_50%_50%]', index: 6 },
  { type: 'image', src: '/imagenes/1creadores/Fer-Rodri.jpg', index: 12 },
  { type: 'shape', color: 'bg-orange-500', rounded: 'rounded-[50%_0_0_50%]', index: 8 },
  { type: 'shape', color: 'bg-pink-200', rounded: 'rounded-[0_50%_50%_0]', index: 9 },
  { type: 'image', src: '/imagenes/1creadores/Rodrigo3.jpg', index: 8 },
  { type: 'shape', color: 'bg-yellow-300', rounded: 'rounded-[50%_0_50%_50%]', index: 11 },
  { type: 'image', src: '/imagenes/1creadores/Rodrigo2.jpg', index: 6 }
];

export default function CreatorsGrid() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll<HTMLElement>('.item');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        className="w-full min-h-[100dvh] md:min-h-[70vh] bg-[radial-gradient(circle,_rgba(67,69,112,1)_3%,_rgba(35,36,57,1)_60%)] overflow-hidden px-4 md:px-6 py-12 md:py-20 flex justify-center items-center"
      >
        <div className="w-full max-w-[1100px] flex flex-col md:flex-row items-center gap-[8rem]">
          {/* Left Title */}
          <div className="text-white text-center xl:scale-[1.3]">
            <h1 className="text-[clamp(3rem,5vw,3rem)] leading-[1.1] mb-12 text-center">
              <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent font-bold">
                Crea tus invitaciones
              </span>{' '}
              <span className="text-white font-bold">con los</span>
              <br />
              <span className="text-white font-bold">mejores</span>
            </h1>
          </div>

          {/* Right Grid */}
          <div className="grid grid-cols-4 grid-rows-3 gap-6">
            {items.map((item) =>
              item.type === 'image' && item.src ? (
                <div
                  key={item.index}
                  className={classNames(
                    'item w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] md:w-[80px] md:h-[80px] lg:w-[120px] lg:h-[120px] xl:w-[140px] xl:h-[140px] aspect-square rounded-full shadow-xl overflow-hidden opacity-0'
                  )}

                  style={{ ['--i' as any]: item.index }}
                >
                  <picture>
                    <source srcSet={item.src.replace('.jpg', '.avif')} type="image/avif" />
                    <source srcSet={item.src.replace('.jpg', '.webp')} type="image/webp" />
                    <img
                      src={item.src}
                      alt={`Creador ${item.index}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </picture>
                </div>
              ) : (
                <span
                  key={item.index}
                  className={classNames('item aspect-square opacity-0 shadow-md', item.color, item.rounded)}
                  style={{ ['--i' as any]: item.index }}
                />
              )
            )}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeIn2 {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        .animate-visible {
          animation: fadeIn2 0.5s linear forwards;
          animation-delay: calc(0.2s * var(--i));
        }
      `}</style>
    </>
  );
}
