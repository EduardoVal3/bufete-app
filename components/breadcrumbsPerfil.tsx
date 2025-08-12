"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

const pathNames: Record<string, string> = {
  "/perfil": "Panel Principal",
  "/perfil/contratar": "Contratar Servicio",
  "/perfil/casos": "Mis Casos",
  "/perfil/pagos": "Pagos",
  "/perfil/configuracion": "Configuración",
}

export function Breadcrumbs() {
  const pathname = usePathname()

  if (pathname === "/perfil") {
    return null // No mostrar breadcrumbs en la página principal
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      <Link href="/perfil" className="flex items-center hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="font-medium text-foreground">{pathNames[pathname] || "Página"}</span>
    </nav>
  )
}
