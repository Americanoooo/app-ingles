import Link from "next/link";

const classeLink =
  "font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4 outline-none hover:decoration-primary-hover focus-visible:ring-3 focus-visible:ring-ring/50";

export function AvisoTermos() {
  return (
    <p className="text-center text-xs text-pretty text-muted-foreground">
      Ao continuar, você concorda com os{" "}
      <Link href="/termos" className={classeLink}>
        Termos de Serviço
      </Link>{" "}
      e a{" "}
      <Link href="/privacidade" className={classeLink}>
        Política de Privacidade
      </Link>
      .
    </p>
  );
}
