"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Briefcase, DollarSign, FileText, AlertTriangle, CheckCircle, TrendingUp, BarChart3 } from "lucide-react"
import { useDashboard } from "@/hooks/useDashboard"

export default function DashboardPage() {
  const { data, loading, error, refetch } = useDashboard();

  // Componente de loading
  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Panel de Control</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Componente de error
  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Panel de Control</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <AlertTriangle className="h-12 w-12 text-red-500" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">Error al cargar datos</h3>
                <p className="text-sm text-gray-600 mt-1">{error}</p>
              </div>
              <Button onClick={refetch} variant="outline">
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si no hay datos
  if (!data) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Panel de Control</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <FileText className="h-12 w-12 text-gray-400" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">No hay datos disponibles</h3>
                <p className="text-sm text-gray-600 mt-1">No se pudieron cargar los datos del dashboard</p>
              </div>
              <Button onClick={refetch} variant="outline">
                Recargar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Panel de Control</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={refetch} variant="outline" size="sm">
            Actualizar
          </Button>
          <Button>Generar Reporte</Button>
        </div>
      </div>

      {/* Alertas */}
      {(data.pendingInquiries > 0 || data.pendingTestimonials > 0 || data.invoicesThisMonth > 0) && (
        <div className="grid gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Notificaciones Importantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.pendingInquiries > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-blue-50">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">
                        {data.pendingInquiries} consulta{data.pendingInquiries !== 1 ? 's' : ''} pendiente{data.pendingInquiries !== 1 ? 's' : ''} de revisión
                      </span>
                    </div>
                  </div>
                )}
                {data.pendingTestimonials > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-yellow-50 dark:bg-yellow-950">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">
                        {data.pendingTestimonials} testimonio{data.pendingTestimonials !== 1 ? 's' : ''} pendiente{data.pendingTestimonials !== 1 ? 's' : ''} de aprobación
                      </span>
                    </div>
                  </div>
                )}
                {data.invoicesThisMonth > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-green-50 dark:bg-green-950">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        {data.invoicesThisMonth} factura{data.invoicesThisMonth !== 1 ? 's' : ''} generada{data.invoicesThisMonth !== 1 ? 's' : ''} este mes
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Estadísticas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">
                +{data.newClientsThisMonth} este mes
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos Activos</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeCases}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">
                {data.totalCases} total
              </span>
              {data.newCasesThisMonth > 0 && (
                <span className="text-green-600 ml-2">
                  +{data.newCasesThisMonth} este mes
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.revenueThisMonth.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-gray-600">
                Total: ${data.totalRevenue.toLocaleString()}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Abogados</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalLawyers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-gray-600">
                Equipo activo
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Casos por Estado */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Casos por Estado
            </CardTitle>
            <CardDescription>Distribución actual de casos según su estado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.casesByStatus.length > 0 ? (
                data.casesByStatus.map((statusItem, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: statusItem.color }}
                      ></div>
                      <div>
                        <p className="text-sm font-medium leading-none">{statusItem.status}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {((statusItem.count / data.totalCases) * 100).toFixed(1)}% del total
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{statusItem.count}</p>
                      <p className="text-xs text-muted-foreground">casos</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No hay datos de estados disponibles</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Casos por Prioridad */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Casos por Prioridad
            </CardTitle>
            <CardDescription>Distribución de casos según urgencia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.casesByPriority.length > 0 ? (
                data.casesByPriority.map((priorityItem, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${priorityItem.color}20` }}
                      >
                        <AlertTriangle 
                          className="h-5 w-5" 
                          style={{ color: priorityItem.color }}
                        />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{priorityItem.priority}</p>
                      <p className="text-xs text-muted-foreground">
                        {((priorityItem.count / data.totalCases) * 100).toFixed(1)}% del total
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{priorityItem.count}</p>
                      <p className="text-xs text-muted-foreground">casos</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No hay datos de prioridades disponibles</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
