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
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  CalendarDays,
  Plane,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos mock de vacaciones (en producción vendrían de la API)
const vacaciones = [
  {
    id: 1,
    empleado: "Dr. Carlos Mendoza",
    puesto: "Abogado Senior",
    tipoSolicitud: "Vacaciones",
    fechaInicio: "2024-02-15",
    fechaFin: "2024-02-29",
    diasSolicitados: 14,
    diasDisponibles: 20,
    motivo: "Vacaciones familiares programadas",
    estado: "Aprobada",
    fechaSolicitud: "2024-01-10",
    aprobadoPor: "María González",
    comentarios: "Solicitud aprobada. Casos redistribuidos temporalmente.",
    avatar: "/avatars/carlos.jpg",
    cobertura: "Dra. Patricia Ruiz",
  },
  {
    id: 2,
    empleado: "Dra. Ana López",
    puesto: "Abogada Laboral",
    tipoSolicitud: "Permiso Personal",
    fechaInicio: "2024-01-22",
    fechaFin: "2024-01-24",
    diasSolicitados: 3,
    diasDisponibles: 15,
    motivo: "Asuntos médicos familiares",
    estado: "Pendiente",
    fechaSolicitud: "2024-01-15",
    aprobadoPor: null,
    comentarios: "Esperando confirmación de cobertura de casos urgentes.",
    avatar: "/avatars/ana.jpg",
    cobertura: "Dr. Miguel Torres",
  },
  {
    id: 3,
    empleado: "Dr. Roberto Silva",
    puesto: "Abogado Corporativo",
    tipoSolicitud: "Vacaciones",
    fechaInicio: "2024-03-01",
    fechaFin: "2024-03-15",
    diasSolicitados: 14,
    diasDisponibles: 25,
    motivo: "Viaje de descanso",
    estado: "Aprobada",
    fechaSolicitud: "2024-01-05",
    aprobadoPor: "María González",
    comentarios: "Aprobado. Proyectos corporativos en pausa temporal.",
    avatar: "/avatars/roberto.jpg",
    cobertura: "Dr. Carlos Mendoza",
  },
  {
    id: 4,
    empleado: "Dra. Patricia Ruiz",
    puesto: "Abogada Penal",
    tipoSolicitud: "Licencia Médica",
    fechaInicio: "2024-01-20",
    fechaFin: "2024-02-05",
    diasSolicitados: 16,
    diasDisponibles: 30,
    motivo: "Recuperación post-operatoria",
    estado: "Aprobada",
    fechaSolicitud: "2024-01-12",
    aprobadoPor: "María González",
    comentarios: "Licencia médica aprobada. Casos urgentes redistribuidos.",
    avatar: "/avatars/patricia.jpg",
    cobertura: "Dr. Carlos Mendoza",
  },
  {
    id: 5,
    empleado: "Dr. Miguel Torres",
    puesto: "Abogado Fiscal",
    tipoSolicitud: "Vacaciones",
    fechaInicio: "2024-04-10",
    fechaFin: "2024-04-20",
    diasSolicitados: 10,
    diasDisponibles: 18,
    motivo: "Vacaciones de Semana Santa",
    estado: "Pendiente",
    fechaSolicitud: "2024-01-18",
    aprobadoPor: null,
    comentarios: "Revisando disponibilidad durante temporada fiscal.",
    avatar: "/avatars/miguel.jpg",
    cobertura: "Dra. Carmen Vega",
  },
  {
    id: 6,
    empleado: "Dra. Carmen Vega",
    puesto: "Abogada Inmobiliaria",
    tipoSolicitud: "Permiso Personal",
    fechaInicio: "2024-01-25",
    fechaFin: "2024-01-26",
    diasSolicitados: 2,
    diasDisponibles: 22,
    motivo: "Trámites personales urgentes",
    estado: "Rechazada",
    fechaSolicitud: "2024-01-20",
    aprobadoPor: "María González",
    comentarios: "Rechazada por conflicto con cierre de proyecto inmobiliario importante.",
    avatar: "/avatars/carmen.jpg",
    cobertura: null,
  },
  {
    id: 7,
    empleado: "Lic. Sofia Herrera",
    puesto: "Asistente Legal",
    tipoSolicitud: "Vacaciones",
    fechaInicio: "2024-02-05",
    fechaFin: "2024-02-12",
    diasSolicitados: 7,
    diasDisponibles: 14,
    motivo: "Descanso programado",
    estado: "Aprobada",
    fechaSolicitud: "2024-01-08",
    aprobadoPor: "María González",
    comentarios: "Aprobado. Cobertura temporal asignada.",
    avatar: "/avatars/sofia.jpg",
    cobertura: "Lic. Marco Jiménez",
  },
  {
    id: 8,
    empleado: "Lic. Marco Jiménez",
    puesto: "Asistente Administrativo",
    tipoSolicitud: "Permiso Personal",
    fechaInicio: "2024-01-30",
    fechaFin: "2024-01-30",
    diasSolicitados: 1,
    diasDisponibles: 12,
    motivo: "Cita médica especializada",
    estado: "Aprobada",
    fechaSolicitud: "2024-01-25",
    aprobadoPor: "María González",
    comentarios: "Permiso de un día aprobado.",
    avatar: "/avatars/marco.jpg",
    cobertura: "Lic. Sofia Herrera",
  },
]

