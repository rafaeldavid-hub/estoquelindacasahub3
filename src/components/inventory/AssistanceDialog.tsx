import { useState } from "react";
import { Product, SystemUser } from "@/types/inventory";
import { useInventory } from "@/contexts/InventoryContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface AssistanceDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: SystemUser;
}

export function AssistanceDialog({
  product,
  open,
  onOpenChange,
  user,
}: AssistanceDialogProps) {
  const { updateProductStatus } = useInventory();
  const [motivo, setMotivo] = useState(product.assistenciaMotivo || "");
  const [dataContato, setDataContato] = useState(
    product.assistenciaDataContato || ""
  );
  const [cliente, setCliente] = useState(product.assistenciaCliente || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (!motivo.trim()) {
      alert("Preencha o motivo da assistência.");
      return;
    }
    if (!dataContato.trim()) {
      alert("Preencha a data de contato com a fábrica.");
      return;
    }
    if (!cliente.trim()) {
      alert("Preencha o nome do cliente.");
      return;
    }

    setIsSaving(true);

    // Atualiza status para Assistência e passa os dados
    updateProductStatus(
      product.id,
      "Assistência",
      user,
      `Produto aberto para assistência - Motivo: ${motivo}`,
      undefined,
      undefined,
      undefined,
      undefined,
      {
        motivo: motivo.trim(),
        dataContato: dataContato.trim(),
        cliente: cliente.trim(),
      }
    );

    setIsSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Abrir Assistência</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            Produto: <strong>{product.name}</strong> ({product.sku})
          </p>

          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo da Assistência *</Label>
            <textarea
              id="motivo"
              className="w-full rounded-lg border bg-card/70 backdrop-blur-md px-3 py-2 text-sm min-h-24 resize-none border-white/20 dark:border-white/10 transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ex: Defeito na estrutura frontal, problema com reclinável, etc."
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataContato">
              Data de Contato com Fábrica *
            </Label>
            <input
              id="dataContato"
              type="date"
              className="w-full rounded-lg border bg-card/70 backdrop-blur-md px-3 py-2 text-sm border-white/20 dark:border-white/10 transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
              value={dataContato}
              onChange={(e) => setDataContato(e.target.value)}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cliente">Nome do Cliente *</Label>
            <input
              id="cliente"
              type="text"
              className="w-full rounded-lg border bg-card/70 backdrop-blur-md px-3 py-2 text-sm border-white/20 dark:border-white/10 transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Ex: João Silva"
              disabled={isSaving}
            />
          </div>

          <div className="mt-6 p-3 bg-info/10 border border-info/20 rounded-lg">
            <p className="text-xs text-info font-semibold">ℹ️ INFORMAÇÕES SERÃO REGISTRADAS</p>
            <p className="text-xs text-muted-foreground mt-1">
              Os dados acima serão arquivados no histórico do produto para futuro acompanhamento.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !motivo.trim() || !dataContato.trim() || !cliente.trim()}>
            {isSaving ? "Salvando..." : "Confirmar Assistência"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
