"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Plus,
  Calendar,
  User,
  Scale,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  FileText,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos mock de casos (en producción vendrían de la API)
const casos = [
  {
    id: 1,
    titulo: "Divorcio Contencioso - García vs. García",
    descripcion: "Proceso de divorcio con disputa por custodia de menores y división de bienes",
    cliente: "María García",
    abogado: "Dr. Carlos Mendoza",
    especialidad: "Derecho Familiar",
    estado: "En Proceso",
    prioridad: "Alta",
    fechaInicio: "2023-11-15",
    fechaVencimiento: "2024-01-25",
    valor: 15000,
    progreso: 65,
    proximaCita: "2024-01-18",
    documentos: 12,
    notas: "Cliente muy colaborativa, caso complejo por bienes inmuebles",
  },
  {
    id: 2,
    titulo: "Demanda Laboral - Constructora ABC",
    descripcion: "Demanda por despido injustificado y prestaciones laborales",
    cliente: "Juan Pérez",
    abogado: "Dra. Ana López",
    especialidad: "Derecho Laboral",
    estado: "Urgente",
    prioridad: "Crítica",
    fechaInicio: "2023-12-01",
    fechaVencimiento: "2024-01-20",
    valor: 25000,
    progreso: 30,
    proximaCita: "2024-01-16",
    documentos: 8,
    notas: "Requiere atención inmediata, audiencia próxima",
  },
  {
    id: 3,
    titulo: "Constitución de Empresa - TechStart SRL",
    descripcion: "Constitución de sociedad de responsabilidad limitada para startup tecnológica",
    cliente: "TechStart SRL",
    abogado: "Dr. Roberto Silva",
    especialidad: "Derecho Corporativo",
    estado: "Finalizado",
    prioridad: "Media",
    fechaInicio: "2023-10-05",
    fechaVencimiento: "2024-01-15",
    valor: 8000,
    progreso: 100,
    proximaCita: null,
    documentos: 15,
    notas: "Caso finalizado exitosamente, cliente satisfecho",
  },
  {
    id: 4,
    titulo: "Recuperación de Deudas - Comercial Norte",
    descripcion: "Proceso de cobranza judicial por facturas impagas",
    cliente: "Comercial Norte SA",
    abogado: "Dra. Patricia Ruiz",
    especialidad: "Derecho Mercantil",
    estado: "En Proceso",
    prioridad: "Alta",
    fechaInicio: "2023-12-10",
    fechaVencimiento: "2024-01-30",
    valor: 12000,
    progreso: 45,
    proximaCita: "2024-01-22",
    documentos: 6,
    notas: "Deudor ha mostrado disposición a negociar",
  },
  {
    id: 5,
    titulo: "Defensa Penal - Caso Fraude Fiscal",
    descripcion: "Defensa en proceso penal por presunto fraude fiscal",
    cliente: "Carlos Rodríguez",
    abogado: "Dr. Miguel Torres",
    especialidad: "Derecho Penal",
    estado: "En Proceso",
    prioridad: "Crítica",
    fechaInicio: "2023-11-20",
    fechaVencimiento: "2024-02-15",
    valor: 35000,
    progreso: 55,
    proximaCita: "2024-01-19",
    documentos: 20,
    notas: "Caso complejo, requiere análisis detallado de documentación fiscal",
  },
  {
    id: 6,
    titulo: "Compraventa Inmobiliaria - Residencial Los Pinos",
    descripcion: "Asesoría legal para compraventa de desarrollo inmobiliario",
    cliente: "Inversiones del Sur SA",
    abogado: "Dra. Carmen Vega",
    especialidad: "Derecho Inmobiliario",
    estado: "Pendiente",
    prioridad: "Media",
    fechaInicio: "2024-01-05",
    fechaVencimiento: "2024-03-01",
    valor: 18000,
    progreso: 15,
    proximaCita: "2024-01-20",
    documentos: 4,
    notas: "Esperando documentación del cliente para proceder",
  },
  {
    id: 7,
    titulo: "Auditoría Fiscal - Empresa Manufacturera",
    descripcion: "Defensa ante auditoría del SAT por ejercicios fiscales 2021-2022",
    cliente: "Manufacturera del Norte",
    abogado: "Dr. Miguel Torres",
    especialidad: "Derecho Fiscal",
    estado: "En Proceso",
    prioridad: "Alta",
    fechaInicio: "2023-12-15",
    fechaVencimiento: "2024-02-28",
    valor: 28000,
    progreso: 40,
    proximaCita: "2024-01-25",
    documentos: 25,
    notas: "Revisión exhaustiva de documentación contable en curso",
  },
  {
    id: 8,
    titulo: "Mediación Familiar - Herencia Familiar",
    descripcion: "Mediación para resolución de conflicto por herencia entre hermanos",
    cliente: "Familia Martínez",
    abogado: "Dr. Carlos Mendoza",
    especialidad: "Derecho Familiar",
    estado: "En Proceso",
    prioridad: "Media",
    fechaInicio: "2023-12-20",
    fechaVencimiento: "2024-02-10",
    valor: 10000,
    progreso: 25,
    proximaCita: "2024-01-24",
    documentos: 8,
    notas: "Sesiones de mediación programadas, ambiente colaborativo",
  },
]

