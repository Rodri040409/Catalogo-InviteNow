"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import productos from "@/data/productos.json";
import planes from "@/data/planes.json";
import afiliadosData from "@/data/afiliados.json";

const categorias: Record<string, string> = {
  basica: "Categoría básica/estándar",
  estandar: "Categoría básica/estándar",
  express: "Categoría express",
  premium: "Categoría premium",
};

type CategoriaTipo = keyof typeof categorias;

interface Producto {
  id: string;
  title: string;
  categoria: CategoriaTipo | CategoriaTipo[];
  url?: string;
  adaptado?: string[];
  incluye?: string[];
  tipo?: CategoriaTipo;
  galeria?: string[];
  imgMain: {
    ruta: string;
    extension: string;
  };
  dificultad?: number;
}


interface Afiliado {
  telefono: string;
  precios: Record<CategoriaTipo, string>;
}

interface PlanesProps {
  categoria?: CategoriaTipo;
  titulo?: string;
  mostrarForma?: boolean;
  afiliado?: keyof typeof afiliadosData;
}

export default function Planes({
  categoria,
  titulo = "Nuestro Catálogo",
  mostrarForma = true,
  afiliado = "default",
  idUnica = "default", // <- Agregado aquí
}: PlanesProps & { idUnica?: string }) {
  const [galeriaActiva, setGaleriaActiva] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [isLastSlide, setIsLastSlide] = useState(false);
  const id = `swiper-${idUnica ?? "default"}`;

  useEffect(() => {
    document.body.style.overflow = galeriaActiva ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [galeriaActiva]);

  const afiliadoData: Afiliado = afiliadosData[afiliado] || afiliadosData.default;

  // Si se pasó una categoría, asumimos que se quieren ver productos
  const productosTyped = productos as { invitaciones?: Producto[] };
  const planesTyped = planes as { planes?: Producto[] };

  const mostrarProductos = categoria !== undefined;
  const mostrarPlanes = categoria === undefined;


  const items: Producto[] = 
    mostrarProductos ? productosTyped.invitaciones || [] : 
    mostrarPlanes ? planesTyped.planes || [] : [];


  const seen = new Set();
  const uniqueItems = items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  const dataFiltrada: Producto[] = 
  !categoria || categoria === "all" 
    ? uniqueItems // Si la categoría es "all", se devuelven todos los productos
    : uniqueItems.filter((item) => {
        const cat = item.categoria;
        return Array.isArray(cat)
          ? cat.includes(categoria) // Si la categoría es un array, verifica si incluye la categoría
          : cat === categoria; // Si es una categoría única, compara directamente
      });

  return (
    <section className="planes max-w-[100%] overflow-hidden">
      <div className="text-white text-center xl:scale-[1.2] mb-12">
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight text-center mt-[4rem]">
          {titulo.split(" ").map((word, index) =>
            index === 1 ? (
              <span
                key={index}
                className="bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent"
              >
                {word + " "}
              </span>
            ) : (
              <span key={index} className="text-white">
                {word + " "}
              </span>
            )
          )}
        </h2>
      </div>

      <div className="wrapper">
        <div className="content">
          {mostrarForma && <div className="bg-shape"></div>}

          <div className="product-img">
            {dataFiltrada.map((item, index) => (
              <div
                key={item.id}
                className={`product-img__item ${index === activeIndex ? "active" : ""}`}
              >
                <img
                  src={`/${item.imgMain.ruta}.${item.imgMain.extension}`}
                  alt={item.title}
                  className={`product-img__img ${mostrarPlanes ? "scale-[1] md:scale-[1.3] xl:scale-[0.8]" : ""}`}
                />
              </div>
            ))}
          </div>

          <div className="product-slider relative">
            <Swiper
              spaceBetween={30}
              navigation={{ nextEl: `.${id}-next`, prevEl: `.${id}-prev` }}
              modules={[Navigation]}
              slidesPerView={1}
              loop={false}
              onSwiper={(swiper) => {
                setIsFirstSlide(swiper.activeIndex === 0);
                setIsLastSlide(swiper.activeIndex === swiper.slides.length - 1);
              }}
              onSlideChange={(swiper) => {
                const index = swiper.activeIndex;
                setActiveIndex(index);
                setIsFirstSlide(index === 0);
                setIsLastSlide(index === swiper.slides.length - 1);
              }}

              className="product-slider__wrp swiper-wrapper"
            >
              {dataFiltrada.map((item, index) => (
                <SwiperSlide
                  key={item.id}
                  className="product-slider__item swiper-slide"
                  data-target={`slide-${index + 1}`}
                >
                  <div className="product-slider__card">
                    <div className="product-slider__content">
                      <h1 className="product-slider__title">{item.title}</h1>

                      <span className="product-slider__price leading-tight mb-[-2rem]">
                      {(() => {
                        const cats = Array.isArray(item.categoria)
                          ? item.categoria
                          : [item.categoria];
                        const uniqueCats = Array.from(new Set(cats));
                        return Array.from(
                          new Set(uniqueCats.map((c) => categorias[c as CategoriaTipo]))
                        ).join(""); // Esto ya se asegura de no agregar una coma al final.
                      })()}
                    </span>


                      {!categoria && item.tipo && (
                        <span className="product-slider__price leading-tight mt-2 block">
                          {afiliadoData.precios[item.tipo as CategoriaTipo] ?? "$--"}
                        </span>
                      )}


                      <div className="product-ctr">
                        <div className="product-labels">
                          <div className="product-labels__title__Gallery1">
                            {item.adaptado ? "Adaptada para:" : "INCLUYE:"}
                          </div>
                          {(item.adaptado ?? item.incluye)?.map((linea, i) => (
                            <div className="product-labels__product" key={i}>
                              - {linea}
                            </div>
                          ))}
                        </div>

                        <span className="hr-vertical"></span>

                        {mostrarPlanes && item.dificultad !== undefined && (
                          <div className="product-inf">
                            <div className="product-inf__percent flex flex-col items-center justify-center">
                              <div className="relative w-[100px] h-[100px]">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="47"
                                    stroke="#1e2e3e"
                                    strokeWidth="6"
                                    fill="none"
                                  />
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="47"
                                    stroke="#cb2240"
                                    strokeWidth="6"
                                    fill="none"
                                    strokeDasharray={`${(item.dificultad / 100) * 295}, 295`}
                                    transform="rotate(-90 50 50)"
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-white text-[1.75rem] md:text-[2rem] font-extrabold leading-none">
                                  {item.dificultad}%
                                </div>
                              </div>
                            </div>
                            <span className="product-inf__title">NIVEL DE DIFICULTAD</span>
                          </div>
                        )}
                      </div>

                      <div
                        className={`product-slider__bottom ${
                          item.galeria && item.galeria.length > 0
                            ? "product-slider__bottom--gallery1 grid"
                            : "flex justify-center"
                        }`}
                      >

                        {item.url ? (
                          <button
                            onClick={() =>
                              window.open(item.url, "_blank", "noopener,noreferrer")
                            }
                            className="product-slider__cart md:translate-x-[7rem] xl:translate-x-[0rem]"
                          >
                            Ir a la página
                          </button>
                        ) : (
                          <button className="product-slider__cart">Ver opciones</button>
                        )}

                        {item.galeria && item.galeria.length > 0 && (
                          <button
                            className="product-slider__cart md:translate-x-[7rem] xl:translate-x-[0rem]"
                            onClick={() => setGaleriaActiva(item.id)}
                          >
                            VER Fotos
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Botones de navegación */}
            <button
              className={`${id}-prev prev absolute z-10 left-[-50px] top-1/2 transform -translate-y-1/2 rounded-full w-12 h-12 flex items-center justify-center transition-opacity ${
                isFirstSlide
                  ? "opacity-30 cursor-not-allowed bg-gray-500"
                  : "bg-white shadow-md text-black"
              }`}
              disabled={isFirstSlide}
            >
              <svg className="icon icon-arrow-left w-6 h-6">
                <use xlinkHref="#icon-arrow-left"></use>
              </svg>
            </button>
            <button
              className={`${id}-next next absolute z-10 right-[-50px] top-1/2 transform -translate-y-1/2 rounded-full w-12 h-12 flex items-center justify-center transition-opacity ${
                isLastSlide
                  ? "opacity-30 cursor-not-allowed bg-gray-500"
                  : "bg-white shadow-md text-black"
              }`}
              disabled={isLastSlide}
            >
              <svg className="icon icon-arrow-right w-6 h-6">
                <use xlinkHref="#icon-arrow-right"></use>
              </svg>
            </button>

            {/* SVG defs */}
            <svg className="hidden">
              <symbol id="icon-arrow-left" viewBox="0 0 32 32">
                <path d="M0.704 17.696l9.856 9.856c0.896 0.896 2.432 0.896 3.328 0s0.896-2.432 0-3.328l-5.792-5.856h21.568c1.312 0 2.368-1.056 2.368-2.368s-1.056-2.368-2.368-2.368h-21.568l5.824-5.824c0.896-0.896 0.896-2.432 0-3.328-0.48-0.48-1.088-0.704-1.696-0.704s-1.216 0.224-1.696 0.704l-9.824 9.824c-0.448 0.448-0.704 1.056-0.704 1.696s0.224 1.248 0.704 1.696z" />
              </symbol>
              <symbol id="icon-arrow-right" viewBox="0 0 32 32">
                <path d="M31.296 14.336l-9.888-9.888c-0.896-0.896-2.432-0.896-3.328 0s-0.896 2.432 0 3.328l5.824 5.856h-21.536c-1.312 0-2.368 1.056-2.368 2.368s1.056 2.368 2.368 2.368h21.568l-5.856 5.824c-0.896 0.896-0.896 2.432 0 3.328 0.48 0.48 1.088 0.704 1.696 0.704s1.216-0.224 1.696-0.704l9.824-9.824c0.448-0.448 0.704-1.056 0.704-1.696s-0.224-1.248-0.704-1.664z" />
              </symbol>
            </svg>
          </div>
        </div>
      </div>

      {/* GALERÍA MODAL */}
      {galeriaActiva && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center overflow-hidden">
          <div className="relative w-full max-w-5xl rounded-xl p-4">
            <button
              onClick={() => setGaleriaActiva(null)}
              className="absolute top-4 right-4 w-[5rem] h-[5rem] rounded-full flex items-center justify-center z-50"
            >
              <img
                src="/svg/cancelar.svg"
                alt="Cerrar"
                className="w-[3rem] h-[3rem] invert"
              />
            </button>

            <Swiper
              spaceBetween={20}
              navigation={{ nextEl: ".modal-next", prevEl: ".modal-prev" }}
              modules={[Navigation]}
              slidesPerView={1}
              loop={false}
              className="w-full"
            >
              {(dataFiltrada.find((i) => i.id === galeriaActiva)?.galeria ?? []).map(
                (img, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={`/${img}`}
                      alt=""
                      className="max-h-[80vh] object-contain mx-auto rounded-lg shadow-lg"
                    />
                  </SwiperSlide>
                )
              )}
              <button className="modal-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-50 bg-white bg-opacity-40 hover:bg-opacity-90 text-black rounded-full w-[5rem] h-[5rem] flex items-center justify-center">
                <svg className="icon icon-arrow-left w-6 h-6">
                  <use xlinkHref="#icon-arrow-left"></use>
                </svg>
              </button>
              <button className="modal-next absolute right-4 top-1/2 transform -translate-y-1/2 z-50 bg-white bg-opacity-40 hover:bg-opacity-90 text-black rounded-full w-[5rem] h-[5rem] flex items-center justify-center">
                <svg className="icon icon-arrow-right w-6 h-6">
                  <use xlinkHref="#icon-arrow-right"></use>
                </svg>
              </button>
            </Swiper>
          </div>
        </div>
      )}
    </section>
  );
}
