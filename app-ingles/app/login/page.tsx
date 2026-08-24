"use client";

import { ApiError } from "@/lib/apiError";
import { apiFetch } from "@/lib/apiFetch";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

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
      const data = await  apiFetch('/api/login', {method: 'POST', body: JSON.stringify({email, senha})})
      localStorage.setItem(`token`, data.token)
      router.push('/treino')
      }catch(err){
        setErro(err instanceof ApiError ? err.message : 'Erro ao efetuar login')
        setSenha('')
      }
  }

  async function handleCadastrar(e: React.FormEvent){
    e.preventDefault()
    try{
      const data = await apiFetch('/api/cadastrar',
        {method: 'POST', body: JSON.stringify({nome, email,senha})}
      )
      setSucesso('Cadastro efetuado com sucesso')
      setErro('')
    }catch(err:unknown){
      console.log(err)
      setErro( err instanceof  Error ? err.message : 'Erro ao cadastrar')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200">
        
        <div className="flex justify-center items-center w-1/2 md:w-1/5 h-100 rounded shadow bg-white text-lg px-3">
        
          {cadastrar === false ? (
            <form className="flex flex-col gap-7 ">
              <input className="w-full bg-transparent  placeholder:text-slate-400 text-slate-700  border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"  placeholder= "Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

              <input className="w-full bg-transparent  placeholder:text-slate-400 text-slate-700  border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder= "Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />


              <div className="flex flex-col gap-4"> 
                {erro && (
                  <p className="text-red-500">{erro}</p>
                )}
                <button className="bg-blue-700 text-white p-2 rounded shadow cursor-pointer"
                onClick={handleLogin}>Entrar</button>
                <button className="bg-slate-200 p-2 rounded shadow cursor-pointer" onClick={()=> {setCadastrar(true); limparForm()}}>Cadastrar</button>
                </div>
            </form>
          ) : (
            <form className="flex flex-col gap-5">
              <input className="w-full bg-transparent  placeholder:text-slate-400 text-slate-700  border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />

              <input className="w-full bg-transparent  placeholder:text-slate-400 text-slate-700  border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder= "Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

              <input className="w-full bg-transparent  placeholder:text-slate-400 text-slate-700  border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder= "Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
                <div className="flex flex-col gap-4">
                  {erro && (
                  <p className="text-red-500">{erro}</p>
                )}

                {sucesso && (
                  <p className="text-green-500">{sucesso}</p>
                )}
                <button className="bg-blue-700 text-white p-2 rounded shadow cursor-pointer" onClick={(handleCadastrar)}>Cadastrar </button>
                <button className="bg-slate-200 p-2 rounded shadow cursor-pointer" onClick={()=> {setCadastrar(false); limparForm()}}>Voltar para o login</button>
                </div>
            </form>
          )}
        </div>
    </div>
  );
}
export default Login;
