import { getPool } from "./db";


export async function cadastrarUsuario(email:string, nome:string, senha_hash:string){
    const [resultado] = await getPool().query(
        'INSERT INTO usuario (email, nome, senha_hash) VALUES (?,?,?)',
        [email, nome, senha_hash]
    )
    return resultado
}