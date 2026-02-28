import { useInventory } from "@/contexts/InventoryContext";
import { Package, CheckCircle, Clock, ShoppingBag, MapPin, Truck, HeadsetIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const iconMap = {
  total: Package,
  available: CheckCircle,
  sold: ShoppingBag,
  ordered: Clock,
  pendingDeliveries: Truck,
  assistance: HeadsetIcon,
};

export function StatsCards() {
  const { stats } = useInventory();
  const navigate = useNavigate();

  const cards = [
    { label: "Total de Produtos", value: stats.total, icon: "total" as const, color: "text-foreground" },
    { label: "Disponíveis", value: stats.available, icon: "available" as const, color: "text-available" },
    { label: "Vendidos", value: stats.sold, icon: "sold" as const, color: "text-sold" },
    { label: "Pedidos (a caminho)", value: stats.ordered, icon: "ordered" as const, color: "text-ordered" },
    { label: "Entregas Pendentes", value: stats.pendingDeliveries, icon: "pendingDeliveries" as const, color: "text-warning" },
    { label: "Assistências", value: stats.assistanceCount, icon: "assistance" as const, color: "text-info" },
  ];

  return (
    <div className="grid gap-3 grid-cols-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(card => {
        const Icon = iconMap[card.icon];
        // tornar alguns cards clicáveis (status filters ou navegação)
        const isClickable = ["Disponíveis", "Vendidos", "Pedidos (a caminho)", "Entregas Pendentes"].includes(card.label);
        const handleClick = () => {
          if (card.label === "Entregas Pendentes") {
            navigate(`/entregas`);
            return;
          }
          if (card.label.includes("Total")) {
            navigate(`/produtos`);
            return;
          }
          // mapear label para status query
          const map: Record<string, string> = {
            "Disponíveis": "Disponível",
            "Vendidos": "Vendido",
            "Pedidos (a caminho)": "Pedido",
          };
          const status = map[card.label];
          navigate(`/produtos?status=${encodeURIComponent(status)}`);
        };

        return (
          <div
            key={card.label}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onClick={isClickable ? handleClick : undefined}
            onKeyDown={isClickable ? (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") handleClick(); } : undefined}
            className={`animate-fade-in relative rounded-xl border bg-card/70 backdrop-blur-md p-3 sm:p-5 shadow-sm border-white/20 dark:border-white/10 transition-smooth h-24 sm:h-28 flex flex-col justify-between ${isClickable ? "cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring" : ""}`}
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground line-clamp-2">{card.label}</span>
              <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${card.color}`} />
            </div>
            <p className={`ml-auto font-display text-2xl sm:text-4xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        );
      })}
      <div className="col-span-full border-t border-white/10 dark:border-white/5 my-2"></div>
      <div className="col-span-full grid gap-3 sm:gap-4 grid-cols-3">
        {(["Shopping Praça Nova", "Camobi", "Estoque"] as const).map(unit => (
          <div
            key={unit}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/produtos?unit=${encodeURIComponent(unit)}`)}
            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") navigate(`/produtos?unit=${encodeURIComponent(unit)}`); }}
            className="animate-fade-in relative cursor-pointer rounded-xl border bg-card/70 backdrop-blur-md p-3 sm:p-4 shadow-sm border-white/20 dark:border-white/10 transition-smooth hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring h-24 sm:h-28 flex flex-col justify-between"
          >
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-muted-foreground line-clamp-2">{unit}</p>
              <div className="flex h-6 sm:h-7 w-6 sm:w-7 items-center justify-center rounded-lg bg-accent">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-accent-foreground" />
              </div>
            </div>
            <p className="ml-auto font-display text-2xl sm:text-3xl font-bold">{stats.byUnit[unit]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
