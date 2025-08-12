"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  MessageSquare,
  Calendar,
  Clock,
  Phone,
  Mail,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos mock de consultas (en producción vendrían de la API)
const consultas = [
  {
    id: 1,
    nombre: "María González",
    email: "maria.gonzalez@email.com",
    telefono: "+1 234-567-8901",
    asunto: "Consulta sobre divorcio",
    mensaje:
      "Hola, necesito asesoría legal para iniciar un proceso de divorcio. Mi esposo y yo hemos decidido separarnos de mutuo acuerdo, pero tenemos dos hijos menores y propiedades en común. Me gustaría saber cuáles son los pasos a seguir y qué documentos necesito preparar.",
    tipoConsulta: "Derecho Familiar",
    prioridad: "Media",
    estado: "Pendiente",
    fechaConsulta: "2024-01-15",
    fechaRespuesta: null,
    respondidoPor: null,
    respuesta: null,
    origen: "Sitio Web",
    avatar: "/avatars/maria-gonzalez.jpg",
  },
  {
    id: 2,
    nombre: "Carlos Rodríguez",
    email: "carlos.rodriguez@empresa.com",
    telefono: "+1 234-567-8902",
    asunto: "Despido injustificado",
    mensaje:
      "Buenos días, fui despedido de mi trabajo sin causa justificada después de 5 años laborando en la empresa. No me pagaron mi finiquito completo y creo que mis derechos laborales fueron violados. ¿Qué acciones legales puedo tomar?",
    tipoConsulta: "Derecho Laboral",
    prioridad: "Alta",
    estado: "En Proceso",
    fechaConsulta: "2024-01-14",
    fechaRespuesta: "2024-01-15",
    respondidoPor: "Dra. Ana López",
    respuesta:
      "Estimado Carlos, su caso presenta elementos de despido injustificado. Le recomiendo agendar una cita para revisar su contrato laboral y documentos relacionados. Tenemos buenas posibilidades de recuperar sus prestaciones.",
    origen: "Teléfono",
    avatar: "/avatars/carlos-rodriguez.jpg",
  },
  {
    id: 3,
    nombre: "TechStart SRL",
    email: "legal@techstart.com",
    telefono: "+1 234-567-8903",
    asunto: "Constitución de empresa",
    mensaje:
      "Somos una startup tecnológica que necesita constituirse legalmente en México. Queremos conocer las opciones de tipos societarios, los requisitos y costos involucrados en el proceso de constitución.",
    tipoConsulta: "Derecho Corporativo",
    prioridad: "Media",
    estado: "Respondida",
    fechaConsulta: "2024-01-12",
    fechaRespuesta: "2024-01-13",
    respondidoPor: "Dr. Roberto Silva",
    respuesta:
      "Estimados, para una startup tecnológica recomendamos constituir una Sociedad Anónima de Capital Variable (S.A. de C.V.) o una SRL. He enviado por correo una propuesta detallada con costos y tiempos. Quedamos a sus órdenes.",
    origen: "Sitio Web",
    avatar: "/avatars/techstart.jpg",
  },
  {
    id: 4,
    nombre: "Ana Martínez",
    email: "ana.martinez@email.com",
    telefono: "+1 234-567-8904",
    asunto: "Problema con arrendador",
    mensaje:
      "Mi arrendador quiere desalojarme sin causa justificada y además me está cobrando gastos que no me corresponden según el contrato. El inmueble tiene varios problemas de mantenimiento que él se niega a reparar. Necesito asesoría urgente.",
    tipoConsulta: "Derecho Inmobiliario",
    prioridad: "Alta",
    estado: "Pendiente",
    fechaConsulta: "2024-01-13",
    fechaRespuesta: null,
    respondidoPor: null,
    respuesta: null,
    origen: "WhatsApp",
    avatar: "/avatars/ana-martinez.jpg",
  },
  {
    id: 5,
    nombre: "Constructora ABC",
    email: "contacto@constructoraabc.com",
    telefono: "+1 234-567-8905",
    asunto: "Investigación penal en curso",
    mensaje:
      "Nuestra empresa está siendo investigada por presuntas irregularidades en una obra pública. Necesitamos representación legal especializada en derecho penal empresarial para manejar esta situación delicada.",
    tipoConsulta: "Derecho Penal",
    prioridad: "Crítica",
    estado: "En Proceso",
    fechaConsulta: "2024-01-11",
    fechaRespuesta: "2024-01-11",
    respondidoPor: "Dra. Patricia Ruiz",
    respuesta:
      "Estimados, he recibido su consulta y entiendo la urgencia del caso. He programado una reunión para mañana a las 10:00 AM para revisar todos los documentos y definir la estrategia de defensa. Es importante actuar rápidamente.",
    origen: "Referido",
    avatar: "/avatars/constructora.jpg",
  },
  {
    id: 6,
    nombre: "Laura Fernández",
    email: "laura.fernandez@email.com",
    telefono: "+1 234-567-8906",
    asunto: "Compra de casa - revisión de contrato",
    mensaje:
      "Estoy por comprar mi primera casa y me gustaría que un abogado revise el contrato de compraventa antes de firmarlo. También tengo dudas sobre los gastos notariales y el proceso de escrituración.",
    tipoConsulta: "Derecho Inmobiliario",
    prioridad: "Media",
    estado: "Respondida",
    fechaConsulta: "2024-01-10",
    fechaRespuesta: "2024-01-11",
    respondidoPor: "Dra. Carmen Vega",
    respuesta:
      "Estimada Laura, es muy prudente de su parte solicitar la revisión del contrato antes de firmar. He revisado el documento que envió y tengo algunas observaciones importantes. La contactaré mañana para agendar una cita.",
    origen: "Sitio Web",
    avatar: "/avatars/laura-fernandez.jpg",
  },
  {
    id: 7,
    nombre: "Inversiones del Sur",
    email: "info@inversionesdelsur.com",
    telefono: "+1 234-567-8907",
    asunto: "Auditoría del SAT",
    mensaje:
      "Hemos recibido una notificación de auditoría por parte del SAT para revisar nuestros ejercicios fiscales 2021 y 2022. Necesitamos asesoría especializada para manejar este proceso y asegurar el cumplimiento de nuestras obligaciones fiscales.",
    tipoConsulta: "Derecho Fiscal",
    prioridad: "Alta",
    estado: "En Proceso",
    fechaConsulta: "2024-01-09",
    fechaRespuesta: "2024-01-10",
    respondidoPor: "Dr. Miguel Torres",
    respuesta:
      "Estimados, las auditorías del SAT requieren preparación meticulosa. He comenzado a revisar su documentación fiscal y necesitamos reunirnos esta semana para preparar la estrategia de respuesta. El plazo para responder es crítico.",
    origen: "Teléfono",
    avatar: "/avatars/inversiones.jpg",
  },
  {
    id: 8,
    nombre: "Roberto Jiménez",
    email: "roberto.jimenez@email.com",
    telefono: "+1 234-567-8908",
    asunto: "Registro de marca comercial",
    mensaje:
      "Tengo un negocio de productos artesanales y quiero registrar mi marca comercial para protegerla. No tengo experiencia en este proceso y me gustaría conocer los pasos, costos y tiempo que toma el registro ante el IMPI.",
    tipoConsulta: "Propiedad Intelectual",
    prioridad: "Baja",
    estado: "Pendiente",
    fechaConsulta: "2024-01-08",
    fechaRespuesta: null,
    respondidoPor: null,
    respuesta: null,
    origen: "Sitio Web",
    avatar: "/avatars/roberto-jimenez.jpg",
  },
]

