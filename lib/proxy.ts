import { NextResponse } from 'next/server'
import { pegarUsuarioId } from './auth'
import { unauthorized } from './respostas'

export const config = {
  matcher: ['api/((?!login).*)']
}


export default async function proxy(){
    try{
       await pegarUsuarioId()
     return  NextResponse.next()
    }catch{
        return unauthorized()
    }

}