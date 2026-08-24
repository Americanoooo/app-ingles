import { RowDataPacket } from "mysql2";
import { pool } from "./db";

export async function login(email:string){
    const [resultado] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM usuario WHERE email =?',
        [email]
    )
    return resultado[0]
}