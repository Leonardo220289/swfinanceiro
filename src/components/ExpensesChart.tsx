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

export const ExpensesChart = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Custos e Despesas</h3>
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
            dataKey="custos" 
            fill="hsl(var(--chart-black))" 
            name="Custos"
            radius={[8, 8, 0, 0]}
          />
          <Bar 
            dataKey="despesasVariaveis" 
            fill="hsl(var(--warning))" 
            name="Despesas Variáveis"
            radius={[8, 8, 0, 0]}
          />
          <Bar 
            dataKey="despesasFixas" 
            fill="hsl(var(--destructive))" 
            name="Despesas Fixas"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
