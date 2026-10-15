import { Fragment } from "react";

/** Ritmo da escrita: quanto cada letra leva para aparecer, em ms. */
const MS_POR_LETRA = 22;

function planejar(texto: string) {
  let inicio = 0;
  return texto.split(" ").map((palavra) => {
    const passo = {
      palavra,
      atraso: inicio,
      // A borda suave da máscara precisa de mais tempo que a palavra para atravessá-la.
      duracao: Math.max(palavra.length * MS_POR_LETRA * 1.8, 240),
    };
    inicio += (palavra.length + 1) * MS_POR_LETRA;
    return passo;
  });
}

/** Quando a última palavra termina de aparecer, em ms. */
export function duracaoEscrita(texto: string) {
  const ultima = planejar(texto).at(-1);
  return ultima ? ultima.atraso + ultima.duracao : 0;
}

/**
 * Texto que aparece letra a letra, da esquerda para a direita, como se
 * estivesse sendo escrito. Cada palavra é revelada por uma máscara com
 * borda suave, então o kerning da fonte continua intacto. Só CSS: funciona
 * em Server Component e, com movimento reduzido, o texto já aparece pronto.
 */
export function TituloEscrito({ texto }: { texto: string }) {
  const palavras = planejar(texto);
  return (
    <>
      <span className="sr-only">{texto}</span>
      <span aria-hidden="true">
        {palavras.map(({ palavra, atraso, duracao }, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span
              style={{ animationDelay: `${atraso}ms`, animationDuration: `${duracao}ms` }}
              className="-mx-[0.12em] -my-[0.2em] inline-block px-[0.12em] py-[0.2em] animate-escrever [mask-image:linear-gradient(90deg,black_40%,transparent_60%)] [mask-repeat:no-repeat] [mask-size:300%_100%] motion-reduce:animate-none"
            >
              {palavra}
            </span>
          </Fragment>
        ))}
      </span>
    </>
  );
}
