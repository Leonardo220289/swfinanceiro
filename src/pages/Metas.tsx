import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, DollarSign, PieChart, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { formatCurrency, formatPercent, getDataByYear } from "@/data/financialData";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";

// Metas para 2026
const GOALS = {
  faturamentoBrutoAnual: 2028000,
  mediaFaturamentoMensal: 169000,
  lucroLiquidoAnual: 223080,
  margemBrutaMinima: 60,
};

const Metas = () => {
  const navigate = useNavigate();

  const dados2026 = getDataByYear("26");
  const mesesContabilizados = dados2026.length;
  
  const faturamentoBrutoAcumulado = dados2026.reduce((acc, d) => acc + d.faturamentoBruto, 0);
  const lucroLiquidoAcumulado = dados2026.reduce((acc, d) => acc + d.lucroLiquido, 0);
  const lucroBrutoAcumulado = dados2026.reduce((acc, d) => acc + d.lucroBruto, 0);
  const faturamentoLiquidoAcumulado = dados2026.reduce((acc, d) => acc + d.faturamentoLiquido, 0);

  // Calcular médias
  const mediaFaturamentoBruto = mesesContabilizados > 0 
    ? faturamentoBrutoAcumulado / mesesContabilizados 
    : 0;
  const margemBrutaMedia = faturamentoLiquidoAcumulado > 0 
    ? (lucroBrutoAcumulado / faturamentoLiquidoAcumulado) * 100 
    : 0;

  // Calcular progressos
  const progressFaturamentoAnual = Math.min((faturamentoBrutoAcumulado / GOALS.faturamentoBrutoAnual) * 100, 100);
  const progressMediaMensal = Math.min((mediaFaturamentoBruto / GOALS.mediaFaturamentoMensal) * 100, 100);
  const progressLucroLiquido = Math.min((lucroLiquidoAcumulado / GOALS.lucroLiquidoAnual) * 100, 100);
  const progressMargemBruta = Math.min((margemBrutaMedia / GOALS.margemBrutaMinima) * 100, 100);

  // Verificar se metas foram atingidas
  const metaFaturamentoAtingida = faturamentoBrutoAcumulado >= GOALS.faturamentoBrutoAnual;
  const metaMediaAtingida = mediaFaturamentoBruto >= GOALS.mediaFaturamentoMensal;
  const metaLucroAtingida = lucroLiquidoAcumulado >= GOALS.lucroLiquidoAnual;
  const metaMargemAtingida = margemBrutaMedia >= GOALS.margemBrutaMinima;

  const goals = [
    {
      title: "Faturamento Bruto Anual",
      description: "Meta de faturamento total para o ano de 2026",
      icon: <DollarSign className="h-6 w-6" />,
      current: faturamentoBrutoAcumulado,
      target: GOALS.faturamentoBrutoAnual,
      progress: progressFaturamentoAnual,
      achieved: metaFaturamentoAtingida,
      format: "currency" as const,
    },
    {
      title: "Média Faturamento Mensal",
      description: "Média mensal necessária para atingir a meta anual",
      icon: <TrendingUp className="h-6 w-6" />,
      current: mediaFaturamentoBruto,
      target: GOALS.mediaFaturamentoMensal,
      progress: progressMediaMensal,
      achieved: metaMediaAtingida,
      format: "currency" as const,
    },
    {
      title: "Lucro Líquido Acumulado",
      description: "Lucro líquido acumulado esperado para o ano",
      icon: <Target className="h-6 w-6" />,
      current: lucroLiquidoAcumulado,
      target: GOALS.lucroLiquidoAnual,
      progress: progressLucroLiquido,
      achieved: metaLucroAtingida,
      format: "currency" as const,
    },
    {
      title: "Margem Bruta Média",
      description: "Margem bruta mínima a ser mantida",
      icon: <PieChart className="h-6 w-6" />,
      current: margemBrutaMedia,
      target: GOALS.margemBrutaMinima,
      progress: progressMargemBruta,
      achieved: metaMargemAtingida,
      format: "percent" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Metas 2026" subtitle="Acompanhamento dos Objetivos Anuais" />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Info Card */}
        <Card className="p-6 mb-8 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Objetivos para 2026</h2>
              <p className="text-muted-foreground">
                Este painel apresenta as metas definidas para o ano de 2026. Os indicadores serão atualizados 
                conforme os dados financeiros forem sendo inseridos ao longo do ano. Acompanhe o progresso 
                em tempo real em relação aos objetivos estabelecidos.
              </p>
            </div>
          </div>
        </Card>

        {/* Goals Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {goals.map((goal) => {
            const percentageValue = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
            
            return (
              <Card 
                key={goal.title} 
                className={cn(
                  "p-6 transition-all",
                  goal.achieved 
                    ? "bg-accent/5 border-accent/20" 
                    : "bg-card"
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "p-3 rounded-xl",
                    goal.achieved ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                  )}>
                    {goal.icon}
                  </div>
                  {goal.achieved ? (
                    <div className="flex items-center gap-2 text-accent">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="text-sm font-medium">Meta Atingida</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <AlertCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Em Progresso</span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold mb-1">{goal.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{goal.description}</p>
                
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Atual</p>
                      <span className={cn(
                        "text-2xl font-bold",
                        goal.achieved ? "text-accent" : "text-foreground"
                      )}>
                        {goal.format === "currency" 
                          ? formatCurrency(goal.current)
                          : formatPercent(goal.current)
                        }
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Meta</p>
                      <span className="text-2xl font-bold text-muted-foreground">
                        {goal.format === "currency" 
                          ? formatCurrency(goal.target)
                          : `${goal.target}%`
                        }
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress 
                      value={goal.progress} 
                      className={cn(
                        "h-3",
                        goal.achieved ? "[&>div]:bg-accent" : "[&>div]:bg-primary"
                      )}
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className={cn(
                        "font-medium",
                        goal.achieved ? "text-accent" : "text-foreground"
                      )}>
                        {percentageValue.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Summary Card */}
        <Card className="p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">Resumo das Metas</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Indicador</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Meta</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Atual</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Progresso</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {goals.map((goal) => {
                  const percentageValue = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
                  return (
                    <tr key={goal.title} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{goal.title}</td>
                      <td className="py-3 px-4 text-right">
                        {goal.format === "currency" ? formatCurrency(goal.target) : `${goal.target}%`}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {goal.format === "currency" ? formatCurrency(goal.current) : formatPercent(goal.current)}
                      </td>
                      <td className="py-3 px-4 text-right">{percentageValue.toFixed(1)}%</td>
                      <td className="py-3 px-4 text-right">
                        {goal.achieved ? (
                          <span className="inline-flex items-center gap-1 text-accent">
                            <CheckCircle2 className="h-4 w-4" />
                            Atingida
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <AlertCircle className="h-4 w-4" />
                            Pendente
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Metas;