export default function ConsultasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTipo, setFilterTipo] = useState("todos")
  const [filterEstado, setFilterEstado] = useState("todos")
  const [filterPrioridad, setFilterPrioridad] = useState("todas")

  const tipos = Array.from(new Set(consultas.map((c) => c.tipoConsulta)))

  const consultasFiltradas = consultas.filter((consulta) => {
    const matchesSearch =
      consulta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consulta.asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consulta.mensaje.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = filterTipo === "todos" || consulta.tipoConsulta === filterTipo
    const matchesEstado = filterEstado === "todos" || consulta.estado === filterEstado
    const matchesPrioridad = filterPrioridad === "todas" || consulta.prioridad === filterPrioridad

    return matchesSearch && matchesTipo && matchesEstado && matchesPrioridad
  })

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Pendiente: "outline",
      "En Proceso": "default",
      Respondida: "secondary",
      Cerrada: "destructive",
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

  const getEstadoIcon = (estado: string) => {
    const icons: Record<string, any> = {
      Pendiente: AlertCircle,
      "En Proceso": Clock,
      Respondida: CheckCircle,
      Cerrada: XCircle,
    }
    return icons[estado] || AlertCircle
  }

  const totalConsultas = consultas.length
  const consultasPendientes = consultas.filter((c) => c.estado === "Pendiente").length
  const consultasEnProceso = consultas.filter((c) => c.estado === "En Proceso").length
  const consultasRespondidas = consultas.filter((c) => c.estado === "Respondida").length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Consultas</h2>
          <p className="text-muted-foreground">Administra las consultas legales recibidas de clientes potenciales</p>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consultas</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConsultas}</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{consultasPendientes}</div>
            <p className="text-xs text-muted-foreground">Esperando respuesta</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{consultasEnProceso}</div>
            <p className="text-xs text-muted-foreground">Siendo atendidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Respondidas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{consultasRespondidas}</div>
            <p className="text-xs text-muted-foreground">Ya atendidas</p>
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
                  placeholder="Buscar consultas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
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
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="En Proceso">En Proceso</SelectItem>
                <SelectItem value="Respondida">Respondida</SelectItem>
                <SelectItem value="Cerrada">Cerrada</SelectItem>
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
          </div>
        </CardContent>
      </Card>

      {/* Lista de consultas */}
      <div className="grid gap-4">
        {consultasFiltradas.map((consulta) => {
          const EstadoIcon = getEstadoIcon(consulta.estado)

          return (
            <Card key={consulta.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={consulta.avatar || "/placeholder.svg"} alt={consulta.nombre} />
                      <AvatarFallback>
                        {consulta.nombre
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{consulta.nombre}</CardTitle>
                      <CardDescription>{consulta.asunto}</CardDescription>
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
                        Ver Completa
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Responder
                      </DropdownMenuItem>
                      {consulta.estado === "Pendiente" && (
                        <DropdownMenuItem className="text-blue-600">
                          <Clock className="mr-2 h-4 w-4" />
                          Marcar En Proceso
                        </DropdownMenuItem>
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
                  <Badge variant={getEstadoBadge(consulta.estado)} className="flex items-center gap-1">
                    <EstadoIcon className="h-3 w-3" />
                    {consulta.estado}
                  </Badge>
                  <Badge variant="outline">{consulta.tipoConsulta}</Badge>
                  <Badge variant="outline" className={getPrioridadColor(consulta.prioridad)}>
                    {consulta.prioridad}
                  </Badge>
                  <Badge variant="secondary">{consulta.origen}</Badge>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Mensaje:</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{consulta.mensaje}</p>
                </div>

                {consulta.respuesta && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">Respuesta:</h4>
                      <span className="text-xs text-blue-700 dark:text-blue-300">
                        {consulta.respondidoPor} • {new Date(consulta.fechaRespuesta!).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{consulta.respuesta}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{consulta.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{consulta.telefono}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {new Date(consulta.fechaConsulta).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {consultasFiltradas.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron consultas</h3>
            <p className="text-muted-foreground text-center">
              Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
