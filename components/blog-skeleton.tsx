import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface BlogSkeletonProps {
  count?: number
}

export function BlogPostsSkeleton({ count = 6 }: BlogSkeletonProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="border-0 shadow-lg hover:shadow-xl dark:bg-gray-800 dark:shadow-gray-700">
          <CardContent className="p-0">
            <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-t-lg animate-pulse"></div>
            <div className="p-6">
              <div className="h-4 w-24 bg-blue-200 dark:bg-blue-800 rounded mb-3 animate-pulse"></div>
              <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
              <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-3 animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded mb-1 animate-pulse"></div>
              <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded mb-4 animate-pulse"></div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded mr-2 animate-pulse"></div>
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded mr-2 animate-pulse"></div>
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 h-10 w-full bg-blue-200 dark:bg-blue-800 rounded animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function FeaturedPostSkeleton() {
  return (
    <Card className="border-0 shadow-xl overflow-hidden dark:bg-gray-800 dark:shadow-gray-700">
      <div className="grid lg:grid-cols-2 gap-0">
        <div className="h-64 lg:h-auto bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
        <div className="p-8">
          <div className="h-6 w-32 bg-blue-200 dark:bg-blue-800 rounded mb-4 animate-pulse"></div>
          <div className="h-8 w-full bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
          <div className="h-8 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded mb-1 animate-pulse"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded mb-1 animate-pulse"></div>
          <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded mb-6 animate-pulse"></div>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded mr-2 animate-pulse"></div>
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded mr-2 animate-pulse"></div>
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            </div>
          </div>
          
          <div className="h-10 w-32 bg-blue-200 dark:bg-blue-800 rounded animate-pulse"></div>
        </div>
      </div>
    </Card>
  )
}

interface BlogPostCardProps {
  post: {
    Id: string
    Titulo: string
    Excerpt: string
    Fecha: string
    TiempoLectura: string
    Imagen: string
    Categoria: string
    Autor: string
  }
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl dark:bg-gray-800 dark:shadow-gray-700 transition-all hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="relative h-48">
          <Image
            src={post.Imagen || "/placeholder.svg"}
            alt={post.Titulo}
            className="w-full h-full object-cover rounded-t-lg"
            width={800}
            height={300}
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = "/placeholder.svg";
            }}
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-blue-600 dark:bg-blue-700 text-white">
              {post.Categoria}
            </Badge>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
            {post.Titulo}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {post.Excerpt}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {post.Fecha}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {post.TiempoLectura}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{post.Autor}</span>
            </div>
            <Button asChild variant="outline" size="sm" className="bg-transparent">
              <Link href={`/blog/${post.Id}`}>
                Leer más
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface FeaturedPostCardProps {
  post: {
    Id: string
    Titulo: string
    Excerpt: string
    Fecha: string
    TiempoLectura: string
    Imagen: string
    Categoria: string
    Autor: string
  }
}

export function FeaturedPostCard({ post }: FeaturedPostCardProps) {
  return (
    <Card className="border-0 shadow-xl overflow-hidden dark:bg-gray-800 dark:shadow-gray-700 hover:shadow-lg transition-all hover:-translate-y-1">
      <div className="grid lg:grid-cols-2 gap-0">
        <div className="relative h-64 lg:h-auto">
          <Image
            src={post.Imagen || "/placeholder.svg"}
            alt={post.Titulo}
            className="w-full h-full object-cover"
            width={800}
            height={300}
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = "/placeholder.svg";
            }}
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-blue-600 dark:bg-blue-700 text-white">
              {post.Categoria}
            </Badge>
          </div>
        </div>
        <div className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {post.Titulo}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {post.Excerpt}
          </p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {post.Autor}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {post.Fecha}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {post.TiempoLectura}
            </div>
          </div>
          
          <Button asChild className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
            <Link href={`/blog/${post.Id}`}>
              Leer artículo completo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default BlogPostsSkeleton
