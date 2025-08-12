"use client"
import {
  Users,
  Scale,
  FileText,
  Briefcase,
  Calendar,
  BookOpen,
  MessageSquare,
  Star,
  HelpCircle,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  Building2,
  UserCheck,
  Clock,
  Mail,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"

// Datos del administrador (en producción vendrían de la API)
const adminData = {
  name: "María González",
  email: "admin@bufete.com",
  role: "Administrador",
  avatar: "/avatars/admin.jpg",
}

// Estructura de navegación del panel administrativo
const navigationItems = [
  {
    title: "Panel Principal",
    url: "/dashboard",
    icon: BarChart3,
    isActive: true,
  },
  {
    title: "Gestión de Personal",
    icon: Users,
    items: [
      {
        title: "Abogados",
        url: "/dashboard/abogados",
        icon: Scale,
      },
      {
        title: "Clientes",
        url: "/dashboard/clientes",
        icon: UserCheck,
      },
      {
        title: "Vacaciones",
        url: "/dashboard/vacaciones",
        icon: Calendar,
      },
    ],
  },
  {
    title: "Gestión Legal",
    icon: Briefcase,
    items: [
      {
        title: "Casos Activos",
        url: "/dashboard/casos",
        icon: FileText,
      },
      {
        title: "Servicios",
        url: "/dashboard/servicios",
        icon: Shield,
      },
      {
        title: "Consultas",
        url: "/dashboard/consultas",
        icon: Mail,
      },
    ],
  },
  {
    title: "Contenido Web",
    icon: BookOpen,
    items: [
      {
        title: "Blog",
        url: "/dashboard/blog",
        icon: BookOpen,
      },
      {
        title: "Testimonios",
        url: "/dashboard/testimonios",
        icon: Star,
      },
      {
        title: "FAQ",
        url: "/dashboard/faq",
        icon: HelpCircle,
      },
    ],
  },
  {
    title: "Comunicación",
    icon: MessageSquare,
    items: [
      {
        title: "Mensajes",
        url: "/dashboard/mensajes",
        icon: MessageSquare,
      },
      {
        title: "Notificaciones",
        url: "/dashboard/notificaciones",
        icon: Clock,
      },
    ],
  },
]

export function SidebarAdmin() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Lexfirm</span>
            <span className="text-xs text-muted-foreground">Panel Admin</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible defaultOpen className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                <Link href={subItem.url}>
                                  <subItem.icon className="h-4 w-4" />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Configuración</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/configuracion">
                    <Settings className="h-4 w-4" />
                    <span>Configuración</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="flex items-center justify-between gap-2 p-2">
          <span className="text-xs font-medium">Tema</span>
          <ThemeToggle />
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={adminData.avatar || "/placeholder.svg"} alt={adminData.name} />
                    <AvatarFallback>
                      {adminData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium">{adminData.name}</span>
                    <span className="text-xs text-muted-foreground">{adminData.role}</span>
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-56">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
