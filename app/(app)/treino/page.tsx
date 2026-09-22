"use client";

import { apiFetch } from "@/lib/apiFetch";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { FeedbackButton } from "@/app/components/FeedbackButton";
import { DadosQuiz, Pergunta } from "@/types";



function Treino(){
    const [dificuldade, setDificuldade]=useState(0)
    const [quantidade, setQuantidade]=useState('')

    const [tela, setTela]= useState<"setup" | "quiz"| "resultado">("setup")

    const [carregando, setCarregando]=useState(false)

    const [perguntas, setPerguntas]=useState<DadosQuiz | null>(null)
    const [acertos, setAcertos]= useState(0)

    const [respostas, setRespostas] = useState<Record<number, string>>({})

    const [resultado, setResultado] = useState<Pergunta[]>([]);

    const [erro, setErro]=useState('')

    const [erroPerguntas, setErroPerguntas]= useState('')


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


        }catch{
            setErro('Erro interno, tente novamente.')
        }finally{
            setCarregando(false)

        }
    }

    async function handleEnviar(){
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
        }catch{
            setErroPerguntas('Preencha todas as perguntas.')
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

    }

    return(
        <>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">

            {tela === 'setup' && (
            <Card className="w-full max-w-md gap-0 rounded-3xl p-0">
                <CardHeader className="items-center gap-1 px-6 pt-6 pb-2 text-center">
                    <CardTitle className="font-heading text-3xl font-bold tracking-tight text-foreground">Treine seu inglês</CardTitle>
                    <p className="text-md text-muted-foreground">Escolha o nível e a quantidade de perguntas</p>
                </CardHeader>
                <CardContent className="px-6 pt-4 pb-6 flex flex-col gap-6 items-center">
                {carregando ===false ? (
                    <>

                <div className="flex flex-col items-center gap-3 w-full">
                    <h2 className="text-sm font-semibold text-foreground">Dificuldade</h2>
                    <div className="grid grid-cols-3 gap-2 w-full">
                    <Button variant={dificuldade === 1 ? "default" : "outline"} size="lg" className="rounded-full px-2" onClick={()=> setDificuldade(1)}>Fácil</Button>
                    <Button variant={dificuldade === 2 ? "default" : "outline"} size="lg" className="rounded-full px-2" onClick={()=> setDificuldade(2)}>Média</Button>
                    <Button variant={dificuldade === 3 ? "default" : "outline"} size="lg" className="rounded-full px-2" onClick={()=> setDificuldade(3)}>Difícil</Button>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                    <h2 className="text-sm font-semibold text-foreground">Quantidade de perguntas</h2>

                    <Input
                    className="h-12 w-24 rounded-2xl text-center text-lg font-bold"
                    value={quantidade}
                    onChange={(e)=> setQuantidade(e.target.value)}
                    type="number"
                    min={1}
                    max={10}/>
                    <p className="text-xs text-muted-foreground">Entre 1 e 10 perguntas</p>
                </div>
                {erro && <p className="text-destructive text-sm font-medium text-center">{erro}</p>}
            <Button onClick={handleQuiz} size="lg" className="w-full rounded-full">Gerar quiz</Button>
             </>) :(

                <div className="flex flex-col items-center gap-3 py-10">
                    <Loader2 className="size-10 animate-spin text-primary" />
                    <p className="font-heading text-lg font-semibold text-foreground">Preparando seu quiz...</p>
                </div>

            )}
            </CardContent>
            </Card>
                )} {tela === 'quiz'  &&(
                    <Card className="w-full max-w-2xl max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden">
                        <CardHeader className="px-4 py-3 border-b border-border">
                            <CardTitle className="font-heading text-lg font-bold text-foreground">Responda as perguntas</CardTitle>
                        </CardHeader>
                        <div className="px-4 py-4 flex-1 overflow-y-auto flex flex-col gap-4 justify-start">
                        {perguntas?.todasPerguntas.map((p, indexPergunta)=> (
                            <Card key={indexPergunta} className="shrink-0 rounded-2xl gap-3">
                            <CardContent className="flex flex-col gap-3 py-4">
                            <div className="flex items-start gap-3">
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-primary-foreground">{indexPergunta + 1}</span>
                            <p className="pt-1 text-base font-semibold text-foreground">{p.enunciado}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                            {p.opcoes.map((o, indexOpcao)=> (
                                <Button key={indexOpcao}
                                variant={respostas[indexPergunta] === o ? "default" : "outline"}
                                size="lg"
                                onClick={()=> setRespostas({... respostas, [indexPergunta]: o})}
                                className="w-full justify-start text-left h-auto py-3 rounded-2xl whitespace-normal">{o}</Button>

                            ))}
                            </div>
                            </CardContent>
                            </Card>
                        ))}
                                                {erroPerguntas && <p className="text-destructive text-sm font-medium text-center">{erroPerguntas}</p>}
                        </div>

                        <CardFooter className="shrink-0">
                    <Button onClick={handleEnviar} size="lg" className="w-full rounded-full">Enviar respostas</Button>

                        </CardFooter>
                    </Card>
                )}

                {tela === 'resultado' && (
                    <Card className="w-full max-w-2xl max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden">
                      <CardHeader className="gap-4 px-4 py-5 border-b border-border">
                      <div className="flex items-center justify-between gap-3">

                       <Button variant="outline" size="sm" className="shrink-0 rounded-full" onClick={()=>  reiniciar()}>Voltar</Button>
                        <span className="text-sm font-medium text-muted-foreground ">Resultado</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-center">
                        <p className="font-heading text-5xl font-bold text-primary">{acertos}<span className="text-2xl text-muted-foreground">/{resultado.length}</span></p>
                        <p className="text-sm font-semibold text-foreground">{resultado.length > 0 && acertos === resultado.length ? "Mandou muito bem! 🎉" : resultado.length > 0 && acertos >= resultado.length / 2 ? "Bom trabalho!" : "Continue treinando!"}</p>
                        </div>
                      </CardHeader>
                      <div className="px-4 py-4 flex-1 overflow-y-auto flex flex-col gap-3 justify-start">
                        {resultado.map((p, i)=> (
                            <Card key={i} className={p.acertou ? 'shrink-0 gap-1 rounded-2xl border-2 border-success bg-success/10' : 'shrink-0 gap-1 rounded-2xl border-2 border-destructive bg-destructive/10'}>
                                <CardContent className="flex flex-col gap-1 text-base px-3 py-3">
                                <p className="font-semibold text-foreground">{p.enunciado}</p>
                                <p className="capitalize text-xs font-medium text-muted-foreground">Categoria: {p.categoria.replace(/_/g, " ")}</p>

                                <p className="text-foreground">Sua  resposta: {p.respostaUsuario}</p>
                                {!p.acertou && <p className="font-semibold text-success">Resposta certa: {p.respostaCerta}</p>}

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
