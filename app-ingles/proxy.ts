import { NextRequest, NextResponse } from "next/server";
import {  pegarUsuarioIdProxy } from "./lib/auth";
import { rateLimite } from "./lib/rateLimite";
import { TooManyRequests, unauthorized } from "./lib/respostas";

export const config = {
  matcher: ["/api/((?!login|cadastrar|me).*)"],
};

export default async function proxy(request: NextRequest) {

    let usuarioId: number
    try{
          usuarioId = await pegarUsuarioIdProxy(request);
    }catch{
      return unauthorized()
    }
    try{
    if (
      request.nextUrl.pathname === "/api/gerar-perguntas" ||
      request.nextUrl.pathname === "/api/feedback"
    ) {
      const checar = await rateLimite(`ia:${usuarioId}`, 75, 3600);
      if (!checar) {
        return TooManyRequests();
      }
    }else{
      const checar = await rateLimite(`geral:${usuarioId}`, 120, 3600);
      if (!checar) {
        return TooManyRequests();
      }
    }
    }catch(err){
      console.error(err)
    }


    return NextResponse.next();
  } 

