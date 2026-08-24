import { ApiError } from "./apiError";

export async function apiFetch (endpoint:string, options: RequestInit = {}){
    const token = localStorage.getItem('token')
    const res = await fetch(endpoint, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? {Authorization: `Bearer ${token}`}: {}),
            ...options.headers,
        },
    });
    if(res.status ===401 && !endpoint.includes('api/login') && !endpoint.includes('api/cadastrar')){
        localStorage.removeItem('token');
        window.location.href='/login';
        throw new Error('Sessão expirada')
    }
    const data = await res.json()

    if(!res.ok){
        throw new ApiError(res.status, data.error || data.mensagem || data.message || 'Erro na requisição')
    }
    return data

}