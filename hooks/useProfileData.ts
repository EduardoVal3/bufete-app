import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/axios'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'

// Interfaces basadas en las especificaciones del markdown
interface ProfileData {
  id: number
  userId: string
  fullName: string
  email: string
  phone?: string | null
  address?: string | null
  dateOfBirth?: string | null
  occupation?: string | null
  companyName?: string | null
  clientCode: string
  isActive: boolean
  createdAt: string
  updatedAt?: string | null
  totalCases: number
  activeCases: number
  totalBilled: number
  pendingPayments: number
}

interface UpdateProfileData {
  firstName: string
  lastName: string
  phoneNumber?: string
  address?: string
  dateOfBirth?: string
  occupation?: string
  companyName?: string
}

interface UseProfileDataReturn {
  profileData: ProfileData | null
  isLoading: boolean
  isUpdating: boolean
  error: string | null
  fetchProfile: () => Promise<void>
  updateProfile: (data: UpdateProfileData) => Promise<boolean>
  clearError: () => void
}

export const useProfileData = (): UseProfileDataReturn => {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Función para obtener el perfil del cliente
  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await api.get('/Clients/my-profile')
      
      if (response.data && response.data.data) {
        setProfileData(response.data.data)
      } else {
        throw new Error('Formato de respuesta inválido')
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
      
      // Manejar diferentes tipos de errores
      if (err.response?.status === 401) {
        toast.error('Sesión expirada', {
          description: 'Por favor, inicia sesión nuevamente.'
        })
        // Aquí se podría redirigir al login
      } else if (err.response?.status === 403) {
        toast.error('Acceso denegado', {
          description: 'No tienes permisos para acceder a esta información.'
        })
      } else if (err.response?.status === 404) {
        toast.error('Perfil no encontrado', {
          description: 'No se pudo encontrar tu información de perfil.'
        })
      } else {
        toast.error('Error al cargar perfil', {
          description: errorMessage
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Función para actualizar el perfil del cliente
  const updateProfile = useCallback(async (updateData: UpdateProfileData): Promise<boolean> => {
    try {
      setIsUpdating(true)
      setError(null)

      const response = await api.put('/Clients/my-profile', updateData)
      
      if (response.data && response.data.data) {
        setProfileData(response.data.data)
        toast.success('Perfil actualizado', {
          description: 'Tu información personal ha sido actualizada correctamente.'
        })
        return true
      } else {
        throw new Error('Formato de respuesta inválido')
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
      
      // Manejar errores específicos de validación
      if (err.response?.status === 400) {
        const validationErrors = err.response?.data?.errors
        if (validationErrors && Array.isArray(validationErrors)) {
          toast.error('Error de validación', {
            description: validationErrors.join(', ')
          })
        } else {
          toast.error('Datos inválidos', {
            description: 'Por favor, revisa la información ingresada.'
          })
        }
      } else if (err.response?.status === 401) {
        toast.error('Sesión expirada', {
          description: 'Por favor, inicia sesión nuevamente.'
        })
      } else if (err.response?.status === 403) {
        toast.error('Acceso denegado', {
          description: 'No tienes permisos para actualizar esta información.'
        })
      } else if (err.response?.status === 404) {
        toast.error('Perfil no encontrado', {
          description: 'No se pudo encontrar tu información de perfil.'
        })
      } else {
        toast.error('Error al actualizar', {
          description: errorMessage
        })
      }
      
      return false
    } finally {
      setIsUpdating(false)
    }
  }, [])

  // Función para limpiar errores
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Cargar perfil al montar el componente y cuando el usuario cambie
  useEffect(() => {
    if (user && user.role === 'Cliente' && user.clientId) {
      fetchProfile()
    } else if (user && user.role !== 'Cliente') {
      setError('Solo los clientes pueden acceder a esta información')
      setIsLoading(false)
    } else if (!user) {
      setIsLoading(false)
    }
  }, [user, fetchProfile])

  return {
    profileData,
    isLoading,
    isUpdating,
    error,
    fetchProfile,
    updateProfile,
    clearError
  }
}

// Función auxiliar para extraer mensajes de error
const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  
  if (error.message) {
    return error.message
  }
  
  if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
    return 'Error de conexión. Verifica tu conexión a internet.'
  }
  
  return 'Ha ocurrido un error inesperado. Inténtalo de nuevo.'
}

export default useProfileData
