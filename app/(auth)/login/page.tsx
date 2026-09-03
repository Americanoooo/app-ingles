"use client";

import { ApiError } from "@/lib/apiError";
import { apiFetch } from "@/lib/apiFetch";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";


function Login() {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");

  const [cadastrar, setCadastrar] = useState(false);
  const [erro, setErro]= useState('')
  const [sucesso, setSucesso]= useState('')
  const router = useRouter()

  function limparForm(){
    setErro('')
    setNome('')
    setEmail('')
    setSenha('')
    setSucesso('')
  }


  async function handleLogin(e: React.FormEvent){
    e.preventDefault()
    try{
       await  apiFetch('/api/login', {method: 'POST', body: JSON.stringify({email, senha})})
      router.push('/treino')
      }catch(err){
        setErro(err instanceof ApiError ? err.message : 'Erro ao efetuar login')
        setSenha('')
      }
  }

  async function handleCadastrar(e: React.FormEvent){
    e.preventDefault()
    try{
         await apiFetch('/api/cadastrar',
        {method: 'POST', body: JSON.stringify({nome, email,senha})}
      )
      setSucesso('Cadastro efetuado com sucesso')
      setErro('')
    }catch(err:unknown){
      setErro( err instanceof  Error ? err.message : 'Erro ao cadastrar')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200 ">

        <Card className="w-1/2 md:w-1/5 px-3 ">
          <CardHeader>
            <CardTitle className="text-center text-2xl">{cadastrar === false ? "Login" : "Cadastro"}</CardTitle>
          </CardHeader>
          <CardContent>
          {cadastrar === false ? (
            <form className="flex flex-col gap-7 ">
              <Input  placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

              <Input placeholder="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />


              <div className="flex flex-col gap-4">
                {erro && (
                  <p className="text-red-500">{erro}</p>
                )}
                <Button onClick={handleLogin}>Entrar</Button>
                <Button variant="outline" onClick={()=> {setCadastrar(true); limparForm()}}>Cadastrar</Button>
                </div>
            </form>
          ) : (
            <form className="flex flex-col gap-5">
              <Input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />

              <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

              <Input placeholder="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
                <div className="flex flex-col gap-4">
                  {erro && (
                  <p className="text-red-500">{erro}</p>
                )}

                {sucesso && (
                  <p className="text-green-500">{sucesso}</p>
                )}
                <Button onClick={(handleCadastrar)}>Cadastrar</Button>
                <Button variant="outline" onClick={()=> {setCadastrar(false); limparForm()}}>Voltar para o login</Button>
                </div>
            </form>
          )}
          </CardContent>
        </Card>
    </div>
  );
}
export default Login;
