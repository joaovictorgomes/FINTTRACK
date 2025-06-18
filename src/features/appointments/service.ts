export async function getAppointments() {
  const res = await fetch("/api/appointments");
  if (!res.ok) throw new Error("Erro ao buscar atendimentos");
  return res.json();
}

export async function getAtendimentoById(id: string) {
  const res = await fetch(`/api/appointments/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar atendimento");
  return res.json();
}
