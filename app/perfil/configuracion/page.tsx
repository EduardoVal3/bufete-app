"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Breadcrumbs } from "@/components/breadcrumbsPerfil"
import { User, Mail, Phone, Lock, Save, LogOut, Trash2, Eye, EyeOff, Camera, Shield, Bell, Globe } from "lucide-react"
import { toast } from "sonner"
import { useProfileData } from "@/hooks/useProfileData"
import { usePasswordChange } from "@/hooks/usePasswordChange"
import { useAuth } from "@/hooks/useAuth"

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  dateOfBirth: string
  occupation: string
  companyName: string
  avatar: string
}

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ConfiguracionPage() {
  // Hooks para manejo de datos y autenticación
  const { user, logout } = useAuth()
  const { profileData, isLoading, isUpdating, updateProfile } = useProfileData()
  const { isChangingPassword, changePassword } = usePasswordChange()
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Estado del perfil del usuario - inicializado desde API
  const [profileFormData, setProfileFormData] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    occupation: "",
    companyName: "",
    avatar: "/placeholder.svg?height=100&width=100",
  })

  // Efecto para cargar datos del perfil cuando se obtienen de la API
  useEffect(() => {
    if (profileData) {
      // Convertir fullName a firstName y lastName
      const nameParts = profileData.fullName.split(' ')
      const firstName = nameParts[0] || ""
      const lastName = nameParts.slice(1).join(' ') || ""
      
      setProfileFormData({
        firstName,
        lastName,
        email: profileData.email,
        phone: profileData.phone || "",
        address: profileData.address || "",
        dateOfBirth: profileData.dateOfBirth ? profileData.dateOfBirth.split('T')[0] : "",
        occupation: profileData.occupation || "",
        companyName: profileData.companyName || "",
        avatar: "/placeholder.svg?height=100&width=100",
      })
    }
  }, [profileData])

  // Estado para el cambio de contraseña
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Validaciones
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateProfile = () => {
    const newErrors: Record<string, string> = {}

    if (!profileFormData.firstName.trim()) {
      newErrors.firstName = "El nombre es obligatorio"
    }

    if (!profileFormData.lastName.trim()) {
      newErrors.lastName = "El apellido es obligatorio"
    }

    if (!profileFormData.email.trim()) {
      newErrors.email = "El email es obligatorio"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileFormData.email)) {
      newErrors.email = "El formato del email no es válido"
    }

    if (profileFormData.phone && !/^[+]?[\d\s-()]+$/.test(profileFormData.phone)) {
      newErrors.phone = "El formato del teléfono no es válido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePassword = () => {
    const newErrors: Record<string, string> = {}

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "La contraseña actual es obligatoria"
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "La nueva contraseña es obligatoria"
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "La contraseña debe tener al menos 8 caracteres"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      newErrors.newPassword = "La contraseña debe contener mayúsculas, minúsculas y números"
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Confirma la nueva contraseña"
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    setErrors((prev) => ({ ...prev, ...newErrors }))
    return Object.keys(newErrors).length === 0
  }

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfileFormData((prev) => ({ ...prev, [field]: value }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSaveProfile = async () => {
    if (!validateProfile()) {
      toast.error("Error en el formulario", {
        description: "Por favor, corrige los errores antes de continuar.",
      })
      return
    }

    // Preparar datos para enviar a la API
    const updateData = {
      firstName: profileFormData.firstName,
      lastName: profileFormData.lastName,
      phoneNumber: profileFormData.phone || undefined,
      address: profileFormData.address || undefined,
      dateOfBirth: profileFormData.dateOfBirth || undefined,
      occupation: profileFormData.occupation || undefined,
      companyName: profileFormData.companyName || undefined,
    }

    const success = await updateProfile(updateData)
    if (success) {
      // El hook ya maneja el toast de éxito
    }
  }

  const handleChangePassword = async () => {
    if (!validatePassword()) {
      toast.error("Error en la contraseña", {
        description: "Por favor, corrige los errores antes de continuar.",
      })
      return
    }

    // Usar el hook real de cambio de contraseña
    const success = await changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      confirmNewPassword: passwordData.confirmPassword,
    })

    if (success) {
      // Limpiar formulario de contraseña solo si fue exitoso
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  const handleDeleteAccount = () => {
    toast.success("Solicitud enviada", {
      description: "Tu solicitud de eliminación de cuenta ha sido enviada. Te contactaremos pronto.",
    })
    // Aquí iría la lógica real para solicitar eliminación de cuenta
  }

  const handleAvatarChange = () => {
    toast.info("Función próximamente", {
      description: "La función de cambio de avatar estará disponible pronto.",
    })
    // Aquí iría la lógica para cambiar avatar
  }

  return (
    <div className="space-y-6 p-6 pb-24">
      <Breadcrumbs />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Configuración del Perfil</h1>
        <p className="text-muted-foreground">Gestiona tu información personal, seguridad y preferencias de cuenta.</p>
      </div>

      {/* Loading inicial */}
      {isLoading && !profileData ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <span className="ml-2 text-muted-foreground">Cargando información del perfil...</span>
        </div>
      ) : !user ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-muted-foreground">Acceso Requerido</h2>
            <p className="text-muted-foreground">Debes iniciar sesión para acceder a esta página.</p>
          </div>
        </div>
      ) : user.role !== 'Cliente' ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-muted-foreground">Acceso Restringido</h2>
            <p className="text-muted-foreground">Esta página es solo para clientes registrados.</p>
          </div>
        </div>
      ) : !profileData ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-muted-foreground">Perfil no encontrado</h2>
            <p className="text-muted-foreground">No se pudo cargar tu información de perfil.</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Reintentar
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información del perfil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
              <CardDescription>Actualiza tu información personal y de contacto.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileFormData.avatar || "/placeholder.svg"} alt="Avatar" />
                  <AvatarFallback className="text-lg">
                    {profileFormData.firstName[0] || "U"}
                    {profileFormData.lastName[0] || "S"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" onClick={handleAvatarChange} className="bg-transparent">
                    <Camera className="h-4 w-4 mr-2" />
                    Cambiar foto
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG o GIF. Máximo 2MB.</p>
                </div>
              </div>

              <Separator />

              {/* Formulario de información personal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input
                    id="firstName"
                    value={profileFormData.firstName}
                    onChange={(e) => handleProfileChange("firstName", e.target.value)}
                    placeholder="Tu nombre"
                    className={errors.firstName ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido *</Label>
                  <Input
                    id="lastName"
                    value={profileFormData.lastName}
                    onChange={(e) => handleProfileChange("lastName", e.target.value)}
                    placeholder="Tu apellido"
                    className={errors.lastName ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profileFormData.email}
                    onChange={(e) => handleProfileChange("email", e.target.value)}
                    placeholder="tu@email.com"
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                    disabled={true} // Email no es editable
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                <p className="text-xs text-muted-foreground">El email no se puede modificar por razones de seguridad.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Número de Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={profileFormData.phone}
                    onChange={(e) => handleProfileChange("phone", e.target.value)}
                    placeholder="+504 1234-5678"
                    className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={profileFormData.address}
                  onChange={(e) => handleProfileChange("address", e.target.value)}
                  placeholder="Tu dirección completa"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileFormData.dateOfBirth}
                    onChange={(e) => handleProfileChange("dateOfBirth", e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Ocupación</Label>
                  <Input
                    id="occupation"
                    value={profileFormData.occupation}
                    onChange={(e) => handleProfileChange("occupation", e.target.value)}
                    placeholder="Tu ocupación"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Empresa/Organización</Label>
                <Input
                  id="companyName"
                  value={profileFormData.companyName}
                  onChange={(e) => handleProfileChange("companyName", e.target.value)}
                  placeholder="Nombre de tu empresa u organización"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Cambio de contraseña */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Cambiar Contraseña
              </CardTitle>
              <CardDescription>Actualiza tu contraseña para mantener tu cuenta segura.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Contraseña Actual *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                    placeholder="Tu contraseña actual"
                    className={`pl-10 pr-10 ${errors.currentPassword ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.currentPassword && <p className="text-sm text-red-500">{errors.currentPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                    placeholder="Tu nueva contraseña"
                    className={`pl-10 pr-10 ${errors.newPassword ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
                <p className="text-xs text-muted-foreground">
                  Mínimo 8 caracteres con mayúsculas, minúsculas y números.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                    placeholder="Confirma tu nueva contraseña"
                    className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>

              <Button 
                onClick={handleChangePassword} 
                disabled={isLoading || isUpdating || isChangingPassword} 
                className="w-full md:w-auto"
              >
                {isChangingPassword ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Cambiando...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Cambiar Contraseña
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Columna lateral */}
        <div className="space-y-6">
          {/* Información de seguridad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Autenticación de dos factores</p>
                  <p className="text-xs text-muted-foreground">Próximamente disponible</p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Configurar
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Sesiones activas</p>
                  <p className="text-xs text-muted-foreground">1 dispositivo conectado</p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Ver todas
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preferencias */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preferencias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Notificaciones por email</p>
                  <p className="text-xs text-muted-foreground">Actualizaciones de casos</p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Configurar
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Idioma</p>
                  <p className="text-xs text-muted-foreground">Español</p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  <Globe className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Administración de cuenta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Zona de Peligro</CardTitle>
              <CardDescription>Acciones irreversibles de administración de cuenta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" onClick={handleLogout} className="w-full justify-start bg-transparent">
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 bg-transparent"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Solicitar Eliminación de Cuenta
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción enviará una solicitud para eliminar permanentemente tu cuenta. Todos tus datos, casos
                      y facturas serán eliminados. Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700 text-white">
                      Solicitar Eliminación
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
      )}

      {/* Botón fijo de guardar cambios */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4 lg:pl-72">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">* Los campos marcados son obligatorios</div>
            <Button onClick={handleSaveProfile} disabled={isLoading || isUpdating} size="lg">
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}