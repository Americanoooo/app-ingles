import { login } from "@/lib/login.model";
import { IncorrectLogin, internalServerError } from "@/lib/respostas";
import { createSession } from "@/lib/session";

export const dynamic = "force-dynamic";


export async function POST(){

    try{
        const email = "visitante@gmail.com"

        const usuario = await login(email)
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