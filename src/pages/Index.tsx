import { KPICard } from "@/components/KPICard";
import { RevenueChart } from "@/components/RevenueChart";
import { MarginChart } from "@/components/MarginChart";
import { ExpensesChart } from "@/components/ExpensesChart";
import { RevenueCompositionChart } from "@/components/RevenueCompositionChart";
import { MonthFilter } from "@/components/MonthFilter";
import {
  DollarSign,
  TrendingUp,
  PieChart,
  Target,
  ArrowUpIcon,
  ArrowDownIcon,
} from "lucide-react";
import {
  getLatestMonth,
  getPreviousMonth,
  calculateTrend,
  formatCurrency,
  formatPercent,
  financialData,
  getMonthData,
  getPreviousMonthData,
} from "@/data/financialData";
import { useState } from "react";

const Index = () => {
  const [selectedMonths, setSelectedMonths] = useState<string[]>(
    financialData.map(d => d.month)
  );

  const filteredData = financialData.filter(d => selectedMonths.includes(d.month));
  
  // Agregar dados dos meses selecionados
  const aggregatedData = filteredData.reduce(
    (acc, data) => ({
      faturamentoBruto: acc.faturamentoBruto + data.faturamentoBruto,
      recorrente: acc.recorrente + data.recorrente,
      variavel: acc.variavel + data.variavel,
      impostos: acc.impostos + data.impostos,
      faturamentoLiquido: acc.faturamentoLiquido + data.faturamentoLiquido,
      custos: acc.custos + data.custos,
      lucroBruto: acc.lucroBruto + data.lucroBruto,
      despesasVariaveis: acc.despesasVariaveis + data.despesasVariaveis,
      despesasFixas: acc.despesasFixas + data.despesasFixas,
      despesasTotais: acc.despesasTotais + data.despesasTotais,
      margemContribuicao: acc.margemContribuicao + data.margemContribuicao,
      ebitda: acc.ebitda + data.ebitda,
      resultadoFinanceiro: acc.resultadoFinanceiro + data.resultadoFinanceiro,
      lucroAntesIR: acc.lucroAntesIR + data.lucroAntesIR,
      lucroLiquido: acc.lucroLiquido + data.lucroLiquido,
    }),
    {
      faturamentoBruto: 0,
      recorrente: 0,
      variavel: 0,
      impostos: 0,
      faturamentoLiquido: 0,
      custos: 0,
      lucroBruto: 0,
      despesasVariaveis: 0,
      despesasFixas: 0,
      despesasTotais: 0,
      margemContribuicao: 0,
      ebitda: 0,
      resultadoFinanceiro: 0,
      lucroAntesIR: 0,
      lucroLiquido: 0,
    }
  );

  // Calcular margens baseadas nos valores agregados
  const margemBruta = aggregatedData.faturamentoLiquido > 0 
    ? (aggregatedData.lucroBruto / aggregatedData.faturamentoLiquido) * 100 
    : 0;
  
  const margemContribuicaoPercent = aggregatedData.faturamentoLiquido > 0
    ? (aggregatedData.margemContribuicao / aggregatedData.faturamentoLiquido) * 100
    : 0;
  
  const margemEbitda = aggregatedData.faturamentoLiquido > 0
    ? (aggregatedData.ebitda / aggregatedData.faturamentoLiquido) * 100
    : 0;
  
  const margemLiquida = aggregatedData.faturamentoLiquido > 0
    ? (aggregatedData.lucroLiquido / aggregatedData.faturamentoLiquido) * 100
    : 0;

  // Para cálculo de tendência, usar último mês vs penúltimo mês do período filtrado
  const latest = filteredData[filteredData.length - 1] || getLatestMonth();
  const previous = filteredData.length >= 2 
    ? filteredData[filteredData.length - 2] 
    : (selectedMonths.length === 1 ? getPreviousMonthData(latest.month) : null);

  const faturamentoBrutoTrend = previous 
    ? calculateTrend(latest.faturamentoBruto, previous.faturamentoBruto)
    : null;
  const lucroLiquidoTrend = previous
    ? calculateTrend(latest.lucroLiquido, previous.lucroLiquido)
    : null;
  const ebitdaTrend = previous 
    ? calculateTrend(latest.ebitda, previous.ebitda)
    : null;

  const renderTrendCell = (current: number, previous: number | null) => {
    if (!previous) return null;
    const trend = calculateTrend(current, previous);
    const isPositive = trend >= 0;
    
    return (
      <div className="flex items-center justify-end gap-2">
        {isPositive ? (
          <ArrowUpIcon className="h-4 w-4 text-accent" />
        ) : (
          <ArrowDownIcon className="h-4 w-4 text-destructive" />
        )}
        <span className={`text-sm font-medium ${isPositive ? "text-accent" : "text-destructive"}`}>
          {Math.abs(trend).toFixed(1)}%
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Dashboard Financeiro
            </h1>
            <p className="text-muted-foreground text-lg">
              Saúde Work - Demonstrativo de Resultados
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Month Filter */}
        <MonthFilter 
          selectedMonths={selectedMonths}
          onMonthsChange={setSelectedMonths}
        />

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <KPICard
            title="Faturamento Bruto"
            value={formatCurrency(aggregatedData.faturamentoBruto)}
            trend={faturamentoBrutoTrend ?? undefined}
            trendLabel="vs mês anterior"
            icon={<DollarSign className="h-6 w-6" />}
            variant="primary"
          />
          <KPICard
            title="Faturamento Líquido"
            value={formatCurrency(aggregatedData.faturamentoLiquido)}
            icon={<DollarSign className="h-6 w-6" />}
            variant="default"
          />
          <KPICard
            title="EBITDA"
            value={formatCurrency(aggregatedData.ebitda)}
            trend={ebitdaTrend ?? undefined}
            trendLabel="vs mês anterior"
            icon={<TrendingUp className="h-6 w-6" />}
            variant={aggregatedData.ebitda >= 0 ? "success" : "danger"}
          />
          <KPICard
            title="Lucro Líquido"
            value={formatCurrency(aggregatedData.lucroLiquido)}
            trend={lucroLiquidoTrend ?? undefined}
            trendLabel="vs mês anterior"
            icon={<Target className="h-6 w-6" />}
            variant={aggregatedData.lucroLiquido >= 0 ? "success" : "danger"}
          />
        </div>

        {/* Margin KPIs */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <KPICard
            title="Margem Bruta"
            value={formatPercent(margemBruta)}
            icon={<PieChart className="h-6 w-6" />}
            variant="default"
          />
          <KPICard
            title="Margem de Contribuição"
            value={formatPercent(margemContribuicaoPercent)}
            icon={<PieChart className="h-6 w-6" />}
            variant="default"
          />
          <KPICard
            title="Margem EBITDA"
            value={formatPercent(margemEbitda)}
            icon={<PieChart className="h-6 w-6" />}
            variant={margemEbitda >= 0 ? "success" : "danger"}
          />
          <KPICard
            title="Margem Líquida"
            value={formatPercent(margemLiquida)}
            icon={<PieChart className="h-6 w-6" />}
            variant={margemLiquida >= 0 ? "success" : "danger"}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <RevenueChart />
          <MarginChart />
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <RevenueCompositionChart />
          <ExpensesChart />
        </div>

        {/* Summary Table */}
        <div className="bg-card rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4">Resumo Mensal com Comparativos</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Indicador
                  </th>
                  {filteredData.map((data) => (
                    <th key={data.month} className="text-right py-3 px-4 font-medium text-muted-foreground">
                      <div>{data.month}</div>
                    </th>
                  ))}
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    <div>Total</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium">Faturamento Bruto</td>
                  {filteredData.map((data, idx) => {
                    const prev = idx > 0 ? filteredData[idx - 1] : null;
                    return (
                      <td key={data.month} className="py-3 px-4">
                        <div className="text-right">{formatCurrency(data.faturamentoBruto)}</div>
                        {prev && renderTrendCell(data.faturamentoBruto, prev.faturamentoBruto)}
                      </td>
                    );
                  })}
                  <td className="py-3 px-4">
                    <div className="text-right font-semibold">{formatCurrency(aggregatedData.faturamentoBruto)}</div>
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium">Impostos</td>
                  {filteredData.map((data, idx) => {
                    const prev = idx > 0 ? filteredData[idx - 1] : null;
                    return (
                      <td key={data.month} className="py-3 px-4">
                        <div className="text-right text-destructive">{formatCurrency(data.impostos)}</div>
                        {prev && renderTrendCell(data.impostos, prev.impostos)}
                      </td>
                    );
                  })}
                  <td className="py-3 px-4">
                    <div className="text-right font-semibold text-destructive">{formatCurrency(aggregatedData.impostos)}</div>
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium">Custos</td>
                  {filteredData.map((data, idx) => {
                    const prev = idx > 0 ? filteredData[idx - 1] : null;
                    return (
                      <td key={data.month} className="py-3 px-4">
                        <div className="text-right text-destructive">{formatCurrency(data.custos)}</div>
                        {prev && renderTrendCell(data.custos, prev.custos)}
                      </td>
                    );
                  })}
                  <td className="py-3 px-4">
                    <div className="text-right font-semibold text-destructive">{formatCurrency(aggregatedData.custos)}</div>
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium">Despesas Variáveis</td>
                  {filteredData.map((data, idx) => {
                    const prev = idx > 0 ? filteredData[idx - 1] : null;
                    return (
                      <td key={data.month} className="py-3 px-4">
                        <div className="text-right text-warning">{formatCurrency(data.despesasVariaveis)}</div>
                        {prev && renderTrendCell(data.despesasVariaveis, prev.despesasVariaveis)}
                      </td>
                    );
                  })}
                  <td className="py-3 px-4">
                    <div className="text-right font-semibold text-warning">{formatCurrency(aggregatedData.despesasVariaveis)}</div>
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium">Despesas Fixas</td>
                  {filteredData.map((data, idx) => {
                    const prev = idx > 0 ? filteredData[idx - 1] : null;
                    return (
                      <td key={data.month} className="py-3 px-4">
                        <div className="text-right text-destructive">{formatCurrency(data.despesasFixas)}</div>
                        {prev && renderTrendCell(data.despesasFixas, prev.despesasFixas)}
                      </td>
                    );
                  })}
                  <td className="py-3 px-4">
                    <div className="text-right font-semibold text-destructive">{formatCurrency(aggregatedData.despesasFixas)}</div>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-bold">Lucro Líquido</td>
                  {filteredData.map((data, idx) => {
                    const prev = idx > 0 ? filteredData[idx - 1] : null;
                    const isPositive = data.lucroLiquido >= 0;
                    return (
                      <td key={data.month} className="py-3 px-4">
                        <div className={`text-right font-bold ${isPositive ? "text-accent" : "text-destructive"}`}>
                          {formatCurrency(data.lucroLiquido)}
                        </div>
                        {prev && renderTrendCell(data.lucroLiquido, prev.lucroLiquido)}
                      </td>
                    );
                  })}
                  <td className="py-3 px-4">
                    <div className={`text-right font-bold ${aggregatedData.lucroLiquido >= 0 ? "text-accent" : "text-destructive"}`}>
                      {formatCurrency(aggregatedData.lucroLiquido)}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
