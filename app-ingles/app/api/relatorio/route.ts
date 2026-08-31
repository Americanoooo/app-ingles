import { pegarUsuarioId } from "@/lib/auth";
import { relatorio } from "@/lib/relatorio.model";
import { erro500 } from "@/lib/respostas";

export const dynamic = "force-dynamic";

export async function GET(req: Request){
    let usuario_id: number
    try{
        usuario_id = pegarUsuarioId(req)
    }catch{
        return Response.json({mensagem: 'Acesso negado. Token inválido.'}, {status:401})

    }

    try{
        const resposta = await relatorio(usuario_id)
        

      
        return Response.json({quizzes: resposta}, {status:200})
    }catch(err: unknown){
        console.error(err)
        return erro500()
    }
}