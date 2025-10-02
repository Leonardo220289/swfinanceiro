import { Card } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "danger" | "primary";
}

export const KPICard = ({
  title,
  value,
  trend,
  trendLabel,
  icon,
  variant = "default",
}: KPICardProps) => {
  const getTrendColor = () => {
    if (trend === undefined) return "";
    return trend >= 0 ? "text-accent" : "text-destructive";
  };

  const getCardStyles = () => {
    const baseStyles = "transition-all duration-300 hover:shadow-[var(--shadow-card-hover)]";
    switch (variant) {
      case "success":
        return cn(baseStyles, "bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20");
      case "danger":
        return cn(baseStyles, "bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20");
      case "primary":
        return cn(baseStyles, "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20");
      default:
        return cn(baseStyles, "bg-[var(--gradient-card)]");
    }
  };

  return (
    <Card className={getCardStyles()}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
          </div>
          {icon && (
            <div className={cn(
              "p-3 rounded-xl",
              variant === "success" ? "bg-accent/20 text-accent" :
              variant === "danger" ? "bg-destructive/20 text-destructive" :
              variant === "primary" ? "bg-primary/20 text-primary" :
              "bg-muted text-muted-foreground"
            )}>
              {icon}
            </div>
          )}
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-2">
            {trend >= 0 ? (
              <ArrowUpIcon className={cn("h-4 w-4", getTrendColor())} />
            ) : (
              <ArrowDownIcon className={cn("h-4 w-4", getTrendColor())} />
            )}
            <span className={cn("text-sm font-medium", getTrendColor())}>
              {Math.abs(trend).toFixed(1)}%
            </span>
            {trendLabel && (
              <span className="text-sm text-muted-foreground">{trendLabel}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
