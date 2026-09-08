import { pegarUsuarioId } from "@/lib/auth";
import { buscarRelatorioCompleto } from "@/lib/relatorioCompleto.model";
import { internalServerError } from "@/lib/respostas";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, {params}:{params: Promise<{id: string}>}){

    try{
    const usuarioId = await pegarUsuarioId()
    const {id}= await params;
    const quizId = Number(id)
    const resultado = await buscarRelatorioCompleto(quizId, usuarioId)
        if(resultado.length ===0){
            return Response.json({mensagem: 'Quiz não encontrado'}, {status: 404})
        }
    return Response.json({listaPerguntas: resultado}, {status:200})
    }catch(err){
        console.error(err)
        return internalServerError()
    }
}