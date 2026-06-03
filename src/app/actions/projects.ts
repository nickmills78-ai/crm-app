"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { PROJECT_STATUSES } from "@/lib/projects";
import type { ProjectStatus } from "@/types/database";

export type ProjectActionState = {
  error?: string;
};

function parseProjectForm(formData: FormData) {
  const status = String(formData.get("status") ?? "backlog") as ProjectStatus;
  const dueDate = String(formData.get("due_date") ?? "").trim();

  return {
    customer_id: String(formData.get("customer_id") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    status: PROJECT_STATUSES.includes(status) ? status : "backlog",
    due_date: dueDate || null,
  };
}

async function getNextPosition(status: ProjectStatus) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("position")
    .eq("status", status)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (data?.position ?? -1) + 1;
}

export async function createProject(
  _prevState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const payload = parseProjectForm(formData);

  if (!payload.name) {
    return { error: "Project name is required." };
  }

  if (!payload.customer_id) {
    return { error: "Select a customer for this project." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to create projects." };
  }

  const position = await getNextPosition(payload.status);
  const { error } = await supabase.from("projects").insert({
    ...payload,
    user_id: user.id,
    position,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/projects");
  revalidatePath("/");
  redirect("/projects?toast=project-created");
}

export async function updateProject(
  projectId: string,
  _prevState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const payload = parseProjectForm(formData);

  if (!payload.name) {
    return { error: "Project name is required." };
  }

  if (!payload.customer_id) {
    return { error: "Select a customer for this project." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update(payload)
    .eq("id", projectId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/");
  redirect("/projects?toast=project-updated");
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", projectId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/projects");
  revalidatePath("/");
  redirect("/projects?toast=project-deleted");
}

export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus,
  position: number,
) {
  if (!PROJECT_STATUSES.includes(status)) {
    throw new Error("Invalid project status.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ status, position })
    .eq("id", projectId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/projects");
  revalidatePath("/");
}
