import { useState, useEffect } from 'react'
import api from '@/lib/axios'

interface BlogPost {
  Id: string
  Titulo: string
  Contenido: string
  Excerpt: string
  Fecha: string
  TiempoLectura: string
  Imagen: string
  EsDestacado: boolean
  Categoria: string
  Autor: string
  Publicado: boolean
}

interface BlogCategory {
  nombre: string
  cantidad: number
}

interface UseBlogDataReturn {
  blogPosts: BlogPost[]
  featuredPost: BlogPost | null
  categories: BlogCategory[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useBlogData = (): UseBlogDataReturn => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null)
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fallback data para mostrar inmediatamente
  const fallbackCategories: BlogCategory[] = [
    { nombre: "Todos", cantidad: 12 },
    { nombre: "Derecho Corporativo", cantidad: 4 },
    { nombre: "Derecho de Familia", cantidad: 3 },
    { nombre: "Derecho Laboral", cantidad: 2 },
    { nombre: "Derecho Inmobiliario", cantidad: 2 },
    { nombre: "Derecho Penal", cantidad: 1 }
  ]

  const fallbackBlogPosts: BlogPost[] = [
    {
      Id: "1",
      Titulo: "Nuevas Regulaciones en Derecho Corporativo 2024",
      Contenido: "Análisis completo de las últimas modificaciones en la legislación corporativa...",
      Excerpt: "Análisis completo de las últimas modificaciones en la legislación corporativa y su impacto en las empresas.",
      Fecha: "15 de Marzo, 2024",
      TiempoLectura: "8 min lectura",
      Imagen: "/images/blog/derecho-corporativo.jpg",
      EsDestacado: true,
      Categoria: "Derecho Corporativo",
      Autor: "Dra. María Elena Rodríguez",
      Publicado: true
    },
    {
      Id: "2",
      Titulo: "Guía Completa para Divorcios Consensuales",
      Contenido: "Todo lo que necesita saber sobre el proceso de divorcio consensual...",
      Excerpt: "Todo lo que necesita saber sobre el proceso de divorcio consensual, requisitos y beneficios para las familias.",
      Fecha: "10 de Marzo, 2024",
      TiempoLectura: "6 min lectura",
      Imagen: "/images/blog/derecho-familia.jpg",
      EsDestacado: false,
      Categoria: "Derecho de Familia",
      Autor: "Dra. Ana Sofía López",
      Publicado: true
    },
    {
      Id: "3",
      Titulo: "Derechos Laborales: Cambios en la Legislación",
      Contenido: "Actualización sobre las nuevas normativas laborales...",
      Excerpt: "Actualización sobre las nuevas normativas laborales y cómo afectan tanto a empleadores como empleados.",
      Fecha: "5 de Marzo, 2024",
      TiempoLectura: "10 min lectura",
      Imagen: "/images/blog/derecho-laboral.jpg",
      EsDestacado: false,
      Categoria: "Derecho Laboral",
      Autor: "Lic. Roberto Jiménez",
      Publicado: true
    },
    {
      Id: "4",
      Titulo: "Contratos Inmobiliarios: Errores Comunes a Evitar",
      Contenido: "Los errores más frecuentes en contratos de compraventa inmobiliaria...",
      Excerpt: "Los errores más frecuentes en contratos de compraventa inmobiliaria y cómo prevenirlos.",
      Fecha: "28 de Febrero, 2024",
      TiempoLectura: "7 min lectura",
      Imagen: "/images/blog/derecho-inmobiliario.jpg",
      EsDestacado: false,
      Categoria: "Derecho Inmobiliario",
      Autor: "Lic. Fernando Castro",
      Publicado: true
    },
    {
      Id: "5",
      Titulo: "Defensa Penal: Estrategias Efectivas",
      Contenido: "Análisis de las mejores estrategias en defensa penal...",
      Excerpt: "Análisis de las mejores estrategias en defensa penal y casos de éxito recientes.",
      Fecha: "20 de Febrero, 2024",
      TiempoLectura: "12 min lectura",
      Imagen: "/images/blog/derecho-penal.jpg",
      EsDestacado: false,
      Categoria: "Derecho Penal",
      Autor: "Dr. Carlos Mendoza",
      Publicado: true
    },
    {
      Id: "6",
      Titulo: "Fusiones y Adquisiciones: Tendencias 2024",
      Contenido: "Las tendencias más importantes en fusiones y adquisiciones...",
      Excerpt: "Las tendencias más importantes en fusiones y adquisiciones para el año 2024.",
      Fecha: "15 de Febrero, 2024",
      TiempoLectura: "9 min lectura",
      Imagen: "/images/blog/fusiones.jpg",
      EsDestacado: false,
      Categoria: "Derecho Corporativo",
      Autor: "Dra. Patricia Vega",
      Publicado: true
    }
  ]

  const fetchBlogData = async () => {
    try {
      // Mostrar fallback rápidamente si no hay respuesta
      setTimeout(() => {
        if (isLoading) {
          setBlogPosts(fallbackBlogPosts)
          setFeaturedPost(fallbackBlogPosts.find(post => post.EsDestacado) || fallbackBlogPosts[0])
          setCategories(fallbackCategories)
          setIsLoading(false)
        }
      }, 350) // 350ms timeout para blog

      setError(null)
      
      const response = await api.get('/blog')
      
      if (response.data && response.data.success) {
        const apiPosts = response.data.data || fallbackBlogPosts
        setBlogPosts(apiPosts)
        setFeaturedPost(apiPosts.find((post: BlogPost) => post.EsDestacado) || apiPosts[0])
        
        // Generar categorías dinámicamente
        const categoryMap = new Map<string, number>()
        apiPosts.forEach((post: BlogPost) => {
          const count = categoryMap.get(post.Categoria) || 0
          categoryMap.set(post.Categoria, count + 1)
        })
        
        const dynamicCategories = [
          { nombre: "Todos", cantidad: apiPosts.length },
          ...Array.from(categoryMap.entries()).map(([nombre, cantidad]) => ({ nombre, cantidad }))
        ]
        
        setCategories(dynamicCategories)
      } else {
        setBlogPosts(fallbackBlogPosts)
        setFeaturedPost(fallbackBlogPosts[0])
        setCategories(fallbackCategories)
      }
    } catch (err) {
      console.error('Error fetching blog data:', err)
      setError('Error al cargar el blog')
      setBlogPosts(fallbackBlogPosts)
      setFeaturedPost(fallbackBlogPosts[0])
      setCategories(fallbackCategories)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogData()
  }, [])

  return {
    blogPosts,
    featuredPost,
    categories,
    isLoading,
    error,
    refetch: fetchBlogData
  }
}

export default useBlogData
