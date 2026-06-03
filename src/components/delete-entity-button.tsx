"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";

type DeleteEntityButtonProps = {
  action: () => Promise<void>;
  label: string;
};

export function DeleteEntityButton({ action, label }: DeleteEntityButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(`Delete this ${label}? This action cannot be undone.`)) {
          return;
        }

        startTransition(async () => {
          await action();
        });
      }}
      type="button"
      variant="destructive"
    >
      {isPending ? "Deleting..." : `Delete ${label}`}
    </Button>
  );
}
