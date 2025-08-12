"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Save, Building, Shield, Database, Palette, Eye } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ConfiguracionPage() {
  const [configuracion, setConfiguracion] = useState({
    // Información general del bufete
    nombreBuffete: "LexFirm",
    descripcion:
      "Bufete de abogados especializado en derecho civil, laboral, corporativo y penal con más de 15 años de experiencia.",
    direccion: "Tegucigalpa, Honduras",
    telefono: "+504 1234-5678",
    email: "contacto@lexfirm.com",
    sitioWeb: "www.lexfirm.com",

    // Configuración de notificaciones
    notificacionesEmail: true,
    notificacionesSMS: false,
    notificacionesPush: true,
    notificarNuevosCasos: true,
    notificarVencimientos: true,
    notificarPagos: true,
    notificarConsultas: true,

    // Configuración de seguridad
    autenticacionDosFactor: true,
    sesionExpiracion: "8",
    intentosLogin: "3",
    backupAutomatico: true,

    // Configuración de la aplicación
    idiomaDefault: "es",
    zonaHoraria: "America/Honduras",
    formatoFecha: "DD/MM/YYYY",
    monedaDefault: "HNL", // Moneda Hondureña (Lempira)

    // Configuración visual
    temaOscuro: false,
    colorPrimario: "#3b82f6",
    logoUrl: "/logo-lexfirm.png",

    // Configuración de facturación
    iva: "16",
    retencionISR: "10",
    metodoPagoDefault: "Transferencia",

    // Configuración de reportes
    reportesAutomaticos: true,
    frecuenciaReportes: "mensual",
    destinatarioReportes: "admin@lexfirm.com",
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setConfiguracion((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    // Aquí se enviaría la configuración a la API
    console.log("Guardando configuración:", configuracion)
    // Mostrar mensaje de éxito
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configuración del Sistema</h2>
          <p className="text-muted-foreground">Administra la configuración general del bufete y la aplicación</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Guardar Cambios
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Información General del Bufete */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Información del Bufete
            </CardTitle>
            <CardDescription>Configuración básica de la información del bufete</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombreBuffete">Nombre del Bufete</Label>
                <Input
                  id="nombreBuffete"
                  value={configuracion.nombreBuffete}
                  onChange={(e) => handleInputChange("nombreBuffete", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sitioWeb">Sitio Web</Label>
                <Input
                  id="sitioWeb"
                  value={configuracion.sitioWeb}
                  onChange={(e) => handleInputChange("sitioWeb", e.target.value)}
                  placeholder="www.ejemplo.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={configuracion.descripcion}
                onChange={(e) => handleInputChange("descripcion", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Textarea
                id="direccion"
                value={configuracion.direccion}
                onChange={(e) => handleInputChange("direccion", e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={configuracion.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={configuracion.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de la Aplicación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración de la Aplicación
            </CardTitle>
            <CardDescription>Configura el comportamiento general de la aplicación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idiomaDefault">Idioma por Defecto</Label>
                <Select
                  value={configuracion.idiomaDefault}
                  onValueChange={(value) => handleInputChange("idiomaDefault", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zonaHoraria">Zona Horaria</Label>
                <Select
                  value={configuracion.zonaHoraria}
                  onValueChange={(value) => handleInputChange("zonaHoraria", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Mexico_City">Ciudad de México</SelectItem>
                    <SelectItem value="America/Cancun">Cancún</SelectItem>
                    <SelectItem value="America/Mazatlan">Mazatlán</SelectItem>
                    <SelectItem value="America/Tijuana">Tijuana</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="formatoFecha">Formato de Fecha</Label>
                <Select
                  value={configuracion.formatoFecha}
                  onValueChange={(value) => handleInputChange("formatoFecha", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monedaDefault">Moneda por Defecto</Label>
                <Select
                  value={configuracion.monedaDefault}
                  onValueChange={(value) => handleInputChange("monedaDefault", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MXN">Peso Mexicano (MXN)</SelectItem>
                    <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Configuración de Seguridad
            </CardTitle>
            <CardDescription>Configura las opciones de seguridad del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sesionExpiracion">Expiración de Sesión (horas)</Label>
                <Select
                  value={configuracion.sesionExpiracion}
                  onValueChange={(value) => handleInputChange("sesionExpiracion", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hora</SelectItem>
                    <SelectItem value="4">4 horas</SelectItem>
                    <SelectItem value="8">8 horas</SelectItem>
                    <SelectItem value="24">24 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="intentosLogin">Intentos de Login Permitidos</Label>
                <Select
                  value={configuracion.intentosLogin}
                  onValueChange={(value) => handleInputChange("intentosLogin", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 intentos</SelectItem>
                    <SelectItem value="5">5 intentos</SelectItem>
                    <SelectItem value="10">10 intentos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Configuraciones de Seguridad</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Autenticación de Dos Factores</div>
                    <div className="text-sm text-muted-foreground">
                      Requiere verificación adicional para iniciar sesión
                    </div>
                  </div>
                  <Badge variant={configuracion.autenticacionDosFactor ? "default" : "secondary"}>
                    {configuracion.autenticacionDosFactor ? "Activado" : "Desactivado"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Backup Automático</div>
                    <div className="text-sm text-muted-foreground">
                      Realizar respaldos automáticos de la base de datos
                    </div>
                  </div>
                  <Badge variant={configuracion.backupAutomatico ? "default" : "secondary"}>
                    {configuracion.backupAutomatico ? "Activado" : "Desactivado"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Facturación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Configuración de Facturación
            </CardTitle>
            <CardDescription>Configura los parámetros de facturación y pagos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="iva">IVA (%)</Label>
                <Input
                  id="iva"
                  type="number"
                  value={configuracion.iva}
                  onChange={(e) => handleInputChange("iva", e.target.value)}
                  min="0"
                  max="100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retencionISR">Retención ISR (%)</Label>
                <Input
                  id="retencionISR"
                  type="number"
                  value={configuracion.retencionISR}
                  onChange={(e) => handleInputChange("retencionISR", e.target.value)}
                  min="0"
                  max="100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metodoPagoDefault">Método de Pago por Defecto</Label>
                <Select
                  value={configuracion.metodoPagoDefault}
                  onValueChange={(value) => handleInputChange("metodoPagoDefault", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Transferencia">Transferencia Bancaria</SelectItem>
                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                    <SelectItem value="Tarjeta">Tarjeta de Crédito/Débito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Reportes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Configuración de Reportes
            </CardTitle>
            <CardDescription>Configura la generación automática de reportes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Reportes Automáticos</div>
                  <div className="text-sm text-muted-foreground">Generar y enviar reportes automáticamente</div>
                </div>
                <Badge variant={configuracion.reportesAutomaticos ? "default" : "secondary"}>
                  {configuracion.reportesAutomaticos ? "Activado" : "Desactivado"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frecuenciaReportes">Frecuencia de Reportes</Label>
                <Select
                  value={configuracion.frecuenciaReportes}
                  onValueChange={(value) => handleInputChange("frecuenciaReportes", value)}
                  disabled={!configuracion.reportesAutomaticos}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="mensual">Mensual</SelectItem>
                    <SelectItem value="trimestral">Trimestral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destinatarioReportes">Destinatario de Reportes</Label>
                <Input
                  id="destinatarioReportes"
                  type="email"
                  value={configuracion.destinatarioReportes}
                  onChange={(e) => handleInputChange("destinatarioReportes", e.target.value)}
                  disabled={!configuracion.reportesAutomaticos}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración Visual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Configuración Visual
            </CardTitle>
            <CardDescription>Personaliza la apariencia de la aplicación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Tema Oscuro</div>
                  <div className="text-sm text-muted-foreground">Activa el modo oscuro para la interfaz</div>
                </div>
                <Badge variant={configuracion.temaOscuro ? "default" : "secondary"}>
                  {configuracion.temaOscuro ? "Activado" : "Desactivado"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="colorPrimario">Color Primario</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="colorPrimario"
                  type="color"
                  value={configuracion.colorPrimario}
                  onChange={(e) => handleInputChange("colorPrimario", e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  value={configuracion.colorPrimario}
                  onChange={(e) => handleInputChange("colorPrimario", e.target.value)}
                  placeholder="#3b82f6"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoUrl">URL del Logo</Label>
              <Input
                id="logoUrl"
                value={configuracion.logoUrl}
                onChange={(e) => handleInputChange("logoUrl", e.target.value)}
                placeholder="/logo-bufete.png"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
