import { buscarPorEmail } from "@/lib/models/usuario.model";
import { IncorrectLogin, internalServerError } from "@/lib/respostas";
import { createSession } from "@/lib/session";
import { CONTA_VISITANTE } from "@/lib/visitante";

export const dynamic = "force-dynamic";


export async function POST(){

    try{
        const usuario = await buscarPorEmail(CONTA_VISITANTE.email)
        if(!usuario){
            console.error("Conta não encontrada no banco")
            return internalServerError()
        }
        
        await createSession(String(usuario.id))

        return Response.json({mensagem: "Usuário logado com sucesso"}, {status:200})
        
    }catch(err:unknown){
               console.error(err)
                return internalServerError()
    }


}