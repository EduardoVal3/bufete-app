import { useState, useEffect } from 'react'
import api from '@/lib/axios'

interface TeamMember {
  Id: string
  Nombre: string
  Apellido: string
  Correo: string
  Cargo: string
  Especializacion: string
  Experiencia: string
  Educacion: string
  Biografia: string
  LinkedinUrl: string
  TwitterUrl: string
  Imagen: string
  SeMuestraEnWeb: boolean
  TarifaHora?: number
}

interface UseAboutDataReturn {
  teamMembers: TeamMember[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useAboutData = (): UseAboutDataReturn => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fallback data para mostrar inmediatamente
  const fallbackTeam: TeamMember[] = [
    {
      Id: "1",
      Nombre: "María",
      Apellido: "González",
      Correo: "maria.gonzalez@bufete.com",
      Cargo: "Socia Fundadora",
      Especializacion: "Derecho Corporativo y Comercial",
      Experiencia: "20+ años de experiencia",
      Educacion: "Licenciada en Derecho, Universidad Nacional. Maestría en Derecho Corporativo",
      Biografia: "Especialista en derecho corporativo con más de 20 años de experiencia asesorando empresas multinacionales y startups.",
      LinkedinUrl: "https://linkedin.com/in/mariagonzalez",
      TwitterUrl: "",
      Imagen: "/images/team/maria-gonzalez.jpg",
      SeMuestraEnWeb: true,
      TarifaHora: 150
    },
    {
      Id: "2",
      Nombre: "Carlos",
      Apellido: "Rodríguez",
      Correo: "carlos.rodriguez@bufete.com",
      Cargo: "Socio Senior",
      Especializacion: "Derecho Penal y Litigios",
      Experiencia: "18+ años de experiencia",
      Educacion: "Licenciado en Derecho, Universidad Central. Especialización en Derecho Penal",
      Biografia: "Experto en derecho penal y litigios complejos, con un historial probado de casos exitosos.",
      LinkedinUrl: "https://linkedin.com/in/carlosrodriguez",
      TwitterUrl: "",
      Imagen: "/images/team/carlos-rodriguez.jpg",
      SeMuestraEnWeb: true,
      TarifaHora: 140
    },
    {
      Id: "3",
      Nombre: "Ana",
      Apellido: "Martínez",
      Correo: "ana.martinez@bufete.com",
      Cargo: "Abogada Senior",
      Especializacion: "Derecho de Familia y Civil",
      Experiencia: "15+ años de experiencia",
      Educacion: "Licenciada en Derecho, Universidad Javeriana. Especialización en Derecho de Familia",
      Biografia: "Dedicada al derecho de familia, mediación y resolución de conflictos con un enfoque humano y empático.",
      LinkedinUrl: "https://linkedin.com/in/anamartinez",
      TwitterUrl: "",
      Imagen: "/images/team/ana-martinez.jpg",
      SeMuestraEnWeb: true,
      TarifaHora: 120
    },
    {
      Id: "4",
      Nombre: "Roberto",
      Apellido: "Silva",
      Correo: "roberto.silva@bufete.com",
      Cargo: "Abogado Asociado",
      Especializacion: "Derecho Laboral e Inmobiliario",
      Experiencia: "10+ años de experiencia",
      Educacion: "Licenciado en Derecho, Universidad de los Andes. Especialización en Derecho Laboral",
      Biografia: "Especialista en derecho laboral y transacciones inmobiliarias, comprometido con la protección de los derechos de los trabajadores.",
      LinkedinUrl: "https://linkedin.com/in/robertosilva",
      TwitterUrl: "",
      Imagen: "/images/team/roberto-silva.jpg",
      SeMuestraEnWeb: true,
      TarifaHora: 100
    }
  ]

  const fetchTeamData = async () => {
    try {
      // Reducir tiempo de loading mostrando fallback rápidamente
      setTimeout(() => {
        if (isLoading) {
          setTeamMembers(fallbackTeam)
          setIsLoading(false)
        }
      }, 300) // Mostrar fallback después de 300ms si no hay respuesta

      setError(null)
      
      const response = await api.get('/empleado')
      
      if (response.data && response.data.success) {
        setTeamMembers(response.data.data || fallbackTeam)
      } else {
        setTeamMembers(fallbackTeam)
      }
    } catch (err) {
      console.error('Error fetching team data:', err)
      setError('Error al cargar el equipo')
      setTeamMembers(fallbackTeam)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTeamData()
  }, [])

  return {
    teamMembers,
    isLoading,
    error,
    refetch: fetchTeamData
  }
}

export default useAboutData
