import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, DollarSign, PieChart, CheckCircle2, AlertCircle } from "lucide-react";
import { financialData, formatCurrency, formatPercent } from "@/data/financialData";
import { cn } from "@/lib/utils";

interface GoalsPanelProps {
  selectedMonths: string[];
}

// Metas para 2026
const GOALS = {
  faturamentoBrutoAnual: 2028000,
  mediaFaturamentoMensal: 169000,
  lucroLiquidoAnual: 223080,
  margemBrutaMinima: 60,
};

export const GoalsPanel = ({ selectedMonths }: GoalsPanelProps) => {
  // Filtrar dados pelos meses selecionados
  const filteredData = financialData.filter(d => selectedMonths.includes(d.month));
  
  // Calcular valores acumulados
  const totalFaturamentoBruto = filteredData.reduce((acc, d) => acc + d.faturamentoBruto, 0);
  const totalLucroLiquido = filteredData.reduce((acc, d) => acc + d.lucroLiquido, 0);
  const totalFaturamentoLiquido = filteredData.reduce((acc, d) => acc + d.faturamentoLiquido, 0);
  const totalLucroBruto = filteredData.reduce((acc, d) => acc + d.lucroBruto, 0);
  
  // Calcular médias
  const mediaFaturamentoBruto = filteredData.length > 0 ? totalFaturamentoBruto / filteredData.length : 0;
  const margemBrutaMedia = totalFaturamentoLiquido > 0 ? (totalLucroBruto / totalFaturamentoLiquido) * 100 : 0;
  
  // Calcular progressos (limitando a 100% para a barra visual)
  const progressFaturamentoAnual = Math.min((totalFaturamentoBruto / GOALS.faturamentoBrutoAnual) * 100, 100);
  const progressMediaMensal = Math.min((mediaFaturamentoBruto / GOALS.mediaFaturamentoMensal) * 100, 100);
  const progressLucroLiquido = Math.min((totalLucroLiquido / GOALS.lucroLiquidoAnual) * 100, 100);
  const progressMargemBruta = Math.min((margemBrutaMedia / GOALS.margemBrutaMinima) * 100, 100);
  
  // Verificar se metas foram atingidas
  const metaFaturamentoAtingida = totalFaturamentoBruto >= GOALS.faturamentoBrutoAnual;
  const metaMediaAtingida = mediaFaturamentoBruto >= GOALS.mediaFaturamentoMensal;
  const metaLucroAtingida = totalLucroLiquido >= GOALS.lucroLiquidoAnual;
  const metaMargemAtingida = margemBrutaMedia >= GOALS.margemBrutaMinima;

  const goals = [
    {
      title: "Faturamento Bruto Anual",
      icon: <DollarSign className="h-5 w-5" />,
      current: totalFaturamentoBruto,
      target: GOALS.faturamentoBrutoAnual,
      progress: progressFaturamentoAnual,
      achieved: metaFaturamentoAtingida,
      format: "currency",
    },
    {
      title: "Média Faturamento Mensal",
      icon: <TrendingUp className="h-5 w-5" />,
      current: mediaFaturamentoBruto,
      target: GOALS.mediaFaturamentoMensal,
      progress: progressMediaMensal,
      achieved: metaMediaAtingida,
      format: "currency",
    },
    {
      title: "Lucro Líquido Acumulado",
      icon: <Target className="h-5 w-5" />,
      current: totalLucroLiquido,
      target: GOALS.lucroLiquidoAnual,
      progress: progressLucroLiquido,
      achieved: metaLucroAtingida,
      format: "currency",
    },
    {
      title: "Margem Bruta Média",
      icon: <PieChart className="h-5 w-5" />,
      current: margemBrutaMedia,
      target: GOALS.margemBrutaMinima,
      progress: progressMargemBruta,
      achieved: metaMargemAtingida,
      format: "percent",
    },
  ];

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Target className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Metas 2026</h3>
          <p className="text-sm text-muted-foreground">
            Acompanhamento do progresso em relação aos objetivos anuais
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {goals.map((goal) => {
          const percentageValue = (goal.current / goal.target) * 100;
          const isOverTarget = percentageValue >= 100;
          
          return (
            <div 
              key={goal.title} 
              className={cn(
                "p-4 rounded-xl border transition-all",
                goal.achieved 
                  ? "bg-accent/5 border-accent/20" 
                  : "bg-muted/30 border-border"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  goal.achieved ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                )}>
                  {goal.icon}
                </div>
                {goal.achieved ? (
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                {goal.title}
              </h4>
              
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className={cn(
                    "text-xl font-bold",
                    goal.achieved ? "text-accent" : "text-foreground"
                  )}>
                    {goal.format === "currency" 
                      ? formatCurrency(goal.current)
                      : formatPercent(goal.current)
                    }
                  </span>
                  <span className={cn(
                    "text-sm font-medium",
                    isOverTarget ? "text-accent" : "text-muted-foreground"
                  )}>
                    {percentageValue.toFixed(1)}%
                  </span>
                </div>
                
                <Progress 
                  value={goal.progress} 
                  className={cn(
                    "h-2",
                    goal.achieved ? "[&>div]:bg-accent" : "[&>div]:bg-primary"
                  )}
                />
                
                <p className="text-xs text-muted-foreground">
                  Meta: {goal.format === "currency" 
                    ? formatCurrency(goal.target)
                    : `${goal.target}%`
                  }
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
