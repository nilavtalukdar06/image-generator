import { AppSidebar } from "@/components/shared/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({ children }: child) {
  const result = await auth.api.getSession({
    headers: await headers(),
  });
  if (!result?.session) {
    redirect("/login");
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <div className="p-2 border-b">
          <SidebarTrigger className="text-muted-foreground" />
        </div>
        {children}
      </div>
    </SidebarProvider>
  );
}
