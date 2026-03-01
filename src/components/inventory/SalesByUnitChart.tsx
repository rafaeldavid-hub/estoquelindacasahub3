import { useMemo, useState } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { useTheme } from "@/hooks/useTheme";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";


export function SalesByUnitChart() {
  const { products } = useInventory();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showData, setShowData] = useState(false);
  const [collapsed, setCollapsed] = useState(true); // start collapsed

  // Cores vivas para cada unidade
  const UNIT_COLORS: Record<string, string> = {
    "Shopping Praça Nova": "#0011c9", // Vermelho vibrante
    "Camobi": "#4ECDC4", // Turquesa
    "Estoque": "#FFE66D", // Amarelo brilhante
  };

  const chartData = useMemo(() => {
    const sold = products.filter(p => p.status === "Vendido" && p.soldPrice);

    const unitSales: Record<string, number> = {
      "Shopping Praça Nova": 0,
      "Camobi": 0,
      "Estoque": 0,
    };

    sold.forEach(product => {
      const unit = (product.unit || "Estoque") as keyof typeof unitSales;
      unitSales[unit] = (unitSales[unit] || 0) + (product.soldPrice || 0);
    });

    return Object.entries(unitSales)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        value: Math.round(value),
        percentage: 0, // Será calculado depois
      }))
      .sort((a, b) => b.value - a.value);
  }, [products]);

  // Calcular percentual
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercentage = chartData.map(item => ({
    ...item,
    percentage: total > 0 ? Math.round((item.value / total) * 100) : 0,
  }));

  const textColor = isDark ? "#F1F5F9" : "#0F172A";
  const gridColor = isDark ? "#334155" : "#E2E8F0";

  return (
    <div className="relative">
      <div className={`rounded-xl border bg-card/70 backdrop-blur-md p-3 sm:p-5 shadow-sm border-white/20 dark:border-white/10 transition-smooth hover:shadow-md relative ${collapsed ? 'max-h-44 overflow-hidden' : 'max-h-none'}`}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 p-1"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expandir' : 'Recolher'}
        >
          <ChevronDown className={`h-5 w-5 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
        </Button>
      <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-base sm:text-lg font-semibold">Unidade</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowData(!showData)}
            className="h-8 w-8"
            title={showData ? "Esconder dados" : "Mostrar dados"}
          >
            {showData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {total === 0 ? (
        <p className="text-xs sm:text-sm text-slate-700 dark:text-muted-foreground">
          Nenhuma venda registrada.
        </p>
      ) : (
        <div className={`flex flex-col lg:flex-row items-center gap-4 transition-all ${collapsed ? 'blur-sm' : ''} ${!showData ? 'blur-sm' : ''}`}>
          <ResponsiveContainer width="100%" height={collapsed ? 100 : 300}>
            <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Pie
                data={dataWithPercentage}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percentage }) => `${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dataWithPercentage.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={UNIT_COLORS[entry.name as keyof typeof UNIT_COLORS] || "#888"}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                  border: `1px solid ${isDark ? "#475569" : "#E2E8F0"}`,
                  borderRadius: "8px",
                  opacity: 0.95,
                }}
                labelStyle={{ color: textColor }}
                formatter={(value: number) =>
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(value)
                }
              />
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                  color: textColor,
                }}
                formatter={(value: any) => (
                  <span style={{ color: textColor, fontSize: "13px" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex flex-col gap-3 sm:gap-2 min-w-max">
            {dataWithPercentage.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{
                    backgroundColor: UNIT_COLORS[item.name as keyof typeof UNIT_COLORS],
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-medium">{item.name}</span>
                  <span className="text-xs text-slate-700 dark:text-muted-foreground">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(item.value)}{" "}
                    ({item.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
  );
}
