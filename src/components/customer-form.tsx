"use client";

import { useActionState } from "react";

import {
  createCustomer,
  updateCustomer,
  type CustomerActionState,
} from "@/app/actions/customers";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Customer } from "@/types/database";

const initialState: CustomerActionState = {};

type CustomerFormProps = {
  customer?: Customer;
};

export function CustomerForm({ customer }: CustomerFormProps) {
  const action = customer
    ? updateCustomer.bind(null, customer.id)
    : createCustomer;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field id="name" label="Name" name="name" defaultValue={customer?.name} required />
        <Field
          id="company"
          label="Company"
          name="company"
          defaultValue={customer?.company ?? ""}
        />
        <Field
          id="email"
          label="Email"
          name="email"
          type="email"
          defaultValue={customer?.email ?? ""}
        />
        <Field
          id="phone"
          label="Phone"
          name="phone"
          defaultValue={customer?.phone ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          defaultValue={customer?.notes ?? ""}
          id="notes"
          name="notes"
          placeholder="Relationship context, preferences, or follow-up details."
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
          {pending ? "Saving..." : customer ? "Save changes" : "Create customer"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  name,
  defaultValue,
  type = "text",
  required,
}: {
  id: string;
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        defaultValue={defaultValue}
        id={id}
        name={name}
        required={required}
        type={type}
      />
    </div>
  );
}
