@AGENTS.md


# CLAUDE.md


## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Projeto
App Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + MySQL.
Rodar com `npm run dev` (porta 3000). Não criar outro servidor.

## Escopo de mudanças visuais — REGRA MAIS IMPORTANTE
- Ao trabalhar em layout/visual, altere APENAS `className`, estrutura de JSX
  e `app/globals.css`.
- NÃO altere: funções, handlers, states, useEffect, fetch/apiFetch, tipos
  (`types.ts`), props de componentes, rotas em `app/api/`, nada em `lib/`.
- Se uma mudança visual exigir mexer em lógica, PARE e pergunte antes.
- Trabalhe em UMA tela por vez. Não altere arquivos que não foram pedidos.
- Nunca rode `git reset`, `git checkout`, `git restore` ou `git stash`.
  Se precisar desfazer algo, avise e deixe eu decidir.
- Não instale dependências novas sem perguntar.

## Design system
- Cores, fontes e raios definidos como variáveis em `app/globals.css`
  (padrão shadcn). Usar sempre as variáveis, nunca cores soltas.
- Usar os componentes existentes em `components/ui/` (shadcn) em vez de
  criar do zero.
- É um app de estudo: priorizar legibilidade e foco. Sem efeitos que
  distraiam durante o quiz.

## Guardrails visuais
- Não usar a paleta padrão do Tailwind (indigo-500, blue-600 etc.) como cor
  principal. Definir a cor da marca nas variáveis.
- Fonte de título diferente da fonte de texto. Títulos grandes com
  tracking justo (-0.03em), texto com line-height ~1.7.
- Sombras suaves com leve tom de cor, não `shadow-md` puro.
- Animar só `transform` e `opacity`. Nunca `transition-all`.
- Todo elemento clicável com estado de hover, focus-visible e active.
- Espaçamento consistente (escala fixa), não valores aleatórios.
- Mobile-first e responsivo.

## Referências
- Se eu mandar imagem de referência, siga layout, espaçamento, tipografia e
  cores dela. Não adicione seções ou funcionalidades que não existem.