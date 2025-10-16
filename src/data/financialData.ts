export interface MonthlyData {
  month: string;
  faturamentoBruto: number;
  impostos: number;
  faturamentoLiquido: number;
  custos: number;
  lucroBruto: number;
  margemBruta: number;
  despesasVariaveis: number;
  despesasFixas: number;
  margemContribuicao: number;
  margemContribuicaoPercent: number;
  ebitda: number;
  margemEbitda: number;
  lucroLiquido: number;
  margemLiquida: number;
}

export const financialData: MonthlyData[] = [
  {
    month: "Jun/25",
    faturamentoBruto: 109664.03,
    impostos: 11009.29,
    faturamentoLiquido: 98654.74,
    custos: 48489.97,
    lucroBruto: 50164.77,
    margemBruta: 50.8,
    despesasVariaveis: 18531.05,
    despesasFixas: 11523.52,
    margemContribuicao: 31633.72,
    margemContribuicaoPercent: 32.1,
    ebitda: 20110.20,
    margemEbitda: 20.4,
    lucroLiquido: 20110.20,
    margemLiquida: 20.4,
  },
  {
    month: "Jul/25",
    faturamentoBruto: 162370.81,
    impostos: 6464.40,
    faturamentoLiquido: 155906.41,
    custos: 57118.57,
    lucroBruto: 98787.84,
    margemBruta: 63.4,
    despesasVariaveis: 9710.28,
    despesasFixas: 55842.69,
    margemContribuicao: 89077.56,
    margemContribuicaoPercent: 57.1,
    ebitda: 33234.87,
    margemEbitda: 21.3,
    lucroLiquido: 33234.87,
    margemLiquida: 21.3,
  },
  {
    month: "Ago/25",
    faturamentoBruto: 112951.04,
    impostos: 6882.57,
    faturamentoLiquido: 106068.47,
    custos: 50405.32,
    lucroBruto: 55663.15,
    margemBruta: 52.5,
    despesasVariaveis: 9721.50,
    despesasFixas: 55338.98,
    margemContribuicao: 45941.65,
    margemContribuicaoPercent: 43.3,
    ebitda: -9397.33,
    margemEbitda: -8.9,
    lucroLiquido: -10059.71,
    margemLiquida: -9.5,
  },
  {
    month: "Set/25",
    faturamentoBruto: 204931.74,
    impostos: 46006.52,
    faturamentoLiquido: 158925.22,
    custos: 65541.22,
    lucroBruto: 93384.00,
    margemBruta: 58.8,
    despesasVariaveis: 10307.04,
    despesasFixas: 64587.27,
    margemContribuicao: 83076.96,
    margemContribuicaoPercent: 52.3,
    ebitda: 18489.69,
    margemEbitda: 11.6,
    lucroLiquido: 18410.44,
    margemLiquida: 11.6,
  },
];

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getLatestMonth = () => financialData[financialData.length - 1];
export const getPreviousMonth = () => financialData[financialData.length - 2];

export const calculateTrend = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
};

export const getMonthData = (month: string) => {
  return financialData.find(d => d.month === month);
};

export const getPreviousMonthData = (month: string) => {
  const currentIndex = financialData.findIndex(d => d.month === month);
  if (currentIndex <= 0) return null;
  return financialData[currentIndex - 1];
};
