import Planes from '@/components/Secciones/Planes';

export default function Home() {
  return (
    <>
      {/* Esta muestra productos de categoría "basica" */}
      {/* all, express, basica, estandar, premium */}
      <Planes
        categoria="all" 
        titulo="Nuestro catálogo"
        mostrarForma={false}
      />
      
      {/* Esta muestra planes personalizados */}
      <Planes
        titulo="Conoce nuestros planes para Invitaciones"
        mostrarForma={true}
        afiliado="default" // o "alexfotografia", etc.
      />
    </>
  );
}
