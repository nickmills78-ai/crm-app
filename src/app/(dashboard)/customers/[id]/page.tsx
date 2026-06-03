import { notFound } from "next/navigation";

import { deleteCustomer } from "@/app/actions/customers";
import { CustomerForm } from "@/components/customer-form";
import { DeleteEntityButton } from "@/components/delete-entity-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

type CustomerDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!customer) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{customer.name}</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Update account details or remove the customer from your workspace.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Edit customer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <CustomerForm customer={customer} />
          <DeleteEntityButton
            action={deleteCustomer.bind(null, customer.id)}
            label="customer"
          />
        </CardContent>
      </Card>
    </div>
  );
}
