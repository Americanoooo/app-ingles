import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { pegarUsuarioId } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Logo } from "./components/Logo";
import { BotaoVisitante } from "./components/landing/BotaoVisitante";
import { QuizPreview } from "./components/landing/QuizPreview";

async function estaLogado() {
  const cookieStore = await cookies();
  // Sem cookie nem tenta validar (evita log de erro do decrypt a cada visita).
  if (!cookieStore.has("session")) return false;
  try {
    await pegarUsuarioId();
    return true;
  } catch {
    return false;
  }
}

export default async function Home() {
  // redirect() lança um erro internamente, por isso fica fora do try.
  if (await estaLogado()) redirect("/treino");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex h-16 w-full max-w-5xl items-center px-4 sm:px-8">
        <Logo comMarca />
      </header>

      <main className="mx-auto grid w-full max-w-5xl flex-1 content-center gap-10 px-4 pt-6 pb-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-x-16 lg:gap-y-12">
        <section className="flex flex-col gap-5 lg:col-start-1 lg:row-start-1">
          <h1 className="max-w-[14ch] font-heading text-4xl leading-[1.05] font-bold tracking-tight text-balance text-foreground sm:text-6xl lg:text-7xl">
            Treine seu inglês com inteligência artificial
          </h1>
          <p className="max-w-md text-lg text-pretty text-muted-foreground">
            A IA cria quizzes no seu nível, explica cada resposta em português
            e mostra no relatório o que você precisa revisar.
          </p>
        </section>

        <section
          aria-labelledby="titulo-acesso"
          className="flex flex-col gap-3 rounded-3xl border-2 border-border bg-card p-5 sm:p-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center"
        >
          <h2 id="titulo-acesso" className="sr-only">
            Acesse o app
          </h2>
          <Link
            href="/login?modo=cadastro"
            className={cn(buttonVariants({ size: "lg" }), "w-full rounded-full text-base")}
          >
            Criar conta
          </Link>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full rounded-full text-base")}
          >
            Entrar
          </Link>

          <div className="my-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            ou
            <span className="h-px flex-1 bg-border" />
          </div>

          <BotaoVisitante />
        </section>

        <QuizPreview className="lg:col-start-1 lg:row-start-2" />
      </main>
    </div>
  );
}
