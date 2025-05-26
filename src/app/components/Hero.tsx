import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Hero from "@/components/text/Hero";
import afiliadosData from "@/data/afiliados.json";

type AfiliadoKey = keyof typeof afiliadosData;

export default function Header() {
  const pathname = usePathname();
  const [afiliado, setAfiliado] = useState<AfiliadoKey>("default");

  useEffect(() => {
    const host = typeof window !== "undefined" ? window.location.hostname : "";
    const match = host.match(/catalogo_invitenow-([\w\d_-]+)\./i);

    if (match && match[1] in afiliadosData) {
      setAfiliado(match[1] as AfiliadoKey);
    } else {
      setAfiliado("default");
    }
  }, []);

  return (
    <header>
      <Hero
        key={`hero-${Date.now()}`}
        title="Bienvenido a"
        highlight="InviteNow"
        subtitle="Invitaciones para ti"
        afiliado={afiliado as string}
      />
    </header>
  );
}
