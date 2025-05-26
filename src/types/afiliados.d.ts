declare module '@/data/afiliados.json' {
  const value: {
    [key: string]: {
      telefono: string;
      mensaje: string;
      precios: {
        basica: string;
        estandar: string;
        premium: string;
        express: string;
        personalizada: string;
      };
    };
  };
  export default value;
}
