"use client";

import { apiFetch } from "@/lib/apiFetch";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FeedbackButton } from "@/app/components/FeedbackButton";


    interface Pergunta {
        enunciado:string,
        categoria: string,
        opcoes:string[],
        resposta_certa:string,
    }

    interface Resultado{
        resposta_certa: string,
        resposta_usuario: string,
        enunciado: string,
        categoria: string,
        opcoes:string[],
        acertou:boolean
    }

function Treino(){
    const [dificuldade, setDificuldade]=useState(0)
    const [quantidade, setQuantidade]=useState('')

    const [tela, setTela]= useState<"setup" | "quiz"| "resultado">("setup")

    const [carregando, setCarregando]=useState(false)

    const [perguntas, setPerguntas]=useState<Pergunta[]>([])
    const [acertos, setAcertos]= useState(0)

    const [respostas, setRespostas] = useState<Record<number, string>>({})

    const [resultado, setResultado] = useState<Resultado[]>([]);

    const [erro, setErro]=useState('')


   async function handleQuiz(){
        if(!dificuldade || !quantidade || Number(quantidade) < 1) return setErro('Preencha todos os campos')
    setCarregando(true)
        try{
        const data = await apiFetch('/api/gerar-perguntas',
            {method:'POST',
            body: JSON.stringify({dificuldade, quantidade})}
        )
        setPerguntas(data.quiz)
        setTela('quiz')

        }catch{
            setErro('Erro interno, tente novamente.')
        }finally{
            setCarregando(false)

        }
    }

    async function handleEnviar(){
        try{
            const respostasQuiz = perguntas.map((p, indexPergunta)=> ({
                ...p,
                resposta_usuario: respostas[indexPergunta]
            }))

            const data = await apiFetch('/api/responder',
                {method: 'POST',
                    body: JSON.stringify({dificuldade, respostaQuiz: respostasQuiz})
                }
            )

            setResultado(data.perguntasCorrigidas)
                setAcertos(data.acertou)
                setTela('resultado')
        }catch{
        }
    }

    

    function reiniciar(){
        setTela("setup");
        setPerguntas([]);
        setRespostas({});
        setResultado([]);
        setAcertos(0);
        setQuantidade('')
        setDificuldade(0)
        setErro('')

    }

    return(
        <>
        <div className="min-h-screen bg-slate-200 flex items-center justify-center">

            {tela === 'setup' && (
            <Card className="min-h-120 w-1/3 py-3 gap-5">
                <CardHeader className="px-3">
                    <CardTitle className="text-center text-xl">Treine seu inglês</CardTitle>
                </CardHeader>
                <CardContent className="px-3 flex flex-col gap-5 items-center">
                {carregando ===false ? (
                    <>

                <div className="flex justify-center gap-10">
                    <h2 className="text-xl">Escolha a  dificuldade:</h2>
                    <div className="flex gap-5 ">
                    <Button variant={dificuldade === 1 ? "default" : "outline"} onClick={()=> setDificuldade(1)}>Fácil</Button>
                    <Button variant={dificuldade === 2 ? "default" : "outline"} onClick={()=> setDificuldade(2)}>Média</Button>
                    <Button variant={dificuldade === 3 ? "default" : "outline"} onClick={()=> setDificuldade(3)}>Difícil</Button>
                    </div>
                </div>

                <div className="flex justify-center gap-10">
                    <h2 className="text-center text-xl">Escolha a quantidade de perguntas:</h2>
                    <Input
                    className="w-20"
                    value={quantidade}
                    onChange={(e)=> setQuantidade(e.target.value)}
                    type="number"
                    min={1}/>

                </div>
                {erro && <p className="text-red-500">{erro}</p>}
            <Button onClick={handleQuiz} className="w-1/3">Gerar quiz</Button>
             </>) :(

                <div>
                    <h1 className="text-xl ">Carregando...</h1>
                </div>

            )}
            </CardContent>
            </Card>
                )} {tela === 'quiz'  &&(
                    <Card className="w-full max-w-2xl max-h-[85vh] flex flex-col">
                        <CardContent className="px-3 flex-1 overflow-y-auto flex flex-col gap-7 justify-start">
                        {perguntas.map((p, indexPergunta)=> (
                            <Card key={indexPergunta} className="shrink-0">
                            <CardContent className="flex flex-col gap-3 py-4">
                            <p className="text-xl font-medium">{indexPergunta + 1}.{p.enunciado}</p>
                            <div className="flex flex-col gap-3 py-1">
                            {p.opcoes.map((o, indexOpcao)=> (
                                <Button key={indexOpcao}
                                variant={respostas[indexPergunta] === o ? "default" : "outline"}
                                onClick={()=> setRespostas({... respostas, [indexPergunta]: o})}
                                className="w-full justify-start text-left h-auto py-1">{o}</Button>

                            ))}
                            </div>
                            </CardContent>
                            </Card>
                        ))}
                        <div className="flex justify-center">
                          
                    <Button onClick={handleEnviar} className="w-1/3">Enviar</Button>
                      
                        </div>
                        </CardContent>
                    </Card>
                )}

                {tela === 'resultado' && (
                    <Card className="w-full max-w-2xl max-h-[85vh] flex flex-col">
                      <CardContent className="px-3 flex-1 overflow-y-auto flex flex-col gap-10 justify-start">
                      <div className="flex items-center">

                       <Button variant="outline" className="w-1/6" onClick={()=>  reiniciar()}>Voltar</Button>
                        <h1 className="flex-1 text-center text-xl ">Você acertou: {acertos} de {resultado.length}</h1>
                        </div>
                        {resultado.map((p, i)=> (
                            <Card key={i} className={p.acertou ? 'border border-green-500 bg-green-50 ring-0' : 'border border-red-500 bg-red-50 ring-0'}>
                                <CardContent className="text-lg px-1 py-3">
                                <p>{p.enunciado}</p>
                                <p className="capitalize ">Categoria: {p.categoria.replace(/_/g, " ")}</p>

                                <p>Sua resposta: {p.resposta_usuario}</p>
                                {!p.acertou && <p>Resposta certa: {p.resposta_certa}</p>}
                               
                                <div className="flex justify-center mx-auto ">
                                <FeedbackButton pergunta={p}/>
                                </div>

                                </CardContent>
                                </Card>
                        ))}
                        </CardContent>
                    </Card>
                    
                )}
                

        </div>
       
        </>

    )
}
export default Treino
