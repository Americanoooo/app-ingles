import { NextRequest, NextResponse } from 'next/server'
import {  pegarUsuarioIdProxy} from './lib/auth'

export const config = {
  matcher: ['/api/((?!login|cadastrar|me).*)']
}


export default async function proxy(request: NextRequest){

    try{
       await pegarUsuarioIdProxy(request)
     return  NextResponse.next()
    }catch{
        return NextResponse.json({ mensagem: "Não autorizado" }, { status: 401 });
    }

}