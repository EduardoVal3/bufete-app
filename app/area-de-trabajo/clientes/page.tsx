"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Phone,
  Mail,
  MapPin,
  FileText,
  MoreHorizontal,
  User,
  Building,
  Clock,
  Plus,
  Star,
  Calendar,
  DollarSign,
  MessageSquare,
  Eye,
  Edit,
  Archive,
  TrendingUp,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface Client {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  ubicacion: string
  avatar?: string
  fechaRegistro: string
  ultimoContacto: string
  casosActivos: number
  casosCompletados: number
  montoTotal: number
  estado: "activo" | "inactivo" | "pendiente"
  tipoCliente: "individual" | "empresa"
  calificacion?: number
  proximaCita?: string
  notas?: string
  especialidadRequerida: string
  prioridad: "alta" | "media" | "baja"
}

export default function ClientesAbogado() {
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFilter, setTipoFilter] = useState("all")
  const [estadoFilter, setEstadoFilter] = useState("all")
  const [prioridadFilter, setPrioridadFilter] = useState("all")

  // Datos simulados de clientes del abogado Dr. Juan Pérez
  const clientes: Client[] = [
    {
      id: "1",
      nombre: "María",
      apellido: "González",
      email: "maria.gonzalez@email.com",
      telefono: "+504 9876-5432",
      ubicacion: "Tegucigalpa, Honduras",
      avatar: "/placeholder.svg?height=40&width=40",
      fechaRegistro: "2023-12-01",
      ultimoContacto: "2025-01-16",
      casosActivos: 1,
      casosCompletados: 0,
      montoTotal: 25000,
      estado: "activo",
      tipoCliente: "individual",
      calificacion: 5,
      proximaCita: "2025-01-17 09:00",
      notas: "Cliente muy colaborativa, proceso de divorcio consensual",
      especialidadRequerida: "Derecho Familiar",
      prioridad: "alta",
    },
    {
      id: "2",
      nombre: "Carlos",
      apellido: "Pérez",
      email: "carlos.perez@email.com",
      telefono: "+504 8765-4321",
      ubicacion: "San Pedro Sula, Honduras",
      avatar: "/placeholder.svg?height=40&width=40",
      fechaRegistro: "2024-01-05",
      ultimoContacto: "2025-01-15",
      casosActivos: 1,
      casosCompletados: 0,
      montoTotal: 15000,
      estado: "activo",
      tipoCliente: "individual",
      calificacion: 4,
      proximaCita: "2025-01-16 14:30",
      notas: "Caso laboral complejo, requiere documentación adicional",
      especialidadRequerida: "Derecho Laboral",
      prioridad: "media",
    },
    {
      id: "3",
      nombre: "Tech Solutions",
      apellido: "S.A.",
      email: "contacto@techsolutions.hn",
      telefono: "+504 2234-5678",
      ubicacion: "Tegucigalpa, Honduras",
      avatar: "/placeholder.svg?height=40&width=40",
      fechaRegistro: "2023-12-15",
      ultimoContacto: "2025-01-14",
      casosActivos: 0,
      casosCompletados: 1,
      montoTotal: 35000,
      estado: "activo",
      tipoCliente: "empresa",
      calificacion: 5,
      notas: "Empresa tecnológica, constitución completada exitosamente",
      especialidadRequerida: "Derecho Corporativo",
      prioridad: "baja",
    },
    {
      id: "4",
      nombre: "Ana",
      apellido: "Rodríguez",
      email: "ana.rodriguez@email.com",
      telefono: "+504 9988-7766",
      ubicacion: "La Ceiba, Honduras",
      avatar: "/placeholder.svg?height=40&width=40",
      fechaRegistro: "2024-01-08",
      ultimoContacto: "2025-01-14",
      casosActivos: 1,
      casosCompletados: 0,
      montoTotal: 20000,
      estado: "activo",
      tipoCliente: "individual",
      calificacion: 4,
      proximaCita: "2025-01-19 10:00",
      notas: "Sucesión familiar, múltiples herederos involucrados",
      especialidadRequerida: "Derecho Sucesorio",
      prioridad: "media",
    },
    {
      id: "5",
      nombre: "Distribuidora",
      apellido: "Central",
      email: "legal@distribuidoracentral.hn",
      telefono: "+504 2345-6789",
      ubicacion: "Tegucigalpa, Honduras",
      avatar: "/placeholder.svg?height=40&width=40",
      fechaRegistro: "2024-01-10",
      ultimoContacto: "2025-01-13",
      casosActivos: 1,
      casosCompletados: 0,
      montoTotal: 18000,
      estado: "activo",
      tipoCliente: "empresa",
      calificacion: 4,
      proximaCita: "2025-01-18 15:00",
      notas: "Contrato de distribución exclusiva en revisión",
      especialidadRequerida: "Derecho Comercial",
      prioridad: "alta",
    },
    {
      id: "6",
      nombre: "Roberto",
      apellido: "Silva",
      email: "roberto.silva@email.com",
      telefono: "+504 7654-3210",
      ubicacion: "Choluteca, Honduras",
      avatar: "/placeholder.svg?height=40&width=40",
      fechaRegistro: "2024-01-12",
      ultimoContacto: "2025-01-10",
      casosActivos: 1,
      casosCompletados: 0,
      montoTotal: 30000,
      estado: "pendiente",
      tipoCliente: "individual",
      calificacion: 3,
      notas: "Litigio civil por disputa de propiedades, caso complejo",
      especialidadRequerida: "Derecho Civil",
      prioridad: "media",
    },
  ]

  // Estadísticas calculadas
  const stats = {
    total: clientes.length,
    activos: clientes.filter((c) => c.estado === "activo").length,
    empresas: clientes.filter((c) => c.tipoCliente === "empresa").length,
    individuales: clientes.filter((c) => c.tipoCliente === "individual").length,
    casosActivos: clientes.reduce((sum, c) => sum + c.casosActivos, 0),
    valorTotal: clientes.reduce((sum, c) => sum + c.montoTotal, 0),
    promedioCalificacion:
      clientes.filter((c) => c.calificacion).reduce((sum, c) => sum + (c.calificacion || 0), 0) /
      clientes.filter((c) => c.calificacion).length,
    proximasCitas: clientes.filter((c) => c.proximaCita).length,
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "activo":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Activo
          </Badge>
        )
      case "inactivo":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
            Inactivo
          </Badge>
        )
      case "pendiente":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Pendiente
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const getTipoClienteBadge = (tipo: string) => {
    switch (tipo) {
      case "individual":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <User className="h-3 w-3" />
            Individual
          </Badge>
        )
      case "empresa":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Building className="h-3 w-3" />
            Empresa
          </Badge>
        )
      default:
        return <Badge variant="outline">Otro</Badge>
    }
  }

  const getPrioridadBadge = (prioridad: string) => {
    switch (prioridad) {
      case "alta":
        return <Badge variant="destructive">Alta</Badge>
      case "media":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
            Media
          </Badge>
        )
      case "baja":
        return <Badge variant="outline">Baja</Badge>
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  const filteredClientes = clientes.filter((cliente) => {
    const searchString =
      `${cliente.nombre} ${cliente.apellido} ${cliente.email} ${cliente.especialidadRequerida}`.toLowerCase()
    const matchesSearch = searchString.includes(searchTerm.toLowerCase())
    const matchesTipo = tipoFilter === "all" || cliente.tipoCliente === tipoFilter
    const matchesEstado = estadoFilter === "all" || cliente.estado === estadoFilter
    const matchesPrioridad = prioridadFilter === "all" || cliente.prioridad === prioridadFilter
    return matchesSearch && matchesTipo && matchesEstado && matchesPrioridad
  })

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3 w-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mis Clientes</h1>
          <p className="text-muted-foreground">Gestiona tu cartera de clientes y relaciones</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/area-de-trabajo/reportes/clientes">
              <TrendingUp className="w-4 h-4 mr-2" />
              Reportes
            </Link>
          </Button>
          <Button asChild>
            <Link href="/area-de-trabajo/clientes/nuevo">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Cliente
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">+2 este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activos}</div>
            <p className="text-xs text-muted-foreground">Con casos activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Individuales</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.individuales}</div>
            <p className="text-xs text-muted-foreground">Personas físicas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.empresas}</div>
            <p className="text-xs text-muted-foreground">Personas jurídicas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos Activos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.casosActivos}</div>
            <p className="text-xs text-muted-foreground">En todos los clientes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">L. {stats.valorTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Cartera total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calificación</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.promedioCalificacion.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Promedio general</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas Citas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{stats.proximasCitas}</div>
            <p className="text-xs text-muted-foreground">Programadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar y Filtrar Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, email, especialidad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tipo de cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="empresa">Empresa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={prioridadFilter} onValueChange={setPrioridadFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las prioridades</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clients Grid */}
      <div className="grid gap-6">
        {filteredClientes.map((cliente) => (
          <Card key={cliente.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={cliente.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg">{getInitials(cliente.nombre, cliente.apellido)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <CardTitle className="text-lg">
                        {cliente.nombre} {cliente.apellido}
                      </CardTitle>
                      {getTipoClienteBadge(cliente.tipoCliente)}
                      {getPrioridadBadge(cliente.prioridad)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {cliente.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {cliente.telefono}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {cliente.ubicacion}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{cliente.especialidadRequerida}</Badge>
                      {cliente.calificacion && (
                        <div className="flex items-center gap-1">
                          {renderStars(cliente.calificacion)}
                          <span className="text-sm text-muted-foreground ml-1">({cliente.calificacion})</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getEstadoBadge(cliente.estado)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/area-de-trabajo/clientes/${cliente.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver perfil completo
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/area-de-trabajo/clientes/${cliente.id}/editar`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar información
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Calendar className="h-4 w-4 mr-2" />
                        Programar cita
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Plus className="h-4 w-4 mr-2" />
                        Crear caso
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Enviar mensaje
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-orange-600">
                        <Archive className="h-4 w-4 mr-2" />
                        Archivar cliente
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Client Notes */}
                {cliente.notas && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Notas:</strong> {cliente.notas}
                    </p>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{cliente.casosActivos}</p>
                    <p className="text-sm text-muted-foreground">Casos Activos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{cliente.casosCompletados}</p>
                    <p className="text-sm text-muted-foreground">Completados</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">L. {cliente.montoTotal.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(cliente.ultimoContacto).toLocaleDateString("es-ES")}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Último Contacto</p>
                  </div>
                </div>

                {/* Next Appointment */}
                {cliente.proximaCita && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Próxima cita:</span>
                      <span className="text-sm">
                        {new Date(cliente.proximaCita).toLocaleDateString("es-ES")} a las{" "}
                        {new Date(cliente.proximaCita).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver detalles
                    </Button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                    <Link href={`/area-de-trabajo/clientes/${cliente.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Ver perfil
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Plus className="h-4 w-4 mr-1" />
                    Crear caso
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Contactar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClientes.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron clientes</h3>
            <p className="text-muted-foreground mb-4">No hay clientes que coincidan con los filtros seleccionados.</p>
            <Button asChild>
              <Link href="/area-de-trabajo/clientes/nuevo">
                <Plus className="w-4 h-4 mr-2" />
                Agregar primer cliente
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
