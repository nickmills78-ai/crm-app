"use client";

import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarClock } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

import { updateProjectStatus } from "@/app/actions/projects";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROJECT_STATUS_LABELS, PROJECT_STATUSES } from "@/lib/projects";
import { cn } from "@/lib/utils";
import type { ProjectStatus, ProjectWithCustomer } from "@/types/database";

type ProjectKanbanProps = {
  projects: ProjectWithCustomer[];
};

export function ProjectKanban({ projects }: ProjectKanbanProps) {
  const [items, setItems] = useState(projects);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Reset local state when the server prop changes (e.g. filter change).
  // See https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevProjects, setPrevProjects] = useState(projects);
  if (prevProjects !== projects) {
    setPrevProjects(projects);
    setItems(projects);
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      // Press-and-hold avoids fighting with scroll on phones.
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
  );

  const columns = useMemo(() => {
    return PROJECT_STATUSES.map((status) => ({
      status,
      projects: items
        .filter((project) => project.status === status)
        .sort((left, right) => left.position - right.position),
    }));
  }, [items]);

  const activeProject = items.find((project) => project.id === activeId) ?? null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) {
      return;
    }

    const projectId = String(active.id);
    const overId = String(over.id);
    const currentProject = items.find((project) => project.id === projectId);

    if (!currentProject) {
      return;
    }

    const targetStatus = PROJECT_STATUSES.includes(overId as ProjectStatus)
      ? (overId as ProjectStatus)
      : items.find((project) => project.id === overId)?.status;

    if (!targetStatus) {
      return;
    }

    const targetColumn = items
      .filter((project) => project.status === targetStatus && project.id !== projectId)
      .sort((left, right) => left.position - right.position);

    const overIndex = PROJECT_STATUSES.includes(overId as ProjectStatus)
      ? targetColumn.length
      : targetColumn.findIndex((project) => project.id === overId);

    const nextColumn = [...targetColumn];
    nextColumn.splice(overIndex < 0 ? nextColumn.length : overIndex, 0, {
      ...currentProject,
      status: targetStatus,
    });

    // No-op if nothing actually moved.
    if (
      currentProject.status === targetStatus &&
      nextColumn.findIndex((entry) => entry.id === projectId) ===
        items
          .filter((project) => project.status === targetStatus)
          .sort((left, right) => left.position - right.position)
          .findIndex((entry) => entry.id === projectId)
    ) {
      return;
    }

    const nextItems = items.map((project) => {
      if (project.id === projectId) {
        const position = nextColumn.findIndex((entry) => entry.id === projectId);
        return { ...project, status: targetStatus, position };
      }

      if (project.status === targetStatus) {
        const position = nextColumn.findIndex((entry) => entry.id === project.id);
        return { ...project, position };
      }

      return project;
    });

    setItems(nextItems);

    startTransition(async () => {
      await Promise.all(
        nextColumn.map((project, index) =>
          updateProjectStatus(project.id, targetStatus, index),
        ),
      );
    });
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <div
        className={cn(
          "grid gap-4 md:grid-cols-3",
          isPending && "opacity-80",
        )}
      >
        {columns.map((column) => (
          <KanbanColumn
            key={column.status}
            projects={column.projects}
            status={column.status}
          />
        ))}
      </div>
      <DragOverlay>
        {activeProject ? <KanbanCard project={activeProject} dragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function KanbanColumn({
  status,
  projects,
}: {
  status: ProjectStatus;
  projects: ProjectWithCustomer[];
}) {
  // Register the column itself as a droppable so empty columns accept drops.
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <Card className="bg-muted/20 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{PROJECT_STATUS_LABELS[status]}</CardTitle>
          <Badge variant="secondary">{projects.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <SortableContext
          items={[status, ...projects.map((project) => project.id)]}
          strategy={verticalListSortingStrategy}
        >
          <div
            ref={setNodeRef}
            className={cn(
              "min-h-28 rounded-xl border border-dashed p-2 transition-colors",
              isOver && "border-primary bg-primary/5",
            )}
            data-status={status}
          >
            {projects.length === 0 ? (
              <p className="text-muted-foreground py-6 text-center text-xs">
                Drop projects here
              </p>
            ) : (
              projects.map((project) => (
                <SortableProjectCard key={project.id} project={project} />
              ))
            )}
          </div>
        </SortableContext>
      </CardContent>
    </Card>
  );
}

function SortableProjectCard({ project }: { project: ProjectWithCustomer }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        // Hide the original card while its overlay is being dragged.
        opacity: isDragging ? 0 : 1,
      }}
      {...attributes}
      {...listeners}
    >
      <KanbanCard project={project} />
    </div>
  );
}

function KanbanCard({
  project,
  dragging = false,
}: {
  project: ProjectWithCustomer;
  dragging?: boolean;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const overdue =
    project.due_date !== null &&
    project.status !== "done" &&
    project.due_date < today;

  return (
    <Card
      className={cn(
        "mb-3 cursor-grab touch-none select-none active:cursor-grabbing",
        dragging && "rotate-1 shadow-lg",
      )}
    >
      <CardContent className="space-y-2 p-3">
        <Link
          className="font-medium leading-tight hover:underline"
          href={`/projects/${project.id}`}
          onPointerDown={(event) => event.stopPropagation()}
        >
          {project.name}
        </Link>
        <p className="text-muted-foreground text-xs">
          {project.customers?.name ?? "Unknown customer"}
          {project.customers?.company ? ` · ${project.customers.company}` : ""}
        </p>
        {project.due_date ? (
          <div
            className={cn(
              "flex items-center gap-1 text-xs",
              overdue ? "text-destructive" : "text-muted-foreground",
            )}
          >
            <CalendarClock className="size-3" />
            <span>
              {overdue ? "Overdue · " : "Due "}
              {project.due_date}
            </span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
