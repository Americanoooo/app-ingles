import { pegarUsuarioId } from "@/lib/auth";
import { atualizarRespostas, buscarQuiz } from "@/lib/pergunta.model";
import { badRequest, calcularNota, internalServerError, NotFounded } from "@/lib/respostas";
import { z } from "zod";


const responderSchema = z.object({
    quizId: z.number(),
    respostasQuiz: z.array(
        z.object({
            perguntaId: z.number(),
            respostaUsuario: z.string(),
        })

    )
    .min(1),
})


export const dynamic = "force-dynamic";

export async function POST(req: Request){


    try{
        const usuarioId = await pegarUsuarioId()

       const parse = responderSchema.safeParse( await req.json());
       if(!parse.success){
         return badRequest()
        }

    const {quizId, respostasQuiz} = parse.data

    const quizBanco  = await buscarQuiz(quizId, usuarioId)

    if(quizBanco.length ===0){
        return NotFounded()
    }

    const todasRespondidas = quizBanco.every((p)=> {
        return respostasQuiz.some((resposta)=> resposta.perguntaId === p.id)
    })
    if(!todasRespondidas){
        return badRequest()
    }
    const perguntasCompletas = quizBanco.map((pergunta)=> {
       const resposta = respostasQuiz.find((p)=> p.perguntaId === pergunta.id)
       if(!resposta) {
        throw new Error('Pergunta sem resposta correspondente')
       }
       return {
        ...pergunta,
        resposta_usuario: resposta?.respostaUsuario,
        acertou: resposta?.respostaUsuario === pergunta.resposta_certa
       }
    })




    const acertos =  perguntasCompletas.filter((p)=> p.acertou).length
    const notaCalculada = calcularNota(acertos, quizBanco.length)

         await atualizarRespostas({id: quizId, perguntas: perguntasCompletas}, usuarioId, notaCalculada)
    return Response.json({perguntasCompletas, notaCalculada, acertos}, {status:200})
    }catch(err:unknown){
        const error = err instanceof Error ? err.message : 'Erro ao salvar quiz'
        console.error(error)
        return internalServerError()
    }


}