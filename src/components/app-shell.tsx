import Link from "next/link";
import { LayoutDashboard, FolderKanban, Users } from "lucide-react";

import { signOut } from "@/app/actions/auth";
import { MobileNav } from "@/components/mobile-nav";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/projects", label: "Projects", icon: FolderKanban },
];

type AppShellProps = {
  children: React.ReactNode;
  userEmail?: string | null;
};

export function AppShell({ children, userEmail }: AppShellProps) {
  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
        <aside className="bg-background hidden border-r lg:flex lg:w-64 lg:flex-col">
          <div className="border-b px-6 py-5">
            <Link className="font-semibold tracking-tight" href="/">
              Studio CRM
            </Link>
            <p className="text-muted-foreground mt-1 text-sm">
              Customers and projects in one workspace.
            </p>
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-4">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>
          <div className="space-y-3 border-t p-4">
            {userEmail ? (
              <p className="text-muted-foreground truncate text-sm">{userEmail}</p>
            ) : null}
            <form action={signOut}>
              <Button className="w-full" type="submit" variant="outline">
                Sign out
              </Button>
            </form>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="bg-background/90 sticky top-0 z-20 border-b backdrop-blur">
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <MobileNav items={navItems} userEmail={userEmail} />
                <div className="lg:hidden">
                  <Link className="font-semibold" href="/">
                    Studio CRM
                  </Link>
                </div>
              </div>
              <div className="hidden items-center gap-3 lg:flex">
                {userEmail ? (
                  <span className="text-muted-foreground text-sm">{userEmail}</span>
                ) : null}
                <form action={signOut}>
                  <Button size="sm" type="submit" variant="outline">
                    Sign out
                  </Button>
                </form>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
          <PwaInstallPrompt />
        </div>
      </div>
    </div>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      className={cn(
        "text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      )}
      href={href}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}
