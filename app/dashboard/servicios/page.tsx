"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Plus,
  DollarSign,
  Users,
  Star,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Scale,
  Building,
  FileText,
  Shield,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos mock de servicios (en producción vendrían de la API)
const servicios = [
  {
    id: 1,
    nombre: "Derecho Civil",
    descripcion: "Asesoría legal en asuntos civiles, contratos, responsabilidad civil y daños",
    categoria: "Legal",
    precio: 2500,
    duracionPromedio: "2-4 semanas",
    clientesAtendidos: 89,
    calificacion: 4.8,
    estado: "Activo",
    abogadosEspecializados: ["Dr. Carlos Mendoza", "Dra. Patricia Ruiz"],
    casosExitosos: 78,
    ingresosMensuales: 45000,
    descripcionDetallada:
      "Servicio integral de asesoría en derecho civil incluyendo contratos, responsabilidad civil, daños y perjuicios, y resolución de conflictos.",
    incluye: ["Consulta inicial", "Redacción de documentos", "Representación legal", "Seguimiento del caso"],
  },
  {
    id: 2,
    nombre: "Derecho Laboral",
    descripcion: "Defensa en conflictos laborales, despidos, prestaciones y derechos del trabajador",
    categoria: "Legal",
    precio: 3000,
    duracionPromedio: "3-6 semanas",
    clientesAtendidos: 67,
    calificacion: 4.9,
    estado: "Activo",
    abogadosEspecializados: ["Dra. Ana López"],
    casosExitosos: 61,
    ingresosMensuales: 38000,
    descripcionDetallada:
      "Especialistas en derecho laboral para la defensa de trabajadores y empresas en conflictos laborales.",
    incluye: ["Análisis del caso", "Negociación", "Representación ante autoridades", "Seguimiento legal"],
  },
  {
    id: 3,
    nombre: "Derecho Corporativo",
    descripcion: "Constitución de empresas, fusiones, adquisiciones y compliance corporativo",
    categoria: "Empresarial",
    precio: 5000,
    duracionPromedio: "4-8 semanas",
    clientesAtendidos: 45,
    calificacion: 4.7,
    estado: "Activo",
    abogadosEspecializados: ["Dr. Roberto Silva"],
    casosExitosos: 42,
    ingresosMensuales: 65000,
    descripcionDetallada:
      "Servicios especializados para empresas en constitución, reestructuración y cumplimiento normativo.",
    incluye: ["Constitución legal", "Documentación corporativa", "Compliance", "Asesoría estratégica"],
  },
  {
    id: 4,
    nombre: "Derecho Penal",
    descripcion: "Defensa penal en delitos federales y del fuero común",
    categoria: "Legal",
    precio: 8000,
    duracionPromedio: "6-12 semanas",
    clientesAtendidos: 34,
    calificacion: 4.9,
    estado: "Activo",
    abogadosEspecializados: ["Dra. Patricia Ruiz"],
    casosExitosos: 29,
    ingresosMensuales: 52000,
    descripcionDetallada: "Defensa especializada en casos penales con amplia experiencia en el sistema judicial.",
    incluye: ["Defensa técnica", "Investigación del caso", "Representación en juicio", "Recursos legales"],
  },
  {
    id: 5,
    nombre: "Derecho Fiscal",
    descripcion: "Asesoría fiscal, auditorías del SAT y planeación tributaria",
    categoria: "Fiscal",
    precio: 4000,
    duracionPromedio: "2-6 semanas",
    clientesAtendidos: 56,
    calificacion: 4.6,
    estado: "Activo",
    abogadosEspecializados: ["Dr. Miguel Torres"],
    casosExitosos: 48,
    ingresosMensuales: 42000,
    descripcionDetallada: "Especialistas en derecho fiscal para empresas y personas físicas con actividad empresarial.",
    incluye: ["Auditoría fiscal", "Planeación tributaria", "Defensa ante SAT", "Optimización fiscal"],
  },
  {
    id: 6,
    nombre: "Derecho Inmobiliario",
    descripcion: "Compraventa, arrendamiento y desarrollo inmobiliario",
    categoria: "Inmobiliario",
    precio: 3500,
    duracionPromedio: "3-5 semanas",
    clientesAtendidos: 38,
    calificacion: 4.8,
    estado: "Activo",
    abogadosEspecializados: ["Dra. Carmen Vega"],
    casosExitosos: 35,
    ingresosMensuales: 28000,
    descripcionDetallada: "Servicios legales especializados en transacciones y desarrollo inmobiliario.",
    incluye: ["Due diligence", "Contratos inmobiliarios", "Registro público", "Asesoría en desarrollo"],
  },
  {
    id: 7,
    nombre: "Mediación y Arbitraje",
    descripcion: "Resolución alternativa de conflictos mediante mediación y arbitraje",
    categoria: "Alternativo",
    precio: 2000,
    duracionPromedio: "1-3 semanas",
    clientesAtendidos: 23,
    calificacion: 4.7,
    estado: "Activo",
    abogadosEspecializados: ["Dr. Carlos Mendoza", "Dr. Roberto Silva"],
    casosExitosos: 21,
    ingresosMensuales: 15000,
    descripcionDetallada: "Métodos alternativos de resolución de conflictos más rápidos y económicos que el litigio.",
    incluye: ["Sesiones de mediación", "Arbitraje", "Acuerdos vinculantes", "Seguimiento"],
  },
  {
    id: 8,
    nombre: "Propiedad Intelectual",
    descripcion: "Registro de marcas, patentes y derechos de autor",
    categoria: "Especializado",
    precio: 6000,
    duracionPromedio: "4-10 semanas",
    clientesAtendidos: 19,
    calificacion: 4.5,
    estado: "En Desarrollo",
    abogadosEspecializados: ["Dr. Roberto Silva"],
    casosExitosos: 15,
    ingresosMensuales: 22000,
    descripcionDetallada: "Protección integral de activos intangibles y propiedad intelectual.",
    incluye: ["Búsqueda de antecedentes", "Registro legal", "Defensa de derechos", "Monitoreo"],
  },
]

