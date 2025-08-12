import { useState, useEffect } from 'react'
import api from '@/lib/axios'

interface ServiceFeature {
  nombre: string
  descripcion?: string
}

interface Service {
  Id: string
  Nombre: string
  Descripcion: string
  DescripcionCorta?: string
  Precio?: string
  Icono: string
  EsPopular: boolean
  Activo: boolean
  Orden: number
  Caracteristicas: ServiceFeature[]
  Categoria?: string
  TiempoEstimado?: string
}

interface UseServicesDataReturn {
  services: Service[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useServicesData = (): UseServicesDataReturn => {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fallback data para mostrar inmediatamente
  const fallbackServices: Service[] = [
    {
      Id: "1",
      Nombre: "Derecho Corporativo",
      Descripcion: "Asesoría integral para empresas de todos los tamaños",
      DescripcionCorta: "Asesoría integral para empresas",
      Precio: "Desde $500/hora",
      Icono: "Building2",
      EsPopular: true,
      Activo: true,
      Orden: 1,
      Categoria: "Empresarial",
      TiempoEstimado: "2-6 meses",
      Caracteristicas: [
        { nombre: "Constitución de sociedades" },
        { nombre: "Contratos comerciales" },
        { nombre: "Fusiones y adquisiciones" },
        { nombre: "Gobierno corporativo" },
        { nombre: "Compliance empresarial" },
        { nombre: "Reestructuraciones" }
      ]
    },
    {
      Id: "2",
      Nombre: "Derecho de Familia",
      Descripcion: "Soluciones sensibles para asuntos familiares",
      DescripcionCorta: "Soluciones para asuntos familiares",
      Precio: "Desde $300/hora",
      Icono: "Heart",
      EsPopular: false,
      Activo: true,
      Orden: 2,
      Categoria: "Familiar",
      TiempoEstimado: "1-4 meses",
      Caracteristicas: [
        { nombre: "Divorcios y separaciones" },
        { nombre: "Custodia de menores" },
        { nombre: "Pensión alimenticia" },
        { nombre: "Adopciones" },
        { nombre: "Mediación familiar" },
        { nombre: "Acuerdos prenupciales" }
      ]
    },
    {
      Id: "3",
      Nombre: "Litigios Civiles",
      Descripcion: "Representación experta en disputas civiles",
      DescripcionCorta: "Representación en disputas civiles",
      Precio: "Desde $400/hora",
      Icono: "Gavel",
      EsPopular: false,
      Activo: true,
      Orden: 3,
      Categoria: "Civil",
      TiempoEstimado: "3-12 meses",
      Caracteristicas: [
        { nombre: "Disputas contractuales" },
        { nombre: "Responsabilidad civil" },
        { nombre: "Daños y perjuicios" },
        { nombre: "Disputas comerciales" },
        { nombre: "Mediación y arbitraje" },
        { nombre: "Apelaciones" }
      ]
    },
    {
      Id: "4",
      Nombre: "Derecho Laboral",
      Descripcion: "Protección de derechos laborales",
      DescripcionCorta: "Protección de derechos laborales",
      Precio: "Desde $350/hora",
      Icono: "Briefcase",
      EsPopular: false,
      Activo: true,
      Orden: 4,
      Categoria: "Laboral",
      TiempoEstimado: "1-6 meses",
      Caracteristicas: [
        { nombre: "Despidos injustificados" },
        { nombre: "Discriminación laboral" },
        { nombre: "Acoso en el trabajo" },
        { nombre: "Negociación colectiva" },
        { nombre: "Contratos laborales" },
        { nombre: "Seguridad social" }
      ]
    },
    {
      Id: "5",
      Nombre: "Derecho Penal",
      Descripcion: "Defensa criminal especializada",
      DescripcionCorta: "Defensa criminal especializada",
      Precio: "Desde $450/hora",
      Icono: "Shield",
      EsPopular: false,
      Activo: true,
      Orden: 5,
      Categoria: "Penal",
      TiempoEstimado: "2-18 meses",
      Caracteristicas: [
        { nombre: "Delitos económicos" },
        { nombre: "Defensa penal" },
        { nombre: "Delitos contra la propiedad" },
        { nombre: "Violencia doméstica" },
        { nombre: "Tráfico de drogas" },
        { nombre: "Apelaciones penales" }
      ]
    },
    {
      Id: "6",
      Nombre: "Derecho Inmobiliario",
      Descripcion: "Transacciones y disputas inmobiliarias",
      DescripcionCorta: "Transacciones inmobiliarias",
      Precio: "Desde $300/hora",
      Icono: "Home",
      EsPopular: false,
      Activo: true,
      Orden: 6,
      Categoria: "Inmobiliario",
      TiempoEstimado: "1-3 meses",
      Caracteristicas: [
        { nombre: "Compraventa de propiedades" },
        { nombre: "Arrendamientos" },
        { nombre: "Desarrollo inmobiliario" },
        { nombre: "Disputas de propiedad" },
        { nombre: "Zonificación" },
        { nombre: "Títulos de propiedad" }
      ]
    }
  ]

  const fetchServicesData = async () => {
    try {
      // Mostrar fallback rápidamente si no hay respuesta
      setTimeout(() => {
        if (isLoading) {
          setServices(fallbackServices)
          setIsLoading(false)
        }
      }, 400) // 400ms timeout para servicios

      setError(null)
      
      const response = await api.get('/servicios')
      
      if (response.data && response.data.success) {
        const apiServices = response.data.data.map((service: any) => ({
          ...service,
          Caracteristicas: service.Caracteristicas || []
        }))
        setServices(apiServices.length > 0 ? apiServices : fallbackServices)
      } else {
        setServices(fallbackServices)
      }
    } catch (err) {
      console.error('Error fetching services data:', err)
      setError('Error al cargar los servicios')
      setServices(fallbackServices)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchServicesData()
  }, [])

  return {
    services,
    isLoading,
    error,
    refetch: fetchServicesData
  }
}

export default useServicesData
