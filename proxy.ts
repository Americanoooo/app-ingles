import { NextRequest, NextResponse } from "next/server";
import {  pegarUsuarioIdProxy } from "./lib/auth";
import { rateLimite } from "./lib/rateLimite";
import { TooManyRequests } from "./lib/respostas";

export const config = {
  matcher: ["/api/((?!login|cadastrar|me).*)"],
};

export default async function proxy(request: NextRequest) {
  try {
    const usuarioId = await pegarUsuarioIdProxy(request);
    if (
      request.nextUrl.pathname === "/api/gerar-perguntas" ||
      request.nextUrl.pathname === "/api/feedback"
    ) {
      const checar = await rateLimite(`ia${usuarioId}`, 75, 3600);
      if (!checar) {
        return TooManyRequests();
      }
    }else{
      const checar = await rateLimite(`geral:${usuarioId}`, 120, 3600);
      if (!checar) {
        return TooManyRequests();
      }
    }



    return NextResponse.next();
  } catch {
    return NextResponse.json({ mensagem: "Não autorizado" }, { status: 401 });
  }
}
