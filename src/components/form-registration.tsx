"use client";

import type React from "react";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, ImagePlus, X } from "lucide-react";
import { DatePickerSimples } from "./date-picker-simples";
import { toast } from "sonner";

interface FormData {
  date: Date | undefined;
  time: string;
  type: string;
  attendant: string;
  price: number; // price como number, já que é um Int no Prisma
  payment: string;
  status: string;
  image: string | null; // A imagem pode ser null
  notes: string | null; // Notes também pode ser null
  userId: string;
}

export default function Formregistration() {
  const { data: session } = useSession();
  console.log(session); // Verifique o conteúdo da sessão no console

  // Estados com tipagem
  const [data, setData] = useState<Date | undefined>(undefined);
  const [hora, setHora] = useState<string>("");
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const [valor, setValor] = useState<string>("");
  const [tipoCorte, setTipoCorte] = useState<string>("");
  const [atendente, setAtendente] = useState<string>("");
  const [formaPagamento, setFormaPagamento] = useState<string>("");
  const [statusAtendimento, setStatusAtendimento] = useState<string>("");
  const [notes, setNotes] = useState<string | null>(null);

  const formatarMoeda = (valor: number) => {
    return (valor / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Converte string como "R$ 10,00" para número em centavos (ex: 1000)
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
    const numericValue = parseInt(rawValue, 10); // Converte para número inteiro (em centavos)

    setValor(isNaN(numericValue) ? "" : numericValue.toString()); // Atualiza o estado com o valor em centavos
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagemPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removerImagem = () => {
    setImagemPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      toast.error("Usuário não autenticado.", {
        icon: "❌",
        style: {
          background: "#ffe6e6",
          color: "#c92a2a",
          fontWeight: "bold",
        },
      });
      return;
    }

    if (
      !data ||
      !hora ||
      !tipoCorte ||
      !atendente ||
      !valor ||
      !formaPagamento ||
      !statusAtendimento
    ) {
      toast.error("Preencha todos os campos obrigatórios.", {
        icon: "❌",
        style: {
          background: "#ffe6e6",
          color: "#c92a2a",
          fontWeight: "bold",
        },
      });
      return;
    }

    const parsedPrice = Number.parseInt(valor ?? "");
    if (isNaN(parsedPrice)) {
      toast.error("Valor do atendimento inválido.", {
        icon: "❌",
        style: {
          background: "#ffe6e6",
          color: "#c92a2a",
          fontWeight: "bold",
        },
      });
      return;
    }

    if (isNaN(new Date(data).getTime())) {
      toast.error("Data inválida.", {
        icon: "❌",
        style: {
          background: "#ffe6e6",
          color: "#c92a2a",
          fontWeight: "bold",
        },
      });
      return;
    }

    const atendimento: FormData = {
      date: data,
      time: hora,
      type: tipoCorte,
      attendant: atendente,
      price: parsedPrice,
      payment: formaPagamento,
      status: statusAtendimento,
      image: imagemPreview,
      notes: notes || null,
      userId: session.user.id,
    };

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(atendimento),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Erro ao criar atendimento: ${response.status} - ${errorText}`
        );
      }

      const responseData = await response.json();
      toast.success("Atendimento criado com sucesso!", {
        icon: "🎉",
        style: {
          background: "#e6ffed", // verde claro de fundo
          color: "#087f5b", // verde escuro no texto
          fontWeight: "bold",
        },
      });

      // Limpar os estados após sucesso
      setData(undefined);
      setHora("");
      setTipoCorte("");
      setAtendente("");
      setValor("");
      setFormaPagamento("");
      setStatusAtendimento("");
      setImagemPreview(null);
      setNotes(null);
    } catch (error: any) {
      console.error("Erro ao criar atendimento:", error);
      toast.error(error?.message || "Erro ao criar atendimento.", {
        icon: "❌", // ícone de erro
        style: {
          background: "#ffe6e6", // fundo vermelho claro
          color: "#c92a2a", // texto vermelho escuro
          fontWeight: "bold",
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Dados do Atendimento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Data do atendimento */}
            <DatePickerSimples
              label="Data do atendimento"
              id="data"
              date={data}
              setDate={setData}
            />

            {/* Hora do atendimento */}
            <div className="space-y-2">
              <Label htmlFor="hora">Hora do atendimento</Label>
              <div className="relative">
                <Input
                  id="hora"
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="w-full pl-10"
                  required
                />
                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            {/* Tipo de corte */}
            <div className="space-y-2">
              <Label htmlFor="tipo-corte">Tipo de corte</Label>
              <Select value={tipoCorte} onValueChange={setTipoCorte} required>
                <SelectTrigger id="tipo-corte" className="w-full">
                  <SelectValue placeholder="Selecione o tipo de corte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="degrade">Degradê</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="infantil">Infantil</SelectItem>
                  <SelectItem value="barba">Barba</SelectItem>
                  <SelectItem value="completo">
                    Completo (Cabelo + Barba)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Atendente */}
            <div className="space-y-2">
              <Label htmlFor="atendente">Atendente</Label>
              <Select value={atendente} onValueChange={setAtendente} required>
                <SelectTrigger id="atendente" className="w-full">
                  <SelectValue placeholder="Selecione o atendente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="natan">Natan</SelectItem>
                  <SelectItem value="matheus">Matheus</SelectItem>
                  <SelectItem value="luciano">Luciano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Valor cobrado */}
            <div className="space-y-2">
              <Label htmlFor="valor">Valor cobrado</Label>
              <Input
                id="valor"
                value={valor !== null ? formatarMoeda(Number(valor)) : ""}
                onChange={handleValorChange}
                placeholder="R$ 0,00"
                required
              />
            </div>

            {/* Forma de pagamento */}
            <div className="space-y-2">
              <Label htmlFor="pagamento">Forma de pagamento</Label>
              <Select
                value={formaPagamento}
                onValueChange={setFormaPagamento}
                required
              >
                <SelectTrigger id="pagamento" className="w-full">
                  <SelectValue placeholder="Selecione a forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="Pix">Pix</SelectItem>
                  <SelectItem value="Cartão">Cartão</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status do atendimento */}
            <div className="space-y-2">
              <Label htmlFor="status">Status do atendimento</Label>
              <Select
                value={statusAtendimento}
                onValueChange={setStatusAtendimento}
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Upload de foto */}
            <div className="space-y-2">
              <Label htmlFor="foto">Foto do corte (opcional)</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById("foto")?.click()}
                    disabled
                  >
                    <ImagePlus className="mr-2 h-4 w-4" />
                    Selecionar imagem
                  </Button>
                  <Input
                    id="foto"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImagemChange}
                  />
                </div>
                {imagemPreview && (
                  <div className="relative mt-2">
                    <img
                      src={imagemPreview || ""}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={removerImagem}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Observações adicionais */}
          <div className="space-y-2 col-span-full">
            <Label htmlFor="observacoes">Observações adicionais</Label>
            <Textarea
              id="observacoes"
              placeholder="Digite observações adicionais sobre o atendimento..."
              className="min-h-[100px]"
              onChange={(e) => setNotes(e.target.value)}
              value={notes || ""}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full md:w-auto md:ml-auto">
            Salvar Atendimento
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
