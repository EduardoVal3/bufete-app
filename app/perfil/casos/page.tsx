"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import api from "@/lib/axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Breadcrumbs } from "@/components/breadcrumbsPerfil"
import {
  FileText,
  Search,
  Filter,
  Calendar,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpDown,
} from "lucide-react"

interface CaseData {
  id: string
  title: string
  description: string
  status: "pending" | "in_progress" | "completed" | "cancelled" | "in_revision" | "paused" | "closed"
  startDate: string
  lastUpdate: string
  lawyer: string
  category: string
  priority: "low" | "medium" | "high" | "urgent"
  caseNumber: string
}

interface ApiCase {
  id: number
  caseNumber: string
  title: string
  description: string
  clientId: number
  clientName: string
  lawyerId: number | null
  lawyerName: string | null
  serviceTypeId: number
  serviceTypeName: string
  statusId: number
  statusName: string
  priority: string
  estimatedValue: number
  actualValue: number
  startDate: string
  endDate: string | null
  dueDate: string | null
  notes: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  totalActivities: number
  totalDocuments: number
  lastActivity: string | null
  recentActivities: Activity[]
  documents: Document[]
}

interface Activity {
  id: string
  type: string
  description: string
  date: string
}

interface Document {
  id: string
  name: string
  type: string
  url: string
  uploadDate: string
}

// Funciones de mapeo
const mapStatusFromAPI = (statusName: string): CaseData['status'] => {
  switch (statusName.toLowerCase()) {
    case 'nuevo': return 'pending';
    case 'en progreso': return 'in_progress';
    case 'en revisión': return 'in_revision';
    case 'pausado': return 'paused';
    case 'completado': return 'completed';
    case 'cerrado': return 'closed';
    case 'cancelado': return 'cancelled';
    default: return 'pending';
  }
};

const mapPriorityFromAPI = (priority: string): CaseData['priority'] => {
  switch (priority) {
    case '1': return 'low';
    case '2': return 'medium';
    case '3': return 'high';
    case '4': return 'urgent';
    default: return 'medium';
  }
};

const mapApiCaseToUICase = (apiCase: ApiCase): CaseData => ({
  id: apiCase.id.toString(),
  title: apiCase.title,
  description: apiCase.description,
  status: mapStatusFromAPI(apiCase.statusName),
  startDate: apiCase.startDate,
  lastUpdate: apiCase.updatedAt || apiCase.createdAt,
  lawyer: apiCase.lawyerName || 'Sin asignar',
  category: apiCase.serviceTypeName,
  priority: mapPriorityFromAPI(apiCase.priority),
  caseNumber: apiCase.caseNumber,
});

const statusConfig = {
  pending: {
    label: "Pendiente",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    icon: AlertCircle,
  },
  in_progress: {
    label: "En Curso",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    icon: Clock,
  },
  in_revision: {
    label: "En Revisión",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    icon: Clock,
  },
  paused: {
    label: "Pausado",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    icon: AlertCircle,
  },
  completed: {
    label: "Completado",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: CheckCircle,
  },
  closed: {
    label: "Cerrado",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelado",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    icon: XCircle,
  },
}

