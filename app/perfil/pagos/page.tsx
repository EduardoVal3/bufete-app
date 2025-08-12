"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Breadcrumbs } from "@/components/breadcrumbsPerfil"
import {
  CreditCard,
  Search,
  Filter,
  Calendar,
  Eye,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
} from "lucide-react"
import { toast } from "sonner"
import { useInvoiceData } from "@/hooks/useInvoiceData"
import { jsPDF } from "jspdf"

// Interfaces actualizadas según el hook (mantener compatibilidad con UI existente)
interface PaymentHistory {
  id: string
  date: string
  amount: number
  method: string
  reference: string
  status: "completed" | "pending" | "failed"
  notes: string
}

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface Invoice {
  id: string
  invoiceNumber: string
  caseId: string | null
  caseTitle: string
  issueDate: string
  dueDate: string
  totalAmount: number
  paidAmount: number
  pendingAmount: number
  subTotal: number
  taxAmount: number
  discountAmount: number
  status: "paid" | "pending" | "overdue" | "partial" | "cancelled"
  caseNumber: string
  items: InvoiceItem[]
  paymentHistory: PaymentHistory[]
  notes: string
  terms: string
  attachments: string[]
  createdAt: string
  updatedAt: string | null
}

const statusConfig = {
  paid: {
    label: "Pagada",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: CheckCircle,
  },
  pending: {
    label: "Pendiente",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    icon: Clock,
  },
  overdue: {
    label: "Vencida",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    icon: AlertTriangle,
  },
  partial: {
    label: "Parcial",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    icon: Clock,
  },
  cancelled: {
    label: "Cancelada",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    icon: AlertTriangle,
  },
}

