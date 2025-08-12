// Servicios
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/breadcrumbsPerfil"
import {
  Scale,
  FileText,
  Home,
  Briefcase,
  Users,
  Shield,
  Building,
  Heart,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/axios"
import { useAuth } from "@/hooks/useAuth"

interface ServiceType {
  id: number
  name: string
  description: string
  basePrice: number
  isActive: boolean
  createdAt: string
  updatedAt: string | null
  totalCases: number
  activeCases: number
  totalRevenue: number
}

interface LegalService extends ServiceType {
  icon: React.ComponentType<{ className?: string }>
  category: string
}

interface CreateCaseRequest {
  title: string
  description: string
  clientId: number
  serviceTypeId: number
  priority: string
  estimatedValue: number
  startDate: string
  notes?: string
}

// Mapeo de iconos para los diferentes tipos de servicio
const getServiceIcon = (serviceName: string): React.ComponentType<{ className?: string }> => {
  const name = serviceName.toLowerCase()
  if (name.includes('civil')) return FileText
  if (name.includes('penal')) return Shield
  if (name.includes('laboral')) return Briefcase
  if (name.includes('familiar') || name.includes('familia')) return Users
  if (name.includes('mercantil') || name.includes('empresarial') || name.includes('comercial')) return Building
  if (name.includes('fiscal') || name.includes('tributario')) return Scale
  if (name.includes('inmobiliario')) return Home
  if (name.includes('sanitario') || name.includes('salud')) return Heart
  return Scale // Icono por defecto
}

// Mapeo de categorías para los diferentes tipos de servicio
const getServiceCategory = (serviceName: string): string => {
  const name = serviceName.toLowerCase()
  if (name.includes('civil')) return 'Civil'
  if (name.includes('penal')) return 'Penal'
  if (name.includes('laboral')) return 'Laboral'
  if (name.includes('familiar') || name.includes('familia')) return 'Familia'
  if (name.includes('mercantil') || name.includes('empresarial') || name.includes('comercial')) return 'Empresarial'
  if (name.includes('fiscal') || name.includes('tributario')) return 'Fiscal'
  if (name.includes('inmobiliario')) return 'Inmobiliario'
  if (name.includes('sanitario') || name.includes('salud')) return 'Sanitario'
  return 'General'
}

export default function ContratarPage() {
  const { user, loading: authLoading } = useAuth()
  const [services, setServices] = useState<LegalService[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<LegalService | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    caseDescription: "",
    urgency: "normal",
    additionalNotes: "",
  })

  // Función para obtener los servicios de la API
  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await api.get('/servicetypes')
      const serviceTypes: ServiceType[] = response.data.data
      
      // Mapear los datos de la API con iconos y categorías
      const mappedServices: LegalService[] = serviceTypes
        .filter(service => service.isActive)
        .map(service => ({
          ...service,
          icon: getServiceIcon(service.name),
          category: getServiceCategory(service.name)
        }))
      
      setServices(mappedServices)
    } catch (error) {
      console.error('Error al obtener servicios:', error)
      toast.error("Error al cargar servicios", {
        description: "No se pudieron cargar los servicios disponibles. Inténtalo más tarde.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Efecto para cargar los servicios al montar el componente
  useEffect(() => {
    fetchServices()
  }, [])

  const handleContractService = (service: LegalService) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.caseDescription.trim()) {
      toast.error("Error", {
        description: "Por favor, describe tu caso antes de enviar la solicitud.",
      })
      return
    }

    if (!selectedService) {
      toast.error("Error", {
        description: "No se ha seleccionado un servicio.",
      })
      return
    }

    if (!user) {
      toast.error("Error", {
        description: "Debes iniciar sesión para contratar un servicio.",
      })
      return
    }

    // Verificar que el usuario tenga clientId (sea un cliente)
    if (!user.clientId) {
      toast.error("Error", {
        description: "Solo los clientes pueden contratar servicios. Contacta al administrador si hay un problema.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const caseData: CreateCaseRequest = {
        title: `Servicio de ${selectedService.name}`,
        description: formData.caseDescription,
        clientId: parseInt(user.clientId), // Usar el clientId del token JWT
        serviceTypeId: selectedService.id,
        priority: formData.urgency === "low" ? "1" : 
                 formData.urgency === "normal" ? "2" :
                 formData.urgency === "high" ? "3" : "4", // 1=Baja, 2=Media, 3=Alta, 4=Urgente
        estimatedValue: selectedService.basePrice,
        startDate: new Date().toISOString(),
        notes: formData.additionalNotes
      }

      const response = await api.post('/cases', caseData)
      
      if (response.data) {
        toast.success("¡Caso creado exitosamente!", {
          description: `Tu caso para ${selectedService.name} ha sido creado. Número de caso: ${response.data.data?.caseNumber || 'Sin asignar'}`,
        })

        setIsModalOpen(false)
        setFormData({
          caseDescription: "",
          urgency: "normal",
          additionalNotes: "",
        })
        setSelectedService(null)
      }
    } catch (error: unknown) {
      console.error('Error al crear caso:', error)
      const axiosError = error as { response?: { data?: { message?: string; errors?: string } } };
      const errorMessage = axiosError.response?.data?.message || 
                          axiosError.response?.data?.errors || 
                          "No se pudo crear el caso. Inténtalo más tarde."
      
      toast.error("Error al crear caso", {
        description: typeof errorMessage === 'string' ? errorMessage : 
                    "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedService(null)
    setFormData({
      caseDescription: "",
      urgency: "normal",
      additionalNotes: "",
    })
  }

  // Mostrar loading si está cargando la autenticacion
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Verificando autenticación...</span>
        </div>
      </div>
    )
  }

  // verificar si el usuario está autenticado
  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Debes iniciar sesión para contratar servicios.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      <Breadcrumbs />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Contratar Servicios Legales</h1>
        <p className="text-muted-foreground">
          Selecciona el servicio legal que necesitas y describe tu caso para recibir asesoría especializada.
        </p>
      </div>

      {/* Servicios disponibles */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Cargando servicios...</span>
          </div>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No hay servicios disponibles en este momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const IconComponent = service.icon

            return (
              <Card key={service.id} className="flex flex-col hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <Badge variant="secondary" className="text-xs mb-2">
                          {service.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{service.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Precio base:</span>
                      <span className="font-semibold text-lg">${service.basePrice}</span>
                    </div>
                    {service.totalCases > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Casos completados:</span>
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {service.totalCases}
                        </span>
                      </div>
                    )}
                    {service.activeCases > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Casos activos:</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-blue-500" />
                          {service.activeCases}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Especialización en:</h4>
                    <p className="text-xs text-muted-foreground">{service.description}</p>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button onClick={() => handleContractService(service)} className="w-full" size="lg">
                    Contratar Servicio
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {/* Modal para descripción del caso */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedService && <selectedService.icon className="h-5 w-5" />}
              Contratar: {selectedService?.name}
            </DialogTitle>
            <DialogDescription className="text-left">
              {selectedService?.description}
              <br />
              <span className="text-sm text-muted-foreground">
                Categoría: {selectedService?.category}
              </span>
              <br />
              <span className="text-sm font-medium text-primary">
                Al enviar este formulario se creará un nuevo caso legal para tu atención.
              </span>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitRequest} className="space-y-6">
            <div className="space-y-4">
              {/* Descripción del caso */}
              <div className="space-y-2">
                <Label htmlFor="caseDescription" className="text-sm font-medium">
                  Describe tu caso <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="caseDescription"
                  placeholder="Proporciona todos los detalles relevantes sobre tu situación legal. Incluye fechas, personas involucradas, documentos disponibles y cualquier información que consideres importante..."
                  value={formData.caseDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, caseDescription: e.target.value }))}
                  className="min-h-[120px] resize-none"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Mínimo 50 caracteres. Cuanta más información proporciones, mejor podremos ayudarte.
                </p>
              </div>

              {/* Urgencia */}
              <div className="space-y-2">
                <Label htmlFor="urgency" className="text-sm font-medium">
                  Nivel de urgencia
                </Label>
                <select
                  id="urgency"
                  value={formData.urgency}
                  onChange={(e) => setFormData((prev) => ({ ...prev, urgency: e.target.value }))}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="low">Baja - Puedo esperar varias semanas</option>
                  <option value="normal">Normal - Necesito respuesta en días</option>
                  <option value="high">Alta - Es urgente, necesito ayuda pronto</option>
                  <option value="critical">Crítica - Es una emergencia legal</option>
                </select>
              </div>

              {/* Notas adicionales */}
              <div className="space-y-2">
                <Label htmlFor="additionalNotes" className="text-sm font-medium">
                  Notas adicionales (opcional)
                </Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="¿Hay algo más que debamos saber? Horarios preferidos, restricciones, documentos que tienes disponibles, etc."
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                  className="min-h-[80px] resize-none"
                />
              </div>
            </div>

            {/* Resumen del servicio */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-sm">Resumen del servicio:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Precio base:</span>
                  <span className="ml-2 font-medium">${selectedService?.basePrice}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Categoría:</span>
                  <span className="ml-2 font-medium">{selectedService?.category}</span>
                </div>
              </div>
              {selectedService && selectedService.totalCases > 0 && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Experiencia:</span>
                  <span className="ml-2">{selectedService.totalCases} casos completados</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                * El precio final puede variar según la complejidad del caso. Te proporcionaremos un presupuesto
                detallado después de la evaluación inicial.
              </p>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-transparent"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.caseDescription.trim()}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creando caso...
                  </>
                ) : (
                  "Crear Caso"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
