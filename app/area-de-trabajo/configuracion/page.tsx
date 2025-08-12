"use client";

import { useState } from "react";
import { Settings, User, Bell, Shield, Lock, Globe, Palette, Mail, Save, Camera } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface LawyerProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  specialization: string;
  licenseNumber: string;
  experience: string;
  bio: string;
  avatar?: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  caseUpdates: boolean;
  appointmentReminders: boolean;
  systemUpdates: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
}

interface SystemSettings {
  language: string;
  timezone: string;
  theme: string;
  dateFormat: string;
}

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState("profile");
  
  const [profile, setProfile] = useState<LawyerProfile>({
    name: "Dr. María García",
    email: "maria.garcia@bufete.com",
    phone: "+504 9876-5432",
    address: "Col. Palmira, Tegucigalpa, Honduras",
    specialization: "Derecho Civil y Comercial",
    licenseNumber: "COL-2018-1234",
    experience: "8 años",
    bio: "Abogada especializada en derecho civil y comercial con amplia experiencia en contratos, litigios comerciales y asesoría empresarial."
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    caseUpdates: true,
    appointmentReminders: true,
    systemUpdates: false
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90
  });

  const [system, setSystem] = useState<SystemSettings>({
    language: "es",
    timezone: "America/Tegucigalpa",
    theme: "system",
    dateFormat: "dd/MM/yyyy"
  });

  const handleSave = () => {
    // Aquí iría la lógica para guardar la configuración
    console.log("Guardando configuración...");
  };

  const tabs = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "notifications", label: "Notificaciones", icon: Bell },
    { id: "security", label: "Seguridad", icon: Shield },
    { id: "system", label: "Sistema", icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">
            Gestiona tu perfil y preferencias del sistema
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Guardar Cambios
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <IconComponent className="mr-3 h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Información del Perfil
                </CardTitle>
                <CardDescription>
                  Actualiza tu información personal y profesional
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="text-lg">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      <Camera className="mr-2 h-4 w-4" />
                      Cambiar Foto
                    </Button>
                    <p className="text-sm text-muted-foreground mt-1">
                      JPG, PNG o GIF. Máximo 2MB.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">Número de Colegiatura</Label>
                    <Input
                      id="licenseNumber"
                      value={profile.licenseNumber}
                      onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Especialización</Label>
                    <Select value={profile.specialization} onValueChange={(value) => setProfile({ ...profile, specialization: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Derecho Civil y Comercial">Derecho Civil y Comercial</SelectItem>
                        <SelectItem value="Derecho Penal">Derecho Penal</SelectItem>
                        <SelectItem value="Derecho Laboral">Derecho Laboral</SelectItem>
                        <SelectItem value="Derecho Familiar">Derecho Familiar</SelectItem>
                        <SelectItem value="Derecho Corporativo">Derecho Corporativo</SelectItem>
                        <SelectItem value="Derecho Tributario">Derecho Tributario</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Años de Experiencia</Label>
                    <Input
                      id="experience"
                      value={profile.experience}
                      onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biografía Profesional</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Describe tu experiencia profesional, especialidades y logros..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Configuración de Notificaciones
                </CardTitle>
                <CardDescription>
                  Gestiona cómo y cuándo recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      Notificaciones por Email
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe notificaciones importantes por correo electrónico
                    </p>
                  </div>
                  <Button
                    variant={notifications.emailNotifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNotifications({ ...notifications, emailNotifications: !notifications.emailNotifications })}
                  >
                    {notifications.emailNotifications ? "Activado" : "Desactivado"}
                  </Button>
                </div>

                <Separator />

                {/* Push Notifications */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones Push</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe notificaciones instantáneas en tu navegador
                    </p>
                  </div>
                  <Button
                    variant={notifications.pushNotifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNotifications({ ...notifications, pushNotifications: !notifications.pushNotifications })}
                  >
                    {notifications.pushNotifications ? "Activado" : "Desactivado"}
                  </Button>
                </div>

                <Separator />

                {/* Case Updates */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Actualizaciones de Casos</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificaciones sobre cambios en tus casos activos
                    </p>
                  </div>
                  <Button
                    variant={notifications.caseUpdates ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNotifications({ ...notifications, caseUpdates: !notifications.caseUpdates })}
                  >
                    {notifications.caseUpdates ? "Activado" : "Desactivado"}
                  </Button>
                </div>

                <Separator />

                {/* Appointment Reminders */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Recordatorios de Citas</Label>
                    <p className="text-sm text-muted-foreground">
                      Recordatorios antes de audiencias y reuniones
                    </p>
                  </div>
                  <Button
                    variant={notifications.appointmentReminders ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNotifications({ ...notifications, appointmentReminders: !notifications.appointmentReminders })}
                  >
                    {notifications.appointmentReminders ? "Activado" : "Desactivado"}
                  </Button>
                </div>

                <Separator />

                {/* System Updates */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Actualizaciones del Sistema</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificaciones sobre nuevas funciones y actualizaciones
                    </p>
                  </div>
                  <Button
                    variant={notifications.systemUpdates ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNotifications({ ...notifications, systemUpdates: !notifications.systemUpdates })}
                  >
                    {notifications.systemUpdates ? "Activado" : "Desactivado"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Configuración de Seguridad
                </CardTitle>
                <CardDescription>
                  Configura las opciones de seguridad de tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Two Factor Auth */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center">
                      <Lock className="mr-2 h-4 w-4" />
                      Autenticación de Dos Factores
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Añade una capa extra de seguridad a tu cuenta
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={security.twoFactorAuth ? "default" : "secondary"}>
                      {security.twoFactorAuth ? "Activado" : "Desactivado"}
                    </Badge>
                    <Button variant="outline" size="sm">
                      {security.twoFactorAuth ? "Desactivar" : "Configurar"}
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Session Timeout */}
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Tiempo de Sesión (minutos)</Label>
                  <Select value={security.sessionTimeout.toString()} onValueChange={(value) => setSecurity({ ...security, sessionTimeout: parseInt(value) })}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                      <SelectItem value="480">8 horas</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Tiempo de inactividad antes de cerrar sesión automáticamente
                  </p>
                </div>

                <Separator />

                {/* Password Expiry */}
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Expiración de Contraseña (días)</Label>
                  <Select value={security.passwordExpiry.toString()} onValueChange={(value) => setSecurity({ ...security, passwordExpiry: parseInt(value) })}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 días</SelectItem>
                      <SelectItem value="60">60 días</SelectItem>
                      <SelectItem value="90">90 días</SelectItem>
                      <SelectItem value="180">180 días</SelectItem>
                      <SelectItem value="365">1 año</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Frecuencia requerida para cambiar tu contraseña
                  </p>
                </div>

                <Separator />

                {/* Change Password */}
                <div className="space-y-4">
                  <Label>Cambiar Contraseña</Label>
                  <div className="space-y-2">
                    <Input type="password" placeholder="Contraseña actual" />
                    <Input type="password" placeholder="Nueva contraseña" />
                    <Input type="password" placeholder="Confirmar nueva contraseña" />
                  </div>
                  <Button variant="outline">
                    Actualizar Contraseña
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "system" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Configuración del Sistema
                </CardTitle>
                <CardDescription>
                  Personaliza la apariencia y comportamiento del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Language */}
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Globe className="mr-2 h-4 w-4" />
                    Idioma
                  </Label>
                  <Select value={system.language} onValueChange={(value) => setSystem({ ...system, language: value })}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Theme */}
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Palette className="mr-2 h-4 w-4" />
                    Tema
                  </Label>
                  <Select value={system.theme} onValueChange={(value) => setSystem({ ...system, theme: value })}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Oscuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Timezone */}
                <div className="space-y-2">
                  <Label>Zona Horaria</Label>
                  <Select value={system.timezone} onValueChange={(value) => setSystem({ ...system, timezone: value })}>
                    <SelectTrigger className="w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Tegucigalpa">América/Tegucigalpa (GMT-6)</SelectItem>
                      <SelectItem value="America/Guatemala">América/Guatemala (GMT-6)</SelectItem>
                      <SelectItem value="America/Mexico_City">América/Ciudad_México (GMT-6)</SelectItem>
                      <SelectItem value="America/New_York">América/Nueva_York (GMT-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Date Format */}
                <div className="space-y-2">
                  <Label>Formato de Fecha</Label>
                  <Select value={system.dateFormat} onValueChange={(value) => setSystem({ ...system, dateFormat: value })}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                      <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                      <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
