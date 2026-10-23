import { pegarUsuarioId } from "@/lib/auth";
import { listarQuizzesFinalizados } from "@/lib/models/quiz.model";
import { internalServerError } from "@/lib/respostas";

export const dynamic = "force-dynamic";

export async function GET(){


    try{
        const usuarioId = await pegarUsuarioId()

        const resposta = await listarQuizzesFinalizados(usuarioId)
    
      
        return Response.json({quizzes: resposta}, {status:200})
    }catch(err: unknown){
        console.error(err)
        return internalServerError()
    }
}