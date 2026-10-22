---
name: design-system
description: Padrão visual do projeto (cores, tipografia, formas, componentes e receitas de className já usadas nas telas). Use antes de criar ou alterar qualquer interface, para a tela nova ficar igual às que já existem.
---

# Design system do projeto

Este resumo foi tirado do código e pode envelhecer. A fonte da verdade é `app/globals.css`, `components/ui/` e as telas prontas. Se houver diferença, vale o código, e este arquivo deve ser atualizado.

## Clima

Claro, quente e amigável, no estilo de app gamificado de estudo. Fundo creme, cartões brancos, texto quase preto e laranja como cor de marca. Formas bem arredondadas, sem sombra, com movimento curto e discreto.

## Cores

Use sempre a classe semântica. Nunca hex, nunca cor crua do Tailwind (`text-red-500`), nunca `style` inline com cor.

| Token | Classes | Uso |
|---|---|---|
| `background` | `bg-background` | fundo da página (creme) |
| `card` | `bg-card` | cartões, navbar, painéis (branco) |
| `foreground` | `text-foreground` | texto principal |
| `muted-foreground` | `text-muted-foreground` | subtítulos, legendas, metadados |
| `primary` | `bg-primary`, `text-primary` | ação principal e destaques pontuais (laranja) |
| `primary-foreground` | `text-primary-foreground` | texto sobre laranja |
| `accent` | `bg-accent` | fundo suave alaranjado para destacar um bloco |
| `secondary`, `muted` | `bg-secondary`, `bg-muted` | fundos neutros, hover |
| `border` | `border-border` | bordas e divisórias |
| `success` | `bg-success`, `text-success` | acerto |
| `destructive` | `text-destructive`, `bg-destructive/10` | erro |
| `warning` | `bg-warning` | aviso |

Regras:

- O laranja é escasso: uma ação principal por seção e, no máximo, um destaque (uma palavra do título, um número, um ícone).
- Texto branco sobre laranja só em tamanho grande ou em bold, por causa do contraste.
- O bloco `.dark` do `globals.css` é o padrão do shadcn e não foi desenhado. Não projete para ele.

## Tipografia

- Títulos: `font-heading` (Fredoka, pesos 600 e 700 carregados).
- Texto: fonte padrão (Nunito, pesos 400, 600 e 700 carregados).
- Não use outros pesos (`font-medium` em Fredoka, `font-light`, `font-extrabold`): eles não foram carregados e o navegador simula.

Escala em uso:

- Título de tela: `font-heading text-3xl font-bold tracking-tight text-foreground`
- Título de bloco: `font-heading text-lg font-bold text-foreground` (ou `font-semibold`)
- Número em destaque: `font-heading text-4xl font-bold text-primary`
- Subtítulo: `text-sm text-muted-foreground` ou `text-base text-muted-foreground`
- Rótulo: `text-sm font-semibold text-foreground`
- Legenda: `text-xs font-medium text-muted-foreground`

## Formas e superfícies

- Raio base de 1rem. Cartões em `rounded-2xl` ou `rounded-3xl`; botões e pílulas em `rounded-full`.
- Cartão: componente `Card` (contorno `ring-1 ring-foreground/10`, sem sombra). Painel simples sem `Card`: `rounded-2xl border border-border bg-card p-3`.
- Sem sombra, gradiente ou blur. A profundidade vem da borda inferior do botão.

## Componentes (`@/components/ui`)

- `Button`: visual "3D" com borda inferior grossa que afunda no clique. Variantes `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`; tamanhos `xs`, `sm`, `default`, `lg`, `icon`. Ação principal: `size="lg" className="w-full rounded-full"`. Ação secundária: `variant="outline"`.
- `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`.
- `Input`, `Select`, `Dialog`.
- Ícones: só `lucide-react`. Tamanhos usados: `size-4` dentro de botão, `size-6` na navbar, `size-10` em estado vazio ou de erro.

Não recrie esses componentes na mão. Para um link com aparência de botão, veja como o `Button` atual aceita composição antes de inventar uma classe nova.

## Receitas já usadas nas telas

- Página centralizada: `min-h-screen bg-background flex items-center justify-center p-4`
- Página de conteúdo: `min-h-screen bg-background p-4 sm:p-6` com `mx-auto flex max-w-3xl flex-col gap-6`
- Navbar: `border-b border-border bg-card`, conteúdo em `mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-8`
- Marca: `font-heading text-lg font-bold text-foreground sm:text-xl`, com parte do nome em `<span className="text-primary">`
- Link de navegação: `rounded-full px-4 py-2 text-sm font-semibold text-foreground transition-[transform,opacity] duration-150 ease-out hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px`
- Badge numerado: `flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-primary-foreground`
- Pílula de status: `rounded-full px-2.5 py-1 text-sm font-bold`
- Cartão clicável: `transition-transform duration-150 ease-out group-hover:-translate-y-1 group-active:translate-y-0`
- Estado vazio ou de erro: `flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-16 text-center`, com ícone `size-10`, título `font-heading text-lg font-semibold` e texto `text-sm text-muted-foreground`
- Mensagem de erro em formulário: `text-destructive text-sm font-medium text-center`

## Movimento e foco

- Transição: `duration-150 ease-out`, só em `transform` e `opacity`.
- Foco: `outline-none focus-visible:ring-3 focus-visible:ring-ring/50`.
- Clique: `active:translate-y-px` em links; o `Button` já afunda sozinho.

## Espaçamento

- Lateral da página: `px-4 sm:px-8` (ou `p-4 sm:p-6`).
- Entre blocos: `gap-6`. Dentro de um bloco: `gap-3` ou `gap-4`.
- Altura mínima de toque: `h-11` (44px). Ações principais em `h-12` (`size="lg"`).

## Quando o padrão não cobre

Se a tela precisar de algo que não existe (uma cor, um tamanho de título maior, uma variante de botão), proponha como token em `globals.css` ou variante no componente, explique o porquê e espere o ok. Não escreva o valor solto na tela. Depois de aprovado, atualize este arquivo.
