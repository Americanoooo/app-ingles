import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated/prisma/client";

function criarPrisma(){
    const {DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT} = process.env

    if(!DB_HOST|| !DB_NAME|| !DB_PASSWORD|| !DB_PORT|| !DB_USER){
        throw new Error('Variáveis de ambiente do banco não configuradas. Confira o .env')
    }

    const adapter = new PrismaMariaDb({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        port: Number(DB_PORT) || 3306,
        connectionLimit: 10,
    })

    return new PrismaClient({ adapter })
}

// Em dev o Next recarrega os módulos a cada alteração. Sem guardar no globalThis,
// cada reload criaria um PrismaClient novo (e um pool de conexões novo) até estourar o MySQL.
const globalParaPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalParaPrisma.prisma ?? criarPrisma()

if(process.env.NODE_ENV !== "production") globalParaPrisma.prisma = prisma
