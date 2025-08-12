"use client";
import type React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarAdmin } from "@/components/sidebar-admin";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  useEffect(() => {
    if (
      !authLoading &&
      (!user || (user.role !== "Admin" && user.role !== "SuperAdmin"))
    ) {
      toast.error("No tienes acceso a esta página", {
        description: "Por favor, inicia sesión con una cuenta autorizada.",
      });
      redirect("/auth/login");
    }
  }, [user, authLoading]);
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || (user.role !== "Admin" && user.role !== "SuperAdmin")) {
    return null;
  }
  return (
    <SidebarProvider>
      <SidebarAdmin />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 md:hidden" />
            <Separator orientation="vertical" className="mr-2 h-4 md:hidden" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Panel de Control
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
