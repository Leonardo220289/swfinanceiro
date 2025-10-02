import { KPICard } from "@/components/KPICard";
import { RevenueChart } from "@/components/RevenueChart";
import { MarginChart } from "@/components/MarginChart";
import { ExpensesChart } from "@/components/ExpensesChart";
import {
  DollarSign,
  TrendingUp,
  PieChart,
  Target,
} from "lucide-react";
import {
  getLatestMonth,
  getPreviousMonth,
  calculateTrend,
  formatCurrency,
  formatPercent,
} from "@/data/financialData";

const Index = () => {
  const latest = getLatestMonth();
  const previous = getPreviousMonth();

  const faturamentoBrutoTrend = calculateTrend(
    latest.faturamentoBruto,
    previous.faturamentoBruto
  );
  const lucroLiquidoTrend = calculateTrend(
    latest.lucroLiquido,
    previous.lucroLiquido
  );
  const ebitdaTrend = calculateTrend(latest.ebitda, previous.ebitda);

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
          <h3 className="text-lg font-semibold mb-4">Resumo Mensal</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Indicador
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    Jun/25
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    Jul/25
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    Ago/25
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium">Faturamento Bruto</td>
                  <td className="py-3 px-4 text-right">
                    {formatCurrency(109664.03)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {formatCurrency(162370.81)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {formatCurrency(112951.04)}
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium">Custos</td>
                  <td className="py-3 px-4 text-right text-destructive">
                    {formatCurrency(48489.97)}
                  </td>
                  <td className="py-3 px-4 text-right text-destructive">
                    {formatCurrency(57118.57)}
                  </td>
                  <td className="py-3 px-4 text-right text-destructive">
                    {formatCurrency(50405.32)}
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium">Despesas Variáveis</td>
                  <td className="py-3 px-4 text-right text-warning">
                    {formatCurrency(18531.05)}
                  </td>
                  <td className="py-3 px-4 text-right text-warning">
                    {formatCurrency(9710.28)}
                  </td>
                  <td className="py-3 px-4 text-right text-warning">
                    {formatCurrency(9721.50)}
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium">Despesas Fixas</td>
                  <td className="py-3 px-4 text-right text-destructive">
                    {formatCurrency(11523.52)}
                  </td>
                  <td className="py-3 px-4 text-right text-destructive">
                    {formatCurrency(55842.69)}
                  </td>
                  <td className="py-3 px-4 text-right text-destructive">
                    {formatCurrency(55338.98)}
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-bold">Lucro Líquido</td>
                  <td className="py-3 px-4 text-right font-bold text-accent">
                    {formatCurrency(20110.20)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-accent">
                    {formatCurrency(17234.87)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-destructive">
                    {formatCurrency(-10059.71)}
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
