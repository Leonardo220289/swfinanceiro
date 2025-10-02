import { KPICard } from "@/components/KPICard";
import { RevenueChart } from "@/components/RevenueChart";
import { MarginChart } from "@/components/MarginChart";
import { ExpensesChart } from "@/components/ExpensesChart";
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
  const latest = filteredData[filteredData.length - 1] || getLatestMonth();
  const previous = filteredData[filteredData.length - 2] || getPreviousMonth();

  const faturamentoBrutoTrend = calculateTrend(
    latest.faturamentoBruto,
    previous.faturamentoBruto
  );
  const lucroLiquidoTrend = calculateTrend(
    latest.lucroLiquido,
    previous.lucroLiquido
  );
  const ebitdaTrend = calculateTrend(latest.ebitda, previous.ebitda);

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
            value={formatCurrency(latest.faturamentoBruto)}
            trend={faturamentoBrutoTrend}
            trendLabel="vs mês anterior"
            icon={<DollarSign className="h-6 w-6" />}
            variant="primary"
          />
          <KPICard
            title="Faturamento Líquido"
            value={formatCurrency(latest.faturamentoLiquido)}
            icon={<DollarSign className="h-6 w-6" />}
            variant="default"
          />
          <KPICard
            title="EBITDA"
            value={formatCurrency(latest.ebitda)}
            trend={ebitdaTrend}
            trendLabel="vs mês anterior"
            icon={<TrendingUp className="h-6 w-6" />}
            variant={latest.ebitda >= 0 ? "success" : "danger"}
          />
          <KPICard
            title="Lucro Líquido"
            value={formatCurrency(latest.lucroLiquido)}
            trend={lucroLiquidoTrend}
            trendLabel="vs mês anterior"
            icon={<Target className="h-6 w-6" />}
            variant={latest.lucroLiquido >= 0 ? "success" : "danger"}
          />
        </div>

        {/* Margin KPIs */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <KPICard
            title="Margem Bruta"
            value={formatPercent(latest.margemBruta)}
            icon={<PieChart className="h-6 w-6" />}
            variant="default"
          />
          <KPICard
            title="Margem de Contribuição"
            value={formatPercent(latest.margemContribuicaoPercent)}
            icon={<PieChart className="h-6 w-6" />}
            variant="default"
          />
          <KPICard
            title="Margem EBITDA"
            value={formatPercent(latest.margemEbitda)}
            icon={<PieChart className="h-6 w-6" />}
            variant={latest.margemEbitda >= 0 ? "success" : "danger"}
          />
          <KPICard
            title="Margem Líquida"
            value={formatPercent(latest.margemLiquida)}
            icon={<PieChart className="h-6 w-6" />}
            variant={latest.margemLiquida >= 0 ? "success" : "danger"}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <RevenueChart />
          <MarginChart />
        </div>

        <div className="grid gap-6 mb-8">
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
