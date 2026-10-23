import { getPrisma } from "@/lib/prisma";
import { CONTA_VISITANTE } from "@/lib/visitante";

async function main() {
  try {
    await getPrisma().usuario.upsert({
      where: {
        email: CONTA_VISITANTE.email,
      },
      update: {
        nome: CONTA_VISITANTE.nome,
        senha_hash: CONTA_VISITANTE.senha_hash,
      },
      create: {
        ...CONTA_VISITANTE,
      },
    });
    console.log("conta visitante criada com sucesso.")
  } catch (err) {
    console.error(err);
    process.exitCode = 1
  }finally{
    await getPrisma().$disconnect();

  }
}
main()