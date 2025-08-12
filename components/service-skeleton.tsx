import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

interface ServiceSkeletonProps {
  count?: number
}

export function ServiceSkeleton({ count = 6 }: ServiceSkeletonProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="border-0 shadow-lg dark:bg-gray-800 dark:shadow-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="h-7 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
            <div className="h-5 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="h-5 w-20 bg-gray-300 dark:bg-gray-700 rounded mb-3 animate-pulse"></div>
              <div className="grid gap-2">
                {Array.from({ length: 6 }).map((_, featIndex) => (
                  <div key={featIndex} className="flex items-center">
                    <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded-full mr-3 animate-pulse"></div>
                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-10 w-28 bg-blue-200 dark:bg-blue-800 rounded animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

interface ServiceCardProps {
  service: {
    Id: string
    Nombre: string
    Descripcion: string
    Precio?: string
    Icono: string
    EsPopular: boolean
    Caracteristicas: Array<{ nombre: string }>
  }
  iconComponent: React.ComponentType<{ className?: string }>
}

export function ServiceCard({ service, iconComponent: IconComponent }: ServiceCardProps) {
  return (
    <Card
      className={`border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 dark:bg-gray-800 dark:shadow-gray-700 ${
        service.EsPopular ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""
      }`}
    >
      {service.EsPopular && (
        <div className="bg-blue-500 text-white text-center py-2 text-sm font-medium rounded-t-lg">
          Más Popular
        </div>
      )}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <Badge
            variant="outline"
            className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
          >
            {service.Precio || "Consultar"}
          </Badge>
        </div>
        <CardTitle className="text-2xl text-gray-900 dark:text-white">{service.Nombre}</CardTitle>
        <p className="text-gray-600 dark:text-gray-300">{service.Descripcion}</p>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Servicios incluidos:</h4>
          <div className="grid gap-2">
            {service.Caracteristicas.slice(0, 6).map((feature, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                <span className="text-gray-600 dark:text-gray-300">{feature.nombre}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {service.Precio || "Precio a consultar"}
          </span>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
            <Link href="/contact">
              Consultar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ServiceSkeleton
