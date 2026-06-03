import Link from "next/link";
import { Plus } from "lucide-react";

import { ListToolbar } from "@/components/list-toolbar";
import { ProjectKanban } from "@/components/project-kanban";
import { ToastFlash } from "@/components/toast-flash";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PROJECT_STATUS_LABELS, PROJECT_STATUSES } from "@/lib/projects";
import { createClient } from "@/lib/supabase/server";
import type { ProjectStatus, ProjectWithCustomer } from "@/types/database";

type ProjectsPageProps = {
  searchParams: Promise<{ q?: string; status?: string; toast?: string }>;
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { q, status } = await searchParams;
  const trimmed = q?.trim() ?? "";
  const safeTerm = trimmed.replace(/[,()%*]/g, "");
  const activeStatus =
    status && PROJECT_STATUSES.includes(status as ProjectStatus)
      ? (status as ProjectStatus)
      : null;

  const supabase = await createClient();
  let query = supabase
    .from("projects")
    .select("*, customers(id, name, company)")
    .order("position", { ascending: true });

  if (safeTerm) {
    query = query.ilike("name", `%${safeTerm}%`);
  }
  if (activeStatus) {
    query = query.eq("status", activeStatus);
  }

  const { data: projects } = await query;
  const typedProjects = (projects ?? []) as ProjectWithCustomer[];

  const statusOptions = PROJECT_STATUSES.map((value) => ({
    value,
    label: PROJECT_STATUS_LABELS[value],
  }));

  const isFiltered = Boolean(safeTerm || activeStatus);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <ToastFlash />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
            Manage linked delivery work in a list or drag cards across the kanban board.
          </p>
        </div>
        <Link className={buttonVariants()} href="/projects/new">
          <Plus className="size-4" />
          New project
        </Link>
      </div>

      <ListToolbar
        placeholder="Search projects"
        statuses={statusOptions}
        statusLabel="All statuses"
      />

      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>
        <TabsContent value="kanban">
          <ProjectKanban projects={typedProjects} />
        </TabsContent>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>
                {isFiltered ? "Filtered projects" : "All projects"}
                <span className="text-muted-foreground ml-2 text-sm font-normal">
                  ({typedProjects.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {typedProjects.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center text-sm">
                  {isFiltered
                    ? "No projects match your filters."
                    : "No projects yet. Create a customer first, then add a linked project."}
                </p>
              ) : (
                <>
                  {/* Mobile: stacked cards */}
                  <ul className="space-y-3 md:hidden">
                    {typedProjects.map((project) => {
                      const overdue =
                        project.due_date !== null &&
                        project.status !== "done" &&
                        project.due_date < today;
                      return (
                        <li key={project.id}>
                          <Link
                            className="hover:bg-muted/50 block rounded-lg border p-3 transition-colors"
                            href={`/projects/${project.id}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <p className="font-medium">{project.name}</p>
                              <Badge variant="secondary">
                                {PROJECT_STATUS_LABELS[project.status]}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mt-1 text-sm">
                              {project.customers?.name ?? "Unknown customer"}
                            </p>
                            {project.due_date ? (
                              <p
                                className={`mt-2 text-xs ${
                                  overdue ? "text-destructive" : "text-muted-foreground"
                                }`}
                              >
                                {overdue ? "Overdue · " : "Due "}
                                {project.due_date}
                              </p>
                            ) : null}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Desktop: table */}
                  <div className="hidden overflow-x-auto md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Due</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {typedProjects.map((project) => {
                          const overdue =
                            project.due_date !== null &&
                            project.status !== "done" &&
                            project.due_date < today;
                          return (
                            <TableRow key={project.id}>
                              <TableCell className="font-medium">
                                <Link
                                  className="hover:underline"
                                  href={`/projects/${project.id}`}
                                >
                                  {project.name}
                                </Link>
                              </TableCell>
                              <TableCell>{project.customers?.name ?? "—"}</TableCell>
                              <TableCell>
                                <Badge variant="secondary">
                                  {PROJECT_STATUS_LABELS[project.status]}
                                </Badge>
                              </TableCell>
                              <TableCell
                                className={overdue ? "text-destructive" : undefined}
                              >
                                {project.due_date ?? "—"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
