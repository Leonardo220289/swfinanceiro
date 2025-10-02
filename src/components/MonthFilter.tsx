import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { financialData } from "@/data/financialData";

interface MonthFilterProps {
  selectedMonths: string[];
  onMonthsChange: (months: string[]) => void;
}

export const MonthFilter = ({ selectedMonths, onMonthsChange }: MonthFilterProps) => {
  const allMonths = financialData.map(d => d.month);
  
  const handleSelectAll = () => {
    onMonthsChange(allMonths);
  };

  const handleSelectMonth = (month: string) => {
    if (selectedMonths.includes(month)) {
      onMonthsChange(selectedMonths.filter(m => m !== month));
    } else {
      onMonthsChange([...selectedMonths, month]);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-card rounded-xl border">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Filtrar por período:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {allMonths.map(month => (
          <button
            key={month}
            onClick={() => handleSelectMonth(month)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedMonths.includes(month)
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {month}
          </button>
        ))}
      </div>
      <button
        onClick={handleSelectAll}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all"
      >
        Selecionar Todos
      </button>
    </div>
  );
};
