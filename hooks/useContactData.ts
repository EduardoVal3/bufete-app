"use client"

import { useState, useEffect } from "react"
import api from "@/lib/axios"

interface ContactInfo {
  direccion: string
  telefono: string
  email: string
  horarioAtencion: {
    lunesViernes: string
    sabados: string
    domingos: string
  }
  telefonoEmergencia: string
}

interface UseContactDataReturn {
  contactInfo: ContactInfo
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useContactData = (): UseContactDataReturn => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    direccion: "123 Calle Principal\nSuite 456\nCiudad, Estado 12345",
    telefono: "(555) 123-4567",
    email: "info@lexfirm.com",
    horarioAtencion: {
      lunesViernes: "8:00 AM - 6:00 PM",
      sabados: "9:00 AM - 2:00 PM",
      domingos: "Cerrado",
    },
    telefonoEmergencia: "(555) 999-HELP",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Datos de fallback
  const fallbackContactInfo: ContactInfo = {
    direccion: "123 Calle Principal\nSuite 456\nCiudad, Estado 12345",
    telefono: "(555) 123-4567",
    email: "info@lexfirm.com",
    horarioAtencion: {
      lunesViernes: "8:00 AM - 6:00 PM",
      sabados: "9:00 AM - 2:00 PM",
      domingos: "Cerrado",
    },
    telefonoEmergencia: "(555) 999-HELP",
  }

  const fetchContactData = async () => {
    try {
      // Mostrar fallback rápidamente
      setTimeout(() => {
        if (isLoading) {
          setContactInfo(fallbackContactInfo)
          setIsLoading(false)
        }
      }, 200)

      setError(null)

      const response = await api.get("/configuracion/contacto")

      if (response.data && response.data.success) {
        setContactInfo(response.data.data || fallbackContactInfo)
      } else {
        setContactInfo(fallbackContactInfo)
      }
    } catch (err) {
      console.error("Error fetching contact data:", err)
      setError("Error al cargar información de contacto")
      setContactInfo(fallbackContactInfo)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchContactData()
  }, [])

  return {
    contactInfo,
    isLoading,
    error,
    refetch: fetchContactData,
  }
}

export default useContactData
