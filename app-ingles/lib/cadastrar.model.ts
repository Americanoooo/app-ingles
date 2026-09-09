import { getPool } from "./db";


export async function cadastrarUsuario(email:string, nome:string, senhaHash:string){
    const [resultado] = await getPool().query(
        'INSERT INTO usuario (email, nome, senha_hash) VALUES (?,?,?)',
        [email, nome, senhaHash]
    )
    return resultado
}