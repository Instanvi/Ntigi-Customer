"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDeclineShipment } from "@/hooks/api/use-tracking";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DeclineShipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trackingNo: string;
  onSuccess: () => void;
}

export function DeclineShipmentDialog({
  open,
  onOpenChange,
  trackingNo,
  onSuccess,
}: DeclineShipmentDialogProps) {
  const [reason, setReason] = useState("");
  const declineShipment = useDeclineShipment();

  const handleDecline = () => {
    if (reason.trim().length < 2) {
      toast.error("Please provide a valid reason for declining.");
      return;
    }

    declineShipment.mutate(
      { trackingNo, reason },
      {
        onSuccess: () => {
          toast.success("Shipment declined successfully");
          onOpenChange(false);
          onSuccess();
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to decline shipment");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Decline Shipment</DialogTitle>
          <DialogDescription>
            Please provide a reason for declining this shipment. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Reason for declining..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="col-span-3"
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={declineShipment.isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDecline} disabled={declineShipment.isPending || !reason.trim()}>
            {declineShipment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Decline
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