export default function PagosPage() {
  // Usar el hook para obtener datos reales de la API
  const { invoices, loading, error, stats, refetch } = useInvoiceData()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "amount" | "status">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const filteredAndSortedInvoices = useMemo(() => {
    if (!invoices) return []
    
    const filtered = invoices.filter((invoice: Invoice) => {
      const matchesSearch =
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.caseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.caseNumber.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

      return matchesSearch && matchesStatus
    })

    filtered.sort((a: Invoice, b: Invoice) => {
      let comparison = 0

      switch (sortBy) {
        case "date":
          comparison = new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime()
          break
        case "amount":
          comparison = a.totalAmount - b.totalAmount
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [invoices, searchTerm, statusFilter, sortBy, sortOrder])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-HN", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const handlePayment = (invoice: Invoice) => {
    toast.info("Procesando pago", {
      description: `Redirigiendo al sistema de pagos para la factura ${invoice.invoiceNumber}...`,
    })
    // Aquí iría la integración con el sistema de pagos real
  }

  const handleDownload = async (invoiceNumber: string) => {
    try {
      toast.info("Generando PDF", {
        description: `Preparando la descarga de la factura ${invoiceNumber}...`,
      })

      // Buscar la factura por número
      const invoice = invoices.find(inv => inv.invoiceNumber === invoiceNumber)
      if (!invoice) {
        toast.error("Error", { description: "Factura no encontrada" })
        return
      }

      // Crear el PDF
      const pdf = new jsPDF()
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      
      // Configurar fuentes
      pdf.setFont("helvetica")
      
      // Encabezado de la empresa
      pdf.setFontSize(20)
      pdf.setTextColor(0, 0, 0)
      pdf.text("LEXFIRM", pageWidth / 2, 30, { align: "center" })
      
      pdf.setFontSize(12)
      pdf.text("Servicios Legales Profesionales", pageWidth / 2, 40, { align: "center" })
      pdf.text("Tel: +504 1234-5678 | Email: info@lexfirm.com", pageWidth / 2, 50, { align: "center" })

      // Línea separadora
      pdf.setLineWidth(0.5)
      pdf.line(20, 60, pageWidth - 20, 60)
      
      // Título de la factura
      pdf.setFontSize(16)
      pdf.setTextColor(0, 100, 200)
      pdf.text(`FACTURA ${invoice.invoiceNumber}`, 20, 80)
      
      // Información de la factura
      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)
      
      const infoY = 100
      pdf.text(`Fecha de emisión: ${formatDate(invoice.issueDate)}`, 20, infoY)
      pdf.text(`Fecha de vencimiento: ${formatDate(invoice.dueDate)}`, pageWidth - 85, infoY)
      
      pdf.text(`Caso: ${invoice.caseTitle}`, 20, infoY + 10)
      pdf.text(`Estado: ${statusConfig[invoice.status].label}`, pageWidth - 85, infoY + 10)

      if (invoice.caseNumber) {
        pdf.text(`Número de caso: ${invoice.caseNumber}`, 20, infoY + 20)
      }
      
      // Tabla de servicios
      const tableStartY = infoY + 40
      
      // Encabezados de la tabla
      pdf.setFillColor(240, 240, 240)
      pdf.rect(20, tableStartY, pageWidth - 40, 10, 'F')
      
      pdf.setFontSize(9)
      pdf.setTextColor(0, 0, 0)
      pdf.text("Descripción", 25, tableStartY + 7)
      pdf.text("Cant.", pageWidth - 120, tableStartY + 7)
      pdf.text("P. Unit.", pageWidth - 90, tableStartY + 7)
      pdf.text("Total", pageWidth - 50, tableStartY + 7)
      
      // Contenido de la tabla
      let currentY = tableStartY + 15
      invoice.items.forEach((item, index) => {
        // Alternar color de fondo
        if (index % 2 === 0) {
          pdf.setFillColor(250, 250, 250)
          pdf.rect(20, currentY - 5, pageWidth - 40, 10, 'F')
        }
        
        pdf.text(item.description, 25, currentY + 2)
        pdf.text(item.quantity.toString(), pageWidth - 120, currentY + 2)
        pdf.text(formatCurrency(item.unitPrice), pageWidth - 90, currentY + 2)
        pdf.text(formatCurrency(item.total), pageWidth - 50, currentY + 2)
        
        currentY += 12
      })
      
      // Linea separadora antes de totales
      pdf.setLineWidth(0.3)
      pdf.line(20, currentY + 5, pageWidth - 20, currentY + 5)
      
      // Totales
      const totalsY = currentY + 20
      pdf.setFontSize(10)
      
      // Subtotal
      pdf.text("Subtotal:", pageWidth - 100, totalsY)
      pdf.text(formatCurrency(invoice.subTotal), pageWidth - 50, totalsY)
      
      // Impuestos
      if (invoice.taxAmount > 0) {
        pdf.text("IVA:", pageWidth - 100, totalsY + 10)
        pdf.text(formatCurrency(invoice.taxAmount), pageWidth - 50, totalsY + 10)
      }
      
      // Descuentos
      if (invoice.discountAmount > 0) {
        pdf.text("Descuento:", pageWidth - 100, totalsY + 20)
        pdf.text(`-${formatCurrency(invoice.discountAmount)}`, pageWidth - 50, totalsY + 20)
      }
      
      // Total
      pdf.setFontSize(12)
      pdf.setTextColor(0, 100, 0)
      const totalY = totalsY + (invoice.taxAmount > 0 ? 30 : 20) + (invoice.discountAmount > 0 ? 10 : 0)
      pdf.text("TOTAL:", pageWidth - 100, totalY)
      pdf.text(formatCurrency(invoice.totalAmount), pageWidth - 50, totalY)
      
      // Estado de pago
      const paymentY = totalY + 20
      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)
      pdf.text("Importe pagado:", pageWidth - 100, paymentY)
      pdf.text(formatCurrency(invoice.paidAmount), pageWidth - 50, paymentY)
      
      pdf.setTextColor(200, 0, 0)
      pdf.text("Pendiente de pago:", pageWidth - 100, paymentY + 10)
      pdf.text(formatCurrency(invoice.totalAmount - invoice.paidAmount), pageWidth - 50, paymentY + 10)
      
      const notesY = paymentY + 30
      pdf.setFontSize(9)
      pdf.setTextColor(0, 0, 0)
      pdf.text(`Notas: ${invoice.notes}.`, 20, notesY)
      
      // terminos y condiciones
      const termsY = pageHeight - 40
      pdf.setFontSize(8)
      pdf.setTextColor(100, 100, 100)
      pdf.text("Términos y condiciones: " + (invoice.terms || "Pago a 30 días."), 20, termsY)
      
      // Pie de página
      pdf.text(`Generado el ${new Date().toLocaleDateString("es-ES")} a las ${new Date().toLocaleTimeString("es-ES")}`, 20, pageHeight - 20)
      pdf.text("Documento generado electrónicamente", pageWidth / 2, pageHeight - 20, { align: "center" })
      
      // Descargar el PDF
      pdf.save(`Factura_${invoice.invoiceNumber}.pdf`)
      
      toast.success("PDF descargado", {
        description: `La factura ${invoiceNumber} se ha descargado correctamente.`,
      })
      
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Error al generar PDF", {
        description: "Hubo un problema al generar el archivo PDF. Inténtalo de nuevo.",
      })
    }
  }

  const StatusBadge = ({ status }: { status: Invoice["status"] }) => {
    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge variant="secondary" className={`${config.color} flex items-center gap-1 font-medium`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const InvoiceDetailModal = ({ invoice }: { invoice: Invoice }) => (
    <DialogContent className="max-w-4xl max-h-[95vh] w-[95vw] overflow-hidden flex flex-col">
      <DialogHeader className="flex-shrink-0 pb-4">
        <DialogTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5" />
          Factura {invoice.invoiceNumber}
        </DialogTitle>
        <DialogDescription>Detalles completos de la factura</DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {/* Información general - Layout vertical en móvil */}
        <div className="space-y-4">
          {/* Información General */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-sm text-muted-foreground block">Número:</span>
                  <span className="font-medium">{invoice.invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground block">Estado:</span>
                  <StatusBadge status={invoice.status} />
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">Caso:</span>
                <span className="font-medium">{invoice.caseTitle}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">Número del caso:</span>
                <span className="font-medium">{invoice.caseNumber || "No especificado"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Fechas e Importes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Fechas e Importes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-sm text-muted-foreground block">Fecha emisión:</span>
                  <span className="font-medium">{formatDate(invoice.issueDate)}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground block">Fecha vencimiento:</span>
                  <span className="font-medium">{formatDate(invoice.dueDate)}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground block">Importe total:</span>
                  <span className="font-medium">{formatCurrency(invoice.totalAmount)}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground block">Pagado:</span>
                  <span className="font-medium text-green-600">{formatCurrency(invoice.paidAmount)}</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <span className="text-sm text-muted-foreground block">Pendiente:</span>
                <span className="text-lg font-bold text-red-600">
                  {formatCurrency(invoice.totalAmount - invoice.paidAmount)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Desglose de servicios */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Desglose de Servicios</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Vista unificada - Cards para todas las pantallas */}
            <div className="space-y-3">
              {invoice.items.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-3 space-y-2">
                  <div>
                    <span className="text-xs text-muted-foreground">Servicio {index + 1}:</span>
                    <p className="text-sm font-medium">{item.description}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground block">Cantidad:</span>
                      <span className="font-medium">{item.quantity}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">P. Unitario:</span>
                      <span className="font-medium">{formatCurrency(item.unitPrice)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Total:</span>
                      <span className="font-medium">{formatCurrency(item.total)}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-t-2 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total General:</span>
                  <span className="text-lg font-bold">{formatCurrency(invoice.totalAmount)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Historial de pagos */}
        {invoice.paymentHistory.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Historial de Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoice.paymentHistory.map((payment) => (
                  <div key={payment.id} className="border rounded-lg p-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div className="space-y-1">
                        <div className="font-medium">{formatCurrency(payment.amount)}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(payment.date)} • {payment.method}
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end space-y-1">
                        <Badge
                          variant={payment.status === "completed" ? "default" : "secondary"}
                          className={
                            payment.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : ""
                          }
                        >
                          {payment.status === "completed" ? "Completado" : "Pendiente"}
                        </Badge>
                        {payment.reference && (
                          <div className="text-xs text-muted-foreground">{payment.reference}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notas y archivos adjuntos */}
        <div className="space-y-4">
          {invoice.notes && invoice.notes.trim() !== "" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Notas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{invoice.notes}</p>
              </CardContent>
            </Card>
          )}

          {invoice.attachments.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Archivos Adjuntos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {invoice.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm truncate">{attachment}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="flex-shrink-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Botones de acción - Footer fijo */}
      <div className="flex-shrink-0 pt-4 border-t bg-background">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => handleDownload(invoice.invoiceNumber)} 
            variant="outline" 
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar PDF
          </Button>
          {(invoice.status === "pending" || invoice.status === "partial" || invoice.status === "overdue") && (
            <Button onClick={() => handlePayment(invoice)} className="flex-1">
              <CreditCard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Pagar </span>
              {formatCurrency(invoice.totalAmount - invoice.paidAmount)}
            </Button>
          )}
        </div>
      </div>
    </DialogContent>
  )

  return (
    <div className="space-y-6 p-6">
      <Breadcrumbs />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Pagos y Facturas</h1>
        <p className="text-muted-foreground">
          Gestiona tus facturas, realiza pagos y consulta el historial de transacciones.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Cargando facturas...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-600">Error al cargar facturas</h3>
                <p className="text-muted-foreground">{error}</p>
                <Button onClick={refetch} variant="outline" className="mt-4">
                  Intentar de nuevo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content - solo mostrar si no hay loading ni error */}
      {!loading && !error && (
        <>
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">Total Facturado</div>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(stats.total)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div className="text-sm text-muted-foreground">Pagado</div>
                </div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.paid)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <div className="text-sm text-muted-foreground">Pendiente</div>
                </div>
                <div className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.pending)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <div className="text-sm text-muted-foreground">Vencido</div>
                </div>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.overdue)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros y Búsqueda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por número de factura, caso o Número del caso..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="paid">Pagada</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="partial">Parcial</SelectItem>
                    <SelectItem value="overdue">Vencida</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={`${sortBy}-${sortOrder}`}
                  onValueChange={(value) => {
                    const [field, order] = value.split("-")
                    setSortBy(field as typeof sortBy)
                    setSortOrder(order as typeof sortOrder)
                  }}
                >
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Fecha (más reciente)</SelectItem>
                    <SelectItem value="date-asc">Fecha (más antiguo)</SelectItem>
                    <SelectItem value="amount-desc">Importe (mayor)</SelectItem>
                    <SelectItem value="amount-asc">Importe (menor)</SelectItem>
                    <SelectItem value="status-asc">Estado (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de facturas - Desktop */}
          <Card className="hidden md:block">
            <div className="relative">
              <div className="max-h-[600px] overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead>Factura</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha Emisión</TableHead>
                      <TableHead>Fecha Vencimiento</TableHead>
                      <TableHead className="text-right">Importe</TableHead>
                      <TableHead className="text-right">Pendiente</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedInvoices.map((invoice) => (
                      <TableRow key={invoice.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{invoice.invoiceNumber}</div>
                            <div className="text-sm text-muted-foreground">{invoice.caseTitle}</div>
                            <div className="text-xs text-muted-foreground">{invoice.caseNumber || "Sin caso asociado"}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={invoice.status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(invoice.issueDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(invoice.dueDate)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(invoice.totalAmount)}</TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              invoice.totalAmount - invoice.paidAmount > 0 ? "text-red-600 font-medium" : "text-green-600"
                            }
                          >
                            {formatCurrency(invoice.totalAmount - invoice.paidAmount)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedInvoice(invoice)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver Detalles
                                </Button>
                              </DialogTrigger>
                              {selectedInvoice && <InvoiceDetailModal invoice={selectedInvoice} />}
                            </Dialog>
                            {(invoice.status === "pending" ||
                              invoice.status === "partial" ||
                              invoice.status === "overdue") && (
                              <Button size="sm" onClick={() => handlePayment(invoice)}>
                                <CreditCard className="h-4 w-4 mr-2" />
                                Pagar Ahora
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>

          {/* Vista móvil - Cards */}
          <div className="md:hidden space-y-4">
            {filteredAndSortedInvoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-base">{invoice.invoiceNumber}</CardTitle>
                      <p className="text-sm text-muted-foreground">{invoice.caseTitle}</p>
                      <p className="text-xs text-muted-foreground">{invoice.caseNumber || "Sin caso asociado"}</p>
                    </div>
                    <StatusBadge status={invoice.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Emisión:</p>
                      <p className="font-medium">{formatDate(invoice.issueDate)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Vencimiento:</p>
                      <p className="font-medium">{formatDate(invoice.dueDate)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total:</p>
                      <p className="font-medium">{formatCurrency(invoice.totalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pendiente:</p>
                      <p
                        className={`font-medium ${
                          invoice.totalAmount - invoice.paidAmount > 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {formatCurrency(invoice.totalAmount - invoice.paidAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </DialogTrigger>
                      {selectedInvoice && <InvoiceDetailModal invoice={selectedInvoice} />}
                    </Dialog>
                    {(invoice.status === "pending" || invoice.status === "partial" || invoice.status === "overdue") && (
                      <Button className="w-full" onClick={() => handlePayment(invoice)}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pagar Ahora ({formatCurrency(invoice.totalAmount - invoice.paidAmount)})
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Estado vacío */}
          {filteredAndSortedInvoices.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron facturas</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Aún no tienes facturas registradas"}
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
