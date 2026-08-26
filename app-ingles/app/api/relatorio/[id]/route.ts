import { pegarUsuarioId } from "@/lib/auth";
import { buscarRelatorioCompleto } from "@/lib/relatorioCompleto.model";


export async function GET(req: Request, {params}:{params: Promise<{id: string}>}){
    let usuario_id: number
    try{
         usuario_id =  pegarUsuarioId(req)
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
        return Response.json({mensagem: 'Erro desconhecido'}, {status:500})
    }
}