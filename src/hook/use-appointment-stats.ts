import { useMemo } from "react";
import { useCurrencyBRL } from "./use-currency-brl";

interface Appointment {
  date: string | Date;
  price: number;
  clientId: string;
}

export function useAppointmentStats(data?: Appointment[]) {
  const { formatToBRL } = useCurrencyBRL();

  const hoje = new Date();
  const ontem = new Date(hoje);
  ontem.setDate(hoje.getDate() - 1);

  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  const mesAnterior = mesAtual === 0 ? 11 : mesAtual - 1;
  const anoMesAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;

  // Função auxiliar para filtrar por dia
  function filterByDay(data: Appointment[], dia: Date) {
    return data.filter((item) => {
      const dataItem = new Date(item.date);
      return (
        dataItem.getDate() === dia.getDate() &&
        dataItem.getMonth() === dia.getMonth() &&
        dataItem.getFullYear() === dia.getFullYear()
      );
    });
  }

  // Filtra atendimentos de hoje e ontem
  const atendimentosHoje = useMemo(() => {
    if (!data) return [];
    return filterByDay(data, hoje);
  }, [data, hoje]);

  const atendimentosOntem = useMemo(() => {
    if (!data) return [];
    return filterByDay(data, ontem);
  }, [data, ontem]);

  // Filtra atendimentos do mês atual e mês anterior
  const atendimentosMesAtual = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      const d = new Date(item.date);
      return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
    });
  }, [data, mesAtual, anoAtual]);

  const atendimentosMesAnterior = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      const d = new Date(item.date);
      return d.getMonth() === mesAnterior && d.getFullYear() === anoMesAnterior;
    });
  }, [data, mesAnterior, anoMesAnterior]);

  // Função para somar preços
  function somaPreco(items: Appointment[]) {
    return items.reduce((acc, cur) => acc + cur.price, 0);
  }

  // Soma preços e conta clientes únicos
  const totalHoje = useMemo(
    () => somaPreco(atendimentosHoje),
    [atendimentosHoje]
  );
  const totalOntem = useMemo(
    () => somaPreco(atendimentosOntem),
    [atendimentosOntem]
  );

  const totalMesAtual = useMemo(
    () => somaPreco(atendimentosMesAtual),
    [atendimentosMesAtual]
  );
  const totalMesAnterior = useMemo(
    () => somaPreco(atendimentosMesAnterior),
    [atendimentosMesAnterior]
  );

  function clientesUnicos(items: Appointment[]) {
    const setClientes = new Set<string>();
    items.forEach((a) => setClientes.add(a.clientId));
    return setClientes.size;
  }

  const clientesHoje = useMemo(
    () => clientesUnicos(atendimentosHoje),
    [atendimentosHoje]
  );
  const clientesMesAtual = useMemo(
    () => clientesUnicos(atendimentosMesAtual),
    [atendimentosMesAtual]
  );

  // Função para calcular variação percentual
  function variacaoPercentual(atual: number, anterior: number) {
    if (anterior === 0) return 0;
    return ((atual - anterior) / anterior) * 100;
  }

  const variacaoFaturamentoHoje = variacaoPercentual(totalHoje, totalOntem);
  const variacaoClientes = variacaoPercentual(
    clientesMesAtual,
    clientesUnicos(atendimentosMesAnterior)
  );
  const variacaoFaturamentoMes = variacaoPercentual(
    totalMesAtual,
    totalMesAnterior
  );

  return {
    faturamentoHoje: formatToBRL(totalHoje),
    variacaoFaturamentoHoje,
    clientesAtendidosHoje: clientesHoje,
    variacaoClientes,
    faturamentoMes: formatToBRL(totalMesAtual),
    variacaoFaturamentoMes,
    quantidadeDoDia: atendimentosHoje.length,
    quantidadeDoMes: atendimentosMesAtual.length,
  };
}
