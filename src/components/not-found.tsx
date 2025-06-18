import Link from "next/link";
import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotFoundProps {
  virtual?: boolean;
}

export default function NotFound({ virtual = true }: NotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center bg-background px-4 text-center">
      <div className="max-w-md space-y-8">
        <div className="flex justify-center">
          <div className="rounded-full bg-amber-100 p-6">
            <Construction className="h-16 w-16 text-amber-600" />
          </div>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Em breve
        </h1>

        <p className="text-xl text-muted-foreground">
          Este recurso ainda está em desenvolvimento. Estamos trabalhando duro
          para disponibilizá-lo o mais rápido possível.
        </p>

        {virtual && (
          <>
            <div className="pt-4">
              <Button asChild size="lg">
                <Link href="/dashboard">Voltar para a página inicial</Link>
              </Button>
            </div>
          </>
        )}
      </div>

      {virtual && (
        <div className="mt-12 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} - Todos os direitos reservados</p>
        </div>
      )}
    </div>
  );
}
