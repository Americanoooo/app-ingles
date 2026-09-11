# Revisão técnica — App Inglês (portfólio)

Revisão como se fosse code review de dev sênior para candidato júnior, focada no que pesa numa avaliação de entrevista/code review. Diferencio bug real de preferência de estilo e não listo nada que não tenha visto no código.

## Resumo executivo

O projeto está **sólido para portfólio de primeira vaga**. A arquitetura é coerente com Next.js (App Router), a separação model/route é limpa, a autenticação via cookie httpOnly + `proxy.ts` está bem feita, e o SQL é 100% parametrizado. O nível de raciocínio por trás de decisões como a transação atômica, a validação lazy de env vars e a separação Server/Client Component é acima da média para quem está buscando a primeira vaga — isso vai aparecer numa conversa técnica.

Os pontos que realmente merecem atenção antes de publicar são poucos e rápidos de resolver. Nada aqui é "reescrever o projeto" — é polimento pontual e, principalmente, **saber articular** um trade-off que você já tomou conscientemente.

### Prioridade 1 — vale corrigir antes de divulgar (rápido, alto impacto em entrevista)

1. `git status` mostra o repositório inteiro como modificado (problema de fim de linha CRLF/LF) — se um entrevistador pedir pra ver o histórico do repo, isso causa má impressão.
2. Existe um arquivo solto na raiz do projeto chamado `et --hard 0a4b8a2de337691b77767283f690fe0131fec8d4` (não versionado, mas está no disco).
3. `catch{}` silenciosos no frontend em 3 lugares — usuário não recebe feedback nenhum se uma requisição falhar.
4. `dificuldade` não é validada por range em `/api/responder` (é em `/api/gerar-perguntas`, mas não no responder).

### Prioridade 2 — recomendado, melhora a impressão em code review

5. A correção do quiz confia no `respostaCerta` que o **próprio cliente reenvia** — vale entender e saber explicar esse mecanismo (detalhe abaixo, seção 3 e 8).
6. Falha de autenticação dentro das rotas cai num `catch` genérico que devolve 500 em vez de 401 (hoje o `proxy.ts` cobre isso antes, mas é frágil).
7. `jsonwebtoken` é dependência morta no `package.json` (vocês migraram pra `jose`, mas o pacote antigo ficou instalado, sem uso).
8. Tipos duplicados (`Pergunta`/`Quiz`) reescritos em 3 arquivos do frontend em vez de um `types.ts` compartilhado.
9. Zero testes automatizados.

### Pontos fortes que vale destacar numa entrevista

- Nenhum uso de `any` em todo o projeto; uso correto de `unknown` com narrowing nos `catch`.
- 100% das queries MySQL parametrizadas — sem brecha de SQL injection.
- Transação atômica bem implementada (e testada com rollback forçado, segundo o histórico).
- Autorização por dono (anti-IDOR) correta em `/api/relatorio/[id]` — filtra por `quiz.usuario_id` do token, não confia em só estar logado.
- Anti user-enumeration no login (mesma resposta pra "não existe" e "senha errada").
- `use client` empurrado para os componentes-folha (`Navbar`, `AuthGuard`) em vez do layout inteiro — a maioria dos juniores erra isso.
- Uso de status `503` para IA indisponível em `/api/gerar-perguntas` é uma escolha de nível sênior — poucos juniores diferenciam "erro meu" de "erro do provedor externo".
- `proxy.ts` (guarda global) **+** checagem redundante dentro de cada rota é literalmente o padrão que a própria documentação do Next.js recomenda para esse recurso — vocês já fazem "defesa em profundidade" sem que eu precisasse sugerir.

---

## 1. Arquitetura

