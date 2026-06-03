export type ProjectStatus = "backlog" | "active" | "done";

export type Customer = {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  customer_id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  position: number;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectWithCustomer = Project & {
  customers: Pick<Customer, "id" | "name" | "company"> | null;
};
