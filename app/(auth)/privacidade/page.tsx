import Link from "next/link";
import { Logo } from "@/app/components/Logo";

export const metadata = {
  title: "Política de Privacidade | AI Fluency",
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

function Privacidade() {
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
            Política de Privacidade
          </h1>
          <p className="text-sm text-muted-foreground">
            Última atualização: 27 de outubro de 2026
          </p>
        </div>

        <Secao titulo="Quais dados coletamos">
          <p>
            Ao criar uma conta, coletamos seu nome e email. Se você entrar com
            o Google, recebemos seu nome, email e um identificador da sua
            conta Google, sem acesso à sua senha. Também guardamos o histórico
            dos seus quizzes: respostas, acertos e notas, para montar seu
            relatório de evolução.
          </p>
        </Secao>

        <Secao titulo="Como usamos seus dados">
          <p>
            Usamos esses dados apenas para autenticar seu acesso, salvar seu
            progresso nos treinos e exibir seu histórico de desempenho. Não
            vendemos nem compartilhamos seus dados com terceiros para fins de
            publicidade.
          </p>
        </Secao>

        <Secao titulo="Com quem compartilhamos">
          <p>
            Compartilhamos dados apenas com o Google, quando você escolhe
            entrar com sua conta Google, e com o provedor de hospedagem que
            armazena o banco de dados da aplicação.
          </p>
        </Secao>

        <Secao titulo="Segurança">
          <p>
            Senhas são armazenadas com hash, nunca em texto puro. O acesso ao
            banco de dados é restrito à aplicação.
          </p>
        </Secao>

        <Secao titulo="Seus direitos">
          <p>
            Você pode pedir a correção ou exclusão da sua conta e dos seus
            dados a qualquer momento entrando em contato pelo email abaixo.
          </p>
        </Secao>

        <Secao titulo="Contato">
          <p>
            Dúvidas sobre esta política podem ser enviadas para{" "}
            <a
              href="mailto:caua.americano0710@gmail.com"
              className="font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4 outline-none hover:decoration-primary-hover focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              caua.americano0710@gmail.com
            </a>
            . Veja também nossos{" "}
            <Link
              href="/termos"
              className="font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4 outline-none hover:decoration-primary-hover focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Termos de Serviço
            </Link>
            .
          </p>
        </Secao>
      </main>
    </div>
  );
}

export default Privacidade;
