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
  FileText,
  Clock,
  User,
  Calendar,
  MoreHorizontal,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Timer,
  Target,
  TrendingUp,
  Eye,
  Edit,
  Archive,
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

interface Case {
  id: string
  title: string
  caseNumber: string
  client: string
  status: "pending" | "in_progress" | "completed" | "cancelled" | "on_hold"
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  startDate: string
  lastUpdate: string
  estimatedCompletion: string
  amount: number
  description: string
  progress: number
  nextAction: string
  hoursWorked: number
  estimatedHours: number
  documents: number
  upcomingEvents: number
}

export default function CasosAbogado() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Datos simulados de casos del abogado Dr. Juan Pérez
  const casos: Case[] = [
    {
      id: "1",
      title: "Divorcio consensual - María González",
      caseNumber: "CASE-2024-001",
      client: "María González",
      status: "in_progress",
      priority: "high",
      category: "Derecho Familiar",
      startDate: "2024-01-01",
      lastUpdate: "2025-01-16",
      estimatedCompletion: "2025-02-15",
      amount: 25000,
      description: "Proceso de divorcio consensual con distribución de bienes y custodia compartida",
      progress: 75,
      nextAction: "Audiencia programada para mañana",
      hoursWorked: 45,
      estimatedHours: 60,
      documents: 12,
      upcomingEvents: 1,
    },
    {
      id: "2",
      title: "Demanda laboral - Carlos Pérez",
      caseNumber: "CASE-2024-002",
      client: "Carlos Pérez",
      status: "pending",
      priority: "medium",
      category: "Derecho Laboral",
      startDate: "2024-01-05",
      lastUpdate: "2025-01-15",
      estimatedCompletion: "2025-03-01",
      amount: 15000,
      description: "Demanda por despido injustificado y compensaciones laborales",
      progress: 45,
      nextAction: "Revisar documentos adicionales del empleador",
      hoursWorked: 28,
      estimatedHours: 50,
      documents: 8,
      upcomingEvents: 0,
    },
    {
      id: "3",
      title: "Constitución de empresa - Tech Solutions",
      caseNumber: "CASE-2024-003",
      client: "Tech Solutions S.A.",
      status: "completed",
      priority: "low",
      category: "Derecho Corporativo",
      startDate: "2023-12-15",
      lastUpdate: "2025-01-14",
      estimatedCompletion: "Completado",
      amount: 35000,
      description: "Constitución legal de empresa tecnológica y registro mercantil",
      progress: 100,
      nextAction: "Caso completado exitosamente",
      hoursWorked: 40,
      estimatedHours: 40,
      documents: 15,
      upcomingEvents: 0,
    },
    {
      id: "4",
      title: "Sucesión testamentaria - Familia Rodríguez",
      caseNumber: "CASE-2024-004",
      client: "Ana Rodríguez",
      status: "in_progress",
      priority: "medium",
      category: "Derecho Sucesorio",
      startDate: "2024-01-08",
      lastUpdate: "2025-01-14",
      estimatedCompletion: "2025-02-28",
      amount: 20000,
      description: "Proceso de sucesión y distribución de herencia familiar",
      progress: 60,
      nextAction: "Reunión con herederos el viernes",
      hoursWorked: 32,
      estimatedHours: 55,
      documents: 10,
      upcomingEvents: 1,
    },
    {
      id: "5",
      title: "Contrato comercial - Distribuidora Central",
      caseNumber: "CASE-2024-005",
      client: "Distribuidora Central",
      status: "in_progress",
      priority: "high",
      category: "Derecho Comercial",
      startDate: "2024-01-10",
      lastUpdate: "2025-01-13",
      estimatedCompletion: "2025-01-25",
      amount: 18000,
      description: "Revisión y negociación de contrato de distribución exclusiva",
      progress: 80,
      nextAction: "Revisión final con el cliente",
      hoursWorked: 25,
      estimatedHours: 30,
      documents: 6,
      upcomingEvents: 1,
    },
    {
      id: "6",
      title: "Litigio civil - Propiedades Inmobiliarias",
      caseNumber: "CASE-2024-006",
      client: "Roberto Silva",
      status: "on_hold",
      priority: "medium",
      category: "Derecho Civil",
      startDate: "2024-01-12",
      lastUpdate: "2025-01-10",
      estimatedCompletion: "2025-04-15",
      amount: 30000,
      description: "Litigio por disputa de límites de propiedad",
      progress: 30,
      nextAction: "Esperando peritaje técnico",
      hoursWorked: 18,
      estimatedHours: 65,
      documents: 7,
      upcomingEvents: 0,
    },
  ]

  // Estadísticas calculadas
  const stats = {
    total: casos.length,
    active: casos.filter((c) => c.status === "in_progress").length,
    pending: casos.filter((c) => c.status === "pending").length,
    completed: casos.filter((c) => c.status === "completed").length,
    totalValue: casos.reduce((sum, c) => sum + c.amount, 0),
    avgProgress: Math.round(casos.reduce((sum, c) => sum + c.progress, 0) / casos.length),
    urgentCases: casos.filter((c) => c.priority === "high" || c.priority === "urgent").length,
    upcomingEvents: casos.reduce((sum, c) => sum + c.upcomingEvents, 0),
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Completado
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            En Progreso
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Pendiente
          </Badge>
        )
      case "on_hold":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
            En Espera
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Cancelado
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return (
          <Badge variant="destructive" className="bg-red-600">
            Urgente
          </Badge>
        )
      case "high":
        return <Badge variant="destructive">Alta</Badge>
      case "medium":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
            Media
          </Badge>
        )
      case "low":
        return <Badge variant="outline">Baja</Badge>
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  const filteredCases = casos.filter((caso) => {
    const matchesSearch =
      caso.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || caso.status === statusFilter
    const matchesPriority = priorityFilter === "all" || caso.priority === priorityFilter
    const matchesCategory = categoryFilter === "all" || caso.category === categoryFilter
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mis Casos</h1>
          <p className="text-muted-foreground">Gestiona todos tus casos legales activos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/area-de-trabajo/reportes">
              <TrendingUp className="w-4 h-4 mr-2" />
              Reportes
            </Link>
          </Button>
          <Button asChild>
            <Link href="/area-de-trabajo/casos/nuevo">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Caso
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Casos totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">En progreso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Por iniciar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Finalizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">L. {stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Cartera total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgProgress}%</div>
            <p className="text-xs text-muted-foreground">Promedio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.urgentCases}</div>
            <p className="text-xs text-muted-foreground">Alta prioridad</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">Próximos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar casos, clientes o números de caso..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="in_progress">En Progreso</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="on_hold">En Espera</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las prioridades</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="Derecho Familiar">Derecho Familiar</SelectItem>
                <SelectItem value="Derecho Laboral">Derecho Laboral</SelectItem>
                <SelectItem value="Derecho Corporativo">Derecho Corporativo</SelectItem>
                <SelectItem value="Derecho Sucesorio">Derecho Sucesorio</SelectItem>
                <SelectItem value="Derecho Comercial">Derecho Comercial</SelectItem>
                <SelectItem value="Derecho Civil">Derecho Civil</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cases Grid */}
      <div className="grid gap-6">
        {filteredCases.map((caso) => (
          <Card key={caso.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-lg">{caso.title}</CardTitle>
                    {getPriorityBadge(caso.priority)}
                    {getStatusBadge(caso.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {caso.caseNumber}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {caso.client}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Inicio: {new Date(caso.startDate).toLocaleDateString("es-ES")}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      L. {caso.amount.toLocaleString()}
                    </span>
                  </div>
                  <CardDescription className="text-sm">{caso.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/area-de-trabajo/casos/${caso.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/area-de-trabajo/casos/${caso.id}/editar`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Calendar className="h-4 w-4 mr-2" />
                        Programar cita
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        Ver documentos
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-orange-600">
                        <Archive className="h-4 w-4 mr-2" />
                        Archivar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso del caso</span>
                    <span>{caso.progress}%</span>
                  </div>
                  <Progress value={caso.progress} className="h-2" />
                </div>

                {/* Key Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Categoría</p>
                    <Badge variant="outline" className="mt-1">
                      {caso.category}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Horas trabajadas</p>
                    <p className="font-medium">
                      {caso.hoursWorked} / {caso.estimatedHours}h
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Documentos</p>
                    <p className="font-medium">{caso.documents} archivos</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Próximos eventos</p>
                    <p className="font-medium">{caso.upcomingEvents} programados</p>
                  </div>
                </div>

                {/* Next Action & Timeline */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Próxima acción: <span className="font-medium text-foreground">{caso.nextAction}</span>
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {caso.status === "completed" ? (
                      <span className="text-green-600 font-medium">✓ Completado</span>
                    ) : (
                      <>
                        Estimado: {caso.estimatedCompletion} • Actualizado:{" "}
                        {new Date(caso.lastUpdate).toLocaleDateString("es-ES")}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron casos</h3>
            <p className="text-muted-foreground mb-4">No hay casos que coincidan con los filtros seleccionados.</p>
            <Button asChild>
              <Link href="/area-de-trabajo/casos/nuevo">
                <Plus className="w-4 h-4 mr-2" />
                Crear primer caso
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
