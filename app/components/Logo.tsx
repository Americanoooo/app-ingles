import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** Mostra o balão de fala do ícone do app ao lado do nome. */
  comMarca?: boolean;
};

export function Logo({ className, comMarca = false }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-heading text-lg font-bold text-foreground sm:text-xl",
        className
      )}
    >
      {comMarca && (
        <svg
          viewBox="0 0 64 64"
          className="size-8 shrink-0"
          aria-hidden="true"
        >
          <path
            className="fill-primary"
            d="M14 4h36a10 10 0 0 1 10 10v26a10 10 0 0 1-10 10H30l-12 10v-10h-4A10 10 0 0 1 4 40V14A10 10 0 0 1 14 4z"
          />
          <path
            className="fill-primary-foreground"
            fillRule="evenodd"
            d="M32 11 L45 43 H37.5 L35 36.5 H29 L26.5 43 H19 Z M30.8 30.5 H33.2 L32 27 Z"
          />
        </svg>
      )}
      <span>
        App <span className="text-primary">Inglês</span>
      </span>
    </span>
  );
}
