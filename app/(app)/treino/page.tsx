"use client";

import { apiFetch } from "@/lib/apiFetch";
import { useRef, useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { FeedbackButton } from "@/app/components/FeedbackButton";
import { BalaoDigitando } from "@/app/components/BalaoDigitando";
import { Placar, DURACAO_CONTAGEM } from "@/app/components/Placar";
import { SeloResultado } from "@/app/components/SeloResultado";
import { DadosQuiz, PerguntaQuiz } from "@/types";
import { ApiError } from "@/lib/apiError";
import { cn } from "@/lib/utils";

/** Intervalo entre um selo de acerto/erro e o próximo, em ms. */
const INTERVALO_SELOS = 120;

function prefereMenosMovimento() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}


function Treino(){
    const [dificuldade, setDificuldade]=useState(0)
    const [quantidade, setQuantidade]=useState('')

    const [tela, setTela]= useState<"setup" | "quiz"| "resultado">("setup")

    const [carregando, setCarregando]=useState(false)
    const [enviando, setEnviando]=useState(false)

    const [perguntas, setPerguntas]=useState<DadosQuiz | null>(null)
    const [acertos, setAcertos]= useState(0)

    const [respostas, setRespostas] = useState<Record<number, string>>({})

    const [resultado, setResultado] = useState<PerguntaQuiz[]>([]);

    const [erro, setErro]=useState('')

    const [erroPerguntas, setErroPerguntas]= useState('')

    // Depois da primeira tentativa de envio, as perguntas sem resposta ficam destacadas.
    const [tentouEnviar, setTentouEnviar] = useState(false)
    const cardsPerguntas = useRef<(HTMLDivElement | null)[]>([])

    const totalPerguntas = perguntas?.todasPerguntas.length ?? 0
    const respondidas = Object.keys(respostas).length


   async function handleQuiz(){
        if(!dificuldade || !quantidade || Number(quantidade) < 1) return setErro('Preencha todos os campos')
        if(Number(quantidade) > 10 || Number(quantidade) < 1) return setErro('Escolha entre 1 e 10 perguntas.')
            setCarregando(true)
        try{
        const data = await apiFetch('/api/gerar-perguntas',
            {method:'POST',
            body: JSON.stringify({dificuldade, quantidade})}
        )
        setPerguntas(data)
        setTela('quiz')


        }catch(err: unknown){
            console.error(err)
            setErro(err instanceof ApiError ? err.message : 'Não foi possível gerar o quiz. Tente novamente em instantes.')
        }finally{
            setCarregando(false)

        }
    }

    function mostrarPrimeiraPendente(){
        const indice = perguntas?.todasPerguntas.findIndex((_, i) => respostas[i] === undefined) ?? -1
        const card = cardsPerguntas.current[indice]
        if(!card) return
        const reduzir = prefereMenosMovimento()
        card.querySelector("button")?.focus({ preventScroll: true })
        card.scrollIntoView({ behavior: reduzir ? "auto" : "smooth", block: "center" })
        if(!reduzir){
            card.animate(
                [
                    { transform: "translateX(0)" },
                    { transform: "translateX(-6px)" },
                    { transform: "translateX(6px)" },
                    { transform: "translateX(-4px)" },
                    { transform: "translateX(0)" },
                ],
                { duration: 300, easing: "ease-out" }
            )
        }
    }

    async function handleEnviar(){
        if(perguntas?.todasPerguntas.length !== Object.keys(respostas).length){
            const faltam = totalPerguntas - respondidas
            setTentouEnviar(true)
            mostrarPrimeiraPendente()
            return setErroPerguntas(faltam === 1 ? 'Falta responder 1 pergunta.' : `Falta responder ${faltam} perguntas.`)
        }
        setErroPerguntas('')
        setEnviando(true)
        try{
            const respostasQuiz = perguntas?.todasPerguntas.map((p, indexPergunta)=> ({
                perguntaId: p.id,
                respostaUsuario: respostas[indexPergunta]
            }))

            const data = await apiFetch('/api/responder',
                {method: 'POST',
                    body: JSON.stringify({quizId: perguntas?.quizId, respostasQuiz})
                }
            )

            setResultado(data.perguntasCompletas)
                setAcertos(data.acertos)
                setTela('resultado')
        }catch(err:unknown){
            const message = err instanceof ApiError ? err.message : "Não foi possível salvar o quiz, tente novamente."
            setErroPerguntas(message)
            console.error(err)
        }finally{
            setEnviando(false)
        }
    }



    function reiniciar(){
        setTela("setup");
        setPerguntas(null);
        setRespostas({});
        setResultado([]);
        setAcertos(0);
        setQuantidade('')
        setDificuldade(0)
        setErro('')
        setErroPerguntas('')
        setTentouEnviar(false)

    }

    return(
        <>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">

            {tela === 'setup' && (
            <Card className="w-full max-w-md gap-0 rounded-3xl p-0 animate-in fade-in duration-200 motion-reduce:animate-none">
                <CardHeader className="items-center gap-1 px-6 pt-6 pb-2 text-center">
                    <CardTitle className="font-heading text-3xl font-bold tracking-tight text-foreground">Treine seu inglês</CardTitle>
                    <p className="text-base text-muted-foreground">Escolha o nível e a quantidade de perguntas</p>
                </CardHeader>
                <CardContent className="px-6 pt-4 pb-6 flex flex-col gap-6 items-center">
                {carregando ===false ? (
                    <>

                <div className="flex flex-col items-center gap-3 w-full">
                    <h2 className="text-sm font-semibold text-foreground">Dificuldade</h2>
                    <div className="grid grid-cols-3 gap-2 w-full">
                    <Button variant={dificuldade === 1 ? "default" : "outline"} size="lg" aria-pressed={dificuldade === 1} className="rounded-full px-2" onClick={()=> setDificuldade(1)}>Fácil</Button>
                    <Button variant={dificuldade === 2 ? "default" : "outline"} size="lg" aria-pressed={dificuldade === 2} className="rounded-full px-2" onClick={()=> setDificuldade(2)}>Média</Button>
                    <Button variant={dificuldade === 3 ? "default" : "outline"} size="lg" aria-pressed={dificuldade === 3} className="rounded-full px-2" onClick={()=> setDificuldade(3)}>Difícil</Button>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                    <label htmlFor="quantidade" className="text-sm font-semibold text-foreground">Quantidade de perguntas</label>

                    <Input
                    id="quantidade"
                    className="h-12 w-24 rounded-2xl text-center text-lg font-bold"
                    value={quantidade}
                    onChange={(e)=> setQuantidade(e.target.value)}
                    type="number"
                    min={1}
                    max={10}
                    aria-describedby="quantidade-ajuda"/>
                    <p id="quantidade-ajuda" className="text-xs text-muted-foreground">Entre 1 e 10 perguntas</p>
                </div>
                {erro && <p role="alert" className="text-destructive-strong text-sm font-semibold text-center">{erro}</p>}
            <Button onClick={handleQuiz} size="lg" className="w-full rounded-full">Gerar quiz</Button>
             </>) :(

                <div role="status" className="flex flex-col items-center gap-3 py-10 animate-in fade-in duration-200 motion-reduce:animate-none">
                    <BalaoDigitando />
                    <p className="font-heading text-lg font-semibold text-foreground">Preparando seu quiz...</p>
                </div>

            )}
            </CardContent>
            </Card>
                )} {tela === 'quiz'  &&(
                    <Card className="w-full max-w-2xl max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden animate-in fade-in duration-200 motion-reduce:animate-none">
                        <CardHeader className="gap-3 px-4 py-4 border-b border-border">
                            <div className="flex items-baseline justify-between gap-3">
                                <CardTitle className="font-heading text-xl font-bold text-foreground">Responda as perguntas</CardTitle>
                                <span className="shrink-0 text-sm font-semibold text-muted-foreground tabular-nums">{respondidas} de {totalPerguntas}</span>
                            </div>
                            <div
                            role="progressbar"
                            aria-label="Perguntas respondidas"
                            aria-valuemin={0}
                            aria-valuemax={totalPerguntas}
                            aria-valuenow={respondidas}
                            aria-valuetext={`${respondidas} de ${totalPerguntas} respondidas`}
                            className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
                            >
                                <div
                                className="h-full origin-left rounded-full bg-primary transition-transform duration-300 ease-out motion-reduce:transition-none"
                                style={{ transform: `scaleX(${totalPerguntas ? respondidas / totalPerguntas : 0})` }}
                                />
                            </div>
                        </CardHeader>
                        <div className="px-4 py-4 flex-1 overflow-y-auto flex flex-col gap-4 justify-start">
                        {perguntas?.todasPerguntas.map((p, indexPergunta)=> {
                            const pendente = tentouEnviar && respostas[indexPergunta] === undefined
                            return (
                            <Card
                            key={indexPergunta}
                            ref={(el) => { cardsPerguntas.current[indexPergunta] = el }}
                            className={cn(
                                "shrink-0 rounded-2xl gap-3 transition-shadow duration-200 motion-reduce:transition-none",
                                pendente && "ring-2 ring-primary"
                            )}
                            >
                            <CardContent className="flex flex-col gap-3 py-4">
                            <div className="flex items-start gap-3">
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-primary-foreground">{indexPergunta + 1}</span>
                            <p id={`enunciado-${indexPergunta}`} lang="en" className="pt-0.5 font-heading text-lg font-semibold leading-snug text-foreground">{p.enunciado}</p>
                            </div>
                            {pendente && <p className="text-sm font-semibold text-primary-strong">Escolha uma resposta.</p>}
                            <div role="group" aria-labelledby={`enunciado-${indexPergunta}`} lang="en" className="flex flex-col gap-2">
                            {p.opcoes.map((o, indexOpcao)=> {
                                const marcada = respostas[indexPergunta] === o
                                return (
                                <Button key={indexOpcao}
                                variant={marcada ? "default" : "outline"}
                                size="lg"
                                aria-pressed={marcada}
                                onClick={()=> setRespostas({... respostas, [indexPergunta]: o})}
                                disabled={enviando}
                                className={cn(
                                    "w-full justify-start text-left h-auto py-3 rounded-2xl whitespace-normal text-base font-semibold transition-[transform,opacity,background-color,border-color,color] motion-reduce:transition-none",
                                    marcada && "animate-opcao-marcada motion-reduce:animate-none"
                                )}>{o}</Button>
                                )
                            })}
                            </div>
                            </CardContent>
                            </Card>
                            )
                        })}
                        </div>

                        <CardFooter className="shrink-0 flex-col gap-2">
                    <p role="alert" className="text-destructive-strong text-sm font-semibold text-center empty:hidden">{erroPerguntas}</p>
                    <Button onClick={handleEnviar} size="lg" className="w-full rounded-full" disabled={enviando}>
                        {enviando && <Loader2 className="animate-spin motion-reduce:animate-none" />}
                        {enviando ? "Enviando..." : "Enviar respostas"}
                    </Button>

                        </CardFooter>
                    </Card>
                )}

                {tela === 'resultado' && (
                    <Card className="w-full max-w-2xl max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden animate-in fade-in duration-200 motion-reduce:animate-none">
                      <CardHeader className="gap-4 px-4 py-4 border-b border-border">
                      <div className="flex items-center justify-between gap-3">
                        <CardTitle className="font-heading text-xl font-bold text-foreground">Resultado</CardTitle>
                       <Button variant="outline" size="sm" className="shrink-0 gap-1.5 rounded-full" onClick={()=>  reiniciar()}>
                        <RotateCcw aria-hidden="true" />
                        Treinar de novo
                       </Button>
                        </div>
                        <Placar acertos={acertos} total={resultado.length} />
                      </CardHeader>
                      <div className="px-4 py-4 flex-1 overflow-y-auto flex flex-col gap-3 justify-start">
                        {resultado.map((p, i)=> (
                            <Card key={i} className={p.acertou ? 'shrink-0 gap-1 rounded-2xl border-2 border-success bg-success/10' : 'shrink-0 gap-1 rounded-2xl border-2 border-destructive bg-destructive/10'}>
                                <CardContent className="flex flex-col gap-2 text-base px-3 py-3">
                                <div className="flex items-start justify-between gap-3">
                                <p lang="en" className="font-heading text-lg font-semibold leading-snug text-foreground">{p.enunciado}</p>
                                <SeloResultado acertou={p.acertou === true} animado atraso={DURACAO_CONTAGEM + i * INTERVALO_SELOS} />
                                </div>
                                <p className="capitalize text-xs font-semibold text-muted-foreground">Categoria: {p.categoria.replace(/_/g, " ")}</p>

                                <p className="text-foreground">Sua resposta: <span lang="en" className="font-semibold">{p.respostaUsuario}</span></p>
                                {!p.acertou && <p className="text-foreground">Resposta certa: <span lang="en" className="font-bold text-success-strong">{p.respostaCerta}</span></p>}

                                    <FeedbackButton pergunta={p}/>

                                </CardContent>

                                </Card>
                        ))}
                        </div>
                    </Card>

                )}


        </div>

        </>

    )
}
export default Treino
