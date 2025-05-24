import Planes from '@/components/Secciones/Planes';

export default function Home() {
  return (
    <>
      {/* <Planes categoria="basica" /> Solo muestra planes básicos */}
      {/* <Planes categoria="premium" /> */}
      <Planes
        // categoria="basica"
        titulo="Descubre nuestros Planes Premium"
        mostrarForma={false}
      />
    </>
  );
}
