import Link from "next/link";
import { Logo } from "@/app/components/Logo";

export const metadata = {
  title: "Termos de Serviço | AI Fluency",
};

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-heading text-xl font-bold text-foreground">{titulo}</h2>
      <div className="flex flex-col gap-2 text-base text-pretty text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function Termos() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex h-16 w-full max-w-3xl items-center px-4 sm:px-8">
        <Link
          href="/"
          aria-label="AI Fluency, voltar para o início"
          className="rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Logo comMarca />
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 pt-4 pb-16 sm:px-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Termos de Serviço
          </h1>
          <p className="text-sm text-muted-foreground">
            Última atualização: 27 de outubro de 2026
          </p>
        </div>

        <Secao titulo="Sobre o serviço">
          <p>
            O AI Fluency é uma plataforma gratuita de treino de inglês com
            quizzes gerados por inteligência artificial. Ao criar uma conta ou
            entrar com o Google, você aceita estes termos.
          </p>
        </Secao>

        <Secao titulo="Sua conta">
          <p>
            Você é responsável por manter sua senha em segurança e pelas
            atividades feitas na sua conta. Avise-nos se suspeitar de acesso
            não autorizado.
          </p>
        </Secao>

        <Secao titulo="Uso aceitável">
          <p>
            Use o serviço apenas para seu aprendizado pessoal. Não é permitido
            automatizar o preenchimento dos quizzes, tentar acessar dados de
            outros usuários ou interferir no funcionamento da plataforma.
          </p>
        </Secao>

        <Secao titulo="Conteúdo gerado por IA">
          <p>
            As perguntas, respostas e explicações são geradas por inteligência
            artificial e podem conter imprecisões. O conteúdo é fornecido para
            fins educacionais, sem garantia de exatidão total.
          </p>
        </Secao>

        <Secao titulo="Disponibilidade">
          <p>
            O serviço é oferecido &quot;como está&quot;, sem garantia de
            disponibilidade contínua. Podemos alterar, suspender ou encerrar
            funcionalidades a qualquer momento.
          </p>
        </Secao>

        <Secao titulo="Cancelamento">
          <p>
            Você pode parar de usar o serviço quando quiser. Para excluir sua
            conta e seus dados, entre em contato pelo email abaixo.
          </p>
        </Secao>

        <Secao titulo="Alterações nestes termos">
          <p>
            Podemos atualizar estes termos periodicamente. O uso continuado do
            serviço após uma alteração significa que você concorda com os
            novos termos.
          </p>
        </Secao>

        <Secao titulo="Contato">
          <p>
            Dúvidas sobre estes termos podem ser enviadas para{" "}
            <a
              href="mailto:caua.americano0710@gmail.com"
              className="font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4 outline-none hover:decoration-primary-hover focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              caua.americano0710@gmail.com
            </a>
            . Veja também nossa{" "}
            <Link
              href="/privacidade"
              className="font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4 outline-none hover:decoration-primary-hover focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </Secao>
      </main>
    </div>
  );
}

export default Termos;
