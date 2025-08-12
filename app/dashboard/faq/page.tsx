"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Plus,
  HelpCircle,
  Eye,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Star,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Datos mock de FAQ (en producción vendrían de la API)
const faqs = [
  {
    id: 1,
    pregunta: "¿Cuáles son los honorarios por una consulta inicial?",
    respuesta:
      "La consulta inicial tiene un costo de $500 pesos mexicanos y tiene una duración aproximada de 30 minutos. Durante esta consulta evaluaremos su caso y le proporcionaremos una orientación inicial sobre las opciones legales disponibles.",
    categoria: "Honorarios",
    subcategoria: "Consultas",
    fechaCreacion: "2024-01-15",
    fechaActualizacion: "2024-01-15",
    autor: "Dr. Carlos Mendoza",
    estado: "Publicado",
    visitas: 245,
    orden: 1,
    destacada: true,
    tags: ["honorarios", "consulta", "precios"],
  },
  {
    id: 2,
    pregunta: "¿Qué documentos necesito para iniciar un proceso de divorcio?",
    respuesta:
      "Para iniciar un proceso de divorcio necesitará: acta de matrimonio original, identificaciones oficiales de ambos cónyuges, comprobantes de ingresos, estados de cuenta bancarios, escrituras de propiedades, y si hay menores de edad, actas de nacimiento de los hijos. También es recomendable tener un inventario de bienes muebles e inmuebles.",
    categoria: "Derecho Familiar",
    subcategoria: "Divorcio",
    fechaCreacion: "2024-01-12",
    fechaActualizacion: "2024-01-14",
    autor: "Dr. Carlos Mendoza",
    estado: "Publicado",
    visitas: 189,
    orden: 2,
    destacada: true,
    tags: ["divorcio", "documentos", "familia"],
  },
  {
    id: 3,
    pregunta: "¿Cuánto tiempo tarda un proceso laboral?",
    respuesta:
      "La duración de un proceso laboral varía según la complejidad del caso. En promedio, un juicio laboral puede tardar entre 6 meses y 2 años. Los casos más sencillos pueden resolverse en 3-6 meses, mientras que los casos complejos con múltiples audiencias pueden extenderse hasta 3 años.",
    categoria: "Derecho Laboral",
    subcategoria: "Procesos",
    fechaCreacion: "2024-01-10",
    fechaActualizacion: "2024-01-10",
    autor: "Dra. Ana López",
    estado: "Publicado",
    visitas: 167,
    orden: 3,
    destacada: false,
    tags: ["laboral", "tiempo", "proceso"],
  },
  {
    id: 4,
    pregunta: "¿Qué es una sociedad de responsabilidad limitada?",
    respuesta:
      "Una Sociedad de Responsabilidad Limitada (SRL) es un tipo de sociedad mercantil donde la responsabilidad de los socios se limita al monto de sus aportaciones. Es ideal para pequeñas y medianas empresas ya que ofrece flexibilidad en su administración y protección patrimonial para los socios.",
    categoria: "Derecho Corporativo",
    subcategoria: "Sociedades",
    fechaCreacion: "2024-01-08",
    fechaActualizacion: "2024-01-08",
    autor: "Dr. Roberto Silva",
    estado: "Publicado",
    visitas: 134,
    orden: 4,
    destacada: false,
    tags: ["corporativo", "sociedades", "empresa"],
  },
  {
    id: 5,
    pregunta: "¿Cuáles son mis derechos si soy detenido?",
    respuesta:
      "Si es detenido, tiene derecho a: permanecer en silencio, ser informado de los cargos en su contra, comunicarse con un abogado, hacer una llamada telefónica, ser tratado con dignidad, no ser torturado o maltratado, y ser presentado ante un juez en un plazo máximo de 48 horas.",
    categoria: "Derecho Penal",
    subcategoria: "Derechos",
    fechaCreacion: "2024-01-05",
    fechaActualizacion: "2024-01-05",
    autor: "Dra. Patricia Ruiz",
    estado: "Publicado",
    visitas: 298,
    orden: 5,
    destacada: true,
    tags: ["penal", "derechos", "detención"],
  },
  {
    id: 6,
    pregunta: "¿Cómo puedo optimizar mis impuestos legalmente?",
    respuesta:
      "Existen varias estrategias legales para optimizar impuestos: aprovechar deducciones fiscales, planificar el momento de ingresos y gastos, utilizar regímenes fiscales preferenciales, realizar aportaciones a fondos de retiro, y estructurar adecuadamente las operaciones empresariales. Es importante contar con asesoría profesional.",
    categoria: "Derecho Fiscal",
    subcategoria: "Optimización",
    fechaCreacion: "2024-01-03",
    fechaActualizacion: "2024-01-03",
    autor: "Dr. Miguel Torres",
    estado: "Borrador",
    visitas: 0,
    orden: 6,
    destacada: false,
    tags: ["fiscal", "impuestos", "optimización"],
  },
  {
    id: 7,
    pregunta: "¿Qué debo verificar antes de comprar una propiedad?",
    respuesta:
      "Antes de comprar una propiedad debe verificar: que el vendedor sea el propietario legítimo, que no existan gravámenes o adeudos, que los documentos estén en orden, que la propiedad cumpla con las regulaciones de uso de suelo, y que no tenga problemas legales pendientes. Recomendamos realizar un estudio de título completo.",
    categoria: "Derecho Inmobiliario",
    subcategoria: "Compraventa",
    fechaCreacion: "2024-01-01",
    fechaActualizacion: "2024-01-01",
    autor: "Dra. Carmen Vega",
    estado: "Publicado",
    visitas: 156,
    orden: 7,
    destacada: false,
    tags: ["inmobiliario", "compraventa", "verificación"],
  },
  {
    id: 8,
    pregunta: "¿Qué es la mediación y cuándo es recomendable?",
    respuesta:
      "La mediación es un método alternativo de resolución de conflictos donde un tercero imparcial ayuda a las partes a llegar a un acuerdo. Es recomendable cuando las partes desean mantener una relación, buscan una solución rápida y económica, o cuando el conflicto no es de alta complejidad legal.",
    categoria: "Mediación",
    subcategoria: "Proceso",
    fechaCreacion: "2023-12-28",
    fechaActualizacion: "2023-12-28",
    autor: "Dr. Carlos Mendoza",
    estado: "Publicado",
    visitas: 89,
    orden: 8,
    destacada: false,
    tags: ["mediación", "alternativo", "conflictos"],
  },
  {
    id: 9,
    pregunta: "¿Cómo registro una marca comercial?",
    respuesta:
      "Para registrar una marca comercial debe: realizar una búsqueda de antecedentes, presentar la solicitud ante el IMPI, pagar las tarifas correspondientes, esperar el examen de forma y fondo, y si es aprobada, obtener el título de registro. El proceso puede tardar entre 6 meses y 2 años.",
    categoria: "Propiedad Intelectual",
    subcategoria: "Marcas",
    fechaCreacion: "2023-12-25",
    fechaActualizacion: "2023-12-25",
    autor: "Dr. Roberto Silva",
    estado: "Revisión",
    visitas: 0,
    orden: 9,
    destacada: false,
    tags: ["marca", "registro", "IMPI"],
  },
  {
    id: 10,
    pregunta: "¿Cuándo necesito un abogado para mi empresa?",
    respuesta:
      "Necesita un abogado para su empresa cuando: constituya la sociedad, elabore contratos importantes, enfrente disputas legales, requiera cumplimiento normativo, planifique fusiones o adquisiciones, o necesite asesoría en temas laborales, fiscales o regulatorios. La asesoría preventiva es siempre recomendable.",
    categoria: "Derecho Corporativo",
    subcategoria: "Asesoría",
    fechaCreacion: "2023-12-20",
    fechaActualizacion: "2023-12-22",
    autor: "Dr. Roberto Silva",
    estado: "Publicado",
    visitas: 112,
    orden: 10,
    destacada: false,
    tags: ["empresa", "asesoría", "abogado"],
  },
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategoria, setFilterCategoria] = useState("todas")
  const [filterEstado, setFilterEstado] = useState("todos")
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const categorias = Array.from(new Set(faqs.map((f) => f.categoria)))

  const faqsFiltradas = faqs
    .filter((faq) => {
      const matchesSearch =
        faq.pregunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.respuesta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategoria = filterCategoria === "todas" || faq.categoria === filterCategoria
      const matchesEstado = filterEstado === "todos" || faq.estado === filterEstado

      return matchesSearch && matchesCategoria && matchesEstado
    })
    .sort((a, b) => a.orden - b.orden)

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Publicado: "default",
      Borrador: "outline",
      Revisión: "secondary",
      Archivado: "destructive",
    }
    return variants[estado] || "default"
  }

  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const totalFAQs = faqs.length
  const faqsPublicadas = faqs.filter((f) => f.estado === "Publicado").length
  const totalVisitas = faqs.reduce((sum, f) => sum + f.visitas, 0)
  const faqsDestacadas = faqs.filter((f) => f.destacada).length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de FAQ</h2>
          <p className="text-muted-foreground">Administra las preguntas frecuentes del sitio web</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva FAQ
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total FAQs</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFAQs}</div>
            <p className="text-xs text-muted-foreground">{faqsPublicadas} publicadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisitas.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Todas las FAQs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Destacadas</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{faqsDestacadas}</div>
            <p className="text-xs text-muted-foreground">En página principal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categorias.length}</div>
            <p className="text-xs text-muted-foreground">Áreas de práctica</p>
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
                  placeholder="Buscar preguntas frecuentes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterCategoria} onValueChange={setFilterCategoria}>
              <SelectTrigger className="w-[200px]">
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
                <SelectItem value="Publicado">Publicado</SelectItem>
                <SelectItem value="Borrador">Borrador</SelectItem>
                <SelectItem value="Revisión">Revisión</SelectItem>
                <SelectItem value="Archivado">Archivado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de FAQs */}
      <div className="grid gap-4">
        {faqsFiltradas.map((faq) => (
          <Card key={faq.id} className="hover:shadow-lg transition-shadow">
            <Collapsible open={expandedItems.includes(faq.id)} onOpenChange={() => toggleExpanded(faq.id)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CollapsibleTrigger className="flex items-start space-x-3 text-left flex-1">
                    <div className="mt-1">
                      {expandedItems.includes(faq.id) ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg">{faq.pregunta}</CardTitle>
                      <CardDescription>
                        {faq.categoria} • {faq.subcategoria}
                      </CardDescription>
                    </div>
                  </CollapsibleTrigger>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver en Sitio
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
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getEstadoBadge(faq.estado)}>{faq.estado}</Badge>
                  <Badge variant="outline">{faq.categoria}</Badge>
                  {faq.destacada && <Badge variant="secondary">Destacada</Badge>}
                  {faq.estado === "Publicado" && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {faq.visitas} visitas
                    </Badge>
                  )}
                </div>

                <CollapsibleContent className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Respuesta:</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.respuesta}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Autor:</span>
                      <span className="ml-2 text-muted-foreground">{faq.autor}</span>
                    </div>
                    <div>
                      <span className="font-medium">Orden:</span>
                      <span className="ml-2 text-muted-foreground">#{faq.orden}</span>
                    </div>
                    <div>
                      <span className="font-medium">Creada:</span>
                      <span className="ml-2 text-muted-foreground">
                        {new Date(faq.fechaCreacion).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Actualizada:</span>
                      <span className="ml-2 text-muted-foreground">
                        {new Date(faq.fechaActualizacion).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Tags:</div>
                    <div className="flex flex-wrap gap-1">
                      {faq.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </CardContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {faqsFiltradas.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron FAQs</h3>
            <p className="text-muted-foreground text-center">
              Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
