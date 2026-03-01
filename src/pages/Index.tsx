import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCards } from "@/components/inventory/StatsCards";
import { SalesChart } from "@/components/inventory/SalesChart";
import { SalesByUnitChart } from "@/components/inventory/SalesByUnitChart";

const Index = () => {

  return (
    <AppLayout>
      <div className="container py-4 sm:py-6 space-y-6 sm:space-y-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-muted-foreground">Visão geral</p>
        </div>

        <StatsCards />

        <SalesChart />

        <SalesByUnitChart />
      </div>
    </AppLayout>
  );
};

export default Index;
