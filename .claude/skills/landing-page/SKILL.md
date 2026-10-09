---
name: landing-page
description: Como planejar e construir a landing page do projeto (seções, texto, hierarquia, SEO e a decisão sobre a rota "/"). Use ao criar ou revisar a landing page ou qualquer página pública de apresentação do produto.
---

# Landing page

A landing é a porta de entrada pública. Em poucos segundos ela precisa responder: o que é isso, para quem é, por que vale tentar e onde clicar. Ela deve parecer a mesma marca do app (ver skill `design-system`), com mais respiro e títulos maiores.

## Antes de escrever código

1. Leia o `README.md` para saber o que o produto faz de verdade.
2. Resolva a rota (seção abaixo) com o dono do projeto.
3. Apresente o plano: lista de seções, o que cada uma comunica, o texto proposto e os componentes reutilizados. Espere o ok.

## A rota `/`

Hoje `app/page.tsx` não é uma tela: é um Client Component que chama `/api/me` e redireciona (logado para `/treino`, deslogado para `/login`). Colocar a landing ali muda o comportamento do app, e isso é decisão de lógica. Apresente as opções e espere a escolha:

- **Landing em `/` para todo mundo**, com botões para `/login`. Mais simples; quem já está logado vê a landing e clica para entrar.
- **Landing em `/` só para deslogado**, mantendo o redirecionamento de quem está logado. Melhor experiência, mas exige mexer na lógica de sessão (trabalho dele, não seu).
- **Landing em outra rota** (por exemplo `/sobre`), sem tocar em `/`. Não muda nada, mas a landing deixa de ser a primeira coisa que se vê.

Nunca apague o redirecionamento por conta própria.

## Estrutura recomendada

Use só as seções que tiverem conteúdo real. Menos seções boas valem mais que muitas vazias.

1. **Header**: marca à esquerda, `Entrar` (outline) e `Começar` (primary) à direita. Mesmo estilo da `Navbar` do app.
2. **Hero**: um `h1` que diz o benefício, um parágrafo curto que diz como, um botão principal e, no máximo, um secundário. Ao lado ou abaixo, um print real do app ou uma composição com os próprios componentes.
3. **Como funciona**: três passos numerados (escolher nível, responder o quiz, receber a explicação), usando o badge numerado do app.
4. **O que você treina / recursos**: grade de cartões com ícone, título e uma frase. Só o que existe.
5. **Prova visual**: prints das telas (`docs/`) com legenda curta.
6. **Chamada final**: repete a ação principal em um bloco destacado (`bg-accent` ou `bg-card`).
7. **Footer**: marca, link do GitHub, crédito do autor.

## Texto

- Escreva para quem quer treinar inglês, não para recrutador. Benefício antes de tecnologia. (Uma seção curta "Como foi construído", com link para o repositório, é bem-vinda no fim, porque o projeto também é portfólio.)
- Frases curtas, voz ativa, "você". Sem jargão de marketing ("revolucione", "potencialize", "a melhor plataforma").
- O botão diz o que acontece: "Começar a treinar", "Criar conta grátis", "Entrar".
- **Não invente conteúdo.** Sem depoimentos, número de usuários, notas, logos de empresas, preços ou funcionalidades que não existem. Todo texto proposto é sugestão para o dono validar; marque como tal.
- Use o nome do produto que está no código e no README. Se estiverem diferentes, pergunte qual vale.

## Layout

- Mobile primeiro (~375px). O hero empilha no celular e vira duas colunas em `lg:`.
- Largura do conteúdo: `mx-auto max-w-5xl px-4 sm:px-8` (o app usa `max-w-3xl`; a landing pode ser mais larga).
- Respiro entre seções: `py-16 sm:py-24`. Alterne o fundo (`bg-background` e `bg-card`) para separar seções sem usar linhas.
- Título do hero maior que o das telas internas: `font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl`. Títulos de seção: `text-3xl sm:text-4xl`. Texto do hero: `text-lg text-muted-foreground`, com no máximo ~60 caracteres por linha (`max-w-xl`).
- Grades: `grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3`.
- Um único botão laranja por dobra da tela.

## Implementação

- Server Component: nada de `"use client"` na página. Interatividade pequena (menu mobile) vai num componente isolado.
- Uma seção por componente, em arquivos pequenos, numa pasta própria da landing. Sem lógica de negócio dentro deles.
- Navegação interna com `next/link`. Imagens com `next/image`, com `width`, `height` e `alt` descritivo; a imagem do hero com `priority`.
- HTML semântico: `header`, `main`, uma `section` por bloco com seu `h2`, `footer`. Um único `h1`.
- `metadata` da página com `title` e `description` próprios. O projeto já tem imagem de Open Graph em `app/opengraph-image.png`.
- Sem dependência nova (animação, carrossel, ícones) sem o ok do dono.

## Antes de entregar

- Rode `npm run lint` e `npx tsc --noEmit`.
- Passe pelo checklist da skill `revisao-visual`.
- Liste o que precisa ser conferido no navegador, no celular e no desktop.
