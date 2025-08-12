import { useState, useEffect, useMemo } from "react"
import api from "@/lib/axios"
import { useAuth } from "./useAuth"

// Interfaces basadas en la estructura real del backend según InvoiceDTOs.cs
interface ApiInvoice {
  id: number
  invoiceNumber: string
  clientId: number
  clientName: string
  caseId: number | null
  caseTitle: string | null
  caseNumber: string | null
  issueDate: string
  dueDate: string
  status: "Pendiente" | "Pagada" | "Vencida" | "Cancelada"
  subTotal: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  paidAmount: number
  pendingAmount: number
  notes: string | null
  terms: string | null
  createdAt: string
  updatedAt: string | null
  items: ApiInvoiceItem[]
  payments: ApiPayment[]
}

interface ApiInvoiceItem {
  id: number
  invoiceId: number
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface ApiPayment {
  id: number
  invoiceId: number
  amount: number
  paymentDate: string
  paymentMethod: "Cash" | "Transfer" | "Card" | "Check"
  reference: string | null
  notes: string | null
  createdAt: string
}

interface ApiInvoiceResponse {
  data: ApiInvoice[]
  totalCount: number
  pageSize: number
  currentPage: number
}

// Interfaces para la UI (mantener compatibilidad con el código existente)
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

interface InvoiceStats {
  total: number
  paid: number
  pending: number
  overdue: number
  totalInvoices: number
  paidInvoices: number
  pendingInvoices: number
  overdueInvoices: number
}

interface PaginationInfo {
  totalCount: number
  pageSize: number
  currentPage: number
}

interface UseInvoiceDataReturn {
  invoices: Invoice[]
  loading: boolean
  error: string | null
  stats: InvoiceStats
  pagination: PaginationInfo
  refetch: () => Promise<void>
}

// Mapeo de estados según Invoice.cs
const statusMapping = {
  "Pendiente": "pending",
  "Pagada": "paid",
  "Vencida": "overdue",
  "Cancelada": "cancelled"
} as const

// Mapeo de métodos de pago según Payment.cs
const paymentMethodMapping = {
  "Cash": "Efectivo",
  "Transfer": "Transferencia",
  "Card": "Tarjeta",
  "Check": "Cheque"
} as const

// Función para determinar el estado calculado de la factura
const getCalculatedStatus = (invoice: ApiInvoice): Invoice["status"] => {
  // Si está pendiente y tiene pagos parciales, es "partial"
  if (invoice.status === "Pendiente" && invoice.paidAmount > 0 && invoice.paidAmount < invoice.totalAmount) {
    return "partial"
  }
  
  // Si está pendiente y la fecha de vencimiento ya pasó, es "overdue"
  if (invoice.status === "Pendiente" && new Date(invoice.dueDate) < new Date()) {
    return "overdue"
  }
  
  // Mapear el resto de estados
  return statusMapping[invoice.status] || "pending"
}

// Función para mapear item de factura de API a UI
const mapInvoiceItem = (apiItem: ApiInvoiceItem): InvoiceItem => ({
  id: apiItem.id.toString(),
  description: apiItem.description,
  quantity: apiItem.quantity,
  unitPrice: apiItem.unitPrice,
  total: apiItem.totalPrice
})

// Función para mapear pago de API a UI
const mapPayment = (apiPayment: ApiPayment): PaymentHistory => ({
  id: apiPayment.id.toString(),
  date: apiPayment.paymentDate,
  amount: apiPayment.amount,
  method: paymentMethodMapping[apiPayment.paymentMethod] || apiPayment.paymentMethod,
  reference: apiPayment.reference || "",
  status: "completed", // Los pagos registrados están completados
  notes: apiPayment.notes || ""
})

// Función principal para mapear factura de API a UI
const mapInvoiceData = (apiInvoice: ApiInvoice): Invoice => ({
  id: apiInvoice.id.toString(),
  invoiceNumber: apiInvoice.invoiceNumber,
  caseId: apiInvoice.caseId?.toString() || null,
  caseTitle: apiInvoice.caseTitle || "Sin caso asociado",
  issueDate: apiInvoice.issueDate,
  dueDate: apiInvoice.dueDate,
  totalAmount: apiInvoice.totalAmount,
  paidAmount: apiInvoice.paidAmount,
  pendingAmount: apiInvoice.pendingAmount,
  subTotal: apiInvoice.subTotal,
  taxAmount: apiInvoice.taxAmount,
  discountAmount: apiInvoice.discountAmount,
  status: getCalculatedStatus(apiInvoice),
  caseNumber: apiInvoice.caseNumber || "", // No disponible en API actual
  items: apiInvoice.items.map(mapInvoiceItem),
  paymentHistory: apiInvoice.payments.map(mapPayment),
  notes: apiInvoice.notes || "",
  terms: apiInvoice.terms || "",
  attachments: [], // No disponible en API actual
  createdAt: apiInvoice.createdAt,
  updatedAt: apiInvoice.updatedAt
})

// Función para calcular estadísticas según las especificaciones del markdown
const calculateStats = (invoices: ApiInvoice[]): InvoiceStats => {
  const now = new Date()
  
  return {
    total: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
    paid: invoices.reduce((sum, inv) => sum + inv.paidAmount, 0),
    pending: invoices.reduce((sum, inv) => sum + inv.pendingAmount, 0),
    overdue: invoices
      .filter(inv => inv.status === "Pendiente" && new Date(inv.dueDate) < now)
      .reduce((sum, inv) => sum + inv.pendingAmount, 0),
    totalInvoices: invoices.length,
    paidInvoices: invoices.filter(inv => inv.status === "Pagada").length,
    pendingInvoices: invoices.filter(inv => inv.status === "Pendiente").length,
    overdueInvoices: invoices.filter(inv => 
      inv.status === "Pendiente" && new Date(inv.dueDate) < now
    ).length
  }
}

// Hook principal
export const useInvoiceData = (clientId?: number): UseInvoiceDataReturn => {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState<ApiInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo>({
    totalCount: 0,
    pageSize: 10,
    currentPage: 1
  })

  // Función para obtener las facturas del cliente
  const fetchInvoices = async (targetClientId?: number) => {
    try {
      setLoading(true)
      setError(null)

      // Si no se proporciona clientId, obtenerlo del usuario autenticado
      let effectiveClientId = targetClientId || clientId
      
      if (!effectiveClientId && user?.clientId) {
        effectiveClientId = parseInt(user.clientId)
      }
      
      if (!effectiveClientId) {
        throw new Error("ID de cliente no disponible. Asegúrate de estar autenticado como cliente.")
      }

      console.log("Fetching invoices for client ID:", effectiveClientId)

      // Hacer la petición al endpoint según ClientsController.cs
      const response = await api.get<ApiInvoiceResponse>(`/clients/${effectiveClientId}/invoices`, {
        params: {
          page: 1,
          pageSize: 50 // Obtener todas las facturas por ahora
        }
      })

      const { data, totalCount, pageSize, currentPage } = response.data

      setInvoices(data)
      setPagination({
        totalCount,
        pageSize,
        currentPage
      })
    } catch (err: any) {
      console.error("Error al obtener facturas:", err)
      setError(err.response?.data?.message || err.message || "Error al cargar las facturas")
      setInvoices([])
    } finally {
      setLoading(false)
    }
  }

  // Efecto para cargar las facturas al montar el componente
  useEffect(() => {
    if (user) {
      fetchInvoices()
    }
  }, [clientId, user])

  // Memoizar los datos mapeados para la UI
  const mappedInvoices = useMemo(() => {
    return invoices.map(mapInvoiceData)
  }, [invoices])

  // Memoizar las estadísticas calculadas
  const stats = useMemo(() => {
    return calculateStats(invoices)
  }, [invoices])

  // Función para refrescar los datos
  const refetch = async () => {
    await fetchInvoices()
  }

  return {
    invoices: mappedInvoices,
    loading,
    error,
    stats,
    pagination,
    refetch
  }
}

export default useInvoiceData
