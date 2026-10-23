---
name: revisao-visual
description: Checklist para revisar uma tela (consistência com o design system, hierarquia, responsividade, acessibilidade e acabamento). Use ao criticar um layout, antes de entregar uma tela nova ou quando pedirem feedback visual.
---

# Revisão visual

Leia o código da tela inteira antes de opinar. Você não enxerga a tela renderizada: revise pelo código e diga claramente o que só dá para confirmar no navegador.

Relate em ordem de impacto e, para cada achado, indique arquivo, trecho e a correção concreta. Separe **problema real** (quebra uso, leitura ou acessibilidade), **inconsistência** (foge do padrão do projeto) e **gosto pessoal**. Se a tela está boa, diga que está boa.

## 1. Hierarquia e clareza

- Dá para saber em poucos segundos o que a tela é e qual é a ação principal?
- Existe um único `h1` e os headings descem em ordem (`h1`, `h2`, `h3`)?
- Há só uma ação principal (laranja) por seção? As demais são `outline` ou `ghost`?
- Os tamanhos de texto seguem a escala do projeto, ou há tamanhos intermediários soltos?

## 2. Consistência com o design system

Confira contra a skill `design-system`.

- Alguma cor fora dos tokens? Procure hex, `style=` com cor e cores cruas do Tailwind:
  `grep -rnE "#[0-9a-fA-F]{3,8}\b|(text|bg|border)-(red|orange|green|blue|gray|slate|zinc|neutral|yellow)-[0-9]" app components`
- Fontes: títulos em `font-heading`? Algum peso não carregado?
- Botões, cartões e inputs vêm de `@/components/ui`, ou foram recriados na mão?
- Raios, bordas e espaçamentos batem com as telas existentes?
- Apareceu sombra, gradiente, blur ou animação que não existe no resto do app?

## 3. Responsividade

- Funciona em 375px sem scroll horizontal? Procure larguras fixas (`w-[...]`, `min-w-`) e textos longos sem quebra.
- As grades empilham no celular (`grid-cols-1`) e abrem em `sm:` / `lg:`?
- Áreas de toque com pelo menos 44px (`h-11`)?
- Em tela larga, o conteúdo tem `max-w-*` e a linha de texto não passa de ~70 caracteres?
- Imagens têm dimensões definidas, para o layout não pular ao carregar?

## 4. Acessibilidade

- HTML semântico (`header`, `nav`, `main`, `section`, `footer`, `button` para ação, `a`/`Link` para navegação)?
- Toda imagem tem `alt` (vazio se for decorativa)? Botão só com ícone tem `aria-label`?
- Campos de formulário têm `label` associado, e não só `placeholder`?
- Foco visível em tudo que é interativo, e ordem de tabulação igual à ordem visual?
- Contraste: texto `muted-foreground` sobre fundo colorido e texto branco pequeno sobre laranja são os suspeitos de sempre.
- Informação não depende só de cor (acerto e erro têm também ícone ou texto)?

## 5. Estados

- Hover, foco, active e disabled em cada elemento interativo.
- Carregando, vazio e erro, quando a tela busca dados.
- Texto muito longo e lista muito grande: o layout aguenta?

## 6. Acabamento

- Alinhamentos: os blocos compartilham as mesmas bordas laterais?
- Espaçamento com ritmo consistente (mesmos `gap` para o mesmo tipo de relação)?
- Texto sem erro de português, com capitalização e pontuação consistentes entre botões e títulos.
- Nada de conteúdo inventado ou de exemplo esquecido (lorem ipsum, números fictícios).

## Verificação

- `npm run lint` e `npx tsc --noEmit` passam?
- Liste, ao final, o que precisa ser visto no navegador (celular e desktop), porque não dá para confirmar pelo código.
