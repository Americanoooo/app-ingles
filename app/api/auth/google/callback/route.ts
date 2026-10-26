import { NextRequest, NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { createSession } from "@/lib/session";
import { entrarComGoogle } from "@/lib/models/usuario.model";

const chavesGoogle = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs")
);

export async function GET(request: NextRequest) {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error(
      "Variáveis de ambiente da Google não configuradas. Confira o .env",
    );
  }

  const origem = request.nextUrl.origin;
  // Mesma origem usada para montar o redirect_uri em /api/auth/google.
  const redirectUri = new URL("/api/auth/google/callback", origem).toString();

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");

  const stateCookie = request.cookies.get("google_state")?.value;

  if (!code || !state || error || !stateCookie || state !== stateCookie) {
    return NextResponse.redirect(new URL("/login", origem));
  }

  const respostaToken = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({
      code: code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!respostaToken.ok) {
    return NextResponse.redirect(new URL("/login", origem));
  }

  const tokens = await respostaToken.json();
  let payloadVerificado
  let usuarioId: number | null = null
  try{
  const {payload}= await jwtVerify(tokens.id_token, chavesGoogle, {
    
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    audience: GOOGLE_CLIENT_ID
  })
  payloadVerificado = payload

  if (!payloadVerificado.sub || typeof payloadVerificado.email !== "string") {
  return NextResponse.redirect(new URL("/login", origem));
  }

  const nomeGoogle =
    typeof payloadVerificado.name === "string" ? payloadVerificado.name.trim() : "";

  const nome = (nomeGoogle || payloadVerificado.email.split("@")[0]).slice(0, 100);


  usuarioId = await entrarComGoogle({
  sub: payloadVerificado.sub,
  email: payloadVerificado.email,
  nome: nome,
  emailVerificadoGoogle: payloadVerificado.email_verified === true,
});

  }catch(err){
    console.error(err)
    payloadVerificado = null
}
  
  if(!payloadVerificado || !usuarioId){
    return NextResponse.redirect(new URL("/login", origem));

  }

  await createSession(String(usuarioId))

  if(usuarioId === null){
    return NextResponse.redirect(new URL("/login", origem));
  }

  return NextResponse.redirect(new URL("/treino", origem));
    }