A estrutura de pastas faz sentido e é idiomática de App Router: grupos de rota `(app)` e `(auth)` separando telas autenticadas de públicas, `api/` para os route handlers, `lib/` para a camada de dados e utilitários, `components/ui` para os componentes shadcn. Não vi responsabilidade misturada — os route handlers ficam finos (validam, chamam o model, formatam resposta) e a lógica de banco fica isolada em `lib/*.model.ts`. Isso é exatamente o que um revisor sênior procura: saber onde cada coisa mora sem precisar perguntar.

Não há abstração desnecessária. Vocês evitaram, por exemplo, criar uma camada de "repository" genérica ou um ORM para um projeto desse tamanho — decisão correta, teria sido complexidade sem benefício.

Dois pontos de higiene, não de arquitetura:

- **`git status` mostra o repo inteiro como "modified"**, mesmo sem mudanças de conteúdo reais — comparei um diff (`login/route.ts`, `db.ts`) e é troca de fim de linha linha a linha (CRLF↔LF), não conteúdo. `core.autocrlf` não está configurado. Isso é comum em Windows sem um `.gitattributes`, mas se você abrir o projeto numa entrevista e rodar `git status`/`git diff`, vai parecer que "tudo mudou" sem explicação. Vale adicionar um `.gitattributes` com `* text=auto eol=lf` (ou configurar `core.autocrlf=true` localmente) e recommitar normalizado.
- Existe um arquivo na raiz chamado `et --hard 0a4b8a2de337691b77767283f690fe0131fec8d4` — parece sobra de um comando `git reset --hard <hash>` que teve a saída redirecionada para um arquivo por engano. Não está versionado (`git status` mostra `??`), então não vai pro GitHub, mas está no disco — vale apagar antes de continuar trabalhando pra não commitar por acidente.

Fora isso, a arquitetura é coerente e nada parece improvisado — as decisões (proxy + guarda por rota, model layer com injeção do `db`/`conn` pra suportar transação) têm justificativa técnica visível no próprio código, não são "porque sim".

## 2. TypeScript

Ponto forte real: **não há nenhum uso de `any`** no projeto (confirmei com busca no código). Os `catch` usam `unknown` e fazem narrowing correto (`err instanceof Error`, `'code' in err`). Isso é incomum em portfólio júnior e vale mencionar ativamente numa entrevista.

Achados:

- **As interfaces `Pergunta`/`Quiz` são reescritas manualmente em pelo menos 3 arquivos** (`app/(app)/treino/page.tsx`, `app/(app)/relatorio/[id]/page.tsx`, `app/components/FeedbackButton.tsx`), cada uma com um subconjunto de campos ligeiramente diferente. Funciona, mas é o tipo de duplicação que gera bug de manutenção (você ajusta um contrato de API e esquece de atualizar uma das três). Um `types.ts` (ou `types/quiz.ts`) compartilhado entre backend e frontend resolveria isso — não é urgente, mas é uma melhoria barata e visível em code review.
- **Caso real de tipo "mentindo" sobre o dado**: em `lib/relatorioCompleto.model.ts`, o campo `opcoes` é devolvido direto do MySQL (`opcoes: pergunta.opcoes`) sem `JSON.parse` — no banco ele é uma `VARCHAR` com uma string JSON (`JSON.stringify` foi aplicado na hora de salvar, em `pergunta.model.ts`). A interface do frontend declara `opcoes: string[]`, mas o valor que realmente chega ali é uma `string`. Hoje isso não quebra porque a tela de revisão (`relatorio/[id]/page.tsx`) nunca usa esse campo — mas é exatamente o tipo de coisa que o TypeScript **deveria** ter pego e não pega, porque o retorno do `mysql2` (`RowDataPacket`) não é validado, só tipado por `as`/genérico. É um ótimo exemplo pra responder a pergunta "onde o TS poderia ter detectado um erro que só aparece em runtime" numa entrevista.
- `categoria` é tipada como `string` solto no frontend (`treino/page.tsx`, etc.), enquanto no backend é um enum fechado (`"preposicao" | "tempo_verbal" | "contexto"`, tanto no Zod quanto no `ENUM` do MySQL). Dá pra apertar o tipo no frontend também — não é um bug (o `.replace(/_/g, " ")` funciona com qualquer string), só uma oportunidade de o compilador te proteger mais.
- Não encontrei cast (`as`) escondendo erro, nem `!` (non-null assertion) sendo abusado. Os `interface` fazem sentido com os dados reais na maior parte do código.

