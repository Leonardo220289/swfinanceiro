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
import { financialData } from "@/data/financialData";

export const MarginChart = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Evolução das Margens</h3>
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
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            formatter={(value: number) => `${value.toFixed(1)}%`}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar 
            dataKey="margemBruta" 
            fill="hsl(var(--primary))" 
            name="Margem Bruta"
            radius={[8, 8, 0, 0]}
          />
          <Bar 
            dataKey="margemEbitda" 
            fill="hsl(var(--accent))" 
            name="Margem EBITDA"
            radius={[8, 8, 0, 0]}
          />
          <Bar 
            dataKey="margemLiquida" 
            fill="hsl(var(--chart-3))" 
            name="Margem Líquida"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
