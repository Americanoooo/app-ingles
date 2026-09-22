import { cadastrarUsuario } from '@/lib/cadastrar.model'
import { rateLimite } from '@/lib/rateLimite';
import { badRequest, internalServerError, TooManyRequests } from '@/lib/respostas';
import bcrypt from 'bcrypt'
import { z} from 'zod'

export const dynamic = "force-dynamic";

const cadastrarSchema = z.object({
    email:z
    .string()
    .email({message: "Insira um email válido."}),

    nome: z
    .string()
    .min(2, { message: 'O nome deve ter pelo menos 2 caracteres.'}),

    senha:z
    .string()
    .min(8, {message: 'A senha deve conter pelo menos 8 caracteres.'})
    .max(20, {message: 'A senha é longa demais.'})
    .refine((value)=> /[a-zA-Z]/.test(value), {message: 'A senha deve conter pelo menos uma letra.'})
    .refine((value)=> /[0-9]/.test(value), {message:'A senha deve conter pelo menos um número'}),
})

export async function POST(req: Request){
    try{
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'desconhecido'
    const rate = await rateLimite(ip, 300, 3600)
        if(!rate){
            return TooManyRequests()
        }

        const body = await req.json() 
        const validacao = cadastrarSchema.safeParse(body)

        if(!validacao.success) {
            return Response.json({mensagem: validacao.error.issues[0].message}, {status:400})
        }

        const { email, nome, senha } = validacao.data
        const senhaHash = await bcrypt.hash(senha, 10)

        await cadastrarUsuario(email,nome , senhaHash)
        return Response.json({mensagem: 'Usuário cadastrado com sucesso'}, {status: 201})
    }catch(err:unknown){        
        if(err && typeof err === 'object' && 'code' in err && err.code === 'ER_DUP_ENTRY'){
            return Response.json({mensagem: 'Este email já está cadastrado'}, {status: 409})
        }
        console.log(err)

        return internalServerError()
    }
}