export default function ServiciosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategoria, setFilterCategoria] = useState("todas")
  const [filterEstado, setFilterEstado] = useState("todos")

  const categorias = Array.from(new Set(servicios.map((s) => s.categoria)))

  const serviciosFiltrados = servicios.filter((servicio) => {
    const matchesSearch =
      servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = filterCategoria === "todas" || servicio.categoria === filterCategoria
    const matchesEstado = filterEstado === "todos" || servicio.estado === filterEstado

    return matchesSearch && matchesCategoria && matchesEstado
  })

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Activo: "default",
      "En Desarrollo": "outline",
      Suspendido: "destructive",
      Inactivo: "secondary",
    }
    return variants[estado] || "default"
  }

  const getCategoriaIcon = (categoria: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      Legal: Scale,
      Empresarial: Building,
      Fiscal: DollarSign,
      Inmobiliario: Building,
      Alternativo: Users,
      Especializado: Shield,
    }
    return icons[categoria] || FileText
  }

  const totalServicios = servicios.length
  const serviciosActivos = servicios.filter((s) => s.estado === "Activo").length
  const totalClientes = servicios.reduce((sum, s) => sum + s.clientesAtendidos, 0)
  const ingresosTotales = servicios.reduce((sum, s) => sum + s.ingresosMensuales, 0)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Servicios</h2>
          <p className="text-muted-foreground">Administra los servicios legales ofrecidos por el bufete</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Servicio
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Servicios</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServicios}</div>
            <p className="text-xs text-muted-foreground">{serviciosActivos} activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Atendidos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClientes}</div>
            <p className="text-xs text-muted-foreground">En todos los servicios</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${ingresosTotales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total por servicios</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calificación Promedio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(servicios.reduce((sum, s) => sum + s.calificacion, 0) / servicios.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">De 5.0 estrellas</p>
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
                  placeholder="Buscar servicios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterCategoria} onValueChange={setFilterCategoria}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las categorías</SelectItem>
                {categorias.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="En Desarrollo">En Desarrollo</SelectItem>
                <SelectItem value="Suspendido">Suspendido</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de servicios */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {serviciosFiltrados.map((servicio) => {
          const IconComponent = getCategoriaIcon(servicio.categoria)
          return (
            <Card key={servicio.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{servicio.nombre}</CardTitle>
                      <CardDescription>{servicio.categoria}</CardDescription>
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
                      <DropdownMenuItem>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Estadísticas
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
                  <Badge variant={getEstadoBadge(servicio.estado)}>{servicio.estado}</Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{servicio.calificacion}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{servicio.descripcion}</p>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">${servicio.precio.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Precio Base</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">{servicio.clientesAtendidos}</div>
                    <div className="text-xs text-muted-foreground">Clientes</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Duración:</span>
                    <span className="font-medium">{servicio.duracionPromedio}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Casos exitosos:</span>
                    <span className="font-medium">{servicio.casosExitosos}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Ingresos mensuales:</span>
                    <span className="font-medium">${servicio.ingresosMensuales.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Abogados especializados:</div>
                  <div className="flex flex-wrap gap-1">
                    {servicio.abogadosEspecializados.map((abogado, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {abogado}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Incluye:</div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {servicio.incluye.slice(0, 3).map((item, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                        {item}
                      </li>
                    ))}
                    {servicio.incluye.length > 3 && (
                      <li className="text-primary">+{servicio.incluye.length - 3} más...</li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {serviciosFiltrados.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron servicios</h3>
            <p className="text-muted-foreground text-center">
              Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
