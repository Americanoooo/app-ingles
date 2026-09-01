import { RowDataPacket } from "mysql2";
import { getPool } from "./db";

export async function login(email:string){
    const [resultado] = await getPool().query<RowDataPacket[]>(
        'SELECT * FROM usuario WHERE email =?',
        [email]
    )
    return resultado[0]
}