## 3. Backend / API

Os endpoints fazem sentido e os métodos HTTP estão corretos (POST para mutação/geração, GET para leitura). Os status HTTP são bem escolhidos na maior parte — 201 para criação, 400 para body inválido, 401 para não autenticado, 409 para email duplicado, e o uso de **503 especificamente para a IA estar indisponível** em `/api/gerar-perguntas` (`lib/respostas.ts: IAResponseError`) é um detalhe de nível sênior: distingue "seu request está errado" de "o provedor externo falhou".

Achados:

- **Inconsistência de status em falha de autenticação.** Em `/api/responder`, `/api/relatorio` e `/api/relatorio/[id]`, a chamada a `pegarUsuarioId()` (que lança erro se não há sessão válida) está dentro do **mesmo** `try/catch` que o resto da lógica da rota — então, se ela falhar, cai no `catch` genérico e devolve **500**, quando semanticamente deveria ser **401**. Na prática isso não te morde hoje porque o `proxy.ts` intercepta a requisição *antes* dela chegar no handler e já devolve 401 — mas se algum dia o `matcher` do proxy for ajustado e uma dessas rotas escapar da cobertura (a própria documentação do Next.js alerta exatamente pra esse risco: "a refactor that moves a route can silently remove Proxy coverage"), o comportamento observável muda de 401 pra 500 sem ninguém perceber. Separar a chamada de auth num `try/catch` próprio (como estava documentado que vocês fizeram em algum momento) resolve e também é mais fácil de justificar numa entrevista ("por que 500 pra usuário deslogado?" é uma pergunta clássica).
- **`dificuldade` não tem validação de range em `/api/responder`.** O schema é `dificuldade: z.number().int()`, sem `.min(1).max(3)` — diferente de `/api/gerar-perguntas`, que valida `min(1).max(3)`. Como o valor vai direto pra coluna `quiz.dificuldade` (sem `CHECK` no schema.sql também), um body manipulado poderia gravar `dificuldade: -50` ou `9999`, que quebraria a exibição no relatório (`converterDificuldade()` no frontend não trata nenhum valor fora de 1/2/3 e retorna `undefined`, mostrando célula em branco). É uma validação faltando de verdade, rápida de adicionar (só repetir o `.min(1).max(3)` que já existe no outro endpoint).
- **O ponto mais importante pra entender e saber explicar**: o `/api/responder` corrige a prova comparando `respostaCerta === respostaUsuario`, e os dois vêm dentro do mesmo objeto **reenviado pelo cliente** no body — porque o quiz nunca é persistido no momento da geração (decisão consciente de vocês pro v1). Isso quer dizer que a "correção no servidor" é real no sentido de que o cliente não pode mandar `acertou: true` diretamente (o campo é derivado no servidor) — **mas** o servidor não tem nenhuma fonte de verdade independente pra saber qual era a resposta certa: ele confia no `respostaCerta` que o próprio cliente devolveu. Na prática, um usuário abrindo o DevTools poderia editar o body de `/api/responder` e mandar `respostaUsuario` igual a `respostaCerta` em toda pergunta, garantindo 10/10 sempre. O README já documenta que o gabarito "trafega pelo front (espiável no F12)" como simplificação aceita do v1 — o que eu acrescentaria é que o risco vai um pouco além de só "ser espiável": é que a integridade da correção inteira depende de um dado que o cliente controla. Pra fechar isso de verdade no v2, o quiz gerado precisaria ficar guardado no servidor (banco, cache, ou até a sessão) no momento da geração, e o `/api/responder` buscaria o gabarito por referência (`quizId`) em vez de aceitá-lo no body. Não acho que isso bloqueie o portfólio — é um trade-off de v1 perfeitamente razoável pra um projeto de estudo — mas é exatamente o tipo de pergunta que aparece numa entrevista técnica ("o que acontece se eu interceptar essa requisição?"), então vale ter a resposta pronta e articulada, e é um ótimo item pra colocar explicitamente no "Próximos passos" do README.
- Pequena inconsistência de robustez: `/api/feedback` valida o body com `if(!enunciado || !respostaUsuario || ...)` manual, enquanto o resto do projeto usa Zod. Funciona, mas quebra o padrão — não é um bug, é só destoante.
- Os contratos de resposta são consistentes: todo erro retorna `{mensagem: string}` (via `lib/respostas.ts`) e o `apiFetch` do frontend lê exatamente essa chave — isso é o tipo de consistência de contrato que muita gente júnior não mantém.

