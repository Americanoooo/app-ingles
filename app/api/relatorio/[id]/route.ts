import { pegarUsuarioId } from "@/lib/auth";
import { buscarRelatorioCompleto } from "@/lib/relatorioCompleto.model";
import { erro500 } from "@/lib/respostas";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, {params}:{params: Promise<{id: string}>}){
    let usuario_id: number
    try{
         usuario_id = await pegarUsuarioId()
    }catch{
        return Response.json({mensagem: 'Acesso negado. Token inválido.'}, {status:401})
    }

    try{
    const {id}= await params;
    const quiz_id = Number(id)
    const resultado = await buscarRelatorioCompleto(quiz_id, usuario_id)
        if(resultado.length ===0){
            return Response.json({error: 'Quiz não encontrado'}, {status: 404})
        }
    return Response.json({quizzes: resultado}, {status:200})
    }catch(err){
        console.error(err)
        return erro500()
    }
}