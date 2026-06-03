"use client";

import { useActionState } from "react";

import {
  createProject,
  updateProject,
  type ProjectActionState,
} from "@/app/actions/projects";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PROJECT_STATUS_LABELS, PROJECT_STATUSES } from "@/lib/projects";
import type { Customer, Project } from "@/types/database";

const initialState: ProjectActionState = {};

type ProjectFormProps = {
  customers: Pick<Customer, "id" | "name" | "company">[];
  project?: Project;
};

export function ProjectForm({ customers, project }: ProjectFormProps) {
  const action = project ? updateProject.bind(null, project.id) : createProject;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Project name</Label>
          <Input
            defaultValue={project?.name}
            id="name"
            name="name"
            placeholder="Website redesign"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer_id">Customer</Label>
          <Select
            defaultValue={project?.customer_id ?? undefined}
            name="customer_id"
            required
          >
            <SelectTrigger className="w-full" id="customer_id">
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.length === 0 ? (
                <div className="text-muted-foreground px-2 py-2 text-sm">
                  No customers yet — create one first.
                </div>
              ) : (
                customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                    {customer.company ? ` · ${customer.company}` : ""}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select defaultValue={project?.status ?? "backlog"} name="status">
            <SelectTrigger className="w-full" id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {PROJECT_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="due_date">Due date</Label>
          <Input
            defaultValue={project?.due_date ?? ""}
            id="due_date"
            name="due_date"
            type="date"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          defaultValue={project?.description ?? ""}
          id="description"
          name="description"
          placeholder="Scope, milestones, or delivery notes."
          rows={5}
        />
      </div>

      {state.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button disabled={pending} type="submit">
          {pending ? "Saving..." : project ? "Save changes" : "Create project"}
        </Button>
      </div>
    </form>
  );
}
