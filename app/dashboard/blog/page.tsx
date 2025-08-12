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
  Eye,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  TrendingUp,
  BookOpen,
  Clock,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos mock del blog (en producción vendrían de la API)
const articulos = [
  {
    id: 1,
    titulo: "Nuevas Reformas al Código Civil 2024",
    resumen:
      "Análisis detallado de las principales modificaciones al Código Civil que entrarán en vigor este año y su impacto en los contratos civiles.",
    contenido: "Las reformas al Código Civil de 2024 representan un cambio significativo...",
    autor: "Dr. Carlos Mendoza",
    categoria: "Derecho Civil",
    fechaPublicacion: "2024-01-15",
    fechaCreacion: "2024-01-10",
    estado: "Publicado",
    visitas: 1250,
    likes: 89,
    comentarios: 23,
    tiempoLectura: "8 min",
    tags: ["Código Civil", "Reformas", "Contratos", "2024"],
    imagenDestacada: "/blog/codigo-civil-2024.jpg",
    avatar: "/avatars/carlos.jpg",
  },
  {
    id: 2,
    titulo: "Guía Completa del Derecho Laboral en México",
    resumen:
      "Todo lo que necesitas saber sobre los derechos laborales, desde contratos hasta despidos y prestaciones sociales.",
    contenido: "El derecho laboral en México ha evolucionado considerablemente...",
    autor: "Dra. Ana López",
    categoria: "Derecho Laboral",
    fechaPublicacion: "2024-01-12",
    fechaCreacion: "2024-01-05",
    estado: "Publicado",
    visitas: 2100,
    likes: 156,
    comentarios: 45,
    tiempoLectura: "12 min",
    tags: ["Derecho Laboral", "Contratos", "Despidos", "Prestaciones"],
    imagenDestacada: "/blog/derecho-laboral-mexico.jpg",
    avatar: "/avatars/ana.jpg",
  },
  {
    id: 3,
    titulo: "Constitución de Empresas: Paso a Paso",
    resumen:
      "Proceso completo para constituir una empresa en México, desde la elección del tipo societario hasta los trámites finales.",
    contenido: "La constitución de una empresa requiere seguir varios pasos...",
    autor: "Dr. Roberto Silva",
    categoria: "Derecho Corporativo",
    fechaPublicacion: null,
    fechaCreacion: "2024-01-08",
    estado: "Borrador",
    visitas: 0,
    likes: 0,
    comentarios: 0,
    tiempoLectura: "15 min",
    tags: ["Empresas", "Constitución", "Sociedades", "Trámites"],
    imagenDestacada: "/blog/constitucion-empresas.jpg",
    avatar: "/avatars/roberto.jpg",
  },
  {
    id: 4,
    titulo: "Defensa Penal: Derechos del Acusado",
    resumen: "Conoce los derechos fundamentales de toda persona acusada de un delito y cómo ejercerlos efectivamente.",
    contenido: "En el sistema penal mexicano, toda persona acusada tiene derechos...",
    autor: "Dra. Patricia Ruiz",
    categoria: "Derecho Penal",
    fechaPublicacion: "2024-01-10",
    fechaCreacion: "2024-01-03",
    estado: "Publicado",
    visitas: 890,
    likes: 67,
    comentarios: 18,
    tiempoLectura: "10 min",
    tags: ["Derecho Penal", "Derechos", "Defensa", "Acusado"],
    imagenDestacada: "/blog/defensa-penal.jpg",
    avatar: "/avatars/patricia.jpg",
  },
  {
    id: 5,
    titulo: "Optimización Fiscal para Empresas 2024",
    resumen:
      "Estrategias legales para optimizar la carga fiscal de tu empresa aprovechando las nuevas disposiciones fiscales.",
    contenido: "La planeación fiscal es fundamental para cualquier empresa...",
    autor: "Dr. Miguel Torres",
    categoria: "Derecho Fiscal",
    fechaPublicacion: null,
    fechaCreacion: "2024-01-14",
    estado: "Revisión",
    visitas: 0,
    likes: 0,
    comentarios: 0,
    tiempoLectura: "11 min",
    tags: ["Fiscal", "Optimización", "Empresas", "Impuestos"],
    imagenDestacada: "/blog/optimizacion-fiscal.jpg",
    avatar: "/avatars/miguel.jpg",
  },
  {
    id: 6,
    titulo: "Compraventa de Inmuebles: Aspectos Legales",
    resumen: "Guía completa sobre los aspectos legales más importantes en las transacciones inmobiliarias.",
    contenido: "La compraventa de inmuebles involucra múltiples aspectos legales...",
    autor: "Dra. Carmen Vega",
    categoria: "Derecho Inmobiliario",
    fechaPublicacion: "2024-01-08",
    fechaCreacion: "2024-01-01",
    estado: "Publicado",
    visitas: 1450,
    likes: 98,
    comentarios: 31,
    tiempoLectura: "9 min",
    tags: ["Inmobiliario", "Compraventa", "Contratos", "Registro"],
    imagenDestacada: "/blog/compraventa-inmuebles.jpg",
    avatar: "/avatars/carmen.jpg",
  },
  {
    id: 7,
    titulo: "Mediación: Alternativa al Litigio",
    resumen:
      "Descubre cómo la mediación puede ser una alternativa más rápida y económica para resolver conflictos legales.",
    contenido: "La mediación se ha convertido en una herramienta fundamental...",
    autor: "Dr. Carlos Mendoza",
    categoria: "Mediación",
    fechaPublicacion: null,
    fechaCreacion: "2024-01-16",
    estado: "Borrador",
    visitas: 0,
    likes: 0,
    comentarios: 0,
    tiempoLectura: "7 min",
    tags: ["Mediación", "Conflictos", "Alternativo", "Resolución"],
    imagenDestacada: "/blog/mediacion-alternativa.jpg",
    avatar: "/avatars/carlos.jpg",
  },
  {
    id: 8,
    titulo: "Propiedad Intelectual en la Era Digital",
    resumen: "Protege tus activos intangibles en el mundo digital: marcas, patentes y derechos de autor online.",
    contenido: "En la era digital, la protección de la propiedad intelectual...",
    autor: "Dr. Roberto Silva",
    categoria: "Propiedad Intelectual",
    fechaPublicacion: "2024-01-05",
    fechaCreacion: "2023-12-28",
    estado: "Publicado",
    visitas: 756,
    likes: 54,
    comentarios: 12,
    tiempoLectura: "13 min",
    tags: ["Propiedad Intelectual", "Digital", "Marcas", "Patentes"],
    imagenDestacada: "/blog/propiedad-intelectual-digital.jpg",
    avatar: "/avatars/roberto.jpg",
  },
]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategoria, setFilterCategoria] = useState("todas")
  const [filterEstado, setFilterEstado] = useState("todos")

  const categorias = Array.from(new Set(articulos.map((a) => a.categoria)))

  const articulosFiltrados = articulos.filter((articulo) => {
    const matchesSearch =
      articulo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      articulo.resumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      articulo.autor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = filterCategoria === "todas" || articulo.categoria === filterCategoria
    const matchesEstado = filterEstado === "todos" || articulo.estado === filterEstado

    return matchesSearch && matchesCategoria && matchesEstado
  })

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Publicado: "default",
      Borrador: "outline",
      Revisión: "secondary",
      Archivado: "destructive",
    }
    return variants[estado] || "default"
  }

  const totalArticulos = articulos.length
  const articulosPublicados = articulos.filter((a) => a.estado === "Publicado").length
  const totalVisitas = articulos.reduce((sum, a) => sum + a.visitas, 0)
  const totalLikes = articulos.reduce((sum, a) => sum + a.likes, 0)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión del Blog</h2>
          <p className="text-muted-foreground">Administra el contenido del blog legal del bufete</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Artículo
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Artículos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArticulos}</div>
            <p className="text-xs text-muted-foreground">{articulosPublicados} publicados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisitas.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Todas las publicaciones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLikes}</div>
            <p className="text-xs text-muted-foreground">Interacciones positivas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio Comentarios</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(articulos.reduce((sum, a) => sum + a.comentarios, 0) / articulosPublicados)}
            </div>
            <p className="text-xs text-muted-foreground">Por artículo publicado</p>
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
                  placeholder="Buscar artículos..."
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

      {/* Lista de artículos */}
      <div className="grid gap-4">
        {articulosFiltrados.map((articulo) => (
          <Card key={articulo.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg">{articulo.titulo}</CardTitle>
                  <CardDescription className="text-sm">{articulo.resumen}</CardDescription>
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
                      Ver Artículo
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Ver en Sitio
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
              <div className="flex flex-wrap gap-2">
                <Badge variant={getEstadoBadge(articulo.estado)}>{articulo.estado}</Badge>
                <Badge variant="outline">{articulo.categoria}</Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {articulo.tiempoLectura}
                </Badge>
              </div>

              <div className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={articulo.avatar || "/placeholder.svg"} alt={articulo.autor} />
                  <AvatarFallback>
                    {articulo.autor
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">{articulo.autor}</div>
                  <div className="text-muted-foreground">
                    Creado: {new Date(articulo.fechaCreacion).toLocaleDateString()}
                    {articulo.fechaPublicacion && (
                      <> • Publicado: {new Date(articulo.fechaPublicacion).toLocaleDateString()}</>
                    )}
                  </div>
                </div>
              </div>

              {articulo.estado === "Publicado" && (
                <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-lg font-bold">{articulo.visitas.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Visitas</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-lg font-bold text-red-600">{articulo.likes}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-lg font-bold text-blue-600">{articulo.comentarios}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Comentarios</div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-sm font-medium">Tags:</div>
                <div className="flex flex-wrap gap-1">
                  {articulo.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {articulosFiltrados.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron artículos</h3>
            <p className="text-muted-foreground text-center">
              Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
