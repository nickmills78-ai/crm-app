import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-primary text-sm font-medium uppercase tracking-[0.2em]">
            Studio CRM
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Sign in to continue</h1>
          <p className="text-muted-foreground text-sm">
            Manage customers, projects, and delivery status from one responsive workspace.
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
