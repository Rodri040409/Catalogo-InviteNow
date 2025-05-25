import Planes from '@/components/Secciones/Planes';

export default function Home() {
  return (
    <>
      {/* Esta muestra productos de categoría "basica" */}
      {/* all, express, basica, estandar, premium */}
      <Planes
        key="catalogo"
        idUnica="catalogo"
        categoria="all" 
        titulo="Nuestro catálogo"
        mostrarForma={false}
      />

      <Planes
        key="planes"
        idUnica="planes"
        titulo="Conoce nuestros planes para Invitaciones"
        mostrarForma={true}
        afiliado="default"
      />
    </>
  );
}
