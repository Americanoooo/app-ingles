
import { cookies } from "next/headers"
import { decrypt } from "./session"

export async function pegarUsuarioId(): Promise<number>{
    const cookieStore = await cookies()
    const session =  cookieStore.get('session')?.value

    const payload = await decrypt(session)

    if(!payload){
        throw new Error('Não autenticado');
    }

    return Number(payload.userId)

}

