export async function getAppointments() {
  const res = await fetch("/api/appointments", {
    credentials: "include", // ESSENCIAL: envia os cookies da sessão
  });
  if (!res.ok) throw new Error("Erro ao buscar atendimentos");
  return res.json();
}

export async function getAtendimentoById(id: string) {
  const res = await fetch(`/api/appointments/${id}`, {
    credentials: "include", // idem aqui
  });
  if (!res.ok) throw new Error("Erro ao buscar atendimento");
  return res.json();
}
