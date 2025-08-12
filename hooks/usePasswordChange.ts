import { useState, useCallback } from 'react'
import api from '@/lib/axios'
import { toast } from 'sonner'

interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

interface UsePasswordChangeReturn {
  isChangingPassword: boolean
  changePassword: (data: ChangePasswordData) => Promise<boolean>
}

export const usePasswordChange = (): UsePasswordChangeReturn => {
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const changePassword = useCallback(async (data: ChangePasswordData): Promise<boolean> => {
    try {
      setIsChangingPassword(true)

      const response = await api.post('/Auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword
      })
      
      if (response.data && response.status === 200) {
        toast.success('Contraseña actualizada', {
          description: 'Tu contraseña ha sido cambiada exitosamente.'
        })
        return true
      }
      
      return false
    } catch (err: any) {
      const errorMessage = getErrorMessage(err)
      
      // Manejar diferentes tipos de errores
      if (err.response?.status === 400) {
        toast.error('Error en la solicitud', {
          description: errorMessage || 'Verifica que la contraseña actual sea correcta.'
        })
      } else if (err.response?.status === 401) {
        toast.error('Sesión expirada', {
          description: 'Por favor, inicia sesión nuevamente.'
        })
      } else {
        toast.error('Error al cambiar contraseña', {
          description: errorMessage
        })
      }
      
      return false
    } finally {
      setIsChangingPassword(false)
    }
  }, [])

  return {
    isChangingPassword,
    changePassword
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
