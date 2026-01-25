import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { financialData, formatCurrency } from "@/data/financialData";

export const RevenueChart = () => {
  // Calcular médias históricas
  const avgFaturamentoBruto = financialData.reduce((acc, d) => acc + d.faturamentoBruto, 0) / financialData.length;
  const avgFaturamentoLiquido = financialData.reduce((acc, d) => acc + d.faturamentoLiquido, 0) / financialData.length;
  const avgLucroLiquido = financialData.reduce((acc, d) => acc + d.lucroLiquido, 0) / financialData.length;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Evolução de Receitas</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={financialData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="month" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Legend />
          {/* Linhas de média histórica */}
          <ReferenceLine 
            y={avgFaturamentoBruto} 
            stroke="hsl(var(--primary))" 
            strokeDasharray="5 5" 
            strokeOpacity={0.6}
            label={{ value: `Média: ${formatCurrency(avgFaturamentoBruto)}`, position: 'insideTopRight', fontSize: 10, fill: 'hsl(var(--primary))' }}
          />
          <ReferenceLine 
            y={avgLucroLiquido} 
            stroke="hsl(var(--accent))" 
            strokeDasharray="5 5" 
            strokeOpacity={0.6}
          />
          <Line
            type="monotone"
            dataKey="faturamentoBruto"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            name="Faturamento Bruto"
            dot={{ fill: 'hsl(var(--primary))', r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="faturamentoLiquido"
            stroke="hsl(var(--chart-2))"
            strokeWidth={3}
            name="Faturamento Líquido"
            dot={{ fill: 'hsl(var(--chart-2))', r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="lucroLiquido"
            stroke="hsl(var(--accent))"
            strokeWidth={3}
            name="Lucro Líquido"
            dot={{ fill: 'hsl(var(--accent))', r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
