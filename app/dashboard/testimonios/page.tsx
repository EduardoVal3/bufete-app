"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Star, Quote, MoreHorizontal, Edit, Trash2, Eye, CheckCircle, XCircle, Clock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos mock de testimonios (en producción vendrían de la API)
const testimonios = [
  {
    id: 1,
    cliente: "María García",
    empresa: null,
    email: "maria.garcia@email.com",
    telefono: "+1 234-567-8901",
    servicio: "Derecho Civil",
    abogado: "Dr. Carlos Mendoza",
    calificacion: 5,
    titulo: "Excelente servicio en mi caso de divorcio",
    testimonio:
      "El Dr. Mendoza me brindó un servicio excepcional durante todo mi proceso de divorcio. Su profesionalismo, conocimiento y dedicación fueron fundamentales para lograr un resultado favorable. Siempre estuvo disponible para resolver mis dudas y me mantuvo informada en cada etapa del proceso. Definitivamente recomiendo sus servicios.",
    fechaTestimonio: "2024-01-10",
    fechaCaso: "2023-11-15",
    estado: "Aprobado",
    destacado: true,
    mostrarEnWeb: true,
    avatar: "/avatars/maria.jpg",
  },
  {
    id: 2,
    cliente: "TechStart SRL",
    empresa: "TechStart SRL",
    email: "contacto@techstart.com",
    telefono: "+1 234-567-8902",
    servicio: "Derecho Corporativo",
    abogado: "Dr. Roberto Silva",
    calificacion: 5,
    titulo: "Constitución de empresa sin complicaciones",
    testimonio:
      "El proceso de constitución de nuestra empresa fue mucho más sencillo de lo que esperábamos gracias al Dr. Silva. Su experiencia en derecho corporativo nos ahorró tiempo y dinero. Nos guió paso a paso y se encargó de todos los trámites legales. Excelente atención y resultados.",
    fechaTestimonio: "2024-01-08",
    fechaCaso: "2023-10-05",
    estado: "Aprobado",
    destacado: true,
    mostrarEnWeb: true,
    avatar: "/avatars/techstart.jpg",
  },
  {
    id: 3,
    cliente: "Carlos Rodríguez",
    empresa: null,
    email: "carlos.rodriguez@email.com",
    telefono: "+1 234-567-8903",
    servicio: "Derecho Laboral",
    abogado: "Dra. Ana López",
    calificacion: 4,
    titulo: "Recuperé mis prestaciones laborales",
    testimonio:
      "Después de un despido injustificado, la Dra. López me ayudó a recuperar todas mis prestaciones laborales. Su conocimiento del derecho laboral es impresionante y siempre me explicó claramente mis opciones. El proceso fue exitoso y estoy muy agradecido por su apoyo.",
    fechaTestimonio: "2024-01-05",
    fechaCaso: "2023-09-20",
    estado: "Aprobado",
    destacado: false,
    mostrarEnWeb: true,
    avatar: "/avatars/carlos.jpg",
  },
  {
    id: 4,
    cliente: "Constructora ABC",
    empresa: "Constructora ABC",
    email: "legal@constructoraabc.com",
    telefono: "+1 234-567-8904",
    servicio: "Derecho Penal",
    abogado: "Dra. Patricia Ruiz",
    calificacion: 5,
    titulo: "Defensa exitosa en caso complejo",
    testimonio:
      "La Dra. Ruiz nos defendió en un caso penal muy complejo relacionado con nuestra empresa. Su estrategia legal fue brillante y logró demostrar nuestra inocencia. Su dedicación y profesionalismo fueron excepcionales durante todo el proceso judicial.",
    fechaTestimonio: "2024-01-03",
    fechaCaso: "2023-08-10",
    estado: "Pendiente",
    destacado: false,
    mostrarEnWeb: false,
    avatar: "/avatars/constructora.jpg",
  },
  {
    id: 5,
    cliente: "Laura Fernández",
    empresa: null,
    email: "laura.fernandez@email.com",
    telefono: "+1 234-567-8905",
    servicio: "Derecho Inmobiliario",
    abogado: "Dra. Carmen Vega",
    calificacion: 5,
    titulo: "Compra de casa sin problemas",
    testimonio:
      "La Dra. Vega me acompañó en todo el proceso de compra de mi primera casa. Revisó todos los documentos, me explicó cada detalle y se aseguró de que todo estuviera en orden. Gracias a ella, la transacción fue perfecta y sin sorpresas desagradables.",
    fechaTestimonio: "2023-12-28",
    fechaCaso: "2023-07-15",
    estado: "Aprobado",
    destacado: true,
    mostrarEnWeb: true,
    avatar: "/avatars/laura.jpg",
  },
  {
    id: 6,
    cliente: "Inversiones del Sur SA",
    empresa: "Inversiones del Sur SA",
    email: "info@inversionesdelsur.com",
    telefono: "+1 234-567-8906",
    servicio: "Derecho Fiscal",
    abogado: "Dr. Miguel Torres",
    calificacion: 4,
    titulo: "Optimización fiscal efectiva",
    testimonio:
      "El Dr. Torres nos ayudó a optimizar nuestra estructura fiscal de manera completamente legal. Sus recomendaciones nos han permitido ahorrar significativamente en impuestos mientras cumplimos con todas nuestras obligaciones. Muy profesional y conocedor.",
    fechaTestimonio: "2023-12-20",
    fechaCaso: "2023-06-01",
    estado: "Aprobado",
    destacado: false,
    mostrarEnWeb: true,
    avatar: "/avatars/inversiones.jpg",
  },
  {
    id: 7,
    cliente: "Ana Martínez",
    empresa: null,
    email: "ana.martinez@email.com",
    telefono: "+1 234-567-8907",
    servicio: "Mediación",
    abogado: "Dr. Carlos Mendoza",
    calificacion: 5,
    titulo: "Mediación familiar exitosa",
    testimonio:
      "El Dr. Mendoza nos ayudó a resolver un conflicto familiar muy delicado a través de mediación. Su paciencia, imparcialidad y habilidad para facilitar el diálogo fueron clave para llegar a un acuerdo que benefició a toda la familia. Proceso mucho más rápido y menos costoso que un juicio.",
    fechaTestimonio: "2023-12-15",
    fechaCaso: "2023-05-10",
    estado: "Rechazado",
    destacado: false,
    mostrarEnWeb: false,
    avatar: "/avatars/ana-martinez.jpg",
  },
  {
    id: 8,
    cliente: "Grupo Empresarial Norte",
    empresa: "Grupo Empresarial Norte",
    email: "contacto@grupoenorte.com",
    telefono: "+1 234-567-8908",
    servicio: "Propiedad Intelectual",
    abogado: "Dr. Roberto Silva",
    calificacion: 4,
    titulo: "Registro de marca exitoso",
    testimonio:
      "El Dr. Silva nos guió en el proceso de registro de nuestra marca comercial. Su conocimiento en propiedad intelectual nos dio la confianza de que todo se haría correctamente. El proceso fue transparente y el resultado exitoso.",
    fechaTestimonio: "2023-12-10",
    fechaCaso: "2023-04-20",
    estado: "Pendiente",
    destacado: false,
    mostrarEnWeb: false,
    avatar: "/avatars/grupo-norte.jpg",
  },
]

