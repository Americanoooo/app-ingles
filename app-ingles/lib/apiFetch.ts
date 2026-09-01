import { ApiError } from "./apiError";

export async function apiFetch (endpoint:string, options: RequestInit = {}){
    const res = await fetch(endpoint, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
    if(res.status ===401 && !endpoint.includes('api/login') && !endpoint.includes('api/cadastrar')){
        window.location.href='/login';
        throw new Error('Sessão expirada')
    }
    const data = await res.json()

    if(!res.ok){
        throw new ApiError(res.status, data.error || data.mensagem || data.message || 'Erro na requisição')
    }
    return data

}