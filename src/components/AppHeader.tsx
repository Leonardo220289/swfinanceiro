import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Target, Wallet, Receipt, Settings } from "lucide-react";
import saudeWorkLogo from "@/assets/saude-work-logo.png";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/metas", label: "Metas 2026", icon: Target },
  { to: "/fluxo-caixa", label: "Fluxo de Caixa", icon: Wallet },
  { to: "/reembolsos", label: "Reembolsos", icon: Receipt },
  { to: "/cadastros", label: "Cadastros", icon: Settings },
];

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export const AppHeader = ({ title, subtitle }: AppHeaderProps) => {
  const navigate = useNavigate();
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-4 text-left"
          >
            <img src={saudeWorkLogo} alt="Saúde Work" className="h-14 w-auto" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              {subtitle && (
                <p className="text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </button>
          <nav className="flex flex-wrap gap-2">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted border-border"
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
