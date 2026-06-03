"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  if (!visible || !deferredPrompt) {
    return null;
  }

  return (
    <div className="bg-background/95 fixed inset-x-4 bottom-4 z-30 rounded-xl border p-4 shadow-lg backdrop-blur sm:inset-x-auto sm:right-6 sm:max-w-sm">
      <p className="font-medium">Install Studio CRM</p>
      <p className="text-muted-foreground mt-1 text-sm">
        Add the app to your home screen for quick access on mobile.
      </p>
      <div className="mt-4 flex gap-2">
        <Button
          className="flex-1"
          onClick={async () => {
            await deferredPrompt.prompt();
            setVisible(false);
            setDeferredPrompt(null);
          }}
        >
          Install
        </Button>
        <Button
          className="flex-1"
          onClick={() => setVisible(false)}
          variant="outline"
        >
          Not now
        </Button>
      </div>
    </div>
  );
}
