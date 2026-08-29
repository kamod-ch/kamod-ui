import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import { PaymentForm } from "../payment-form/payment-form";
import type { PaymentFormValues, SavedCardSummary } from "../shared/types";

export type SavedCardsListProps = {
  cards?: SavedCardSummary[];
  onSetDefault?: (id: string) => void;
  onRemove?: (id: string) => void;
  onAdd?: (values: PaymentFormValues) => void | Promise<void>;
};

export const SavedCardsList = ({
  cards = [],
  onSetDefault,
  onRemove,
  onAdd,
}: SavedCardsListProps) => {
  const [adding, setAdding] = useState(false);
  const [removeId, setRemoveId] = useState<string | null>(null);

  return (
    <div
      data-slot="block-saved-cards-list"
      class="bg-background text-foreground mx-auto w-full max-w-lg space-y-3 rounded-xl border p-4"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-medium">Saved cards</h2>
        <Button type="button" size="sm" onClick={() => setAdding(true)}>
          Add card
        </Button>
      </div>
      {cards.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No saved cards</EmptyTitle>
            <EmptyDescription>Only masked, tokenized summaries are stored here.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul class="space-y-2">
          {cards.map((card) => (
            <li key={card.id} class="flex items-center justify-between gap-3 rounded-lg border p-3">
              <div>
                <p class="text-sm font-medium">
                  {card.brand} •••• {card.last4}
                </p>
                <p class="text-muted-foreground text-xs">
                  Expires {card.expiryMonth}/{card.expiryYear.slice(-2)}
                  {card.isDefault ? " · Default" : ""}
                </p>
              </div>
              <div class="flex gap-2">
                {!card.isDefault ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onSetDefault?.(card.id)}
                  >
                    Set default
                  </Button>
                ) : null}
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setRemoveId(card.id)}
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a card</DialogTitle>
          </DialogHeader>
          <PaymentForm
            onSubmit={async (values) => {
              await onAdd?.(values);
              setAdding(false);
            }}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog open={removeId != null} onOpenChange={(open) => !open && setRemoveId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this card?</AlertDialogTitle>
            <AlertDialogDescription>
              The masked summary is removed. PAN and CVC are never kept in this list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (removeId) onRemove?.(removeId);
                setRemoveId(null);
              }}
            >
              Remove card
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