## 4. Banco de dados / MySQL

O modelo de dados faz sentido, e a decisão de não usar tabela de junção entre `quiz` e `pergunta` (porque a pergunta é gerada por quiz, não compartilhada) está correta e bem justificada — é o tipo de raciocínio de modelagem que interviewer gosta de ouvir explicado.

- **Sem SQL injection**: toda query usa placeholder (`?`) com `mysql2`, inclusive dentro do loop de inserção de perguntas. Não achei nenhuma concatenação de string em query.
- **Índices**: não há índice explícito além das chaves, mas as consultas filtram exatamente pelas colunas de FK (`usuario_id`, `quiz_id`), que o InnoDB já indexa automaticamente por serem foreign key — então, para o padrão de consulta atual, não falta índice.
- **Transação**: usada no único lugar que precisa (gravar `quiz` + `perguntas` atomicamente), com `beginTransaction`/`commit`/`rollback`/`release` corretos e a conexão (`conn`) sendo reaproveitada em todas as queries da transação (em vez do `pool`, erro comum).
- **Foreign keys sem `ON DELETE` explícito** — hoje isso não importa porque não existe nenhuma operação de delete no app. Se algum dia vocês adicionarem "excluir minha conta" ou "excluir quiz", o comportamento padrão do InnoDB (`RESTRICT`) vai bloquear a exclusão de um `usuario` que tenha quizzes. Não é bug agora, é só um lembrete pra quando essa feature nascer.
- `opcoes` como `VARCHAR(1000)` com `JSON.stringify` (em vez de coluna `JSON` nativa do MySQL 8) foi uma decisão consciente registrada por vocês — é uma escolha válida pro escopo atual (evita ter que lidar com funções JSON do MySQL), só vale saber articular o trade-off (perde validação de estrutura no insert e funções de query sobre o JSON).
- `categoria ENUM(...)` reforça no banco a mesma validação que já existe no Zod — boa prática de "defesa em profundidade" nos dados, mas enums do MySQL exigem `ALTER TABLE` pra adicionar uma categoria nova no futuro; trade-off razoável pro tamanho atual do projeto.

## 5. Autenticação e autorização

Essa parte está bem feita e é provavelmente o ponto mais forte do projeto pra citar em entrevista.

