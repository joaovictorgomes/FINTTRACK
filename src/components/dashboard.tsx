"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarIcon,
  DollarSignIcon,
  ScissorsIcon,
  UsersIcon,
} from "lucide-react";
import NotFound from "./not-found";
import { useAppointments } from "@/features/appointments/useAppointments";
import { useMemo } from "react";
import { useAppointmentStats } from "@/hook/use-appointment-stats";
import Link from "next/link";

interface Appointment {
  date: string | Date;
  price: number;
  type: string;
}

interface ServicoPopular {
  nome: string;
  percentual: number;
}

function calculaServicoMaisPopular(
  appointments: Appointment[]
): ServicoPopular | null {
  if (!appointments || appointments.length === 0) return null;

  const contagem: Record<string, number> = {};

  appointments.forEach(({ type }) => {
    if (!type) return;
    contagem[type] = (contagem[type] || 0) + 1;
  });

  const servicos = Object.keys(contagem);
  if (servicos.length === 0) return null;

  let maisPopular = servicos[0];
  let maxContagem = contagem[maisPopular];

  for (const servico of servicos) {
    if (contagem[servico] > maxContagem) {
      maxContagem = contagem[servico];
      maisPopular = servico;
    }
  }

  const percentual = (maxContagem / appointments.length) * 100;

  return {
    nome: maisPopular,
    percentual: Number(percentual.toFixed(1)),
  };
}

export default function Dashboard() {
  const { data, isLoading, error } = useAppointments();
  const {
    faturamentoHoje,
    variacaoFaturamentoHoje,
    quantidadeDoDia,
    clientesAtendidosHoje,
    variacaoClientes,
    faturamentoMes,
    variacaoFaturamentoMes,
    quantidadeDoMes,
  } = useAppointmentStats(data);

  const popular = useMemo(() => calculaServicoMaisPopular(data || []), [data]);

  const getColorByVariation = (value: number) => {
    if (value > 0) return "text-green-500";
    if (value < 0) return "text-red-500";
    return "text-gray-500"; // se for zero
  };

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar os atendimentos.</p>;

  return (
    <div className="flex flex-col">
      <div>
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Gerencie os atendimentos da sua barbearia
            </p>
          </div>
          <div className="flex items-center">
            <Link href="/dashboard/registration">
              <Button className="w-full md:w-[180px]">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Novo Atendimento
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <div className="flex items-center justify-between space-y-0 px-6">
              <CardTitle className="text-sm font-medium">
                Atendimentos Hoje
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardContent>
              <div className="text-2xl font-bold">{quantidadeDoDia}</div>
              {/* <p className={`text-xs ${getColorByVariation(variacaoClientes)}`}>
                {variacaoClientes}% em relação a ontem
              </p> */}
            </CardContent>
          </Card>

          <Card>
            <div className="flex items-center justify-between space-y-0 px-6">
              <CardTitle className="text-sm font-medium">
                Faturamento Hoje
              </CardTitle>
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardContent>
              <div className="text-2xl font-bold">{faturamentoHoje}</div>
              {/* <p
                className={`text-xs ${getColorByVariation(
                  variacaoFaturamentoHoje
                )}`}
              >
                {variacaoFaturamentoHoje}% em relação a ontem
              </p> */}
            </CardContent>
          </Card>

          <Card>
            <div className="flex items-center justify-between space-y-0 px-6">
              <CardTitle className="text-sm font-medium">
                Clientes Atendidos no Mês
              </CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardContent>
              <div className="text-2xl font-bold">{quantidadeDoMes}</div>
              {/* <p className={`text-xs ${getColorByVariation(variacaoClientes)}`}>
                {variacaoClientes}% em relação ao mês passado
              </p> */}
            </CardContent>
          </Card>

          <Card>
            <div className="flex items-center justify-between space-y-0 px-6">
              <CardTitle className="text-sm font-medium">
                Faturamento do Mês
              </CardTitle>
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardContent>
              <div className="text-2xl font-bold">{faturamentoMes}</div>
              {/* <p
                className={`text-xs ${getColorByVariation(
                  variacaoFaturamentoMes
                )}`}
              >
                {variacaoFaturamentoMes}% em relação ao mês passado
              </p> */}
            </CardContent>
          </Card>

          <Card>
            <div className="flex items-center justify-between space-y-0 px-6">
              <CardTitle className="text-sm font-medium">
                Serviços Populares
              </CardTitle>
              <ScissorsIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardContent>
              <div className="text-2xl font-bold">{popular?.nome || "—"}</div>
              {/* <p
                className={`text-xs ${getColorByVariation(
                  popular?.percentual ?? 0
                )}`}
              >
                {popular
                  ? `${popular.percentual}% dos atendimentos`
                  : "Nenhum atendimento"}
              </p> */}
            </CardContent>
          </Card>
        </div>

        <div className="mt-4">
          <Card>
            <CardContent>
              <NotFound virtual={false} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