export default function TestimoniosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState("todos")
  const [filterCalificacion, setFilterCalificacion] = useState("todas")
  const [filterServicio, setFilterServicio] = useState("todos")

  const servicios = Array.from(new Set(testimonios.map((t) => t.servicio)))

  const testimoniosFiltrados = testimonios.filter((testimonio) => {
    const matchesSearch =
      testimonio.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonio.testimonio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonio.abogado.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = filterEstado === "todos" || testimonio.estado === filterEstado
    const matchesCalificacion =
      filterCalificacion === "todas" || testimonio.calificacion.toString() === filterCalificacion
    const matchesServicio = filterServicio === "todos" || testimonio.servicio === filterServicio

    return matchesSearch && matchesEstado && matchesCalificacion && matchesServicio
  })

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Aprobado: "default",
      Pendiente: "outline",
      Rechazado: "destructive",
    }
    return variants[estado] || "default"
  }

  const getEstadoIcon = (estado: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      Aprobado: CheckCircle,
      Pendiente: Clock,
      Rechazado: XCircle,
    }
    return icons[estado] || Clock
  }

  const renderStars = (calificacion: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < calificacion ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const totalTestimonios = testimonios.length
  const testimoniosAprobados = testimonios.filter((t) => t.estado === "Aprobado").length
  const testimoniosPendientes = testimonios.filter((t) => t.estado === "Pendiente").length
  const calificacionPromedio = testimonios.reduce((sum, t) => sum + t.calificacion, 0) / testimonios.length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Testimonios</h2>
          <p className="text-muted-foreground">Administra los testimonios y reseñas de clientes del bufete</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Testimonio
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Testimonios</CardTitle>
            <Quote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTestimonios}</div>
            <p className="text-xs text-muted-foreground">{testimoniosAprobados} aprobados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{testimoniosPendientes}</div>
            <p className="text-xs text-muted-foreground">Esperando revisión</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calificación Promedio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calificacionPromedio.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">De 5.0 estrellas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Destacados</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testimonios.filter((t) => t.destacado).length}</div>
            <p className="text-xs text-muted-foreground">Mostrados en inicio</p>
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
                  placeholder="Buscar testimonios..."
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
                <SelectItem value="Aprobado">Aprobado</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Rechazado">Rechazado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCalificacion} onValueChange={setFilterCalificacion}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Calificación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las calificaciones</SelectItem>
                <SelectItem value="5">5 estrellas</SelectItem>
                <SelectItem value="4">4 estrellas</SelectItem>
                <SelectItem value="3">3 estrellas</SelectItem>
                <SelectItem value="2">2 estrellas</SelectItem>
                <SelectItem value="1">1 estrella</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterServicio} onValueChange={setFilterServicio}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Servicio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los servicios</SelectItem>
                {servicios.map((servicio) => (
                  <SelectItem key={servicio} value={servicio}>
                    {servicio}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de testimonios */}
      <div className="grid gap-4">
        {testimoniosFiltrados.map((testimonio) => {
          const EstadoIcon = getEstadoIcon(testimonio.estado)

          return (
            <Card key={testimonio.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonio.avatar || "/placeholder.svg"} alt={testimonio.cliente} />
                      <AvatarFallback>
                        {testimonio.cliente
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{testimonio.cliente}</CardTitle>
                      <CardDescription>
                        {testimonio.empresa ? `${testimonio.empresa} • ` : ""}
                        {testimonio.servicio}
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
                        Ver Completo
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      {testimonio.estado === "Pendiente" && (
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
                  <Badge variant={getEstadoBadge(testimonio.estado)} className="flex items-center gap-1">
                    <EstadoIcon className="h-3 w-3" />
                    {testimonio.estado}
                  </Badge>
                  {testimonio.destacado && (
                    <Badge variant="secondary">
                      <Star className="h-3 w-3 mr-1" />
                      Destacado
                    </Badge>
                  )}
                  {testimonio.mostrarEnWeb && <Badge variant="outline">Visible en Web</Badge>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex">{renderStars(testimonio.calificacion)}</div>
                    <span className="text-sm font-medium">{testimonio.calificacion}/5</span>
                  </div>
                  <h3 className="font-semibold text-lg">{testimonio.titulo}</h3>
                </div>

                <div className="relative">
                  <Quote className="absolute top-0 left-0 h-6 w-6 text-muted-foreground/30" />
                  <p className="text-muted-foreground pl-8 italic">{testimonio.testimonio}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2 border-t">
                  <div>
                    <span className="font-medium">Abogado:</span>
                    <span className="ml-2 text-muted-foreground">{testimonio.abogado}</span>
                  </div>
                  <div>
                    <span className="font-medium">Servicio:</span>
                    <span className="ml-2 text-muted-foreground">{testimonio.servicio}</span>
                  </div>
                  <div>
                    <span className="font-medium">Fecha del caso:</span>
                    <span className="ml-2 text-muted-foreground">
                      {new Date(testimonio.fechaCaso).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Fecha del testimonio:</span>
                    <span className="ml-2 text-muted-foreground">
                      {new Date(testimonio.fechaTestimonio).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>Email: {testimonio.email}</span>
                  <span>Teléfono: {testimonio.telefono}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {testimoniosFiltrados.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron testimonios</h3>
            <p className="text-muted-foreground text-center">
              Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
