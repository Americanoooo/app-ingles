import mysql from "mysql2/promise";

let pool: mysql.Pool;

export function getPool(){
    if(pool) return pool;



const {DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT}= process.env

if(!DB_HOST|| !DB_NAME|| !DB_PASSWORD|| !DB_PORT|| !DB_USER){
    throw new Error('Variáveis de ambiemte do banco não configuradas. Confira o .env')
}

pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: Number(DB_PORT) || 3306,
});

return pool;

}