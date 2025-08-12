"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  Building,
  User,
  Calendar,
  Briefcase,
  DollarSign,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  FileText,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos mock de clientes (en producción vendrían de la API)
const clientes = [
  {
    id: 1,
    nombre: "María García",
    tipo: "Particular",
    email: "maria.garcia@email.com",
    telefono: "+1 234-567-8901",
    direccion: "Av. Reforma 123, CDMX",
    fechaRegistro: "2023-01-15",
    casosActivos: 2,
    casosHistoricos: 3,
    abogadoAsignado: "Dr. Carlos Mendoza",
    valorTotal: 25000,
    estado: "Activo",
    ultimaActividad: "2024-01-10",
    avatar: "/avatars/maria.jpg",
    empresa: null,
  },
  {
    id: 2,
    nombre: "TechStart SRL",
    tipo: "Empresa",
    email: "contacto@techstart.com",
    telefono: "+1 234-567-8902",
    direccion: "Torre Corporativa, Piso 15, Guadalajara",
    fechaRegistro: "2023-03-20",
    casosActivos: 1,
    casosHistoricos: 5,
    abogadoAsignado: "Dr. Roberto Silva",
    valorTotal: 85000,
    estado: "Activo",
    ultimaActividad: "2024-01-12",
    avatar: "/avatars/techstart.jpg",
    empresa: {
      rfc: "TSR230320ABC",
      representante: "Juan Carlos Pérez",
      sector: "Tecnología",
    },
  },
  {
    id: 3,
    nombre: "Carlos Rodríguez",
    tipo: "Particular",
    email: "carlos.rodriguez@email.com",
    telefono: "+1 234-567-8903",
    direccion: "Calle Principal 456, Monterrey",
    fechaRegistro: "2023-05-10",
    casosActivos: 0,
    casosHistoricos: 2,
    abogadoAsignado: "Dra. Ana López",
    valorTotal: 15000,
    estado: "Inactivo",
    ultimaActividad: "2023-12-15",
    avatar: "/avatars/carlos.jpg",
    empresa: null,
  },
  {
    id: 4,
    nombre: "Constructora ABC",
    tipo: "Empresa",
    email: "legal@constructoraabc.com",
    telefono: "+1 234-567-8904",
    direccion: "Zona Industrial Norte, Puebla",
    fechaRegistro: "2022-11-05",
    casosActivos: 3,
    casosHistoricos: 12,
    abogadoAsignado: "Dra. Patricia Ruiz",
    valorTotal: 150000,
    estado: "Activo",
    ultimaActividad: "2024-01-14",
    avatar: "/avatars/constructora.jpg",
    empresa: {
      rfc: "CAB221105XYZ",
      representante: "Ana María Sánchez",
      sector: "Construcción",
    },
  },
  {
    id: 5,
    nombre: "Laura Fernández",
    tipo: "Particular",
    email: "laura.fernandez@email.com",
    telefono: "+1 234-567-8905",
    direccion: "Colonia Centro 789, Tijuana",
    fechaRegistro: "2023-08-22",
    casosActivos: 1,
    casosHistoricos: 1,
    abogadoAsignado: "Dra. Carmen Vega",
    valorTotal: 12000,
    estado: "Activo",
    ultimaActividad: "2024-01-08",
    avatar: "/avatars/laura.jpg",
    empresa: null,
  },
  {
    id: 6,
    nombre: "Inversiones del Sur SA",
    tipo: "Empresa",
    email: "info@inversionesdelsur.com",
    telefono: "+1 234-567-8906",
    direccion: "Centro Financiero, Torre B, Cancún",
    fechaRegistro: "2023-02-14",
    casosActivos: 2,
    casosHistoricos: 8,
    abogadoAsignado: "Dr. Miguel Torres",
    valorTotal: 95000,
    estado: "Activo",
    ultimaActividad: "2024-01-13",
    avatar: "/avatars/inversiones.jpg",
    empresa: {
      rfc: "IDS230214DEF",
      representante: "Roberto Martínez",
      sector: "Financiero",
    },
  },
]

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTipo, setFilterTipo] = useState("todos")
  const [filterEstado, setFilterEstado] = useState("todos")

  const clientesFiltrados = clientes.filter((cliente) => {
    const matchesSearch =
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.abogadoAsignado.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = filterTipo === "todos" || cliente.tipo === filterTipo
    const matchesEstado = filterEstado === "todos" || cliente.estado === filterEstado

    return matchesSearch && matchesTipo && matchesEstado
  })

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Activo: "default",
      Inactivo: "secondary",
      Suspendido: "destructive",
      Pendiente: "outline",
    }
    return variants[estado] || "default"
  }

  const getTipoBadge = (tipo: string) => {
    return tipo === "Empresa" ? "default" : "outline"
  }

  const totalClientes = clientes.length
  const clientesActivos = clientes.filter((c) => c.estado === "Activo").length
  const totalCasosActivos = clientes.reduce((sum, c) => sum + c.casosActivos, 0)
  const valorTotalCartera = clientes.reduce((sum, c) => sum + c.valorTotal, 0)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Clientes</h2>
          <p className="text-muted-foreground">Administra la cartera de clientes del bufete</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClientes}</div>
            <p className="text-xs text-muted-foreground">{clientesActivos} activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos Activos</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCasosActivos}</div>
            <p className="text-xs text-muted-foreground">En todos los clientes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Cartera</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${valorTotalCartera.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Valor acumulado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crecimiento Mensual</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground">Nuevos clientes</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="Particular">Particular</SelectItem>
                <SelectItem value="Empresa">Empresa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
                <SelectItem value="Suspendido">Suspendido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de clientes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clientesFiltrados.map((cliente) => (
          <Card key={cliente.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={cliente.avatar || "/placeholder.svg"} alt={cliente.nombre} />
                    <AvatarFallback>
                      {cliente.nombre
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{cliente.nombre}</CardTitle>
                    <CardDescription>
                      {cliente.tipo === "Empresa" && cliente.empresa
                        ? `${cliente.empresa.sector} - ${cliente.empresa.representante}`
                        : "Cliente Particular"}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      Ver Casos
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant={getTipoBadge(cliente.tipo)}>
                    {cliente.tipo === "Empresa" ? (
                      <Building className="mr-1 h-3 w-3" />
                    ) : (
                      <User className="mr-1 h-3 w-3" />
                    )}
                    {cliente.tipo}
                  </Badge>
                  <Badge variant={getEstadoBadge(cliente.estado)}>{cliente.estado}</Badge>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground truncate">{cliente.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{cliente.telefono}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-xs">{cliente.direccion}</span>
                </div>
              </div>

              {cliente.empresa && (
                <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                  <div className="text-xs font-medium">Información Empresarial:</div>
                  <div className="text-xs text-muted-foreground">RFC: {cliente.empresa.rfc}</div>
                  <div className="text-xs text-muted-foreground">Sector: {cliente.empresa.sector}</div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{cliente.casosActivos}</div>
                  <div className="text-xs text-muted-foreground">Activos</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{cliente.casosHistoricos}</div>
                  <div className="text-xs text-muted-foreground">Históricos</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">${(cliente.valorTotal / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-muted-foreground">Valor</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Abogado asignado:</span>
                  <div className="text-muted-foreground">{cliente.abogadoAsignado}</div>
                </div>
              </div>

              <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                <span>Registrado: {new Date(cliente.fechaRegistro).toLocaleDateString()}</span>
                <span>Última actividad: {new Date(cliente.ultimaActividad).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {clientesFiltrados.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron clientes</h3>
            <p className="text-muted-foreground text-center">
              Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
