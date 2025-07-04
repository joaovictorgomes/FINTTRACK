import type React from "react";

import { useEffect, useState } from "react";
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
import { Clock, ImagePlus, Loader2, X } from "lucide-react";
import { DatePickerSimples } from "./date-picker-simples";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface HistoryFormProps {
  modo: "editar" | "criar";
  dadosIniciais?: any;
  onSucesso?: () => void;
}

export const formatarMoeda = (valor: number): string => {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const desformatarMoeda = (valor: string): string => {
  return valor.replace(/[^\d,-]/g, "").replace(",", ".");
};

const HistoryForm = ({ modo, dadosIniciais, onSucesso }: HistoryFormProps) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(dadosIniciais?.date || new Date());
  const [hora, setHora] = useState(dadosIniciais?.time || "");
  const [tipoCorte, setTipoCorte] = useState(dadosIniciais?.type || "");
  const [atendente, setAtendente] = useState(dadosIniciais?.attendant || "");
  const [valor, setValor] = useState(
    dadosIniciais?.price ? (dadosIniciais?.price / 100).toString() : ""
  );

  const [formaPagamento, setFormaPagamento] = useState(
    dadosIniciais?.payment || ""
  );
  const [statusAtendimento, setStatusAtendimento] = useState(
    dadosIniciais?.status || ""
  );
  const [imagemPreview, setImagemPreview] = useState(
    dadosIniciais?.image || ""
  );
  const [notes, setNotes] = useState(dadosIniciais?.notes || "");

  // Atualiza os dados iniciais caso mudem
  useEffect(() => {
    if (dadosIniciais) {
      setData(dadosIniciais.date || new Date());
      setHora(dadosIniciais.time || "");
      setTipoCorte(dadosIniciais.type || "");
      setAtendente(dadosIniciais.attendant || "");
      setValor(
        dadosIniciais.price ? (dadosIniciais.price / 100).toString() : ""
      );
      setFormaPagamento(dadosIniciais.payment || "");
      setStatusAtendimento(dadosIniciais.status || "");
      setImagemPreview(dadosIniciais.image || "");
      setNotes(dadosIniciais.notes || "");
    }
  }, [dadosIniciais]);

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = desformatarMoeda(e.target.value); // Remove o "R$" e outros caracteres
    setValor(valorFormatado); // Armazena o valor como centavos
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removerImagem = () => {
    setImagemPreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const payload = {
        date: data,
        time: hora,
        type: tipoCorte,
        attendant: atendente,
        price: Number(valor) * 100, // Convertendo para centavos ao enviar
        payment: formaPagamento,
        status: statusAtendimento,
        image: imagemPreview,
        notes,
      };

      const method = modo === "editar" ? "PUT" : "POST";
      const url =
        modo === "editar"
          ? `/api/appointments/${dadosIniciais?.id}`
          : `/api/appointments`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Atendimento atualizado com sucesso!", {
          icon: "🎉",
          style: {
            background: "#e6ffed", // verde claro de fundo
            color: "#087f5b", // verde escuro no texto
            fontWeight: "bold",
          },
        });
        queryClient.invalidateQueries({ queryKey: ["appointments"] });

        onSucesso?.();
      } else {
        toast.error("Erro ao tentar atualizar atendimento.", {
          icon: "❌",
          style: {
            background: "#ffe6e6",
            color: "#c92a2a",
            fontWeight: "bold",
          },
        });
      }
    } finally {
      setLoading(false);
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setHora(e.target.value)
                  }
                  className="w-full pl-10"
                />
                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            {/* Tipo de corte */}
            <div className="space-y-2">
              <Label htmlFor="tipo-corte">Tipo de corte</Label>
              <Select value={tipoCorte} onValueChange={setTipoCorte}>
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
              <Select value={atendente} onValueChange={setAtendente}>
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
                value={valor ? formatarMoeda(Number(valor)) : ""} // Formata para exibição em R$
                onChange={handleValorChange}
                placeholder="R$ 0,00"
              />
            </div>

            {/* Forma de pagamento */}
            <div className="space-y-2">
              <Label htmlFor="pagamento">Forma de pagamento</Label>
              <Select value={formaPagamento} onValueChange={setFormaPagamento}>
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
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNotes(e.target.value)
              }
              value={notes || ""}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto md:ml-auto flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin h-5 w-5" />}
            Atualizar
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default HistoryForm;
