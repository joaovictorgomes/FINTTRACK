"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import HistoryForm from "@/components/history-form";
import { toast } from "sonner";
import { getAtendimentoById } from "@/features/appointments/service";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function EditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["atendimento", id],
    queryFn: () => getAtendimentoById(id),
    enabled: !!id, // só executa se tiver id
  });

  if (isLoading)
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 7 campos do tipo input/select */}
            {[...Array(7)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" /> {/* Label */}
                <Skeleton className="h-10 w-full" />
              </div>
            ))}

            {/* Upload de imagem */}
            <div className="space-y-2 col-span-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Observações */}
            <div className="space-y-2 col-span-full">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-[100px] w-full" />
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <button
            disabled
            className="w-full md:w-auto md:ml-auto flex items-center justify-center gap-2"
          >
            <Skeleton className="h-10 w-24" />
          </button>
        </CardFooter>
      </Card>
    );

  if (error) {
    toast.error("Erro ao carregar atendimento.");
    return <p>Erro ao carregar atendimento.</p>;
  }

  return (
    <HistoryForm
      modo="editar"
      dadosIniciais={data}
      onSucesso={() => router.push("/dashboard/history")}
    />
  );
}
