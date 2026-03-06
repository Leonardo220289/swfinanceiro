export interface MonthlyData {
  month: string;
  faturamentoBruto: number;
  recorrente: number;
  variavel: number;
  impostos: number;
  faturamentoLiquido: number;
  custos: number;
  lucroBruto: number;
  margemBruta: number;
  despesasVariaveis: number;
  despesasFixas: number;
  despesasTotais: number;
  margemContribuicao: number;
  margemContribuicaoPercent: number;
  ebitda: number;
  margemEbitda: number;
  resultadoFinanceiro: number;
  lucroAntesIR: number;
  lucroLiquido: number;
  margemLiquida: number;
}

export const financialData: MonthlyData[] = [
  {
    month: "Jun/25",
    faturamentoBruto: 109664.03,
    recorrente: 65456.65,
    variavel: 44207.38,
    impostos: 11009.29,
    faturamentoLiquido: 98654.74,
    custos: 48489.97,
    lucroBruto: 50164.77,
    margemBruta: 50.8,
    despesasVariaveis: 18531.05,
    despesasFixas: 11209.42,
    despesasTotais: 29740.47,
    margemContribuicao: 31633.72,
    margemContribuicaoPercent: 32.1,
    ebitda: 20424.30,
    margemEbitda: 20.7,
    resultadoFinanceiro: 0,
    lucroAntesIR: 20424.30,
    lucroLiquido: 20424.30,
    margemLiquida: 20.7,
  },
  {
    month: "Jul/25",
    faturamentoBruto: 162370.81,
    recorrente: 87651.03,
    variavel: 74719.78,
    impostos: 6464.40,
    faturamentoLiquido: 155906.41,
    custos: 57118.57,
    lucroBruto: 98787.84,
    margemBruta: 63.4,
    despesasVariaveis: 9710.28,
    despesasFixas: 55528.59,
    despesasTotais: 65238.87,
    margemContribuicao: 89077.56,
    margemContribuicaoPercent: 57.1,
    ebitda: 33548.97,
    margemEbitda: 21.5,
    resultadoFinanceiro: 0,
    lucroAntesIR: 33548.97,
    lucroLiquido: 33548.97,
    margemLiquida: 21.5,
  },
  {
    month: "Ago/25",
    faturamentoBruto: 112951.04,
    recorrente: 87205.59,
    variavel: 25745.45,
    impostos: 6425.16,
    faturamentoLiquido: 106525.88,
    custos: 50405.32,
    lucroBruto: 56120.56,
    margemBruta: 52.7,
    despesasVariaveis: 9721.50,
    despesasFixas: 55024.88,
    despesasTotais: 64746.38,
    margemContribuicao: 46399.06,
    margemContribuicaoPercent: 43.6,
    ebitda: -8625.82,
    margemEbitda: -8.1,
    resultadoFinanceiro: 0,
    lucroAntesIR: -9288.20,
    lucroLiquido: -9288.20,
    margemLiquida: -8.7,
  },
  {
    month: "Set/25",
    faturamentoBruto: 204931.74,
    recorrente: 88387.57,
    variavel: 116544.17,
    impostos: 45155.76,
    faturamentoLiquido: 159775.98,
    custos: 65291.22,
    lucroBruto: 94484.76,
    margemBruta: 59.1,
    despesasVariaveis: 10557.04,
    despesasFixas: 64261.04,
    despesasTotais: 74818.08,
    margemContribuicao: 83927.72,
    margemContribuicaoPercent: 52.5,
    ebitda: 19666.68,
    margemEbitda: 12.3,
    resultadoFinanceiro: 546.25,
    lucroAntesIR: 20133.68,
    lucroLiquido: 20133.68,
    margemLiquida: 12.6,
  },
  {
    month: "Out/25",
    faturamentoBruto: 160779.28,
    recorrente: 90114.72,
    variavel: 70664.56,
    impostos: 5971.85,
    faturamentoLiquido: 154807.43,
    custos: 54137.19,
    lucroBruto: 100670.24,
    margemBruta: 65.0,
    despesasVariaveis: 13920.32,
    despesasFixas: 64127.47,
    despesasTotais: 78047.79,
    margemContribuicao: 86749.92,
    margemContribuicaoPercent: 56.0,
    ebitda: 22622.45,
    margemEbitda: 14.6,
    resultadoFinanceiro: 744.92,
    lucroAntesIR: 18288.12,
    lucroLiquido: 18288.12,
    margemLiquida: 11.8,
  },
  {
    month: "Nov/25",
    faturamentoBruto: 208562.12,
    recorrente: 107203.20,
    variavel: 101358.92,
    impostos: 8548.22,
    faturamentoLiquido: 200013.90,
    custos: 51997.96,
    lucroBruto: 148015.94,
    margemBruta: 74.0,
    despesasVariaveis: 20144.37,
    despesasFixas: 64553.70,
    despesasTotais: 84698.07,
    margemContribuicao: 127871.57,
    margemContribuicaoPercent: 63.9,
    ebitda: 63317.87,
    margemEbitda: 31.7,
    resultadoFinanceiro: 799.20,
    lucroAntesIR: 56019.77,
    lucroLiquido: 56019.77,
    margemLiquida: 28.0,
  },
  {
    month: "Dez/25",
    faturamentoBruto: 149270.67,
    recorrente: 77102.73,
    variavel: 72167.94,
    impostos: 49779.71,
    faturamentoLiquido: 99490.96,
    custos: 59666.89,
    lucroBruto: 39824.07,
    margemBruta: 40.0,
    despesasVariaveis: 16630.74,
    despesasFixas: 61340.47,
    despesasTotais: 77971.21,
    margemContribuicao: 23193.33,
    margemContribuicaoPercent: 23.3,
    ebitda: -38147.14,
    margemEbitda: -38.3,
    resultadoFinanceiro: 950.42,
    lucroAntesIR: -44642.74,
    lucroLiquido: -44642.74,
    margemLiquida: -44.9,
  },
  {
    month: "Jan/26",
    faturamentoBruto: 145242.29,
    recorrente: 77102.52,
    variavel: 68139.77,
    impostos: 2510.56,
    faturamentoLiquido: 142731.73,
    custos: 65185.40,
    lucroBruto: 77546.33,
    margemBruta: 54.3,
    despesasVariaveis: 13457.38,
    despesasFixas: 64481.05,
    despesasTotais: 77938.43,
    margemContribuicao: 64088.95,
    margemContribuicaoPercent: 44.9,
    ebitda: -392.10,
    margemEbitda: -0.3,
    resultadoFinanceiro: 900.57,
    lucroAntesIR: 587.72,
    lucroLiquido: 587.72,
    margemLiquida: 0.4,
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
