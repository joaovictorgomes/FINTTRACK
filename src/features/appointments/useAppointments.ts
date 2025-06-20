"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "./service";

export function useAppointments() {
  const query = useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
    refetchOnWindowFocus: true,
  });

  return query;
}


export const deleteAppointment = async (id: string) => {
  try {
    const response = await fetch(`/api/appointments/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao excluir atendimento");
    }

    return `Atendimento ${id} excluído com sucesso`;
  } catch (error) {
    throw new Error(`Erro ao excluir atendimento: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
  }
};
