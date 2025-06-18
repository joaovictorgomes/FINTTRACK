export function useCurrencyBRL() {
  function formatToBRL(value: number, isCentavos = true): string {
    const valorFormatado = isCentavos ? value / 100 : value;

    return valorFormatado.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });
  }

  return { formatToBRL };
}
