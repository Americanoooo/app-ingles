import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Link e não fetch/Link do Next: o navegador precisa seguir os redirecionamentos
 * até o Google e voltar pelo callback. Serve para entrar e para criar conta,
 * porque o callback cria o usuário se ele ainda não existir.
 */
export function BotaoGoogle({ desativado = false }: { desativado?: boolean }) {
  return (
    <a
      href="/api/auth/google"
      aria-disabled={desativado}
      className={cn(
        buttonVariants({ variant: "outline", size: "lg" }),
        "w-full rounded-full text-base aria-disabled:pointer-events-none aria-disabled:opacity-50",
      )}
    >
      Continuar com Google
    </a>
  );
}
