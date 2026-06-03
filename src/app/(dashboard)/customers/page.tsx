import Link from "next/link";
import { Plus } from "lucide-react";

import { ListToolbar } from "@/components/list-toolbar";
import { ToastFlash } from "@/components/toast-flash";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";

type CustomersPageProps = {
  searchParams: Promise<{ q?: string; toast?: string }>;
};

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const { q } = await searchParams;
  const trimmed = q?.trim() ?? "";
  // PostgREST `.or()` uses `,` as a separator; strip a few chars that would
  // break the filter syntax. The %-wildcards still cover the safe term.
  const safeTerm = trimmed.replace(/[,()%*]/g, "");

  const supabase = await createClient();
  let query = supabase
    .from("customers")
    .select("*")
    .order("updated_at", { ascending: false });

  if (safeTerm) {
    const pattern = `%${safeTerm}%`;
    query = query.or(
      `name.ilike.${pattern},company.ilike.${pattern},email.ilike.${pattern}`,
    );
  }

  const { data: customers } = await query;
  const list = customers ?? [];

  return (
    <div className="space-y-6">
      <ToastFlash />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Customers</h1>
          <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
            Keep account details, contact information, and notes in one place.
          </p>
        </div>
        <Link className={buttonVariants()} href="/customers/new">
          <Plus className="size-4" />
          New customer
        </Link>
      </div>

      <ListToolbar placeholder="Search by name, company, or email" />

      <Card>
        <CardHeader>
          <CardTitle>
            All customers
            <span className="text-muted-foreground ml-2 text-sm font-normal">
              ({list.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {list.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              {trimmed
                ? `No customers match “${trimmed}”.`
                : "No customers yet. Add your first account to start linking projects."}
            </p>
          ) : (
            <>
              {/* Mobile: stacked cards */}
              <ul className="space-y-3 md:hidden">
                {list.map((customer) => (
                  <li key={customer.id}>
                    <Link
                      className="hover:bg-muted/50 block rounded-lg border p-3 transition-colors"
                      href={`/customers/${customer.id}`}
                    >
                      <p className="font-medium">{customer.name}</p>
                      {customer.company ? (
                        <p className="text-muted-foreground text-sm">
                          {customer.company}
                        </p>
                      ) : null}
                      <div className="text-muted-foreground mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                        {customer.email ? <span>{customer.email}</span> : null}
                        {customer.phone ? <span>{customer.phone}</span> : null}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Desktop: table */}
              <div className="hidden overflow-x-auto md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {list.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">
                          <Link
                            className="hover:underline"
                            href={`/customers/${customer.id}`}
                          >
                            {customer.name}
                          </Link>
                        </TableCell>
                        <TableCell>{customer.company ?? "—"}</TableCell>
                        <TableCell>{customer.email ?? "—"}</TableCell>
                        <TableCell>{customer.phone ?? "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
