# App Inglês 🇬🇧

Aplicação **full-stack** de treino de inglês com quizzes gerados por **Inteligência Artificial**. O usuário escolhe a dificuldade e a quantidade de perguntas, a IA gera o quiz, e o app corrige, guarda o histórico e permite revisar os erros de cada tentativa.

> 🔗 **Demo:** _(em breve)_

![Tela de treino](docs/treino.png)

---

## ✨ Funcionalidades

- **Autenticação completa** — cadastro e login com senha criptografada e sessão via **cookie httpOnly** (proteção contra XSS).
- **Geração de quiz por IA** — o usuário escolhe a dificuldade (Fácil / Média / Difícil) e a quantidade de perguntas; a IA gera questões de múltipla escolha nas categorias *preposição*, *tempo verbal* e *contexto*.
- **Correção automática** — a nota é calculada **no servidor** (o cliente nunca decide o resultado), com persistência atômica no banco.
- **Tela de resultado** — mostra os acertos e destaca visualmente cada questão (verde para acerto, vermelho para erro) com a resposta correta.
- **Histórico de quizzes** — relatório com todos os quizzes realizados, com **filtros** por dificuldade e por período.
- **Revisão de quiz** — abre um quiz antigo e revê pergunta por pergunta o que foi respondido e o gabarito.

---

## 🛠️ Tecnologias

**Front-end**
- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)

**Back-end**
- Next.js Route Handlers (API)
- [MySQL](https://www.mysql.com/) (`mysql2`)
- [Zod](https://zod.dev/) — validação de entrada
- [bcrypt](https://www.npmjs.com/package/bcrypt) — hash de senha
- [jose](https://www.npmjs.com/package/jose) — assinatura/verificação de JWT (cookie httpOnly)

**IA**
- API do Google **Gemini** (endpoint compatível com OpenAI)

**Infraestrutura**
- [Docker](https://www.docker.com/) + Docker Compose (aplicação + banco em um comando)

---

## 🚀 Como rodar

### Opção 1 — Docker (recomendado)

Sobe a aplicação **e** o banco MySQL juntos, com um único comando.

**Pré-requisitos:** [Docker](https://www.docker.com/products/docker-desktop/) instalado.

```bash
# 1. clone o repositório
git clone https://github.com/SEU-USUARIO/app-ingles.git
cd app-ingles

# 2. crie o arquivo .env (veja a seção "Variáveis de ambiente")

# 3. suba tudo
docker compose up --build
```

Acesse **http://localhost:3000**. O schema do banco é criado automaticamente na primeira execução.

### Opção 2 — Local

**Pré-requisitos:** Node.js, um MySQL rodando localmente e o schema criado (`schema.sql`).

```bash
# 1. instale as dependências
npm install

# 2. configure o .env apontando para o seu MySQL local

# 3. rode em modo desenvolvimento
npm run dev
```

Acesse **http://localhost:3000**.

---

## 🔑 Variáveis de ambiente

Crie um arquivo `.env` na raiz com:

```env
# Banco de dados
DB_HOST=localhost          # use "db" ao rodar via Docker Compose
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=app_ingles
DB_PORT=3306

# Segredos
JWT_SECRET=uma_chave_secreta_longa
GEMINI_API_KEY=sua_chave_do_gemini
```

> ⚠️ O `.env` está no `.gitignore` e **não** deve ser versionado. A chave do Gemini pode ser obtida gratuitamente no [Google AI Studio](https://aistudio.google.com/).

---

## 🧠 Decisões técnicas

Alguns pontos de arquitetura que valem destaque:

- **A nota é calculada no servidor.** O cliente envia apenas as respostas escolhidas; o back-end compara com o gabarito e define a nota. Nunca se confia no cliente para o resultado.
- **Persistência atômica.** O quiz e todas as suas perguntas são gravados dentro de uma **transação** — se qualquer inserção falha, tudo é revertido (nada de quiz órfão sem perguntas).
- **Autorização por dono (anti-IDOR).** As consultas de histórico e revisão filtram pelo usuário do token, então ninguém acessa quizzes de outra pessoa trocando o id na URL.
- **Sessão via cookie httpOnly.** O JWT fica num cookie inacessível ao JavaScript, mitigando roubo de token por XSS.
- **Validação em duas camadas.** Zod valida a entrada no back-end (segurança) e o front-end valida antes de enviar (experiência do usuário).
- **Proxy da IA no servidor.** A chave da API nunca chega ao navegador — a chamada ao Gemini sai de uma rota do servidor.

---

## 📁 Estrutura

```
app/
├── (auth)/          # telas públicas (login, cadastro)
├── (app)/           # telas autenticadas (treino, relatório) + layout com navbar
│   └── ...
├── api/             # rotas de back-end (route handlers)
components/
├── ui/              # componentes shadcn/ui
lib/                 # models, conexão com o banco, helpers
schema.sql           # estrutura do banco
docker-compose.yml   # orquestração app + MySQL
Dockerfile
```

---

## 🗺️ Próximos passos

- **Modo adaptativo:** gerar perguntas focadas nas categorias que o usuário mais erra, lendo o histórico de acertos.
- **Deploy** da aplicação.

---

_Projeto desenvolvido como estudo de desenvolvimento full-stack._
