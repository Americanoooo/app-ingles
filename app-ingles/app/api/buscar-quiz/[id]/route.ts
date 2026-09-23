import { pegarUsuarioId } from "@/lib/auth"
import { buscarQuiz } from "@/lib/pergunta.model"
import { internalServerError } from "@/lib/respostas"

export async function GET(_req: Request, {params}:{params: Promise<{id: string}>}){
    try{
        const {id} = await params
        const quizId = Number(id)
        const usuarioId = await pegarUsuarioId()
        const resultado = await buscarQuiz(quizId, usuarioId)
        if(resultado.length ===0){
            return Response.json({mensagem: 'Quiz não encontrado'}, {status: 404})
        }
        return Response.json({resultado}, {status:200})
    }catch(err){
        console.error(err)
        return internalServerError()
    }


}