- **Autenticação**: sessão via JWT assinado (`jose`, HS256) guardado num cookie `httpOnly`, `secure` em produção, `sameSite: 'lax'`, expiração de 7 dias. `lib/session.ts` centraliza `encrypt`/`decrypt`/`createSession`. Corretíssimo migrar de JWT-no-localStorage pra cookie httpOnly (o localStorage é acessível via JS, logo vulnerável a roubo via XSS; o cookie httpOnly não é).
- **Obtenção do usuário autenticado**: `pegarUsuarioId()` (server, via `next/headers`) e `pegarUsuarioIdProxy()` (dentro do `proxy.ts`, via `NextRequest.cookies`) fazem exatamente a mesma verificação, só mudando de onde leem o cookie — dá pra unificar numa função só que recebe o valor do cookie já extraído, reduzindo duplicação (não é bug, é oportunidade de DRY).
- **Diferença entre autenticado e autorizado**: aqui está correta. `/api/relatorio` e `/api/relatorio/[id]` não fazem só "usuário está logado" — filtram explicitamente por `usuario_id`/`quiz.usuario_id` do token (`lib/relatorio.model.ts`, `lib/relatorioCompleto.model.ts`). Testei mentalmente o cenário de IDOR: trocar o `id` na URL de `/relatorio/5` pra `/relatorio/3` de outro usuário — a query faz `JOIN quiz ON pergunta.quiz_id = quiz.id WHERE pergunta.quiz_id = ? AND quiz.usuario_id = ?`, então retorna vazio (404) em vez de vazar dado de outro usuário. Isso é exatamente o padrão certo pra evitar IDOR/BOLA, e vocês retornam o **mesmo** 404 tanto pra "não existe" quanto "existe mas não é seu" — evita até enumeração de IDs.
- **Login sem enumeração de usuário**: e-mail inexistente e senha errada devolvem o mesmo 401 genérico — protege contra descobrir quais e-mails estão cadastrados.
- **Cookie/token não é suficiente sozinho pra acessar dado de outro usuário** — confirmado: em nenhuma rota vi o `usuario_id` vindo do body/query em vez do token (isso era um hardcode antigo, já removido).
- **Logout**: apaga o cookie no servidor (`cookieStore.delete('session')`), que é o jeito certo — como o cookie é httpOnly, o frontend não teria como limpá-lo sozinho.
- Único ponto de atenção real: falha de auth cai como 500 em vez de 401 dentro das rotas quando o `pegarUsuarioId()` lança (ver seção 3) — hoje mitigado pelo `proxy.ts`, mas vale corrigir pra não depender só de uma camada.
- Não há rate limiting em `/api/login` (força bruta de senha teoricamente possível) nem em `/api/gerar-perguntas`/`/api/feedback` (abuso da cota gratuita do Gemini). Isso não é esperado num portfólio de primeira vaga, mas é uma resposta pronta pra ter se perguntarem "o que você faria diferente em produção".

## 6. Next.js

Vocês entenderam bem a diferença entre Server e Client Component — não vi Client Component desnecessário. `app/layout.tsx` e `app/(app)/layout.tsx` são Server Components; `'use client'` está só onde precisa de hook/estado/evento (`Navbar`, `AuthGuard`, as páginas de treino/relatório/login, `FeedbackButton`). Empurrar o `'use client'` pro componente-folha (`Navbar`) em vez do layout inteiro é exatamente o padrão recomendado, e é comum júnior errar isso.

O uso de Route Handlers (em vez de Server Actions) pra tudo é uma escolha coerente e intencional (documentada no próprio README) — não é "certo ou errado", é uma arquitetura válida de API JSON servindo um frontend orientado a client-side state.

Dois pontos que não são bugs, mas são formas mais "nativas" do App Router de resolver o mesmo problema, caso queiram polir pro v2:

