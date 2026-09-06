import { RowDataPacket } from "mysql2";
import { getPool } from "./db";

export async function login(email:string){
    const [resultado] = await getPool().query<RowDataPacket[]>(
        'SELECT * FROM usuario WHERE email =?',
        [email]
    )
    const usuario = resultado[0]
    if(!usuario) return usuario

    return {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        senhaHash: usuario.senha_hash,
    }
}