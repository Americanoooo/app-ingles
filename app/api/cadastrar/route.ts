import { cadastrarUsuario } from '@/lib/cadastrar.model'
import { erro500 } from '@/lib/respostas';
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
        const body = await req.json() 
        const validacao = cadastrarSchema.safeParse(body)

        if(!validacao.success) {
            const erroFormatado = z.flattenError(validacao.error)
            const mensagens = Object.values(erroFormatado.fieldErrors).flat()
            return Response.json({error: mensagens[0]}, {status:400})
        }

        const { email, nome, senha } = validacao.data
        const senha_hash = await bcrypt.hash(senha, 10)

        await cadastrarUsuario(email,nome , senha_hash)
        return Response.json({mensagem: 'Usuário cadastrado com sucesso'}, {status: 201})
    }catch(err:unknown){        
        if(err && typeof err === 'object' && 'code' in err && err.code === 'ER_DUP_ENTRY'){
            return Response.json({mensagem: 'Este email já está cadastrado'}, {status: 409})
        }
        console.log(err)

        return erro500()
    }
}