- `app/page.tsx` é um Client Component que faz `apiFetch('/api/me')` no `useEffect` só pra decidir se redireciona pra `/treino` ou `/login`. Como é a rota raiz, dá pra fazer isso num Server Component lendo o cookie diretamente (`pegarUsuarioId()` já existe) e chamando `redirect()` do `next/navigation` — evita o round-trip de rede e o flash de tela em branco antes do redirect.
- `AuthGuard` faz a mesma coisa em client: chama `/api/me` no mount pra decidir se deixa renderizar `{children}` ou redireciona. Como `app/(app)/layout.tsx` já é Server Component, a checagem de sessão poderia acontecer ali direto (server-side, sem round-trip e sem o "flash" de tela vazia enquanto `ok` é `false`). Importante deixar claro: isso **não é uma falha de segurança** — o dado de verdade (quizzes, relatórios) continua protegido no backend independente do `AuthGuard`; é só uma otimização de UX/arquitetura, não um requisito.
- `export const dynamic = "force-dynamic"` está em quase todas as rotas, inclusive as `POST` (que já não são cacheáveis/otimizáveis estaticamente por natureza — então ali é redundante, sem efeito prático). Nas rotas `GET` (`/api/relatorio`, `/api/relatorio/[id]`) esse flag é, sim, necessário — evita que o Next sirva uma resposta em cache compartilhada entre usuários diferentes. Então: mantenham nas rotas GET, podem tirar das POST sem mudar nada (cosmético).

Não vi uso de `middleware.ts` — vocês usam `proxy.ts`, que é a convenção atual do Next 16 (o `middleware` foi renomeado; confirmei na própria documentação empacotada com a versão instalada do Next no projeto). É a escolha certa pra rodar em runtime Node (necessário porque a verificação de JWT com `jose` funciona bem em Node) e o padrão de matcher com negative lookahead (`/api/((?!login|cadastrar|me).*)`) está correto.

## 7. Frontend

O fluxo é coerente: má quina de estados (`'setup' | 'quiz' | 'resultado'`) em vez de múltiplos booleanos é uma boa decisão, evita estado impossível tipo "carregando e mostrando resultado ao mesmo tempo".

Achados reais:

- **`catch{}` vazio em 3 lugares** — `handleEnviar` (`treino/page.tsx`), `buscarQuiz` (`relatorio/page.tsx`) e `buscarQuizUnico` (`relatorio/[id]/page.tsx`). Se a requisição falhar (rede, 500, sessão expirada no meio do caminho), nada acontece visualmente: em `handleEnviar`, o usuário clica "Enviar" e a tela simplesmente não avança, sem nenhuma mensagem — parece que o app travou. Em `buscarQuiz`/`buscarQuizUnico`, o `finally` ainda desliga o `carregando`, então o relatório mostra "Nenhum quiz cadastrado" mesmo quando o erro real foi, por exemplo, o servidor fora do ar — um estado de erro real fica disfarçado de estado vazio. Vale, no mínimo, guardar a mensagem de erro num state e mostrar algo tipo "Não foi possível carregar, tente novamente".
- **Bug real e testável: pressionar Enter no formulário de login não loga.** O `<form>` em `app/(auth)/login/page.tsx` não tem `onSubmit` — o clique no botão "Entrar" funciona porque o `onClick={handleLogin}` chama `e.preventDefault()` a tempo de cancelar o submit nativo do botão, mas isso só cobre o clique. Ao digitar a senha e apertar Enter, o navegador dispara o submit nativo do formulário (não há handler pra interceptar), o que recarrega a página e descarta o que foi digitado. É um teste de 5 segundos (`Tab, Tab, Enter` no formulário) que qualquer QA ou entrevistador tentaria. Correção é pequena: mover a lógica pra um `onSubmit={handleLogin}` no `<form>` e usar `type="button"` nos botões secundários (alternar entre login/cadastro).
- Não há estado de carregamento/desabilitação nos botões de login/cadastro/enviar quiz — dá pra clicar duas vezes rápido e disparar a requisição em duplicidade (no cadastro, o `UNIQUE` do e-mail evita dado duplicado, mas gera uma segunda tentativa desnecessária; no "Enviar" do quiz, cada envio grava uma linha de `quiz` nova, então dois cliques rápidos poderiam gravar duas tentativas do mesmo quiz). Não é grave, mas é fácil de resolver desabilitando o botão durante o `await`.
- Não vi chamada de API duplicada por bug de efeito (os `useEffect` têm array de dependências corretos).
- Acessibilidade: os campos de `Input` no login usam só `placeholder` como identificação, sem `<label>` associada — quando o campo é preenchido, o placeholder some e não sobra nenhum texto acessível pra leitor de tela. Também não há `autoComplete="email"`/`autoComplete="current-password"`. Não bloqueia funcionalmente, mas é um ponto real de acessibilidade que dá pra corrigir rápido.
- Estados de loading/erro/vazio existem e são bem tratados no fluxo principal (treino, relatório) — o problema é especificamente os 3 `catch` vazios acima, não a ausência geral desses estados.

