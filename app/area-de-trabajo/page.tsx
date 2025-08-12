"use client"

import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Clock,
  FileText,
  Plus,
  Users,
  AlertCircle,
  CheckCircle2,
  Timer,
  TrendingUp,
  Activity,
  DollarSign,
  Star,
  Target,
  BookOpen,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"

export default function AreaDeTrabajo() {
  // Datos simulados para el dashboard del abogado - Dr. Juan Pérez
  const lawyerStats = {
    totalCases: 24,
    activeCases: 8,
    completedThisMonth: 5,
    clientsCount: 18,
    upcomingAppointments: 3,
    pendingDocuments: 7,
    monthlyRevenue: 125000,
    averageRating: 4.8,
    totalReviews: 47,
    hoursWorked: 156,
    targetHours: 180,
    pendingPayments: 3,
    newConsultations: 2,
  }

  // Casos recientes del abogado
  const recentCases = [
    {
      id: "1",
      title: "Divorcio consensual - María González",
      caseNumber: "CASE-2024-001",
      status: "in_progress",
      priority: "high",
      lastUpdate: "2025-01-16",
      client: "María González",
      nextAction: "Audiencia programada para mañana",
      progress: 75,
      estimatedCompletion: "2025-02-15",
      value: 25000,
    },
    {
      id: "2",
      title: "Demanda laboral - Carlos Pérez",
      caseNumber: "CASE-2024-002",
      status: "pending",
      priority: "medium",
      lastUpdate: "2025-01-15",
      client: "Carlos Pérez",
      nextAction: "Revisar documentos adicionales",
      progress: 45,
      estimatedCompletion: "2025-03-01",
      value: 15000,
    },
    {
      id: "3",
      title: "Constitución de empresa - Tech Solutions",
      caseNumber: "CASE-2024-003",
      status: "completed",
      priority: "low",
      lastUpdate: "2025-01-14",
      client: "Tech Solutions S.A.",
      nextAction: "Caso completado",
      progress: 100,
      estimatedCompletion: "Completado",
      value: 35000,
    },
    {
      id: "4",
      title: "Sucesión testamentaria - Familia Rodríguez",
      caseNumber: "CASE-2024-004",
      status: "in_progress",
      priority: "medium",
      lastUpdate: "2025-01-14",
      client: "Ana Rodríguez",
      nextAction: "Reunión con herederos",
      progress: 60,
      estimatedCompletion: "2025-02-28",
      value: 20000,
    },
  ]

  // Próximas citas del abogado
  const upcomingAppointments = [
    {
      id: "1",
      title: "Audiencia - Divorcio María González",
      time: "09:00",
      date: "Mañana",
      type: "Audiencia",
      location: "Juzgado 1ro Civil - Sala 3",
      client: "María González",
      caseNumber: "CASE-2024-001",
      duration: "2 horas",
      preparation: "Revisar alegatos finales",
    },
    {
      id: "2",
      title: "Reunión con Cliente - Carlos Pérez",
      time: "14:30",
      date: "Hoy",
      type: "Consulta",
      location: "Oficina Principal",
      client: "Carlos Pérez",
      caseNumber: "CASE-2024-002",
      duration: "1 hora",
      preparation: "Documentos laborales",
    },
    {
      id: "3",
      title: "Reunión Familiar - Sucesión Rodríguez",
      time: "10:00",
      date: "Viernes",
      type: "Reunión",
      location: "Oficina Principal",
      client: "Ana Rodríguez",
      caseNumber: "CASE-2024-004",
      duration: "1.5 horas",
      preparation: "Inventario de bienes",
    },
  ]

  // Alertas importantes
  const importantAlerts = [
    {
      id: "1",
      type: "urgent",
      title: "Audiencia mañana",
      message: "Audiencia de divorcio María González - 09:00 AM",
      time: "Mañana",
    },
    {
      id: "2",
      type: "warning",
      title: "Documentos pendientes",
      message: "7 documentos requieren revisión urgente",
      time: "Hoy",
    },
    {
      id: "3",
      type: "info",
      title: "Nueva consulta",
      message: "Consulta programada para la próxima semana",
      time: "Hace 2 horas",
    },
  ]

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
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Consulta":
        return <Users className="h-4 w-4" />
      case "Audiencia":
        return <Activity className="h-4 w-4" />
      case "Reunión":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "info":
        return <Activity className="h-4 w-4 text-blue-500" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Panel Principal</h1>
          <p className="text-muted-foreground">Bienvenido de vuelta, Dr. Juan Pérez</p>
          <p className="text-sm text-muted-foreground">
            Especialista en Derecho Civil y Comercial • {lawyerStats.totalReviews} reseñas • {lawyerStats.averageRating}{" "}
            ⭐
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/area-de-trabajo/consultas">
              <MessageSquare className="w-4 h-4 mr-2" />
              Consultas ({lawyerStats.newConsultations})
            </Link>
          </Button>
          <Button asChild>
            <Link href="/area-de-trabajo/casos?action=new">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Caso
            </Link>
          </Button>
        </div>
      </div>

      {/* Alertas Importantes */}
      {importantAlerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800 dark:text-orange-200">
              <AlertCircle className="mr-2 h-5 w-5" />
              Alertas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {importantAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos Totales</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lawyerStats.totalCases}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +2 desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos Activos</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{lawyerStats.activeCases}</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{lawyerStats.completedThisMonth}</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mis Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lawyerStats.clientsCount}</div>
            <p className="text-xs text-muted-foreground">Clientes activos</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">L. {lawyerStats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calificación</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lawyerStats.averageRating}</div>
            <p className="text-xs text-muted-foreground">{lawyerStats.totalReviews} reseñas</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Progreso Mensual
            </CardTitle>
            <CardDescription>Horas trabajadas vs objetivo mensual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Horas trabajadas</span>
                <span>
                  {lawyerStats.hoursWorked} / {lawyerStats.targetHours} horas
                </span>
              </div>
              <Progress value={(lawyerStats.hoursWorked / lawyerStats.targetHours) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {lawyerStats.targetHours - lawyerStats.hoursWorked} horas restantes para alcanzar el objetivo
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Resumen Financiero
            </CardTitle>
            <CardDescription>Estado de pagos y facturación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Pagos pendientes</span>
                <Badge variant="outline" className="text-orange-600">
                  {lawyerStats.pendingPayments} casos
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Ingresos este mes</span>
                <span className="font-semibold text-green-600">L. {lawyerStats.monthlyRevenue.toLocaleString()}</span>
              </div>
              <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                <Link href="/area-de-trabajo/facturacion">Ver detalles financieros</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Casos Recientes */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Mis Casos Activos
                </CardTitle>
                <CardDescription>Casos que requieren tu atención</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/area-de-trabajo/casos">Ver todos</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCases.map((caso) => (
                <div
                  key={caso.id}
                  className="flex flex-col p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm">{caso.title}</p>
                        {getPriorityBadge(caso.priority)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-mono text-xs">{caso.caseNumber}</span>
                        <span>•</span>
                        <span>{caso.client}</span>
                        <span>•</span>
                        <span>L. {caso.value.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">{getStatusBadge(caso.status)}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso</span>
                      <span>{caso.progress}%</span>
                    </div>
                    <Progress value={caso.progress} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Próxima acción: {caso.nextAction}</span>
                    <span className="text-muted-foreground">
                      {caso.status === "completed" ? "Completado" : `Est: ${caso.estimatedCompletion}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Próximas Citas */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Mi Agenda
                </CardTitle>
                <CardDescription>Próximas citas y audiencias</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/area-de-trabajo/calendario">Ver calendario</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-col gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">{getTypeIcon(appointment.type)}</div>
                    <div className="flex-1 space-y-2">
                      <p className="font-medium text-sm">{appointment.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {appointment.date} • {appointment.time}
                          </span>
                        </div>
                        <span>•</span>
                        <span>{appointment.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {appointment.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">📍 {appointment.location}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-mono">{appointment.caseNumber}</span> • {appointment.client}
                      </div>
                      {appointment.preparation && (
                        <div className="text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 p-2 rounded">
                          📋 Preparación: {appointment.preparation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Acciones Rápidas
          </CardTitle>
          <CardDescription>Accede rápidamente a las funciones más utilizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
              asChild
            >
              <Link href="/area-de-trabajo/casos?action=new">
                <Plus className="h-6 w-6" />
                <span className="text-sm font-medium">Crear Caso</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
              asChild
            >
              <Link href="/area-de-trabajo/clientes">
                <Users className="h-6 w-6" />
                <span className="text-sm font-medium">Ver Clientes</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
              asChild
            >
              <Link href="/area-de-trabajo/documentos">
                <FileText className="h-6 w-6" />
                <span className="text-sm font-medium">Documentos</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
              asChild
            >
              <Link href="/area-de-trabajo/calendario">
                <Calendar className="h-6 w-6" />
                <span className="text-sm font-medium">Calendario</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
