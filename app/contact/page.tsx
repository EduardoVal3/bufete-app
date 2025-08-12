"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ContactInfoSkeleton } from "@/components/contact-skeleton"
import useContactData from "@/hooks/useContactData"

export default function ContactPage() {
  const { contactInfo, isLoading } = useContactData()
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar el formulario
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-800">
              Contáctenos
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Estamos Aquí para Ayudarle</h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Programe una consulta gratuita y descubra cómo nuestro equipo legal puede resolver sus necesidades
              jurídicas.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900 dark:text-white">Solicitar Consulta Gratuita</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    Complete el formulario y nos pondremos en contacto con usted en menos de 24 horas.
                  </p>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">¡Mensaje Enviado!</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Gracias por contactarnos. Nos pondremos en contacto con usted pronto.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="Su nombre"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Apellido *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleChange("lastName", e.target.value)}
                            placeholder="Su apellido"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email">Correo Electrónico *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="su@email.com"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Teléfono</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            placeholder={contactInfo.telefono}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="service">Área de Interés</Label>
                          <Select onValueChange={(value) => handleChange("service", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un servicio" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="corporativo">Derecho Corporativo</SelectItem>
                              <SelectItem value="familia">Derecho de Familia</SelectItem>
                              <SelectItem value="litigios">Litigios Civiles</SelectItem>
                              <SelectItem value="laboral">Derecho Laboral</SelectItem>
                              <SelectItem value="penal">Derecho Penal</SelectItem>
                              <SelectItem value="inmobiliario">Derecho Inmobiliario</SelectItem>
                              <SelectItem value="otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Descripción del Caso *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleChange("message", e.target.value)}
                          placeholder="Describa brevemente su situación legal..."
                          rows={5}
                          required
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <Send className="mr-2 h-5 w-5" />
                        Enviar Consulta
                      </Button>

                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        * Campos obligatorios. Su información es completamente confidencial.
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {isLoading ? (
                <ContactInfoSkeleton />
              ) : (
                <>
                  {/* Office Info */}
                  <Card className="border-0 shadow-lg dark:bg-gray-800">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Información de Contacto
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Dirección</p>
                            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                              {contactInfo.direccion}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Teléfono</p>
                            <p className="text-gray-600 dark:text-gray-300">{contactInfo.telefono}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Email</p>
                            <p className="text-gray-600 dark:text-gray-300">{contactInfo.email}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Office Hours */}
                  <Card className="border-0 shadow-lg dark:bg-gray-800">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Horarios de Atención</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Lunes - Viernes</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {contactInfo.horarioAtencion.lunesViernes}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Sábados</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {contactInfo.horarioAtencion.sabados}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Domingos</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {contactInfo.horarioAtencion.domingos}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Emergencias:</strong> Disponibles 24/7 para casos urgentes
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Emergency Contact */}
                  <Card className="border-0 shadow-lg bg-red-50 dark:bg-red-950">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-4">
                        Contacto de Emergencia
                      </h3>
                      <p className="text-red-800 dark:text-red-200 mb-4">
                        Para asuntos legales urgentes fuera del horario de oficina:
                      </p>
                      <Button className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800">
                        <Phone className="mr-2 h-4 w-4" />
                        {contactInfo.telefonoEmergencia}
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Nuestra Ubicación</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Convenientemente ubicados en el centro de la ciudad
            </p>
          </div>

          <div className="bg-gray-300 dark:bg-gray-700 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-500 dark:text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">
                Mapa interactivo se cargaría aquí
                <br />
                {contactInfo.direccion.split("\n")[0]}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
