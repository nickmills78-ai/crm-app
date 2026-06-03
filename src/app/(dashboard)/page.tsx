import Link from "next/link";
import { ArrowRight, FolderKanban, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROJECT_STATUS_LABELS } from "@/lib/projects";
import { getRelatedCustomerName } from "@/lib/supabase/relations";
import { createClient } from "@/lib/supabase/server";
import type { ProjectStatus } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ count: customerCount }, { data: allProjects }, { data: projects }] =
    await Promise.all([
      supabase.from("customers").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("status"),
      supabase
        .from("projects")
        .select("id, name, status, due_date, customers(name)")
        .order("updated_at", { ascending: false })
        .limit(6),
    ]);

  const statusCounts = (allProjects ?? []).reduce<Record<ProjectStatus, number>>(
    (accumulator, project) => {
      const status = project.status as ProjectStatus;
      accumulator[status] += 1;
      return accumulator;
    },
    { backlog: 0, active: 0, done: 0 },
  );

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
          Track customer relationships, active delivery work, and recently updated projects.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          href="/customers"
          icon={Users}
          label="Customers"
          value={customerCount ?? 0}
        />
        <MetricCard
          href="/projects"
          icon={FolderKanban}
          label="Backlog"
          value={statusCounts.backlog}
        />
        <MetricCard
          href="/projects"
          icon={FolderKanban}
          label="Active"
          value={statusCounts.active}
        />
        <MetricCard
          href="/projects"
          icon={FolderKanban}
          label="Done"
          value={statusCounts.done}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Recent projects</h2>
            <p className="text-muted-foreground text-sm">
              Latest updates across your delivery pipeline.
            </p>
          </div>
          <Link className={buttonVariants({ variant: "outline" })} href="/projects">
            View all
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {(projects ?? []).length > 0 ? (
            projects?.map((project) => (
              <Card key={project.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle className="text-base">
                      <Link className="hover:underline" href={`/projects/${project.id}`}>
                        {project.name}
                      </Link>
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {getRelatedCustomerName(project.customers) ?? "Unknown customer"}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {PROJECT_STATUS_LABELS[project.status as ProjectStatus]}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {project.due_date ? `Due ${project.due_date}` : "No due date"}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="lg:col-span-2">
              <CardContent className="text-muted-foreground py-10 text-center text-sm">
                No projects yet. Create a customer, then add your first project.
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  href,
  icon: Icon,
  label,
  value,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-sm font-medium">{label}</CardTitle>
          <p className="mt-2 text-3xl font-semibold">{value}</p>
        </div>
        <div className="bg-muted rounded-full p-3">
          <Icon className="size-5" />
        </div>
      </CardHeader>
      <CardContent>
        <Link className="text-primary text-sm font-medium hover:underline" href={href}>
          Open {label.toLowerCase()}
        </Link>
      </CardContent>
    </Card>
  );
}