## 8. Segurança

Resumo direto por categoria pedida:

- **SQL injection**: não encontrei. Todas as queries são parametrizadas.
- **XSS**: React escapa por padrão; não há `dangerouslySetInnerHTML` em nenhum lugar do projeto.
- **CSRF**: cookie de sessão usa `sameSite: 'lax'`, o que já bloqueia o cookie em requisições cross-site de mutação (POST) — abordagem válida e comum para não precisar de token CSRF separado num app same-origin como este.
- **Autenticação**: sólida (cookie httpOnly + JWT assinado). Ver seção 5.
- **Autorização**: correta, com checagem de dono nos recursos sensíveis (ver seção 5, sem IDOR encontrado).
- **Exposição de dados**: o hash da senha (`senha_hash`) é lido do banco em `lib/login.model.ts`, mas só é usado server-side pro `bcrypt.compare` — nunca é incluído em nenhuma resposta JSON. Confirmei isso olhando todas as rotas que usam esse model.
- **Secrets/env**: `JWT_SECRET`, `DB_PASSWORD`, `GEMINI_API_KEY` vêm todos de variáveis de ambiente, `.env` está no `.gitignore` e **não está versionado** (confirmei com `git ls-files`). Nenhum segredo hardcoded no código.
- **Validação de entrada**: presente na maioria dos endpoints via Zod, com a exceção pontual de `/api/feedback` (checagem manual) e o gap de range em `dificuldade` no `/api/responder` (seção 3).
- **Cookies**: configurados corretamente (`httpOnly`, `secure` em produção, `sameSite: lax`).
- **Endpoints sem proteção**: revisei o `matcher` do `proxy.ts` contra a lista de rotas — `/api/login`, `/api/cadastrar` e `/api/me` ficam de fora de propósito (precisam funcionar sem sessão), todo o resto passa pela guarda. Coerente.
- **O ponto que mais merece destaque** é o já descrito na seção 3: a correção do quiz confia no `respostaCerta` reenviado pelo cliente, porque não existe um registro server-side do quiz gerado antes da resposta. Não é uma vulnerabilidade "clássica" de OWASP com nome próprio, é mais uma questão de onde fica a fonte de verdade — mas é o achado de segurança mais substantivo do projeto e vale estar preparado pra falar sobre ele.
- Sem rate limiting em nenhum endpoint (login, geração de quiz, feedback de IA) — acessível a força bruta de senha e a abuso de cota de API paga/gratuita. Acrescentaria como "próximo passo" no README, não como bloqueador.

## 9. Qualidade do código

Não vi função grande demais, nem código duplicado relevante (fora as interfaces já citadas). Nomes são claros e consistentes (português pros termos de domínio — `usuario`, `pergunta`, `quiz` — inglês pros termos técnicos — isso é comum e aceitável em times brasileiros, não é inconsistência). O código **não parece gerado/copiado**: decisões como passar `db: Pool | PoolConnection` como parâmetro pros models pra suportar tanto uso avulso quanto dentro de transação, ou tornar a validação de env "lazy" (`getPool()` só lança erro quando chamada, não no import) especificamente para não quebrar o build, são o tipo de solução que só aparece quando alguém debugou o problema de verdade — isso é visível e conta a seu favor numa entrevista.

Achados pequenos:

