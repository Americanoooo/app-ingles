import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { EmailJaCadastradoError } from "@/lib/erros";

export async function buscarPorEmail(email: string){
    const usuario = await prisma.usuario.findUnique({
        where: { email }
    })
    if(!usuario) return usuario

    return {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        senhaHash: usuario.senha_hash,
    }
}

export async function cadastrarUsuario( email: string,nome:string, senhaHash:string){
    try{
     await prisma.usuario.create({data: 
        {
            nome: nome,
            email: email,
            senha_hash: senhaHash

        },
    })
}catch(err){
    if(err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002"){
        throw new EmailJaCadastradoError('Email já cadastrado')
    }
    throw err
}
    
}
