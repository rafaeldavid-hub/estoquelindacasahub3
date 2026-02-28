import { useInventory } from "@/contexts/InventoryContext";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ImageViewer } from "@/components/inventory/ImageViewer";
import { ScheduleDeliveryDialog } from "@/components/inventory/ScheduleDeliveryDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Entregas() {
  const { products, markDelivered } = useInventory();
  const [delivering, setDelivering] = useState<string | null>(null);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedProductName, setSelectedProductName] = useState("");
  
  // Filtros
  const [filterDate, setFilterDate] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const entregasPendentes = products.filter(p => p.deliveryAddress && p.deliveryStatus !== "Entregue");
  const historicoEntregas = products.filter(p => p.deliveryAddress && p.deliveryStatus === "Entregue");

  // Aplicar filtros e ordenação
  const filteredAndSortedEntregas = useMemo(() => {
    let filtered = [...entregasPendentes];

    // Filtrar por data se selecionada
    if (filterDate) {
      const filterDateObj = new Date(filterDate);
      filterDateObj.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(p => {
        const saleDate = p.soldAt ? new Date(p.soldAt) : null;
        if (!saleDate) return false;
        
        saleDate.setHours(0, 0, 0, 0);
        return saleDate.getTime() === filterDateObj.getTime();
      });
    }

    // Ordenar por data de venda
    filtered.sort((a, b) => {
      const dateA = a.soldAt ? new Date(a.soldAt).getTime() : 0;
      const dateB = b.soldAt ? new Date(b.soldAt).getTime() : 0;
      
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [entregasPendentes, filterDate, sortOrder]);

  const openScheduleDialog = (productId: string, productName: string, currentScheduledDate?: string) => {
    setSelectedProductId(productId);
    setSelectedProductName(productName);
    setScheduleDialogOpen(true);
  };

  const renderEntrega = (p: any, expandable: boolean = true) => (
    <div key={p.id} className="p-3 sm:p-4 border rounded-lg bg-card/70 backdrop-blur-md border-white/20 dark:border-white/10 transition-smooth hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div className="shrink-0">
          {p.images && p.images.length > 0 ? (
            <ImageViewer images={p.images} alt={p.name} className="h-20 w-20 rounded-lg" />
          ) : (p.imageUrl || (p as any).image) ? (
            <ImageViewer src={p.imageUrl || (p as any).image} alt={p.name} className="h-20 w-20 rounded-lg" />
          ) : (
            <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center">
              <span className="text-slate-700 dark:text-muted-foreground text-sm">Imagem</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-xs sm:text-sm text-slate-700 dark:text-muted-foreground">Produto</div>
          <div className="font-semibold text-sm sm:text-base truncate">{p.name} ({p.sku})</div>
          <div className="text-xs sm:text-sm mt-2 space-y-1 break-words">
            <div>Endereço: <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.deliveryAddress || "")}`} target="_blank" rel="noreferrer" className="text-primary underline hover:no-underline transition-smooth">{p.deliveryAddress}</a></div>
            {p.deliveryReferencePoint && <div>Ponto de Referência: <strong>{p.deliveryReferencePoint}</strong></div>}
            {p.soldBy && <div>Vendedor: <strong>{p.soldBy}</strong></div>}
            {p.soldAt && <div>Data da Venda: <strong>{new Date(p.soldAt).toLocaleString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</strong></div>}
            {p.scheduledDeliveryDate && (
              <div className="text-primary font-semibold">
                Data Agendada: <strong>{new Date(p.scheduledDeliveryDate).toLocaleString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</strong>
              </div>
            )}
            <div>Tipo: <strong>{p.deliveryType || "Não informado"}</strong></div>
            {p.deliveryType === "Apartamento" && (
              <>
                <div>Andar: <strong>{p.deliveryFloor || "Não informado"}</strong></div>
                <div>Acesso: <strong>{p.deliveryAccess || "Não informado"}</strong></div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
          <div className="text-xs sm:text-sm">Status: <strong>{p.deliveryStatus}</strong></div>
          {p.deliveryStatus !== "Entregue" && (
            <div className="flex gap-2 w-full sm:w-auto flex-col sm:flex-row">
              {expandable && <Button variant="outline" className="text-xs sm:text-sm w-full sm:w-auto" onClick={() => { setDelivering(delivering === p.id ? null : p.id); }}>Ver mapa</Button>}
              <Button 
                variant="secondary" 
                className="text-xs sm:text-sm w-full sm:w-auto" 
                onClick={() => openScheduleDialog(p.id, p.name, p.scheduledDeliveryDate)}
              >
                {p.deliveryStatus === "Agendada" ? "Reagendar" : "Agendar"}
              </Button>
              <Button className="text-xs sm:text-sm w-full sm:w-auto" onClick={() => { markDelivered(p.id, "ANA"); }}>Entregue</Button>
            </div>
          )}
        </div>
      </div>
      {expandable && delivering === p.id && (
        <div className="mt-3">
          <iframe title="map-details" src={`https://www.google.com/maps?q=${encodeURIComponent(p.deliveryAddress || "")}&output=embed`} width="100%" height={240} className="rounded-lg" />
          <div className="mt-2 flex gap-2 flex-col sm:flex-row">
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.deliveryAddress || "")}`} target="_blank" rel="noreferrer" className="text-primary underline text-xs sm:text-sm hover:no-underline transition-smooth">Abrir no Maps</a>
            <Button variant="ghost" className="text-xs sm:text-sm w-full sm:w-auto" onClick={() => setDelivering(null)}>Fechar</Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <AppLayout>
      <div className="container py-4 sm:py-6 space-y-6 sm:space-y-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-4">Entregas</h1>

        {/* Filtros */}
        <div className="bg-card/70 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-sm sm:text-base">Filtros de Entregas Pendentes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filter-date" className="text-xs sm:text-sm">Filtrar por Data de Venda</Label>
              <Input
                id="filter-date"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="text-xs sm:text-sm"
              />
              {filterDate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterDate("")}
                  className="text-xs"
                >
                  Limpar filtro
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort-order" className="text-xs sm:text-sm">Ordenar por Data</Label>
              <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
                <SelectTrigger id="sort-order" className="text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mais Recentes Primeiro</SelectItem>
                  <SelectItem value="oldest">Mais Antigos Primeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {filterDate && (
            <div className="text-xs sm:text-sm text-slate-700 dark:text-muted-foreground">
              Mostrando {filteredAndSortedEntregas.length} entrega(s) para a data {new Date(filterDate).toLocaleDateString("pt-BR")}
            </div>
          )}
        </div>

        {/* Entregas Pendentes */}
        <div>
          <h2 className="font-semibold text-lg sm:text-xl mb-3 sm:mb-4">
            Entregas Pendentes ({filteredAndSortedEntregas.length})
          </h2>
          {filteredAndSortedEntregas.length === 0 ? (
            <div className="rounded-lg border bg-card/70 backdrop-blur-md p-3 sm:p-4 text-slate-700 dark:text-muted-foreground border-white/20 dark:border-white/10">
              {filterDate ? "Nenhuma entrega pendente para essa data." : "Nenhuma entrega pendente."}
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {filteredAndSortedEntregas.map(p => renderEntrega(p, true))}
            </div>
          )}
        </div>

        {/* Histórico de Entregas */}
        {historicoEntregas.length > 0 && (
          <div>
            <h2 className="font-semibold text-lg sm:text-xl mb-3 sm:mb-4">Histórico de Entregas ({historicoEntregas.length})</h2>
            <div className="grid gap-3 sm:gap-4">
              {historicoEntregas.map(p => renderEntrega(p, false))}
            </div>
          </div>
        )}
      </div>

      {/* Dialog de Agendamento */}
      {selectedProductId && (
        <ScheduleDeliveryDialog
          productId={selectedProductId}
          productName={selectedProductName}
          isOpen={scheduleDialogOpen}
          onOpenChange={setScheduleDialogOpen}
        />
      )}
    </AppLayout>
  );
}
