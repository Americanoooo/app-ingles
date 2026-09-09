import { login } from '@/lib/login.model'
import bcrypt from 'bcrypt'
import { badRequest, internalServerError, unauthorized } from '@/lib/respostas'
import { createSession } from '@/lib/session'


export const dynamic = "force-dynamic";

export async function POST(req: Request){
    try{
        const {email, senha} = await req.json()
        if(!email || !senha){
            return badRequest()
        }

        const usuario = await login(email)
        if(!usuario){
            return unauthorized()
        }

        const certa = await bcrypt.compare(senha, usuario.senhaHash)
        if(!certa){
            return unauthorized()
        }
        
        await createSession(String(usuario.id))
        
        return Response.json({mensagem: 'Usuario logado com sucesso'}, {status:200})

    }catch(err:unknown){
        console.log(err)
        return internalServerError()
    }
}