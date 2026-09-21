import { login } from '@/lib/login.model'
import bcrypt from 'bcrypt'
import { badRequest, IncorrectLogin, internalServerError, TooManyRequests } from '@/lib/respostas'
import { createSession } from '@/lib/session'
import { rateLimite } from '@/lib/rateLimite';
import { success, z } from "zod";

const loginSchema = z.object({
    email: z.string(),
    senha: z.string()
})

export const dynamic = "force-dynamic";


export async function POST(req: Request){
    try{
        
        const ip =  req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'desconhecido'
        const rate = await rateLimite(ip, 300, 3600)
        if(!rate){
            return TooManyRequests()
        }

        const body = await req.json()
        const bodyValidado = await loginSchema.safeParseAsync(body)
        if(!bodyValidado.success){
            return badRequest()
        }

        
        const usuario = await login(bodyValidado.data.email)
        if(!usuario){
            return IncorrectLogin()
        }

        const certa = await bcrypt.compare(bodyValidado.data.senha, usuario.senhaHash)
        if(!certa){
            return IncorrectLogin()
        }
        
        await createSession(String(usuario.id))
        
        return Response.json({mensagem: 'Usuario logado com sucesso'}, {status:200})

    }catch(err:unknown){
        console.log(err)
        return internalServerError()
    }
}