import { ReactNode } from "react";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {children}
      </div>
    </main>
  );
}