const priorityConfig = {
  low: { label: "Baja", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
  medium: { label: "Media", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
  high: { label: "Alta", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
  urgent: { label: "Urgente", color: "bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100" },
}

export default function CasosPage() {
  // Estados para la API
  const [cases, setCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "status" | "title">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Función para obtener casos de la API
  const fetchCases = async (filters: {
    search?: string;
    statusId?: number;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: string;
  } = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.statusId) params.append('statusId', filters.statusId.toString());
      params.append('page', (filters.page || 1).toString());
      params.append('pageSize', (filters.pageSize || 50).toString());
      
      // Mapear sortBy a los campos de la API
      let apiSortBy = 'CreatedAt';
      if (filters.sortBy === 'title') apiSortBy = 'Title';
      else if (filters.sortBy === 'status') apiSortBy = 'StatusId';
      else if (filters.sortBy === 'date') apiSortBy = 'StartDate';
      
      params.append('sortBy', apiSortBy);
      params.append('sortDirection', filters.sortDirection || 'desc');
      
      // Construir la URL correctamente
      const queryString = params.toString();
      const url = queryString ? `/Cases/my-cases?${queryString}` : '/Cases/my-cases';
      
      
      const response = await api.get(url);
      
      if (!response.data || !response.data.data) {
        throw new Error('Estructura de respuesta inesperada');
      }
      
      // Mapear datos de la API al formato de la UI
      const mappedCases = response.data.data.map(mapApiCaseToUICase);
      
      setCases(mappedCases);
      setTotalCount(response.data.totalCount || 0);
      
    } catch (error: unknown) {
      console.error('Error fetching cases:', error);
      const axiosError = error as { response?: { data?: unknown; status?: number } };
      console.error('Error response:', axiosError.response?.data);
      console.error('Error status:', axiosError.response?.status);
      
      let errorMessage = 'Error al cargar los casos';
      
      if (axiosError.response?.status === 404) {
        errorMessage = 'Endpoint no encontrado. Verifica la configuración del servidor.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Cargar casos al montar el componente
  useEffect(() => {
    console.log('Token disponible:', !!localStorage.getItem("token"));
    
    fetchCases({
      page: 1,
      pageSize: 50
    });
  }, []);

  // Efecto para manejar cambios en filtros con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCases({
        search: searchTerm || undefined,
        page: 1,
        sortBy: sortBy === 'date' ? 'StartDate' : sortBy === 'title' ? 'Title' : 'StatusId',
        sortDirection: sortOrder
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, sortBy, sortOrder]);

  // Para mantener compatibilidad con el código existente, usar los casos filtrados
  const filteredAndSortedCases = useMemo(() => {
    if (statusFilter === "all") {
      return cases;
    }
    return cases.filter(case_ => case_.status === statusFilter);
  }, [cases, statusFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const truncateDescription = (description: string, maxLength: number = 80) => {
    if (description.length <= maxLength) {
      return description
    }
    return description.slice(0, maxLength).trim() + "..."
  }

  const getStatusStats = () => {
    const stats = {
      total: totalCount || cases.length,
      pending: cases.filter((c) => c.status === "pending").length,
      in_progress: cases.filter((c) => c.status === "in_progress").length,
      completed: cases.filter((c) => c.status === "completed").length,
      closed: cases.filter((c) => c.status === "closed").length,
    }
    return stats
  }

  const stats = getStatusStats()

  const StatusBadge = ({ status }: { status: CaseData["status"] }) => {
    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge variant="secondary" className={`${config.color} flex items-center gap-1 font-medium`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const PriorityBadge = ({ priority }: { priority: CaseData["priority"] }) => {
    const config = priorityConfig[priority]

    return (
      <Badge variant="outline" className={`${config.color} text-xs`}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <Breadcrumbs />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Mis Casos</h1>
        <p className="text-muted-foreground">
          Gestiona y revisa el estado de todos tus casos legales en un solo lugar.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
            <div className="flex gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchCases()}
              >
                Reintentar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={async () => {
                  try {
                    console.log('Probando endpoint básico...');
                    const response = await api.get('/Cases/my-cases');
                    console.log('Respuesta del endpoint básico:', response.data);
                    alert('Endpoint funciona! Ver consola para detalles.');
                  } catch (err: unknown) {
                    console.error('Error en endpoint básico:', err);
                    const axiosError = err as { response?: { status?: number; statusText?: string } };
                    alert(`Error: ${axiosError.response?.status} - ${axiosError.response?.statusText}`);
                  }
                }}
              >
                Probar Endpoint Básico
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.total}
            </div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {loading ? "..." : stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">Pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {loading ? "..." : stats.in_progress}
            </div>
            <p className="text-xs text-muted-foreground">En Curso</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {loading ? "..." : stats.completed}
            </div>
            <p className="text-xs text-muted-foreground">Completados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {loading ? "..." : stats.closed}
            </div>
            <p className="text-xs text-muted-foreground">Cerrados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
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
                  placeholder="Buscar por título, número de caso o abogado..."
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
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="in_progress">En Curso</SelectItem>
                <SelectItem value="in_revision">En Revisión</SelectItem>
                <SelectItem value="paused">Pausado</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="closed">Cerrado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
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
                <SelectItem value="title-asc">Título (A-Z)</SelectItem>
                <SelectItem value="title-desc">Título (Z-A)</SelectItem>
                <SelectItem value="status-asc">Estado (A-Z)</SelectItem>
                <SelectItem value="status-desc">Estado (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vista de escritorio - Tabla */}
      <Card className="hidden md:block">
        <div className="relative">
          <div className="max-h-[600px] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[300px]">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSortBy("title")
                        setSortOrder(sortBy === "title" && sortOrder === "asc" ? "desc" : "asc")
                      }}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Caso
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSortBy("status")
                        setSortOrder(sortBy === "status" && sortOrder === "asc" ? "desc" : "asc")
                      }}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Estado
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSortBy("date")
                        setSortOrder(sortBy === "date" && sortOrder === "asc" ? "desc" : "asc")
                      }}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Fecha de Inicio
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Abogado</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading skeleton para la tabla
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={`loading-${index}`}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-8 bg-gray-200 rounded animate-pulse w-24 ml-auto"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  filteredAndSortedCases.map((case_) => (
                    <TableRow key={case_.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{case_.title}</div>
                          <div className="text-sm text-muted-foreground">{case_.caseNumber}</div>
                          <div className="text-xs text-muted-foreground" title={case_.description}>
                            {truncateDescription(case_.description)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={case_.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(case_.startDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{case_.lawyer}</div>
                        <div className="text-xs text-muted-foreground">{case_.category}</div>
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={case_.priority} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/perfil/casos/${case_.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      {/* Vista móvil - Cards */}
      <div className="md:hidden space-y-4">
        {loading ? (
          // Loading skeleton para vista móvil
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={`mobile-loading-${index}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredAndSortedCases.map((case_) => (
          <Card key={case_.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-base leading-tight">{case_.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{case_.caseNumber}</p>
                </div>
                <StatusBadge status={case_.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground" title={case_.description}>
                {truncateDescription(case_.description, 100)}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Fecha de inicio:</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(case_.startDate)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Prioridad:</p>
                  <PriorityBadge priority={case_.priority} />
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Abogado asignado:</p>
                <p className="font-medium">{case_.lawyer}</p>
                <p className="text-xs text-muted-foreground">{case_.category}</p>
              </div>

              <Link href={`/perfil/casos/${case_.id}`} className="block">
                <Button className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalles del Caso
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))
        )}
      </div>

      {/* Estado vacío */}
      {!loading && filteredAndSortedCases.length === 0 && !error && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron casos</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Intenta ajustar los filtros de búsqueda"
                : "Aún no tienes casos registrados"}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Link href="/perfil/contratar">
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Contratar Primer Servicio
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