export default function CasosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState("todos")
  const [filterPrioridad, setFilterPrioridad] = useState("todas")
  const [filterEspecialidad, setFilterEspecialidad] = useState("todas")

  const especialidades = Array.from(new Set(casos.map((c) => c.especialidad)))

  const casosFiltrados = casos.filter((caso) => {
    const matchesSearch =
      caso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.abogado.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = filterEstado === "todos" || caso.estado === filterEstado
    const matchesPrioridad = filterPrioridad === "todas" || caso.prioridad === filterPrioridad
    const matchesEspecialidad = filterEspecialidad === "todas" || caso.especialidad === filterEspecialidad

    return matchesSearch && matchesEstado && matchesPrioridad && matchesEspecialidad
  })

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      "En Proceso": "default",
      Urgente: "destructive",
      Finalizado: "secondary",
      Pendiente: "outline",
    }
    return variants[estado] || "default"
  }

  const getPrioridadColor = (prioridad: string) => {
    const colors: Record<string, string> = {
      Crítica: "text-red-600",
      Alta: "text-orange-600",
      Media: "text-yellow-600",
      Baja: "text-green-600",
    }
    return colors[prioridad] || "text-gray-600"
  }

  const totalCasos = casos.length
  const casosActivos = casos.filter((c) => c.estado === "En Proceso" || c.estado === "Urgente").length
  const casosUrgentes = casos.filter((c) => c.estado === "Urgente").length
  const valorTotalCartera = casos.reduce((sum, c) => sum + c.valor, 0)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Casos</h2>
          <p className="text-muted-foreground">Administra todos los casos legales del bufete</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Caso
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Casos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCasos}</div>
            <p className="text-xs text-muted-foreground">{casosActivos} activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos Urgentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{casosUrgentes}</div>
            <p className="text-xs text-muted-foreground">Requieren atención inmediata</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${valorTotalCartera.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Valor de todos los casos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso Promedio</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(casos.reduce((sum, c) => sum + c.progreso, 0) / casos.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Avance general</p>
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
                  placeholder="Buscar casos..."
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
                <SelectItem value="En Proceso">En Proceso</SelectItem>
                <SelectItem value="Urgente">Urgente</SelectItem>
                <SelectItem value="Finalizado">Finalizado</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPrioridad} onValueChange={setFilterPrioridad}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las prioridades</SelectItem>
                <SelectItem value="Crítica">Crítica</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
                <SelectItem value="Baja">Baja</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEspecialidad} onValueChange={setFilterEspecialidad}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Especialidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las especialidades</SelectItem>
                {especialidades.map((esp) => (
                  <SelectItem key={esp} value={esp}>
                    {esp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de casos */}
      <div className="grid gap-4">
        {casosFiltrados.map((caso) => (
          <Card key={caso.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg">{caso.titulo}</CardTitle>
                  <CardDescription className="text-sm">{caso.descripcion}</CardDescription>
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
                      <FileText className="mr-2 h-4 w-4" />
                      Documentos
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
              <div className="flex flex-wrap gap-2">
                <Badge variant={getEstadoBadge(caso.estado)}>{caso.estado}</Badge>
                <Badge variant="outline" className={getPrioridadColor(caso.prioridad)}>
                  {caso.prioridad}
                </Badge>
                <Badge variant="secondary">{caso.especialidad}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Cliente</div>
                    <div className="text-muted-foreground">{caso.cliente}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Abogado</div>
                    <div className="text-muted-foreground">{caso.abogado}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Valor</div>
                    <div className="text-muted-foreground">${caso.valor.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Vencimiento</div>
                    <div className="text-muted-foreground">{new Date(caso.fechaVencimiento).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Progreso del caso</span>
                  <span className="text-muted-foreground">{caso.progreso}%</span>
                </div>
                <Progress value={caso.progreso} className="h-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t text-sm">
                <div>
                  <span className="font-medium">Documentos:</span>
                  <span className="ml-2 text-muted-foreground">{caso.documentos}</span>
                </div>
                {caso.proximaCita && (
                  <div>
                    <span className="font-medium">Próxima cita:</span>
                    <span className="ml-2 text-muted-foreground">
                      {new Date(caso.proximaCita).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div>
                  <span className="font-medium">Inicio:</span>
                  <span className="ml-2 text-muted-foreground">{new Date(caso.fechaInicio).toLocaleDateString()}</span>
                </div>
              </div>

              {caso.notas && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium mb-1">Notas:</div>
                  <div className="text-sm text-muted-foreground">{caso.notas}</div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {casosFiltrados.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron casos</h3>
            <p className="text-muted-foreground text-center">
              Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
