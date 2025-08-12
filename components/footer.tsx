import Link from "next/link"
import { Scale, MapPin, Phone, Mail, Facebook, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">LexFirm</span>
            </div>
            <p className="text-gray-300 dark:text-gray-400 leading-relaxed">
              Bufete de abogados líder con más de 25 años de experiencia brindando soluciones legales integrales y
              personalizadas.
            </p>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Nuestro Facebook" className="text-gray-400 hover:text-blue-400 transition-colors dark:hover:text-blue-500">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Nuestro Twitter" className="text-gray-400 hover:text-blue-400 transition-colors dark:hover:text-blue-500">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Nuestro LinkedIn" className="text-gray-400 hover:text-blue-400 transition-colors dark:hover:text-blue-500">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-500 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-500 transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-500 transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-500 transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-gray-300 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-500 transition-colors">
                  Derecho Corporativo
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-500 transition-colors">
                  Derecho de Familia
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-500 transition-colors">
                  Litigios Civiles
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-500 transition-colors">
                  Derecho Laboral
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-500 transition-colors">
                  Derecho Penal
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-500 transition-colors">
                  Derecho Penal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 dark:text-gray-400">
                  123 Calle Principal
                  <br />
                  Ciudad, Estado 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 dark:text-gray-400">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 dark:text-gray-400">info@lexfirm.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 dark:text-gray-500">
            © 2024 LexFirm. Todos los derechos reservados. |
            <Link href="#" className="hover:text-white transition-colors">
              {" "}
              Política de Privacidad
            </Link>{" "}
            |
            <Link href="#" className="hover:text-white transition-colors">
              {" "}
              Términos de Servicio
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
