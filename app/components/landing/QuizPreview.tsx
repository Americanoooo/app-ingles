import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const opcoes = ["go", "goes", "going"];
const respostaCerta = "goes";

/**
 * Exemplo estático de uma pergunta do quiz, no formato de balão de fala do
 * ícone do app. A animação (só CSS) marca a resposta, corrige e mostra a
 * explicação uma única vez ao carregar.
 */
export function QuizPreview({ className }: { className?: string }) {
  return (
    <figure className={cn("relative w-full max-w-md", className)}>
      <figcaption className="sr-only">
        Exemplo de pergunta: She ___ to work by bus every day. Resposta
        correta: goes. Explicação da IA: com she, he e it no presente simples,
        o verbo ganha -s.
      </figcaption>

      <div aria-hidden="true" className="relative rounded-3xl border-2 border-border bg-card p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-primary-foreground">
            1
          </span>
          <p lang="en" className="pt-1 text-base font-semibold text-foreground">
            She ___ to work by bus every day.
          </p>
        </div>

        <div lang="en" className="mt-4 grid grid-cols-3 gap-2">
          {opcoes.map((opcao) => {
            const certa = opcao === respostaCerta;
            return (
              <div
                key={opcao}
                className={cn(
                  "relative rounded-2xl border-2 px-2 py-2.5 text-center text-base font-semibold text-foreground",
                  certa
                    ? "animate-quiz-resposta border-success bg-success/10 motion-reduce:animate-none"
                    : "border-border bg-background"
                )}
              >
                {opcao}
                {certa && (
                  <span className="absolute -top-2.5 -right-2.5 flex size-6 animate-quiz-confirmar items-center justify-center rounded-full bg-success text-success-foreground motion-reduce:animate-none">
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex animate-quiz-explicar gap-2.5 rounded-2xl bg-muted p-3 text-sm text-foreground motion-reduce:animate-none">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
          <p>
            <span className="font-bold">Explicação da IA:</span> com she, he e
            it no presente simples, o verbo ganha -s. Por isso,{" "}
            <span lang="en" className="font-bold">goes</span>.
          </p>
        </div>

        {/* Ponta do balão, como no ícone do app */}
        <span className="absolute -bottom-[11px] left-10 size-5 rotate-45 border-r-2 border-b-2 border-border bg-card" />
      </div>
    </figure>
  );
}
