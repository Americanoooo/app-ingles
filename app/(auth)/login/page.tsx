"use client";

import { ApiError } from "@/lib/apiError";
import { apiFetch } from "@/lib/apiFetch";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { use, useState } from "react";
import { CircleAlert, CircleCheck, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BotaoGoogle } from "@/app/components/BotaoGoogle";
import { Logo } from "@/app/components/Logo";
import { TituloEscrito, duracaoEscrita } from "@/app/components/TituloEscrito";

// Saudação em inglês com a tradução embaixo, no mesmo espírito do app:
// inglês primeiro, explicação em português logo depois.
const textos = {
  login: {
    saudacao: "Welcome back!",
    traducao: "Que bom ter você de volta.",
    apoio: "Entre para continuar seus treinos de onde parou.",
    botao: "Entrar",
    enviando: "Entrando...",
    trocaPergunta: "Ainda não tem conta?",
    trocaAcao: "Criar conta",
  },
  cadastro: {
    saudacao: "Nice to meet you!",
    traducao: "Prazer em te conhecer.",
    apoio: "Crie sua conta para salvar seu histórico e ver sua evolução no relatório.",
    botao: "Criar conta",
    enviando: "Criando conta...",
    trocaPergunta: "Já tem conta?",
    trocaAcao: "Entrar",
  },
};

/** A saudação é curta, então é escrita num ritmo mais lento que o da landing. */
const MS_POR_LETRA_SAUDACAO = 40;

const classeInput =
  "h-12 rounded-2xl border-2 bg-background px-4 text-base md:text-base dark:bg-input/30";

function Login({ searchParams }: PageProps<"/login">) {
  // A landing abre direto no cadastro com /login?modo=cadastro
  const { modo } = use(searchParams);
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");

  const [cadastrar, setCadastrar] = useState(modo === "cadastro");
  const [erro, setErro]= useState('')
  const [sucesso, setSucesso]= useState('')
  const [enviando, setEnviando] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const router = useRouter()

  const t = cadastrar ? textos.cadastro : textos.login
  const fimSaudacao = duracaoEscrita(t.saudacao, MS_POR_LETRA_SAUDACAO)

  function limparForm(){
    setErro('')
    setNome('')
    setEmail('')
    setSenha('')
    setSucesso('')
  }

  function trocarModo(){
    setCadastrar(!cadastrar)
    setMostrarSenha(false)
    limparForm()
  }

  async function handleLogin(e: React.FormEvent){
    e.preventDefault()
     if(!email || !senha){
      return setErro('Preencha todos os campos')
    }
    setEnviando(true)
    try{
       await  apiFetch('/api/login', {method: 'POST', body: JSON.stringify({email, senha})})
      // Sem resetar o enviando no sucesso: o botão fica travado até a navegação terminar
      router.push('/treino')
      }catch(err: unknown){
        setErro( err instanceof  ApiError ? err.message : 'Erro ao efetuar login')
        setSenha('')
        setEnviando(false)
      }
  }

  async function handleCadastrar(e: React.FormEvent){
    // preventDefault antes da validação: senão o form recarrega a página com campos vazios
    e.preventDefault()
        if(!nome || !email || !senha){
      return setErro('Preencha todos os campos')
    }
    setEnviando(true)
    try{

         await apiFetch('/api/cadastrar',
        {method: 'POST', body: JSON.stringify({nome, email,senha})}
      )
      setSucesso('Conta criada. Agora é só entrar com seu email e senha.')
      setErro('')
    }catch(err:unknown){
      setErro( err instanceof  Error ? err.message : 'Não foi possível realizar o cadastro')
    }finally{
      setEnviando(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex h-16 w-full max-w-5xl items-center px-4 sm:px-8">
        <Link
          href="/"
          aria-label="AI Fluency, voltar para o início"
          className="rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Logo comMarca />
        </Link>
      </header>

      <main className="mx-auto grid w-full max-w-5xl flex-1 content-center gap-8 px-4 pt-4 pb-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-center lg:gap-16">
        {/* key troca a cada modo para a saudação ser escrita de novo.
            A saudação em inglês é escrita primeiro; a tradução vem logo depois. */}
        <section
          key={cadastrar ? "cadastro" : "login"}
          className="flex flex-col gap-3"
        >
          <h1
            lang="en"
            className="font-heading text-4xl leading-[1.05] font-bold tracking-tight text-balance text-foreground sm:text-6xl lg:text-7xl"
          >
            <TituloEscrito texto={t.saudacao} msPorLetra={MS_POR_LETRA_SAUDACAO} />
          </h1>
          <p
            style={{ animationDelay: `${fimSaudacao - 150}ms` }}
            className="animate-surgir font-heading text-xl font-semibold text-foreground/80 motion-reduce:animate-none sm:text-2xl"
          >
            {t.traducao}
          </p>
          <p
            style={{ animationDelay: `${fimSaudacao + 50}ms` }}
            className="max-w-sm animate-surgir text-base text-pretty text-muted-foreground motion-reduce:animate-none sm:text-lg"
          >
            {t.apoio}
          </p>
        </section>

        <div className="flex flex-col gap-8">
          {/* Formulário no formato do balão de fala do ícone do app */}
          <form
            onSubmit={cadastrar ? handleCadastrar : handleLogin}
            aria-label={cadastrar ? "Criar conta" : "Entrar"}
            noValidate
            className="relative flex flex-col gap-4 rounded-3xl border-2 border-border bg-card p-5 sm:p-6"
          >
            {cadastrar && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="nome" className="text-sm font-bold text-foreground">
                  Nome
                </label>
                <Input
                  id="nome"
                  autoComplete="name"
                  placeholder="Como quer ser chamado"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={classeInput}
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-bold text-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="voce@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={classeInput}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="senha" className="text-sm font-bold text-foreground">
                Senha
              </label>
              <div className="relative">
                <Input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  autoComplete={cadastrar ? "new-password" : "current-password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className={`${classeInput} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={mostrarSenha}
                  className="absolute top-1/2 right-1.5 flex size-9 -translate-y-1/2 items-center justify-center rounded-xl text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {mostrarSenha ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <div aria-live="polite" className="empty:hidden">
              {erro && (
                <p className="flex gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm font-semibold text-foreground">
                  <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
                  {erro}
                </p>
              )}
              {sucesso && (
                <p className="flex gap-2 rounded-2xl border border-success/30 bg-success/10 px-3 py-2.5 text-sm font-semibold text-foreground">
                  <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                  {sucesso}
                </p>
              )}
            </div>

            <Button type="submit" size="lg" disabled={enviando} className="mt-1 w-full rounded-full text-base">
              {enviando && <Loader2 className="animate-spin" />}
              {enviando ? t.enviando : t.botao}
            </Button>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              ou
              <span className="h-px flex-1 bg-border" />
            </div>

            <BotaoGoogle desativado={enviando} />

            {/* Ponta do balão, como no ícone do app */}
            <span
              aria-hidden="true"
              className="absolute -bottom-[11px] left-10 size-5 rotate-45 border-r-2 border-b-2 border-border bg-card"
            />
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {t.trocaPergunta}{" "}
            <button
              type="button"
              onClick={trocarModo}
              disabled={enviando}
              className="rounded-md font-bold text-foreground underline decoration-primary disabled:pointer-events-none disabled:opacity-50 decoration-2 underline-offset-4 outline-none hover:decoration-primary-hover focus-visible:ring-3 focus-visible:ring-ring/50 cursor-pointer"
            >
              {t.trocaAcao}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
export default Login;
