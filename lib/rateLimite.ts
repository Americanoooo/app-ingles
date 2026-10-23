import { redis } from "./redis";


export async  function rateLimite(
    chave: string, 
    limite: number, 
    janelaSegundos:number) : Promise<boolean>
    {
        const resultado =  await  redis.incr(chave)
        if(resultado ===1){
            await redis.expire(chave, janelaSegundos)
    }
    return resultado <= limite

}