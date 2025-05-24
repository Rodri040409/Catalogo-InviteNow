"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import data from "@/data/productos.json";

const categorias: Record<string, string> = {
  basica: "Categoría básica/estándar",
  estandar: "Categoría básica/estándar",
  express: "Categoría express",
  premium: "Categoría premium",
};

type CategoriaTipo = "basica" | "estandar" | "express" | "premium";

interface PlanesProps {
  categoria?: CategoriaTipo;
  titulo?: string;
  mostrarForma?: boolean;
}

export default function Planes({ categoria, titulo = "Nuestro Catálogo", mostrarForma = true }: PlanesProps) {
  const [galeriaActiva, setGaleriaActiva] = useState<string | null>(null);
  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [isLastSlide, setIsLastSlide] = useState(false);

  useEffect(() => {
    document.body.style.overflow = galeriaActiva ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [galeriaActiva]);

  const dataFiltrada = categoria
    ? data.invitaciones.filter((item) =>
        Array.isArray(item.categoria)
          ? item.categoria.includes(categoria)
          : item.categoria === categoria
      )
    : data.invitaciones;

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
                className={`product-img__item ${index === 0 ? "active" : ""}`}
                id={`slide-${index + 1}`}
              >
                <img
                  src={`/${item.imgMain.ruta}.${item.imgMain.extension}`}
                  alt={item.title}
                  className="product-img__img"
                />
              </div>
            ))}
          </div>

          <div className="product-slider relative">
            <Swiper
              spaceBetween={30}
              navigation={{ nextEl: ".next", prevEl: ".prev" }}
              modules={[Navigation]}
              slidesPerView={1}
              loop={false}
              onSwiper={(swiper) => {
                setIsFirstSlide(swiper.activeIndex === 0);
                setIsLastSlide(swiper.activeIndex === swiper.slides.length - 1);
              }}
              onSlideChange={(swiper) => {
                const index = swiper.activeIndex;
                setIsFirstSlide(index === 0);
                setIsLastSlide(index === swiper.slides.length - 1);
                const target = `slide-${index + 1}`;
                document.querySelectorAll(".product-img__item").forEach((el) =>
                  el.classList.remove("active")
                );
                document.getElementById(target)?.classList.add("active");
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

                      {/* Categoría (única) */}
                      <span className="product-slider__price leading-tight">
                        {
                          Array.isArray(item.categoria)
                            ? Array.from(new Set(item.categoria.map((c) => categorias[c]))).join(", ")
                            : categorias[item.categoria]
                        }
                      </span>


                      <div className="product-ctr">
                        <div className="product-labels">
                          <div className="product-labels__title__Gallery1">
                            Adaptada para:
                          </div>
                          {item.adaptado.map((a) => (
                            <div className="product-labels__product" key={a}>
                              - {a}
                            </div>
                          ))}
                        </div>
                        <span className="hr-vertical"></span>
                      </div>

                      <div className="product-slider__bottom product-slider__bottom--gallery1">
                        <button
                          onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
                          className="product-slider__cart"
                        >
                          Ir a la página
                        </button>
                        <button
                          className="product-slider__cart"
                          onClick={() => setGaleriaActiva(item.id)}
                        >
                          VER Fotos
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Botones de navegación */}
            <button
              className={`prev absolute z-10 left-[-50px] top-1/2 transform -translate-y-1/2 rounded-full w-12 h-12 flex items-center justify-center transition-opacity ${
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
              className={`next absolute z-10 right-[-50px] top-1/2 transform -translate-y-1/2 rounded-full w-12 h-12 flex items-center justify-center transition-opacity ${
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

            {/* SVGs */}
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
              {(data.invitaciones.find((i) => i.id === galeriaActiva)?.galeria || []).map(
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
