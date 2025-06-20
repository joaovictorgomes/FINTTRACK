"use client";

import * as React from "react";
import { useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronsUpDown, Ellipsis, Pencil, Search, Trash2 } from "lucide-react";
import {
  deleteAppointment,
  useAppointments,
} from "@/features/appointments/useAppointments";
import { useRouter } from "next/navigation";
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { toast } from "sonner";

// Tipos
type PaymentMethod = "Dinheiro" | "Pix" | "Cartão";
type AppointmentStatus = "Pendente" | "Concluído" | "Cancelado";

interface Appointment {
  id: string;
  date: string;
  time: string;
  type: string;
  attendant: string;
  price: number;
  payment: PaymentMethod;
  status: string;
}

// Função para renderizar o badge de status
const StatusBadge = ({ status }: { status: string }) => {
  let badgeClass: string = "";
  switch (status) {
    case "Pendente":
      badgeClass = "bg-blue-100 text-blue-800 hover:bg-blue-100";
      break;
    case "Concluído":
      badgeClass = "bg-green-100 text-green-800 hover:bg-green-100";
      break;
    case "Cancelado":
      badgeClass = "bg-red-100 text-red-800 hover:bg-red-100";
      break;
    default:
      badgeClass = "bg-gray-100 text-gray-800";
  }

  return (
    <Badge className={badgeClass} variant="outline">
      {status}
    </Badge>
  );
};

const formatCurrency = (value: number) => {
  return (value / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const handleDelete = async (id: string) => {
  try {
    const successMessage = await deleteAppointment(id);

    if (successMessage) {
      toast.success("Atendimento excluído com sucesso", {
        icon: "🎉", // Ícone para indicar sucesso
        style: {
          background: "#e6ffed", // Verde claro de fundo
          color: "#087f5b", // Verde escuro no texto
          fontWeight: "bold", // Deixar o texto em negrito
        },
      });

      // Recarrega a página após o sucesso
      window.location.reload();
    } else {
      toast.error("Failed to delete the appointment", {
        icon: "⚠️", // Ícone para erro
        style: {
          background: "#ffebeb", // Cor de fundo para erro (vermelho claro)
          color: "#d9534f", // Cor do texto (vermelho escuro)
          fontWeight: "bold", // Deixar o texto em negrito
        },
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message, {
        icon: "⚠️", // Ícone de erro
        style: {
          background: "#ffebeb", // Cor de fundo para erro
          color: "#d9534f", // Cor do texto para erro
          fontWeight: "bold",
        },
      });
    } else {
      toast.error("An unknown error occurred.", {
        icon: "⚠️", // Ícone de erro
        style: {
          background: "#ffebeb", // Cor de fundo para erro
          color: "#d9534f", // Cor do texto para erro
          fontWeight: "bold",
        },
      });
    }
  }
};

// Definição das colunas
export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const formatted = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "time",
    header: "Hora",
    cell: ({ row }) => <div>{row.getValue("time")}</div>,
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tipo de Corte
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("type")}</div>,
  },
  {
    accessorKey: "attendant",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Atendente
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("attendant")}</div>,
  },
  {
    accessorKey: "price",
    header: "Valor Cobrado",
    cell: ({ row }) => <div>{formatCurrency(row.getValue("price"))}</div>,
  },
  {
    accessorKey: "payment",
    header: "Forma de Pagamento",
    cell: ({ row }) => <div>{row.getValue("payment")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const appointment = row.original;
      const router = useRouter(); // Initialize the router

      const [open, setOpen] = useState(false);

      const confirmDelete = () => {
        handleDelete(appointment.id);
        setOpen(false);
      };

      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <Ellipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/history/edit/${appointment.id}`)
                }
                className="cursor-pointer flex items-center"
              >
                <Pencil className="mr-2 h-4 w-4 text-black" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="cursor-pointer text-red-600 flex items-center"
                >
                  <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                  Excluir
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
            </DialogHeader>
            <p>Tem certeza que deseja excluir este atendimento?</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];

export default function BarbershopAppointments() {
  const { data: atendimentos, isLoading, error } = useAppointments();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filtrar dados com base nos filtros selecionados
  const filteredData = React.useMemo(() => {
    let filtered = Array.isArray(atendimentos) ? [...atendimentos] : [];

    // Filtrar por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (atendimento: Appointment) => atendimento.status === statusFilter
      );
    }

    // Filtrar por método de pagamento
    if (paymentFilter !== "all") {
      filtered = filtered.filter(
        (atendimento: Appointment) => atendimento.payment === paymentFilter
      );
    }

    // Filtrar por busca (Data, Hora, Tipo de Corte, Atendente, Valor Cobrado)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();

      filtered = filtered.filter((atendimento: Appointment) => {
        const formattedDate = new Date(atendimento.date).toLocaleDateString(
          "pt-BR"
        ); // Ex: "10/05/2025"

        return (
          formattedDate.includes(query) ||
          atendimento.time.toLowerCase().includes(query) ||
          atendimento.type.toLowerCase().includes(query) ||
          atendimento.attendant.toLowerCase().includes(query) ||
          atendimento.price.toString().toLowerCase().includes(query)
        );
      });
    }

    return filtered;
  }, [atendimentos, statusFilter, paymentFilter, searchQuery]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="relative">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Historico de Atendimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por atendente ou tipo de corte..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="lg:w-[180px] w-full">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="lg:w-[180px] w-full">
                  <SelectValue placeholder="Filtrar por pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="Pix">Pix</SelectItem>
                  <SelectItem value="Cartão">Cartão</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Nenhum atendimento encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {table.getRowModel().rows.length} de{" "}
              {atendimentos?.length} atendimentos
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Próximo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
