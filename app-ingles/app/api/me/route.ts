import { pegarUsuarioId } from "@/lib/auth";


export async function GET(){
    try{
        const usuario_id = await pegarUsuarioId()
        return Response.json({usuario_id}, {status:200})
    }catch{
        return Response.json({mensagem: 'Não autenticado'}, {status:401})
    }
}