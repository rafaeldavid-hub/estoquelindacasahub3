import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInventory } from "@/contexts/InventoryContext";

interface ScheduleDeliveryDialogProps {
  productId: string;
  productName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentScheduledDate?: string;
}

export function ScheduleDeliveryDialog({
  productId,
  productName,
  isOpen,
  onOpenChange,
  currentScheduledDate,
}: ScheduleDeliveryDialogProps) {
  const { scheduleDelivery } = useInventory();
  const [scheduledDate, setScheduledDate] = useState(currentScheduledDate || "");
  const [loading, setLoading] = useState(false);

  const handleSchedule = () => {
    if (!scheduledDate) {
      alert("Por favor, selecione uma data para agendar a entrega.");
      return;
    }

    setLoading(true);
    try {
      scheduleDelivery(productId, scheduledDate, "ANA");
      setScheduledDate("");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agendar Entrega</DialogTitle>
          <DialogDescription>
            Agende a entrega para o produto: <strong>{productName}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="schedule-date">Data e Hora da Entrega</Label>
            <Input
              id="schedule-date"
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSchedule} disabled={loading}>
            {loading ? "Agendando..." : "Agendar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
