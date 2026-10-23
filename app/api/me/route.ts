import { pegarUsuarioId } from "@/lib/auth";
import { unauthorized } from "@/lib/respostas";


export async function GET(){
    try{
        const usuarioId = await pegarUsuarioId()
        return Response.json({usuarioId}, {status:200})
    }catch{
        return unauthorized()
    }
}