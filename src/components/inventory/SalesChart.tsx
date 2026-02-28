import { useState, useMemo } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { useTheme } from "@/hooks/useTheme";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { ChevronDown, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

type TimeRange = "days" | "weeks" | "months" | "years" | "custom";

const timeRangeLabels: Record<TimeRange, string> = {
  days: "Últimos 7 Dias",
  weeks: "Últimas 4 Semanas",
  months: "Últimos 12 Meses",
  years: "Últimos 5 Anos",
  custom: "Período Customizado",
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function SalesChart() {
  const { products } = useInventory();
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState<TimeRange>("days");
  const [customStartDate, setCustomStartDate] = useState<string>();
  const [customEndDate, setCustomEndDate] = useState<string>();
  const [showCustomDates, setShowCustomDates] = useState(false);
  const isDark = theme === "dark";

  const chartData = useMemo(() => {
    const sold = products.filter(p => p.status === "Vendido" && p.soldAt && p.soldPrice);
    const now = new Date();
    let data: { label: string; vendas: number }[] = [];
    
    let startDate: Date;
    let endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999);

    if (timeRange === "custom" && customStartDate && customEndDate) {
      startDate = new Date(customStartDate);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(customEndDate);
      endDate.setHours(23, 59, 59, 999);
    } else if (timeRange === "days") {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
    } else if (timeRange === "weeks") {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 27);
      startDate.setHours(0, 0, 0, 0);
    } else if (timeRange === "months") {
      startDate = new Date(now);
      startDate.setFullYear(startDate.getFullYear() - 1);
      startDate.setHours(0, 0, 0, 0);
    } else {
      // years
      startDate = new Date(now);
      startDate.setFullYear(startDate.getFullYear() - 4);
      startDate.setHours(0, 0, 0, 0);
    }

    if (timeRange === "days") {
      // Últimos 7 dias
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const sum = sold
          .filter(p => {
            const soldDate = new Date(p.soldAt!);
            return soldDate >= dayStart && soldDate < dayEnd;
          })
          .reduce((acc, p) => acc + (p.soldPrice || 0), 0);

        data.push({
          label: dayStart.toLocaleDateString("pt-BR", { weekday: "short" }).slice(0, 3),
          vendas: sum,
        });
      }
    } else if (timeRange === "weeks") {
      // Últimas 4 semanas
      for (let i = 3; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i * 7);
        const weekStart = new Date(date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);

        const sum = sold
          .filter(p => {
            const soldDate = new Date(p.soldAt!);
            return soldDate >= weekStart && soldDate < weekEnd;
          })
          .reduce((acc, p) => acc + (p.soldPrice || 0), 0);

        data.push({
          label: `Sem ${weekStart.toLocaleDateString("pt-BR", { month: "short", day: "numeric" })}`,
          vendas: sum,
        });
      }
    } else if (timeRange === "months") {
      // Últimos 12 meses
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthEnd.getMonth() + 1);

        const sum = sold
          .filter(p => {
            const soldDate = new Date(p.soldAt!);
            return soldDate >= monthStart && soldDate < monthEnd;
          })
          .reduce((acc, p) => acc + (p.soldPrice || 0), 0);

        data.push({
          label: monthStart.toLocaleDateString("pt-BR", { month: "short" }).slice(0, 3),
          vendas: sum,
        });
      }
    } else if (timeRange === "years") {
      // Últimos 5 anos
      for (let i = 4; i >= 0; i--) {
        const year = now.getFullYear() - i;
        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year + 1, 0, 1);

        const sum = sold
          .filter(p => {
            const soldDate = new Date(p.soldAt!);
            return soldDate >= yearStart && soldDate < yearEnd;
          })
          .reduce((acc, p) => acc + (p.soldPrice || 0), 0);

        data.push({
          label: year.toString(),
          vendas: sum,
        });
      }
    } else if (timeRange === "custom" && customStartDate && customEndDate) {
      // Período customizado
      const start = new Date(customStartDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(customEndDate);
      end.setHours(23, 59, 59, 999);
      
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 31) {
        // Se o período é até 31 dias, mostrar por dia
        for (let i = 0; i < diffDays; i++) {
          const date = new Date(start);
          date.setDate(date.getDate() + i);
          const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          const dayEnd = new Date(dayStart);
          dayEnd.setDate(dayEnd.getDate() + 1);

          const sum = sold
            .filter(p => {
              const soldDate = new Date(p.soldAt!);
              return soldDate >= dayStart && soldDate < dayEnd;
            })
            .reduce((acc, p) => acc + (p.soldPrice || 0), 0);

          data.push({
            label: dayStart.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
            vendas: sum,
          });
        }
      } else if (diffDays <= 366) {
        // Se o período é até 1 ano, mostrar por semana
        let currentDate = new Date(start);
        while (currentDate < end) {
          const weekStart = new Date(currentDate);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 7);

          const sum = sold
            .filter(p => {
              const soldDate = new Date(p.soldAt!);
              return soldDate >= weekStart && soldDate < weekEnd;
            })
            .reduce((acc, p) => acc + (p.soldPrice || 0), 0);

          data.push({
            label: weekStart.toLocaleDateString("pt-BR", { month: "short", day: "numeric" }).slice(0, 6),
            vendas: sum,
          });

          currentDate.setDate(currentDate.getDate() + 7);
        }
      } else {
        // Se o período é mais de 1 ano, mostrar por mês
        let currentDate = new Date(start);
        while (currentDate < end) {
          const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const monthEnd = new Date(monthStart);
          monthEnd.setMonth(monthEnd.getMonth() + 1);

          const sum = sold
            .filter(p => {
              const soldDate = new Date(p.soldAt!);
              return soldDate >= monthStart && soldDate < monthEnd;
            })
            .reduce((acc, p) => acc + (p.soldPrice || 0), 0);

          data.push({
            label: monthStart.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }).slice(0, 6),
            vendas: sum,
          });

          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      }
    }

    return data;
  }, [products, timeRange, customStartDate, customEndDate]);

  const textColor = isDark ? "#e0e7ff" : "#1e293b";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";
  const barColor = isDark ? "#6366f1" : "#4f46e5";

  return (
    <div className="rounded-xl border bg-card/70 backdrop-blur-md p-3 sm:p-5 shadow-sm border-white/20 dark:border-white/10 transition-smooth hover:shadow-md">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-base sm:text-lg font-semibold">Vendas</h2>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 sm:h-9 text-xs sm:text-sm gap-2 w-fit"
                >
                  {timeRangeLabels[timeRange]}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {(["days", "weeks", "months", "years", "custom"] as TimeRange[]).map(
                  (key) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => {
                        setTimeRange(key);
                        if (key === "custom") setShowCustomDates(true);
                      }}
                      className="cursor-pointer"
                    >
                      {timeRangeLabels[key]}
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {timeRange === "custom" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCustomDates(!showCustomDates)}
                className="h-8 sm:h-9 text-xs sm:text-sm gap-2"
              >
                <Calendar className="h-4 w-4" />
                <ChevronDown className={`h-4 w-4 transition-transform ${showCustomDates ? "rotate-180" : ""}`} />
              </Button>
            )}
          </div>
        </div>

        {timeRange === "custom" && showCustomDates && (
          <div className="flex flex-col sm:flex-row gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                Data Inicial
              </label>
              <Input
                type="date"
                value={customStartDate || ""}
                onChange={(e) => {
                  setCustomStartDate(e.target.value);
                  if (!timeRange || timeRange !== "custom") {
                    setTimeRange("custom");
                  }
                }}
                className="h-8 text-xs"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                Data Final
              </label>
              <Input
                type="date"
                value={customEndDate || ""}
                onChange={(e) => {
                  setCustomEndDate(e.target.value);
                  if (!timeRange || timeRange !== "custom") {
                    setTimeRange("custom");
                  }
                }}
                min={customStartDate}
                className="h-8 text-xs"
              />
            </div>
          </div>
        )}
      </div>

      <div className="w-full h-64 sm:h-80 md:h-96 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="label"
              stroke={textColor}
              style={{ fontSize: "0.75rem" }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              stroke={textColor}
              style={{ fontSize: "0.75rem" }}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1e293b" : "#f8fafc",
                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
                borderRadius: "8px",
                color: textColor,
              }}
              labelStyle={{ color: textColor }}
              formatter={(value: number) => [formatCurrency(value), "Vendas"]}
            />
            <Bar
              dataKey="vendas"
              fill={barColor}
              radius={[8, 8, 0, 0]}
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
