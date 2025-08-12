"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  Clock,
  Users,
  FileText,
  Target,
  Star,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ReportData {
  period: string
  casesCompleted: number
  casesActive: number
  revenue: number
  hoursWorked: number
  clientsSatisfaction: number
  newClients: number
}

export default function ReportesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("este_mes")
  const [reportType, setReportType] = useState("general")

  // Datos simulados de reportes del abogado Dr. Juan Pérez
  const reportData: Record<string, ReportData> = {
    este_mes: {
      period: "Enero 2025",
      casesCompleted: 5,
      casesActive: 8,
      revenue: 125000,
      hoursWorked: 156,
      clientsSatisfaction: 4.8,
      newClients: 2,
    },
    mes_pasado: {
      period: "Diciembre 2024",
      casesCompleted: 7,
      casesActive: 6,
      revenue: 98000,
      hoursWorked: 142,
      clientsSatisfaction: 4.7,
      newClients: 3,
    },
    trimestre: {
      period: "Q4 2024",
      casesCompleted: 18,
      casesActive: 8,
      revenue: 285000,
      hoursWorked: 420,
      clientsSatisfaction: 4.6,
      newClients: 8,
    },
    año: {
      period: "2024",
      casesCompleted: 65,
      casesActive: 8,
      revenue: 1250000,
      hoursWorked: 1680,
      clientsSatisfaction: 4.7,
      newClients: 24,
    },
  }

  const currentData = reportData[selectedPeriod]
  const previousData = selectedPeriod === "este_mes" ? reportData.mes_pasado : reportData.este_mes

  // Datos detallados por categoría
  const categoryData = [
    {
      category: "Derecho Familiar",
      cases: 8,
      revenue: 45000,
      hours: 65,
      satisfaction: 4.9,
      color: "bg-blue-500",
    },
    {
      category: "Derecho Laboral",
      cases: 6,
      revenue: 32000,
      hours: 48,
      satisfaction: 4.7,
      color: "bg-green-500",
    },
    {
      category: "Derecho Corporativo",
      cases: 4,
      revenue: 28000,
      hours: 35,
      satisfaction: 4.8,
      color: "bg-purple-500",
    },
    {
      category: "Derecho Sucesorio",
      cases: 3,
      revenue: 15000,
      hours: 25,
      satisfaction: 4.6,
      color: "bg-orange-500",
    },
    {
      category: "Derecho Civil",
      cases: 2,
      revenue: 5000,
      hours: 18,
      satisfaction: 4.5,
      color: "bg-red-500",
    },
  ]

  // Datos de rendimiento mensual
  const monthlyPerformance = [
    { month: "Ago", cases: 6, revenue: 85000, hours: 128 },
    { month: "Sep", cases: 8, revenue: 112000, hours: 145 },
    { month: "Oct", cases: 7, revenue: 95000, hours: 138 },
    { month: "Nov", cases: 9, revenue: 125000, hours: 162 },
    { month: "Dic", cases: 7, revenue: 98000, hours: 142 },
    { month: "Ene", cases: 5, revenue: 125000, hours: 156 },
  ]

  const calculateGrowth = (current: number, previous: number) => {
    return (((current - previous) / previous) * 100).toFixed(1)
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600"
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />
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
          <h1 className="text-3xl font-bold">Reportes y Análisis</h1>
          <p className="text-muted-foreground">Analiza tu rendimiento y métricas profesionales</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Vista Detallada
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Reporte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full md:w-48">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="este_mes">Este mes</SelectItem>
                <SelectItem value="mes_pasado">Mes pasado</SelectItem>
                <SelectItem value="trimestre">Último trimestre</SelectItem>
                <SelectItem value="año">Este año</SelectItem>
              </SelectContent>
            </Select>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-full md:w-48">
                <BarChart3 className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Tipo de reporte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Reporte General</SelectItem>
                <SelectItem value="financiero">Análisis Financiero</SelectItem>
                <SelectItem value="casos">Rendimiento de Casos</SelectItem>
                <SelectItem value="clientes">Satisfacción de Clientes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos Completados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.casesCompleted}</div>
            <p
              className={`text-xs flex items-center gap-1 ${getGrowthColor(Number.parseFloat(calculateGrowth(currentData.casesCompleted, previousData.casesCompleted)))}`}
            >
              {getGrowthIcon(
                Number.parseFloat(calculateGrowth(currentData.casesCompleted, previousData.casesCompleted)),
              )}
              {calculateGrowth(currentData.casesCompleted, previousData.casesCompleted)}% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos Activos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{currentData.casesActive}</div>
            <p
              className={`text-xs flex items-center gap-1 ${getGrowthColor(Number.parseFloat(calculateGrowth(currentData.casesActive, previousData.casesActive)))}`}
            >
              {getGrowthIcon(Number.parseFloat(calculateGrowth(currentData.casesActive, previousData.casesActive)))}
              {calculateGrowth(currentData.casesActive, previousData.casesActive)}% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">L. {currentData.revenue.toLocaleString()}</div>
            <p
              className={`text-xs flex items-center gap-1 ${getGrowthColor(Number.parseFloat(calculateGrowth(currentData.revenue, previousData.revenue)))}`}
            >
              {getGrowthIcon(Number.parseFloat(calculateGrowth(currentData.revenue, previousData.revenue)))}
              {calculateGrowth(currentData.revenue, previousData.revenue)}% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Trabajadas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.hoursWorked}</div>
            <p
              className={`text-xs flex items-center gap-1 ${getGrowthColor(Number.parseFloat(calculateGrowth(currentData.hoursWorked, previousData.hoursWorked)))}`}
            >
              {getGrowthIcon(Number.parseFloat(calculateGrowth(currentData.hoursWorked, previousData.hoursWorked)))}
              {calculateGrowth(currentData.hoursWorked, previousData.hoursWorked)}% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfacción</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{currentData.clientsSatisfaction}</div>
            <div className="flex items-center gap-1 mt-1">
              {renderStars(Math.floor(currentData.clientsSatisfaction))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{currentData.newClients}</div>
            <p
              className={`text-xs flex items-center gap-1 ${getGrowthColor(Number.parseFloat(calculateGrowth(currentData.newClients, previousData.newClients)))}`}
            >
              {getGrowthIcon(Number.parseFloat(calculateGrowth(currentData.newClients, previousData.newClients)))}
              {calculateGrowth(currentData.newClients, previousData.newClients)}% vs período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Rendimiento por Especialidad
            </CardTitle>
            <CardDescription>Análisis de casos e ingresos por área de práctica</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${category.color}`} />
                      <span className="font-medium text-sm">{category.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">L. {category.revenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{category.cases} casos</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Progress
                      value={(category.revenue / Math.max(...categoryData.map((c) => c.revenue))) * 100}
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{category.hours}h trabajadas</span>
                      <div className="flex items-center gap-1">
                        {renderStars(Math.floor(category.satisfaction))}
                        <span>({category.satisfaction})</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tendencia Mensual
            </CardTitle>
            <CardDescription>Evolución de casos e ingresos en los últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyPerformance.map((month, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium w-8">{month.month}</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                        <span className="text-sm">{month.cases} casos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-blue-600" />
                        <span className="text-sm">{month.hours}h</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">L. {month.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      L. {Math.round(month.revenue / month.hours).toLocaleString()}/h
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objetivos del Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Casos completados</span>
                  <span>{currentData.casesCompleted} / 8</span>
                </div>
                <Progress value={(currentData.casesCompleted / 8) * 100} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Ingresos objetivo</span>
                  <span>L. {currentData.revenue.toLocaleString()} / L. 150,000</span>
                </div>
                <Progress value={(currentData.revenue / 150000) * 100} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Horas facturables</span>
                  <span>{currentData.hoursWorked} / 180</span>
                </div>
                <Progress value={(currentData.hoursWorked / 180) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Análisis Financiero
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Tarifa promedio/hora</span>
                <span className="font-semibold">
                  L. {Math.round(currentData.revenue / currentData.hoursWorked).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Ingresos por caso</span>
                <span className="font-semibold">
                  L.{" "}
                  {Math.round(
                    currentData.revenue / (currentData.casesCompleted + currentData.casesActive),
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Eficiencia (ingresos/hora)</span>
                <span className="font-semibold text-green-600">
                  L. {Math.round(currentData.revenue / currentData.hoursWorked).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Crecimiento mensual</span>
                <span
                  className={`font-semibold ${getGrowthColor(Number.parseFloat(calculateGrowth(currentData.revenue, previousData.revenue)))}`}
                >
                  {calculateGrowth(currentData.revenue, previousData.revenue)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Métricas de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Satisfacción promedio</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{currentData.clientsSatisfaction}</span>
                  {renderStars(Math.floor(currentData.clientsSatisfaction))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Nuevos clientes</span>
                <span className="font-semibold text-blue-600">{currentData.newClients}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tasa de retención</span>
                <span className="font-semibold text-green-600">95%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Referidos generados</span>
                <span className="font-semibold">8</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen del Período - {currentData.period}</CardTitle>
          <CardDescription>Análisis integral de tu rendimiento profesional</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">Fortalezas Identificadas</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Alta satisfacción del cliente ({currentData.clientsSatisfaction}/5.0)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Crecimiento en ingresos del {calculateGrowth(currentData.revenue, previousData.revenue)}%
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Especialización exitosa en Derecho Familiar
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Eficiencia en resolución de casos
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-orange-600">Áreas de Mejora</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  Aumentar horas facturables ({currentData.hoursWorked}/180 objetivo)
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  Diversificar cartera de servicios
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  Incrementar adquisición de nuevos clientes
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  Optimizar tiempo por caso
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
