"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type CustomerActionState = {
  error?: string;
};

function parseCustomerForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    company: String(formData.get("company") ?? "").trim() || null,
    notes: String(formData.get("notes") ?? "").trim() || null,
  };
}

export async function createCustomer(
  _prevState: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const payload = parseCustomerForm(formData);

  if (!payload.name) {
    return { error: "Customer name is required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to create customers." };
  }

  const { error } = await supabase.from("customers").insert({
    ...payload,
    user_id: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/customers");
  revalidatePath("/");
  redirect("/customers?toast=customer-created");
}

export async function updateCustomer(
  customerId: string,
  _prevState: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const payload = parseCustomerForm(formData);

  if (!payload.name) {
    return { error: "Customer name is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("customers")
    .update(payload)
    .eq("id", customerId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/customers");
  revalidatePath(`/customers/${customerId}`);
  revalidatePath("/projects");
  revalidatePath("/");
  redirect("/customers?toast=customer-updated");
}

export async function deleteCustomer(customerId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("customers").delete().eq("id", customerId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/customers");
  revalidatePath("/projects");
  revalidatePath("/");
  redirect("/customers?toast=customer-deleted");
}
