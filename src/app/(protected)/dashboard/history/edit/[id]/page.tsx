
"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import HistoryForm from "@/components/history-form";
import { toast } from "sonner";
import { getAtendimentoById } from "@/features/appointments/service";

export default function EditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["atendimento", id],
    queryFn: () => getAtendimentoById(id),
    enabled: !!id, // só executa se tiver id
  });

  if (isLoading) return <p>Carregando...</p>;
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
