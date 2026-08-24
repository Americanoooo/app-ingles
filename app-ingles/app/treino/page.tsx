"use client";

import { apiFetch } from "@/lib/apiFetch";
import { useState } from "react";

    interface Pergunta {
        enunciado:string, 
        categoria: string,
        opcoes:string[],
        resposta_certa:string,
    }

function Treino(){
    const [dificuldade, setDificuldade]=useState(0)
    const [quantidade, setQuantidade]=useState('')
    const [opcao, setOpcao]=useState('')

    const [quiz, setQuiz]=useState(false)

    const [carregando, setCarregando]=useState(false)
    const [perguntas, setPerguntas]=useState<Pergunta[]>([])

    const [respostas, setRespostas] = useState<Record<number, string>>({})


   async function handleQuiz(){
    setCarregando(true)
        try{
        const data = await apiFetch('/api/gerar-perguntas', 
            {method:'POST',
            body: JSON.stringify({dificuldade, quantidade})}
        )
        setPerguntas(data.quiz)
        console.log(data.quiz)
        setQuiz(true)

        }catch(err:unknown){
            console.log(err)
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
            setQuiz(false)
        }catch(err){
            console.error(err)
            
        }
    }

    return(
        <div className="min-h-screen bg-slate-200 flex items-center justify-center">
            {quiz === false ?(

            
            <div className= "flex flex-col gap-5 bg-white h-120 w-1/3 rounded shadow p-3 items-center">
                <h1 className="text-center text-xl">Treine seu inglês</h1>
                {carregando ===false ? (
                    <>
                   
                <div className="flex justify-center gap-10">
                    <h2 className="text-xl">Escolha a  dificuldade:</h2>
                    <div className="flex gap-5 ">
                    <button className={`text-white p-2 rounded cursor-pointer ${dificuldade === 1 ? "bg-blue-600" : "bg-blue-500"} `} onClick={()=> setDificuldade(1)}>Fácil</button>
                    <button className={`text-white p-2 rounded cursor-pointer ${dificuldade === 2 ? "bg-blue-600" : "bg-blue-500"} `} onClick={()=> setDificuldade(2)}>Média</button>
                    <button className={`text-white p-2 rounded cursor-pointer ${dificuldade === 3 ? "bg-blue-600" : "bg-blue-500"} `} onClick={()=> setDificuldade(3)}>Difícil</button>
                    </div>
                </div>

                <div className="flex justify-center gap-10">
                    <h2 className="text-center text-xl">Escolha a quantidade de perguntas:</h2>
                    <input 
                    className="border w-15 rounded p-1 "
                    value={quantidade}
                    onChange={(e)=> setQuantidade(e.target.value)}
                    type="number"
                    min={1}/>

                </div> 
            <button onClick={handleQuiz}    className="bg-blue-500 text-white w-1/3 p-2 rounded-xl cursor-pointer " >Gerar quiz</button>
             </>) :( 
                
                <div>
                    <h1 className="text-xl font-semibold">Carregando...</h1>
                </div>

            )}
            </div>
                ): (
                    <div className= "flex flex-col gap-10 bg-white h-150 w-1/2 rounded shadow p-3 justify-start overflow-y-auto">
                        {perguntas.map((p, indexPergunta)=> (
                            <div key={indexPergunta} className="border border-slate-200 rounded-lg p-4 flex flex-col gap-3"> 
                            <p className="text-lg font-medium">{indexPergunta + 1}.{p.enunciado}</p>
                            <div className="flex flex-col gap-3"> 
                            {p.opcoes.map((o, indexOpcao)=> (
                                <button key={indexOpcao}
                                onClick={()=> setRespostas({... respostas, [indexPergunta]: o})}
                                className={`text-left w-full border rounded-lg px-4 py-2 transition cursor-pointer ${
  respostas[indexPergunta] === o
    ? "bg-blue-600 text-white border-blue-600"
    : "border-slate-300 hover:bg-slate-100"
}`}>{o}</button>
                                
                            ))}
                            </div>
                            </div>
                        ))}
                    <button onClick={handleEnviar} className="bg-blue-500 text-white w-1/3 p-2 rounded-xl  cursor-pointer " >Enviar</button>
                        </div>
                )}

        </div>
    )
}
export default Treino