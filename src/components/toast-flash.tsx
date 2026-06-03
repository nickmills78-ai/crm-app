"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

type ToastKind = "success" | "info" | "error";

const TOAST_MESSAGES: Record<string, { kind: ToastKind; text: string }> = {
  "customer-created": { kind: "success", text: "Customer created." },
  "customer-updated": { kind: "success", text: "Customer updated." },
  "customer-deleted": { kind: "success", text: "Customer deleted." },
  "project-created": { kind: "success", text: "Project created." },
  "project-updated": { kind: "success", text: "Project updated." },
  "project-deleted": { kind: "success", text: "Project deleted." },
};

export function ToastFlash() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const toastKey = searchParams.get("toast");

  useEffect(() => {
    if (!toastKey) return;
    const message = TOAST_MESSAGES[toastKey];
    if (message) {
      toast[message.kind](message.text);
    }
    const params = new URLSearchParams(searchParams);
    params.delete("toast");
    const next = params.toString();
    router.replace(`${pathname}${next ? `?${next}` : ""}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toastKey]);

  return null;
}