export default function VacacionesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState("todos")
  const [filterTipo, setFilterTipo] = useState("todos")

  const tipos = Array.from(new Set(vacaciones.map((v) => v.tipoSolicitud)))

  const vacacionesFiltradas = vacaciones.filter((vacacion) => {
    const matchesSearch =
      vacacion.empleado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vacacion.motivo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = filterEstado === "todos" || vacacion.estado === filterEstado
    const matchesTipo = filterTipo === "todos" || vacacion.tipoSolicitud === filterTipo

    return matchesSearch && matchesEstado && matchesTipo
  })

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Aprobada: "default",
      Pendiente: "outline",
      Rechazada: "destructive",
      "En Curso": "secondary",
    }
    return variants[estado] || "default"
  }

  const getEstadoIcon = (estado: string) => {
    const icons: Record<string, any> = {
      Aprobada: CheckCircle,
      Pendiente: AlertCircle,
      Rechazada: XCircle,
      "En Curso": Clock,
    }
    return icons[estado] || AlertCircle
  }

  const getTipoIcon = (tipo: string) => {
    const icons: Record<string, any> = {
      Vacaciones: Plane,
      "Permiso Personal": User,
      "Licencia Médica": AlertCircle,
    }
    return icons[tipo] || Calendar
  }

  const totalSolicitudes = vacaciones.length
  const solicitudesPendientes = vacaciones.filter((v) => v.estado === "Pendiente").length
  const solicitudesAprobadas = vacaciones.filter((v) => v.estado === "Aprobada").length
  const diasTotalesSolicitados = vacaciones.reduce((sum, v) => sum + v.diasSolicitados, 0)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Vacaciones</h2>
          <p className="text-muted-foreground">Administra las solicitudes de vacaciones y permisos del personal</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Solicitud
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Solicitudes</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSolicitudes}</div>
            <p className="text-xs text-muted-foreground">Este período</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{solicitudesPendientes}</div>
            <p className="text-xs text-muted-foreground">Requieren revisión</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{solicitudesAprobadas}</div>
            <p className="text-xs text-muted-foreground">Ya autorizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Días Solicitados</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{diasTotalesSolicitados}</div>
            <p className="text-xs text-muted-foreground">Total de días</p>
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
                  placeholder="Buscar solicitudes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Aprobada">Aprobada</SelectItem>
                <SelectItem value="Rechazada">Rechazada</SelectItem>
                <SelectItem value="En Curso">En Curso</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                {tipos.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de solicitudes */}
      <div className="grid gap-4">
        {vacacionesFiltradas.map((vacacion) => {
          const EstadoIcon = getEstadoIcon(vacacion.estado)
          const TipoIcon = getTipoIcon(vacacion.tipoSolicitud)

          return (
            <Card key={vacacion.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={vacacion.avatar || "/placeholder.svg"} alt={vacacion.empleado} />
                      <AvatarFallback>
                        {vacacion.empleado
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{vacacion.empleado}</CardTitle>
                      <CardDescription>{vacacion.puesto}</CardDescription>
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
                        Ver Detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      {vacacion.estado === "Pendiente" && (
                        <>
                          <DropdownMenuItem className="text-green-600">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Aprobar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <XCircle className="mr-2 h-4 w-4" />
                            Rechazar
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getEstadoBadge(vacacion.estado)} className="flex items-center gap-1">
                    <EstadoIcon className="h-3 w-3" />
                    {vacacion.estado}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <TipoIcon className="h-3 w-3" />
                    {vacacion.tipoSolicitud}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-muted-foreground">Fecha de inicio</div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(vacacion.fechaInicio).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground">Fecha de fin</div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(vacacion.fechaFin).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground">Días solicitados</div>
                    <div className="text-lg font-bold text-primary">{vacacion.diasSolicitados}</div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground">Días disponibles</div>
                    <div className="text-lg font-bold text-green-600">{vacacion.diasDisponibles}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-medium">Motivo:</div>
                  <p className="text-sm text-muted-foreground">{vacacion.motivo}</p>
                </div>

                {vacacion.cobertura && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Cobertura asignada: {vacacion.cobertura}
                    </div>
                  </div>
                )}

                {vacacion.comentarios && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium mb-1">Comentarios:</div>
                    <div className="text-sm text-muted-foreground">{vacacion.comentarios}</div>
                  </div>
                )}

                <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>Solicitado: {new Date(vacacion.fechaSolicitud).toLocaleDateString()}</span>
                  {vacacion.aprobadoPor && <span>Aprobado por: {vacacion.aprobadoPor}</span>}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {vacacionesFiltradas.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron solicitudes</h3>
            <p className="text-muted-foreground text-center">
              Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
