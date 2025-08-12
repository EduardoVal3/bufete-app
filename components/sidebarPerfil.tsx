"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, UserPlus, FileText, CreditCard, Settings, Menu, Sun, Moon, LogOut, Bell } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuth } from "@/hooks/useAuth"
import { useClientProfile } from "@/hooks/useClientProfile"

const navigationItems = [
  {
    title: "Panel Principal",
    href: "/perfil",
    icon: Home,
    description: "Resumen y actividad",
  },
  {
    title: "Contratar Servicio",
    href: "/perfil/contratar",
    icon: UserPlus,
    description: "Solicitar nueva consulta",
  },
  {
    title: "Mis Casos",
    href: "/perfil/casos",
    icon: FileText,
    description: "Ver casos activos y completados",
  },
  {
    title: "Pagos",
    href: "/perfil/pagos",
    icon: CreditCard,
    description: "Facturas y pagos",
  },
  {
    title: "Configuración",
    href: "/perfil/configuracion",
    icon: Settings,
    description: "Perfil y preferencias",
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { user, logout, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useClientProfile()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Generar iniciales del nombre completo
  const getInitials = (fullName?: string) => {
    if (!fullName) return "CL"
    const names = fullName.trim().split(' ')
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
    }
    return names[0].charAt(0).toUpperCase() + (names[0].charAt(1) || "").toUpperCase()
  }

  // Datos del usuario basados en el perfil real
  const userData = {
    name: profile?.fullName || user?.email || "Usuario",
    email: profile?.email || user?.email || "",
    initials: getInitials(profile?.fullName),
    avatar: null, // Placeholder para cuando se implemente upload de avatares
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Error durante el logout:", error)
    }
  }

  // Mostrar estado de carga
  const isLoading = authLoading || profileLoading

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header del usuario */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {isLoading ? "..." : userData.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {isLoading ? "Cargando..." : userData.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {isLoading ? "..." : userData.email}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
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
          onClick={handleLogout}
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
