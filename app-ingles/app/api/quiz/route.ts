import { pegarUsuarioId } from "@/lib/auth";
import { listaQuiz } from "@/lib/quiz.model";

export async function GET(req: Request){
    let usuario_id: number
    try{
        usuario_id = pegarUsuarioId(req)
    }catch{
        return Response.json({mensagem: 'Acesso negado. Token inválido.'}, {status:401})

    }

    try{
        const resposta = await listaQuiz(usuario_id)
        if(resposta.length ===0){
            
        }

      
        return Response.json({quizzes: resposta}, {status:200})
    }catch(err: unknown){
        console.error(err)
        return Response.json({error: 'Erro ao listar quiz'}, {status:500})
    }
}