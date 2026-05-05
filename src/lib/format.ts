export const formatBRL = (value: number): string =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value || 0);

export const formatDateBR = (iso?: string | null): string => {
  if (!iso) return "—";
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR");
};

export const monthInputToISO = (ym: string): string => `${ym}-01`;
export const isoToMonthInput = (iso: string): string => iso.slice(0, 7);
