"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type StatusOption = { value: string; label: string };

type ListToolbarProps = {
  placeholder?: string;
  statuses?: StatusOption[];
  statusLabel?: string;
};

const ALL_STATUSES = "all";

export function ListToolbar({
  placeholder = "Search...",
  statuses,
  statusLabel = "All statuses",
}: ListToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const currentStatus = searchParams.get("status") ?? ALL_STATUSES;

  // Debounce search updates to URL.
  useEffect(() => {
    const currentQ = searchParams.get("q") ?? "";
    if (query === currentQ) return;

    const handle = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      const next = params.toString();
      startTransition(() => {
        router.replace(`${pathname}${next ? `?${next}` : ""}`);
      });
    }, 250);

    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function setStatus(value: string | null) {
    const params = new URLSearchParams(searchParams);
    if (!value || value === ALL_STATUSES) {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    const next = params.toString();
    startTransition(() => {
      router.replace(`${pathname}${next ? `?${next}` : ""}`);
    });
  }

  function clearAll() {
    setQuery("");
    startTransition(() => {
      router.replace(pathname);
    });
  }

  const hasFilters =
    Boolean(searchParams.get("q")) ||
    (Boolean(statuses) && currentStatus !== ALL_STATUSES);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          className="pl-9"
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          value={query}
        />
      </div>
      {statuses ? (
        <Select onValueChange={setStatus} value={currentStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_STATUSES}>{statusLabel}</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}
      {hasFilters ? (
        <Button
          className="self-start sm:self-auto"
          onClick={clearAll}
          size="sm"
          variant="ghost"
        >
          <X className="size-4" />
          Clear
        </Button>
      ) : null}
    </div>
  );
}
