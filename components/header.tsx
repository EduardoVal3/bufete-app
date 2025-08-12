"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Scale, Phone } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Sobre Nosotros", href: "/about" },
    { name: "Servicios", href: "/services" },
    { name: "Blog", href: "/blog" },
    { name: "Contacto", href: "/contact" },
  ];

  const { dashboardHref, dashboardLabel } = useMemo(() => {
    if (user?.role === "SuperAdmin" || user?.role === "Administrador") {
      return { dashboardHref: "/dashboard", dashboardLabel: "Dashboard" };
    } else if (user?.role === "Abogado") {
      return {
        dashboardHref: "/area-de-trabajo",
        dashboardLabel: "Área de Trabajo",
      };
    } else if (user?.role === "Cliente") {
      return { dashboardHref: "/perfil", dashboardLabel: "Mi Perfil" };
    } else {
      return { dashboardHref: "/", dashboardLabel: "" };
    }
  }, [user]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-foreground">LexFirm</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-blue-400 dark:hover:text-blue-500 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>(555) 123-4567</span>
            </div>
            <ThemeToggle />

            {user && dashboardLabel ? (
              <>
                <Button
                  asChild
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white"
                >
                  
                  <Link href={dashboardHref}>{dashboardLabel}</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={logout}
                  className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
              >
                <Link href="/auth/login">Iniciar Sesión</Link>
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8 px-6">
                  <Link href="/" className="flex items-center space-x-2">
                    <Scale className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <span className="text-lg font-bold">
                      Sterling & Asociados
                    </span>
                  </Link>
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>(555) 123-4567</span>
                      </div>
                    </div>

                    {user && dashboardLabel ? (
                      <>
                        <Button
                          asChild
                          className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white"
                          onClick={() => setIsOpen(false)}
                        >
                          <Link href={dashboardHref}>{dashboardLabel}</Link>
                        </Button>
                        <Button
                          className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white mt-2"
                          variant="outline"
                          onClick={() => {
                            logout();
                            setIsOpen(false);
                          }}
                        >
                          Cerrar sesión
                        </Button>
                      </>
                    ) : (
                      <Button
                        asChild
                        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/auth/login">Iniciar Sesión</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
