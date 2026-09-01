import { login } from '@/lib/login.model'
import bcrypt from 'bcrypt'
import { error } from 'console'
import { erro500 } from '@/lib/respostas'
import { createSession } from '@/lib/session'


export const dynamic = "force-dynamic";

export async function POST(req: Request){
    try{
        const {email, senha} = await req.json()
        if(!email || !senha){
            return Response.json({mensagem: 'Insira dados válidos'}, {status: 400})
        }

        const usuario = await login(email)
        if(!usuario){
            return Response.json({mensagem: 'Email ou senha inválidos'}, {status:401})
        }

        const certa = await bcrypt.compare(senha, usuario.senha_hash)
        if(!certa){
            return Response.json({mensagem: 'Email ou senha inválidos'}, {status:401})
        }
        
        await createSession(String(usuario.id))
        
        return Response.json({mensagem: 'Usuario logado com sucesso'}, {status:200})

    }catch(err:unknown){
        console.log(error)
        return erro500()
    }
}