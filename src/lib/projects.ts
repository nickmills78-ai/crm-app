import type { ProjectStatus } from "@/types/database";

export const PROJECT_STATUSES: ProjectStatus[] = ["backlog", "active", "done"];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  backlog: "Backlog",
  active: "Active",
  done: "Done",
};
