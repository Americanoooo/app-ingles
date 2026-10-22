import { Fragment } from "react";

/** Ritmo padrão da escrita: quanto cada letra leva para aparecer, em ms. */
const MS_POR_LETRA = 22;

function planejar(texto: string, msPorLetra = MS_POR_LETRA) {
  let inicio = 0;
  return texto.split(" ").map((palavra) => {
    const passo = {
      palavra,
      atraso: inicio,
      // A borda suave da máscara precisa de mais tempo que a palavra para atravessá-la.
      duracao: Math.max(palavra.length * msPorLetra * 1.8, 240),
    };
    inicio += (palavra.length + 1) * msPorLetra;
    return passo;
  });
}

/** Quando a última palavra termina de aparecer, em ms. */
export function duracaoEscrita(texto: string, msPorLetra = MS_POR_LETRA) {
  const ultima = planejar(texto, msPorLetra).at(-1);
  return ultima ? ultima.atraso + ultima.duracao : 0;
}

/**
 * Texto que aparece letra a letra, da esquerda para a direita, como se
 * estivesse sendo escrito. Cada palavra é revelada por uma máscara com
 * borda suave, então o kerning da fonte continua intacto. Só CSS: funciona
 * em Server Component e, com movimento reduzido, o texto já aparece pronto.
 */
export function TituloEscrito({
  texto,
  msPorLetra = MS_POR_LETRA,
}: {
  texto: string;
  /** Frases curtas ficam melhores com um ritmo mais lento. */
  msPorLetra?: number;
}) {
  const palavras = planejar(texto, msPorLetra);
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
