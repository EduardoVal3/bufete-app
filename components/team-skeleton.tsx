import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Linkedin } from "lucide-react"
import Image from "next/image"

interface TeamMemberSkeletonProps {
  count?: number
}

export function TeamMemberSkeleton({ count = 4 }: TeamMemberSkeletonProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="border-0 shadow-lg bg-transparent">
          <CardContent className="p-0">
            <div className="relative">
              <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded-t-lg animate-pulse"></div>
              <div className="absolute top-4 right-4">
                <div className="h-6 w-20 bg-gray-400 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="p-6">
              <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
              <div className="h-5 w-1/2 bg-blue-200 dark:bg-blue-800 rounded mb-2 animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded mb-1 animate-pulse"></div>
              <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded mb-3 animate-pulse"></div>
              <div className="h-3 w-4/5 bg-gray-200 dark:bg-gray-800 rounded mb-1 animate-pulse"></div>
              <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-800 rounded mb-4 animate-pulse"></div>
              <div className="h-8 w-full bg-gray-200 dark:bg-gray-800 rounded mb-4 animate-pulse"></div>
              <div className="flex space-x-2">
                <div className="h-8 flex-1 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <div className="h-8 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

interface TeamMemberFallbackProps {
  member: {
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
    Imagen: string
  }
}

export function TeamMemberCard({ member }: TeamMemberFallbackProps) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl dark:shadow-gray-700 bg-transparent transition-all hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="relative">
          <Image
            src={member.Imagen || "/placeholder.svg"}
            alt={`${member.Nombre} ${member.Apellido}`}
            className="w-full h-64 object-cover rounded-t-lg"
            width={800}
            height={256}
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = "/placeholder.svg";
            }}
          />
          <div className="absolute top-4 right-4">
            <Badge className="bg-blue-600 dark:bg-blue-700 dark:text-white">
              {member.Experiencia}
            </Badge>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            {member.Nombre} {member.Apellido}
          </h3>
          <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
            {member.Cargo}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            {member.Especializacion}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {member.Educacion}
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            {member.Biografia}
          </p>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
              <a 
                href={`mailto:${member.Correo}`} 
                className="flex items-center justify-center w-full"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contactar
              </a>
            </Button>
            {member.LinkedinUrl && (
              <Button size="sm" variant="outline" asChild>
                <a href={member.LinkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TeamMemberSkeleton