- `console.log(err)` em vez de `console.error(err)` em `app/api/cadastrar/route.ts` e `app/api/login/route.ts` — o resto do projeto usa `console.error` para erro. Inconsistência de 2 linhas, fácil de igualar.
- `jsonwebtoken` está no `package.json` mas não é mais importado em lugar nenhum (confirmei com busca) — sobrou da época anterior à migração pra `jose`. Vale rodar `npm uninstall jsonwebtoken` e `@types/jsonwebtoken` se existir.
- Duas funções praticamente idênticas (`pegarUsuarioId` e `pegarUsuarioIdProxy`) diferindo só em como extraem o cookie — dá pra unificar.
- Histórico de commits tem mensagens em tom de "diário de bordo" ("Backup antes de mudar lógica da nota", "Update page.tsx") — não é errado, mas pra quem for olhar o histórico do repo numa entrevista, mensagens mais descritivas do que foi feito (não do processo) passam melhor impressão daqui pra frente. Não vale reescrever o histórico existente, só adotar daqui pra frente.
- `AGENTS.md`/`CLAUDE.md` na raiz são arquivos gerados automaticamente pelo `next dev` (o próprio conteúdo do arquivo diz isso) — não é um problema, só vale saber que estão lá e por quê, caso perguntem.

## 10. Testes

Não há nenhum teste automatizado no projeto (sem Jest/Vitest configurado, sem arquivo de teste). Pra portfólio de primeira vaga isso **não é desqualificante** — muita gente chega na primeira vaga sem suíte de testes — mas like é uma pergunta certeira em entrevista técnica ("como você garantiria que isso continua funcionando"), então vale ter uma resposta melhor que "não tenho".

O que eu priorizaria, com custo baixo e sinal alto:

- `calcularNota()` (`lib/respostas.ts`) — função pura, testa em segundos, cobre os casos de borda (0 acertos, todos certos, arredondamento do `.toFixed(2)`).
- `encrypt`/`decrypt` de `lib/session.ts` — testar que um payload assinado é recuperado corretamente e que um token adulterado/expirado retorna `null`.
- Um teste de integração do fluxo feliz de `/api/responder` (mockando o pool do MySQL) seria o próximo degrau, mas exige mais setup.

O que é genuinely difícil de testar hoje por causa da arquitetura: as rotas que chamam a API do Gemini diretamente via `fetch` inline (`gerar-perguntas`, `feedback`) não têm a chamada extraída numa função isolada — pra testar essas rotas sem bater na API de verdade, seria preciso mockar o `fetch` global ou extrair a chamada pra uma função separada e injetável (o mesmo padrão de "isolar numa função exportável" que vocês já usam nos models de banco). Não é obrigatório mudar isso agora, só reconheço que hoje seria o ponto mais custoso pra testar.

## 11. Performance

Não encontrei problema real de performance no tamanho atual do projeto.

- Sem N+1: `/api/relatorio/[id]` faz um único `JOIN` em vez de buscar perguntas em loop.
- Sem fetch duplicado: `FeedbackButton` até cacheia a explicação já buscada (`if(explicacao) return`) pra não rechamar a IA ao reabrir o modal da mesma pergunta — detalhe bom.
- Os filtros de dificuldade/período no relatório são aplicados no client sobre a lista inteira já carregada — perfeitamente razoável no volume de dados de um usuário individual; só migraria pra filtro no backend se o histórico de alguém crescesse muito (milhares de quizzes), o que não é o cenário aqui.
- O único custo de rede "extra" é o round-trip do `AuthGuard`/`app/page.tsx` pra `/api/me` (seção 6) — impacto perceptível é de UX (um flash de tela), não de performance de servidor.

---

Se quiser, no próximo passo eu ajudo a priorizar isso numa lista de tarefas curta antes da divulgação, ou revisamos algum desses pontos a fundo (por exemplo, como fechar a lacuna do gabarito no `/api/responder`).
