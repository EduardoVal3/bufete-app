"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  DollarSign,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Eye,
  Download,
  Send,
  TrendingUp,
  Target,
  CreditCard,
  Receipt,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  caseNumber: string
  caseTitle: string
  amount: number
  status: "pendiente" | "pagada" | "vencida" | "parcial"
  issueDate: string
  dueDate: string
  paidDate?: string
  paidAmount?: number
  description: string
  hoursWorked: number
  hourlyRate: number
  expenses: number
  taxes: number
  paymentMethod?: string
  notes?: string
}

interface PaymentRecord {
  id: string
  invoiceId: string
  amount: number
  date: string
  method: string
  reference: string
}

export default function FacturacionPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  // Datos simulados de facturación del abogado Dr. Juan Pérez
  const facturas: Invoice[] = [
    {
      id: "1",
      invoiceNumber: "INV-2025-001",
      clientName: "María González",
      caseNumber: "CASE-2024-001",
      caseTitle: "Divorcio consensual",
      amount: 18750,
      status: "pendiente",
      issueDate: "2025-01-15",
      dueDate: "2025-02-14",
      description: "Servicios legales - Proceso de divorcio consensual",
      hoursWorked: 25,
      hourlyRate: 600,
      expenses: 3750,
      taxes: 0,
      notes: "Incluye gestión de documentos y audiencias",
    },
    {
      id: "2",
      invoiceNumber: "INV-2025-002",
      clientName: "Carlos Pérez",
      caseNumber: "CASE-2024-002",
      caseTitle: "Demanda laboral",
      amount: 12000,
      status: "pagada",
      issueDate: "2025-01-10",
      dueDate: "2025-02-09",
      paidDate: "2025-01-14",
      paidAmount: 12000,
      description: "Servicios legales - Demanda por despido injustificado",
      hoursWorked: 20,
      hourlyRate: 600,
      expenses: 0,
      taxes: 0,
      paymentMethod: "Transferencia bancaria",
      notes: "Pago completo recibido",
    },
    {
      id: "3",
      invoiceNumber: "INV-2025-003",
      clientName: "Tech Solutions S.A.",
      caseNumber: "CASE-2024-003",
      caseTitle: "Constitución de empresa",
      amount: 35000,
      status: "pagada",
      issueDate: "2025-01-05",
      dueDate: "2025-02-04",
      paidDate: "2025-01-12",
      paidAmount: 35000,
      description: "Servicios legales - Constitución legal de empresa tecnológica",
      hoursWorked: 40,
      hourlyRate: 600,
      expenses: 11000,
      taxes: 0,
      paymentMethod: "Cheque",
      notes: "Incluye todos los trámites de registro",
    },
    {
      id: "4",
      invoiceNumber: "INV-2025-004",
      clientName: "Ana Rodríguez",
      caseNumber: "CASE-2024-004",
      caseTitle: "Sucesión testamentaria",
      amount: 15000,
      status: "parcial",
      issueDate: "2025-01-08",
      dueDate: "2025-02-07",
      paidDate: "2025-01-13",
      paidAmount: 7500,
      description: "Servicios legales - Proceso de sucesión familiar",
      hoursWorked: 25,
      hourlyRate: 600,
      expenses: 0,
      taxes: 0,
      paymentMethod: "Efectivo",
      notes: "Pago parcial del 50%, pendiente L. 7,500",
    },
    {
      id: "5",
      invoiceNumber: "INV-2025-005",
      clientName: "Distribuidora Central",
      caseNumber: "CASE-2024-005",
      caseTitle: "Contrato comercial",
      amount: 14400,
      status: "vencida",
      issueDate: "2024-12-20",
      dueDate: "2025-01-19",
      description: "Servicios legales - Revisión de contrato de distribución",
      hoursWorked: 24,
      hourlyRate: 600,
      expenses: 0,
      taxes: 0,
      notes: "Factura vencida, requiere seguimiento",
    },
    {
      id: "6",
      invoiceNumber: "INV-2025-006",
      clientName: "Roberto Silva",
      caseNumber: "CASE-2024-006",
      caseTitle: "Litigio civil",
      amount: 10800,
      status: "pendiente",
      issueDate: "2025-01-12",
      dueDate: "2025-02-11",
      description: "Servicios legales - Litigio por disputa de propiedades",
      hoursWorked: 18,
      hourlyRate: 600,
      expenses: 0,
      taxes: 0,
      notes: "Caso en proceso, facturación por horas trabajadas",
    },
  ]

  // Estadísticas calculadas
  const stats = {
    totalFacturado: facturas.reduce((sum, f) => sum + f.amount, 0),
    totalCobrado: facturas.reduce((sum, f) => sum + (f.paidAmount || 0), 0),
    pendienteCobro: facturas
      .filter((f) => f.status === "pendiente" || f.status === "parcial")
      .reduce((sum, f) => sum + (f.amount - (f.paidAmount || 0)), 0),
    facturasPendientes: facturas.filter((f) => f.status === "pendiente").length,
    facturasVencidas: facturas.filter((f) => f.status === "vencida").length,
    facturasPagadas: facturas.filter((f) => f.status === "pagada").length,
    horasTotales: facturas.reduce((sum, f) => sum + f.hoursWorked, 0),
    tarifaPromedio: facturas.reduce((sum, f) => sum + f.hourlyRate, 0) / facturas.length,
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pagada":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Pagada
          </Badge>
        )
      case "pendiente":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Pendiente
          </Badge>
        )
      case "vencida":
        return <Badge variant="destructive">Vencida</Badge>
      case "parcial":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
            Parcial
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const filteredFacturas = facturas.filter((factura) => {
    const searchString = `${factura.clientName} ${factura.invoiceNumber} ${factura.caseTitle}`.toLowerCase()
    const matchesSearch = searchString.includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || factura.status === statusFilter

    let matchesDate = true
    if (dateFilter !== "all") {
      const now = new Date()
      const facturaDate = new Date(factura.issueDate)

      switch (dateFilter) {
        case "este_mes":
          matchesDate = facturaDate.getMonth() === now.getMonth() && facturaDate.getFullYear() === now.getFullYear()
          break
        case "mes_pasado":
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1)
          matchesDate =
            facturaDate.getMonth() === lastMonth.getMonth() && facturaDate.getFullYear() === lastMonth.getFullYear()
          break
        case "este_año":
          matchesDate = facturaDate.getFullYear() === now.getFullYear()
          break
      }
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  const getPaymentProgress = (factura: Invoice) => {
    if (factura.status === "pagada") return 100
    if (factura.status === "parcial" && factura.paidAmount) {
      return (factura.paidAmount / factura.amount) * 100
    }
    return 0
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Facturación y Pagos</h1>
          <p className="text-muted-foreground">Gestiona tus facturas, pagos y finanzas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Factura
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facturado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">L. {stats.totalFacturado.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Este año</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cobrado</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">L. {stats.totalCobrado.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.totalCobrado / stats.totalFacturado) * 100).toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendiente Cobro</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">L. {stats.pendienteCobro.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Por cobrar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.facturasPendientes}</div>
            <p className="text-xs text-muted-foreground">Facturas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.facturasVencidas}</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagadas</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.facturasPagadas}</div>
            <p className="text-xs text-muted-foreground">Completadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Totales</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.horasTotales}</div>
            <p className="text-xs text-muted-foreground">Horas facturadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarifa Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">L. {stats.tarifaPromedio.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Por hora</p>
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
                  placeholder="Buscar por cliente, número de factura o caso..."
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
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="pagada">Pagada</SelectItem>
                <SelectItem value="vencida">Vencida</SelectItem>
                <SelectItem value="parcial">Parcial</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los períodos</SelectItem>
                <SelectItem value="este_mes">Este mes</SelectItem>
                <SelectItem value="mes_pasado">Mes pasado</SelectItem>
                <SelectItem value="este_año">Este año</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices List */}
      <div className="grid gap-6">
        {filteredFacturas.map((factura) => (
          <Card key={factura.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-lg">{factura.invoiceNumber}</CardTitle>
                    {getStatusBadge(factura.status)}
                    {isOverdue(factura.dueDate) && factura.status !== "pagada" && (
                      <Badge variant="destructive" className="bg-red-600">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Vencida
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {factura.caseNumber}
                    </span>
                    <span>{factura.clientName}</span>
                    <span>{factura.caseTitle}</span>
                  </div>
                  <CardDescription className="text-sm">{factura.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-2xl font-bold">L. {factura.amount.toLocaleString()}</p>
                    {factura.status === "parcial" && factura.paidAmount && (
                      <p className="text-sm text-green-600">Pagado: L. {factura.paidAmount.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Payment Progress */}
                {factura.status === "parcial" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso de pago</span>
                      <span>{getPaymentProgress(factura).toFixed(0)}%</span>
                    </div>
                    <Progress value={getPaymentProgress(factura)} className="h-2" />
                  </div>
                )}

                {/* Invoice Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Horas trabajadas</p>
                    <p className="font-medium">{factura.hoursWorked}h</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tarifa por hora</p>
                    <p className="font-medium">L. {factura.hourlyRate.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Gastos</p>
                    <p className="font-medium">L. {factura.expenses.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fecha vencimiento</p>
                    <p className="font-medium">{new Date(factura.dueDate).toLocaleDateString("es-ES")}</p>
                  </div>
                </div>

                {/* Payment Info */}
                {factura.paidDate && (
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          {factura.status === "pagada" ? "Pagado completamente" : "Pago parcial"}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {new Date(factura.paidDate).toLocaleDateString("es-ES")} • {factura.paymentMethod}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-800 dark:text-green-200">
                          L. {(factura.paidAmount || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {factura.notes && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">
                      <strong>Notas:</strong> {factura.notes}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver detalles
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Descargar PDF
                  </Button>
                  {factura.status === "pendiente" || factura.status === "parcial" ? (
                    <Button size="sm">
                      <Send className="h-4 w-4 mr-1" />
                      Enviar recordatorio
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <CreditCard className="h-4 w-4 mr-1" />
                      Registrar pago
                    </Button>
                  )}
                </div>

                {/* Footer Info */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 pt-2 border-t text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>Emitida: {new Date(factura.issueDate).toLocaleDateString("es-ES")}</span>
                    <span>Vence: {new Date(factura.dueDate).toLocaleDateString("es-ES")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {factura.status === "vencida" && (
                      <span className="text-red-600 font-medium">
                        Vencida hace{" "}
                        {Math.floor(
                          (new Date().getTime() - new Date(factura.dueDate).getTime()) / (1000 * 60 * 60 * 24),
                        )}{" "}
                        días
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFacturas.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron facturas</h3>
            <p className="text-muted-foreground mb-4">No hay facturas que coincidan con los filtros seleccionados.</p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Crear primera factura
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
