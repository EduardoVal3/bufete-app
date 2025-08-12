"use client";
import type React from "react";
import { Sidebar } from "@/components/sidebarPerfil";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function PerfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "Cliente")) {
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

  if (!user || user.role !== "Cliente") {
    return null;
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="lg:pl-64">
        {/* Header móvil - espacio para el botón de menú */}
        <div className="lg:hidden h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-center h-full">
            <h1 className="font-semibold text-lg">Panel Legal</h1>
          </div>
        </div>

        {/* Área de contenido */}
        <main className="min-h-screen lg:min-h-screen">
          <div className="container mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
