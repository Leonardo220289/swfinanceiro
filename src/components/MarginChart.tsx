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
} from "recharts";
import { financialData } from "@/data/financialData";

export const MarginChart = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Evolução das Margens</h3>
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
          <Line 
            type="monotone"
            dataKey="margemBruta" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            name="Margem Bruta"
            dot={{ fill: 'hsl(var(--primary))', r: 5 }}
          />
          <Line 
            type="monotone"
            dataKey="margemEbitda" 
            stroke="hsl(var(--accent))" 
            strokeWidth={3}
            name="Margem EBITDA"
            dot={{ fill: 'hsl(var(--accent))', r: 5 }}
          />
          <Line 
            type="monotone"
            dataKey="margemLiquida" 
            stroke="hsl(var(--chart-3))" 
            strokeWidth={3}
            name="Margem Líquida"
            dot={{ fill: 'hsl(var(--chart-3))', r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
