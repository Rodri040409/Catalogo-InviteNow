"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperInstance } from 'swiper/types';
import "swiper/css";
import "swiper/css/navigation";
import GooeyNav from '@/components/buttons/GooeyNav';

import productos from "@/data/productos.json";
import planes from "@/data/planes.json";
import afiliadosData from "@/data/afiliados.json";

const categorias: Record<string, string> = {
  basica: "Categoría básica/estándar",
  estandar: "Categoría básica/estándar",
  express: "Categoría express",
  premium: "Categoría premium",
  personalizada: "Categoría personalizada",
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
  eventos?: ('boda' | 'xv' | 'cumpleaños' | 'evento' | 'bautizo' | 'confirmacion' | 'personalizado')[];
}

interface Afiliado {
  telefono: string;
  mensaje: string; // 👈 Aquí estaba el problema
  precios: Record<CategoriaTipo, string>;
}

interface PlanesProps {
  categoria?: CategoriaTipo;
  evento?: 'boda' | 'xv' | 'cumpleaños' | 'evento' | 'bautizo' | 'confirmacion' | 'personalizado';
  titulo?: string;
  mostrarForma?: boolean;
  afiliado?: keyof typeof afiliadosData;
}

export default function Planes({
  categoria,
  evento,
  titulo = "Nuestro Catálogo",
  mostrarForma = true,
  afiliado = "default",
  idUnica = "default",
  onSeleccionarCategoria,
}: PlanesProps & {
  idUnica?: string;
  onSeleccionarCategoria?: (cat: string) => void;
}) {
  const [galeriaActiva, setGaleriaActiva] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [isLastSlide, setIsLastSlide] = useState(false);
  const [eventoFiltro, setEventoFiltro] = useState<EventoTipo | null>(null);
  const [activeEventoIndex, setActiveEventoIndex] = useState(0);
  const id = `swiper-${idUnica ?? "default"}`;

  useEffect(() => {
    document.body.style.overflow = galeriaActiva ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [galeriaActiva]);

  useEffect(() => {
    if (galeriaActiva) {
      const galeria = dataFiltrada.find((i) => i.id === galeriaActiva)?.galeria ?? [];
      galeria.forEach((src) => {
        const img = new Image();
        img.src = `/${src}`;
      });
    }
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

  // 1. Filtrar productos sin usar dataFiltrada dentro del filtro
  const dataFiltrada: Producto[] = uniqueItems.filter((item) => {
    const coincideCategoria =
      !categoria || categoria === "all"
        ? true
        : Array.isArray(item.categoria)
          ? item.categoria.includes(categoria)
          : item.categoria === categoria;

    const coincideEvento = !eventoFiltro ? true : item.eventos?.includes(eventoFiltro);

    return coincideCategoria && coincideEvento;
  });

  // 2. Crear el set eventosPresentes fuera del filtro, usando dataFiltrada ya definido
  const eventosPresentes = new Set<string>();
  dataFiltrada.forEach(item => {
    item.eventos?.forEach(ev => eventosPresentes.add(ev));
  });
  

  function formatearPrecio(precio: string | number): {
    principal: string;
    sup?: string;
    texto?: string;
  } {
    const textoOriginal = typeof precio === "string" ? precio.trim() : precio.toString();

    // Separamos el número del texto (por ejemplo: "$950.00 o superior")
    const match = textoOriginal.match(/^\$?([\d,]+)(?:\.(\d{2}))?(.*)?$/);
    if (!match) return { principal: "$--" };

    const [, enteroParte, decimalParte, textoParte] = match;
    const numero = parseFloat(enteroParte.replace(/,/g, ""));
    const textoLimpio = textoParte?.trim().toUpperCase();

    return {
      principal: `$${numero.toLocaleString("es-MX")}`,
      sup: decimalParte === "00" ? "00" : undefined,
      texto: textoLimpio || undefined,
    };
  }

  type EventoTipo = 'boda' | 'xv' | 'cumpleaños' | 'evento' | 'bautizo' | 'confirmacion' | 'personalizado';

  const eventos: { key: EventoTipo | null; label: string }[] = [
    { key: null, label: "Todos" },
    { key: "boda", label: "Boda" },
    { key: "xv", label: "XV Años" },
    { key: "cumpleaños", label: "Cumpleaños" },
    // { key: "bautizo", label: "Bautizo" },
    // { key: "confirmacion", label: "Confirmación" },
    { key: "evento", label: "Evento general" },
  ];

  const eventosItems = eventos.map(e => ({
    label: e.label,
    href: e.key === null ? "#todos" : `#${e.key}`,
  }));

  function onSelectEvento(index: number) {
    setActiveEventoIndex(index);
    const selectedKeyRaw = eventosItems[index]?.href.replace('#', '');
    const selectedKey = selectedKeyRaw === "todos" ? null : (selectedKeyRaw as EventoTipo);
    setEventoFiltro(selectedKey);
    setActiveIndex(0);
  }

  return (
    <section className="planes max-w-[100%] overflow-hidden">
      <div className="text-white text-center xl:scale-[1.2] mb-12">
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight text-center mt-[4rem]">
          {titulo.split(" ").map((word, index) => {
            const palabraNormalizada = word
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase();
            const palabrasClave = ["planes", "invitaciones", "catalogo", "nuestros"];

            const esClave = palabrasClave.includes(palabraNormalizada);

            return (
              <span
                key={index}
                className={
                  esClave
                    ? "bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent"
                    : "text-white"
                }
              >
                {word + " "}
              </span>
            );
          })}

          
        </h2>
      </div>

      {/* Categorías de eventos para filtración */}
      {categoria && (
        <div className="w-full px-4 mt-8 mb-[-8rem] relative z-20 overflow-y-hidden lg:overflow-visible">
          <div className="overflow-visible">
            <div className="max-w-[1200px] mx-auto overflow-visible">
              <div className="relative lg:overflow-visible overflow-x-auto overflow-y-hidden scrollbar-none">
                <div className="flex justify-center lg:justify-end min-w-max overflow-visible">
                  <GooeyNav
                    items={eventosItems}
                    initialActiveIndex={activeEventoIndex}
                    onChange={onSelectEvento}
                    particleCount={15}
                    particleDistances={[90, 10]}
                    particleR={100}
                    animationTime={600}
                    timeVariance={300}
                    colors={[1, 2, 3, 1, 2, 3, 1, 4]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="wrapper">
        <div className="content">
          {mostrarForma && <div className="bg-shape"></div>}

          <div className="product-img">
            {dataFiltrada.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4 md:px-6 text-center lg:w-[90vw] lg:min-h-[25vh] xl:w-[65vw] xl:min-h-[50vh]">
                <div className="text-white text-center px-6 max-w-xl">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    No hay invitaciones disponibles en esta categoría
                  </h3>
                  <p className="text-base md:text-lg text-gray-300">
                    Te invitamos a explorar otras opciones.
                  </p>
                </div>
              </div>
            ) : (
              dataFiltrada.map((item, index) => (
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
              ))
            )}
          </div>

          {dataFiltrada.length > 0 && (
            <div className="product-slider relative">
              <Swiper
                spaceBetween={30}
                navigation={{ nextEl: `.${id}-next`, prevEl: `.${id}-prev` }}
                modules={[Navigation]}
                slidesPerView={1}
                loop={false}
                onSwiper={(swiper: SwiperInstance) => {
                  setIsFirstSlide(swiper.activeIndex === 0);
                  setIsLastSlide(swiper.activeIndex === swiper.slides.length - 1);
                }}

                onSlideChange={(swiper: SwiperInstance) => {
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


                        {!categoria && (
                          <span className="product-slider__price leading-tight mt-[3rem] xl:mt-[1.5rem] block">
                            {(() => {
                              const tipo: CategoriaTipo | undefined = item.tipo
                                ? item.tipo
                                : Array.isArray(item.categoria)
                                  ? (["personalizada", ...item.categoria].find((cat) =>
                                      cat in afiliadoData.precios
                                    ) as CategoriaTipo | undefined)
                                  : (item.categoria as CategoriaTipo);


                            const raw = tipo && tipo in afiliadoData.precios
                              ? afiliadoData.precios[tipo]
                              : "";
                              const { principal, sup, texto } = formatearPrecio(raw);

                              return (
                                <>
                                  <span>
                                    {principal}
                                    {sup && (
                                      <>
                                        .<sup className="text-[0.75em] relative top-[0.4em] ml-[0.05em]">{sup}</sup>
                                      </>
                                    )}
                                  </span>
                                  {texto && (
                                    <span className="ml-4 uppercase">{texto}</span>
                                  )}
                                </>
                              );
                            })()}
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

                          {item.url && (
                              <button
                                onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
                                className="product-slider__cart md:translate-x-[7rem] xl:translate-x-[0rem]"
                              >
                                Ir a la página
                              </button>
                            )}

                            {mostrarPlanes && item.tipo && (
                              item.tipo === "personalizada" ? (
                                <button
                                  onClick={() =>
                                    window.open(
                                      `https://wa.me/${afiliadoData.telefono}?text=${encodeURIComponent(afiliadoData.mensaje)}`,
                                      "_blank",
                                      "noopener,noreferrer"
                                    )
                                  }
                                  className="product-slider__cart md:translate-x-[7rem] xl:translate-x-[0rem]"
                                >
                                  Contactar
                                </button>
                              ) : (
                                <button
                                  className="product-slider__cart md:translate-x-[7rem] xl:translate-x-[0rem]"
                                  onClick={() => {
                                    if (item.tipo) {
                                      onSeleccionarCategoria?.(item.tipo);
                                    }
                                  }}
                                >
                                  Ver opciones
                                </button>
                              )
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

              {categoria && categoria !== "all" && (
                  <div className="w-full flex justify-center mt-24 mb-10">
                    <button
                      onClick={() => onSeleccionarCategoria?.("volver-home")}
                      className="w-[320px] text-center bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-5 md:py-6 rounded-full text-lg md:text-xl lg:text-2xl transition-all duration-300 shadow-lg tracking-wide"
                    >
                      Página principal
                    </button>
                  </div>
                )}

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
          )}
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
                      loading="lazy"
                      decoding="async"
                      className="w-auto max-h-[80vh] max-w-[95vw] object-contain mx-auto rounded-lg shadow-lg transition-opacity duration-300"
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
