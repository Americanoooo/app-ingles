import { getPrisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { EmailJaCadastradoError } from "@/lib/erros";

export async function buscarPorEmail(email: string) {
  const usuario = await getPrisma().usuario.findUnique({
    where: { email },
  });
  if (!usuario) return usuario;

  return {
    id: usuario.id,
    email: usuario.email,
    nome: usuario.nome,
    senhaHash: usuario.senha_hash,
  };
}

export async function cadastrarUsuario(
  email: string,
  nome: string,
  senhaHash: string,
) {
  try {
    await getPrisma().usuario.create({
      data: {
        nome: nome,
        email: email,
        senha_hash: senhaHash,
      },
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      throw new EmailJaCadastradoError("Email já cadastrado");
    }
    throw err;
  }
}

export async function entrarComGoogle(dados: {
  sub: string;
  email: string;
  nome: string;
  emailVerificadoGoogle: boolean;
}): Promise<number | null> {

        const usuario_ja_logou = await getPrisma().usuario.findUnique({
            where:{
                google_sub: dados.sub
            }
        })
        if(usuario_ja_logou){
        return usuario_ja_logou.id
        }

        if(!dados.emailVerificadoGoogle){
            return null
        }

        const usuario_tem_email = await getPrisma().usuario.findUnique({
            where:{
                email: dados.email
            },
        })
        if(usuario_tem_email){
            if(!usuario_tem_email.email_verificado){
             await getPrisma().usuario.update({
                where: {
                    id: usuario_tem_email.id
                },
             data: {
                google_sub: dados.sub,
                email_verificado: true,
                senha_hash: null
             }
            })
            return usuario_tem_email.id
        }
        await getPrisma().usuario.update({
            where:{
                id: usuario_tem_email.id
            },
            data: {
                google_sub: dados.sub
            }
        })
        return usuario_tem_email.id
        }

        const usuario = await getPrisma().usuario.create({
                data: {
             google_sub: dados.sub ,
             email: dados.email,
             nome: dados.nome,
             email_verificado: true
           }
        })
        
        return usuario.id

}
