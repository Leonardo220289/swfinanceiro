import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { financialData, formatCurrency } from "@/data/financialData";

export const RevenueCompositionChart = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Composição do Faturamento (Recorrente vs Variável)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={financialData}>
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
          <Bar
            dataKey="recorrente"
            stackId="a"
            fill="hsl(var(--primary))"
            name="Receita Recorrente"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="variavel"
            stackId="a"
            fill="hsl(var(--chart-2))"
            name="Receita Variável"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
