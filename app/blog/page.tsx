'use client'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { BlogPostsSkeleton, FeaturedPostSkeleton, BlogPostCard, FeaturedPostCard } from "@/components/blog-skeleton"
import useBlogData from "@/hooks/useBlogData"

export default function BlogPage() {
  const { blogPosts, featuredPost, categories, isLoading } = useBlogData()
  const regularPosts = blogPosts.filter((post) => !post.EsDestacado)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-800">
              Blog Legal
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Noticias y Análisis Legal</h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Manténgase informado con las últimas noticias legales, análisis de casos y consejos prácticos de nuestros
              expertos.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Buscar artículos..." className="pl-10" />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  size="sm"
                  className={index === 0 ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
                >
                  {category.nombre} {category.cantidad > 0 && `(${category.cantidad})`}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Badge className="bg-blue-600 dark:bg-blue-700 text-white mb-4">Artículo Destacado</Badge>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lo Más Reciente</h2>
          </div>

          {isLoading ? (
            <FeaturedPostSkeleton />
          ) : (
            featuredPost && <FeaturedPostCard post={featuredPost} />
          )}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Todos los Artículos</h2>
            <p className="text-gray-600 dark:text-gray-300">Explore nuestro archivo completo de artículos legales</p>
          </div>

          {isLoading ? (
            <BlogPostsSkeleton count={6} />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <BlogPostCard key={post.Id} post={post} />
              ))}
            </div>
          )}

          {/* Load More */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent"
            >
              Cargar Más Artículos
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-blue-600 dark:bg-blue-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Suscríbase a Nuestro Newsletter</h2>
            <p className="text-xl mb-8">Reciba las últimas noticias legales y análisis directamente en su correo</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input placeholder="Su correo electrónico" className="flex-1 bg-white text-gray-900" />
              <Button className="bg-white text-blue-600 hover:bg-gray-100">Suscribirse</Button>
            </div>
            <p className="text-sm text-blue-100 mt-4">Sin spam. Puede cancelar su suscripción en cualquier momento.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
