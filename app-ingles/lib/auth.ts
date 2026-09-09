
import { cookies } from "next/headers"
import { decrypt } from "./session"
import { NextRequest } from "next/server"

export async function pegarUsuarioId(): Promise<number>{
    const cookieStore = await cookies()
    const session =  cookieStore.get('session')?.value

    const payload = await decrypt(session)

    if(!payload){
        throw new Error('Não autenticado');
    }

    return Number(payload.userId)
    
}

export async function pegarUsuarioIdProxy(request: NextRequest) {

    const session =  request.cookies.get('session')?.value

    const payload = await decrypt(session)

    if(!payload){
        throw new Error('Não autenticado');
    }

    return Number(payload.userId)
    
}
