import Link from "next/link";

import { ProjectForm } from "@/components/project-form";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function NewProjectPage() {
  const supabase = await createClient();
  const { data: customers } = await supabase
    .from("customers")
    .select("id, name, company")
    .order("name", { ascending: true });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">New project</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Link delivery work to an existing customer and set its initial status.
        </p>
      </div>

      {(customers ?? []).length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Project details</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectForm customers={customers ?? []} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="space-y-4 py-10 text-center">
            <p className="text-muted-foreground text-sm">
              Add a customer before creating your first project.
            </p>
            <Link className={buttonVariants()} href="/customers/new">
              Create customer
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
