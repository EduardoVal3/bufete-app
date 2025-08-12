"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Eye, EyeOff } from "lucide-react";
import api from "@/lib/axios";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

interface LoginResponse {
  message: string;
  token: string;
  refreshToken: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    isActive: boolean;
    createdAt: string;
    lastLoginAt?: string;
    roles: any[];
  };
  role: string;
  expiresAt: string;
}

export function UnifiedLoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [form, setForm] = useState({ 
    email: "", 
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post<LoginResponse>("/Auth/login", form);
      console.log("Login response:", response.data);
      
      if (response.data.token) {
        const { token, refreshToken, user, role } = response.data;
        
        // Almacenar tokens
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        
        // Configurar axios con el token
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Decodificar token para obtener información del usuario
        const decodedToken = jwtDecode<{ 
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string 
        }>(token);
        
        // Obtener el rol del token decodificado o de la respuesta
        const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || role;
        
        // Redirigir según el rol
        switch (userRole) {
          case "SuperAdmin":
          case "Administrador":
            router.push("/dashboard");
            break;
          case "Abogado":
            router.push("/area-de-trabajo");
            break;
          case "Cliente":
            router.push("/perfil");
            break;
          default:
            router.push("/");
        }
      } else {
        alert(response.data.message || "Error al iniciar sesión");
      }
    } catch (error: unknown) {
      console.error("Error de login:", error);
      let errorMessage = "Credenciales incorrectas";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        errorMessage = err.response?.data?.message || errorMessage;
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeIcon = () => {
    return <User className="h-4 w-4" />;
  };

  const getUserTypeDescription = () => {
    return "Ingresa con tu correo y contraseña";
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            {getUserTypeIcon()}
            <CardTitle className="ml-2 text-xl">Bienvenido de nuevo</CardTitle>
          </div>
          <CardDescription>
            {getUserTypeDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Correo</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tuemail@ejemplo.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full hover:scale-105 transition-all duration-300">
                {loading ? "Ingresando..." : "Ingresar"}
              </Button>
              
              <div className="text-center text-sm">
                ¿No tienes una cuenta?{" "}
                <Link
                  href="/auth/cliente/register"
                  className="underline underline-offset-4"
                >
                  Regístrate
                </Link>
              </div>

              <div className="text-center">
                <Link
                  href="/"
                  className="text-sm text-muted-foreground underline underline-offset-4"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
