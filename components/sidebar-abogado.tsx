"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Calendar,
  FileText,
  Settings,
  Menu,
  Sun,
  Moon,
  LogOut,
  Bell,
  Scale,
} from "lucide-react"
import { useTheme } from "next-themes"

const navigationItems = [
  {
    title: "Panel Principal",
    href: "/area-de-trabajo",
    icon: LayoutDashboard,
    description: "Resumen y estadísticas",
  },
  {
    title: "Mis Casos",
    href: "/area-de-trabajo/casos",
    icon: FolderOpen,
    description: "Gestionar casos activos",
  },
  {
    title: "Mis Clientes",
    href: "/area-de-trabajo/clientes",
    icon: Users,
    description: "Directorio de clientes",
  },
  {
    title: "Calendario",
    href: "/area-de-trabajo/calendario",
    icon: Calendar,
    description: "Citas y audiencias",
  },
  {
    title: "Documentos",
    href: "/area-de-trabajo/documentos",
    icon: FileText,
    description: "Biblioteca de documentos",
  },
  {
    title: "Configuración",
    href: "/area-de-trabajo/configuracion",
    icon: Settings,
    description: "Ajustes del perfil",
  },
]

interface SidebarAbogadoProps {
  className?: string
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

export function SidebarAbogado({ className, user }: SidebarAbogadoProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Datos por defecto del abogado
  const userData = user || {
    name: "Dr. Juan Pérez",
    email: "juan.perez@bufete.com",
    avatar: "/placeholder.svg?height=40&width=40",
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header del abogado */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-2 text-primary">
            <Scale className="h-5 w-5" />
            <span className="font-bold text-lg">Bufete Legal</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">{getInitials(userData.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{userData.name}</p>
            <p className="text-xs text-muted-foreground truncate">{userData.email}</p>
            <p className="text-xs text-primary font-medium">Abogado</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <div className="px-3 py-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Área de Trabajo</h2>
          </div>
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                  isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs opacity-70 truncate">{item.description}</div>
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer con controles */}
      <div className="p-4 border-t space-y-2">
        {/* Toggle de tema */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full justify-start gap-3"
        >
          {!mounted ? (
            <>
              <Sun className="h-4 w-4" />
              Cambiar Tema
            </>
          ) : (
            <>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? "Modo Claro" : "Modo Oscuro"}
            </>
          )}
        </Button>

        {/* Cerrar sesión */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Sidebar para desktop */}
      <div
        className={`hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:bg-background ${className}`}
      >
        <SidebarContent />
      </div>

      {/* Sidebar móvil */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden fixed top-4 left-4 z-50 h-9 w-9 p-0 bg-background border shadow-sm"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
