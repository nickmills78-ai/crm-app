import { notFound } from "next/navigation";

import { deleteProject } from "@/app/actions/projects";
import { DeleteEntityButton } from "@/components/delete-entity-button";
import { ProjectForm } from "@/components/project-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: customers }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).maybeSingle(),
    supabase.from("customers").select("id, name, company").order("name", { ascending: true }),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{project.name}</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Update delivery details, status, and customer linkage.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Edit project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProjectForm customers={customers ?? []} project={project} />
          <DeleteEntityButton action={deleteProject.bind(null, project.id)} label="project" />
        </CardContent>
      </Card>
    </div>
  );
}
