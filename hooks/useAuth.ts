import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

interface DecodedToken {
  [key: string]: any;
  exp: number;
  sub: string;
  role?: string;
  clientId?: string;
  lawyerId?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
}

export function useAuth() {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;
        const clientId = decoded.clientId;
        const lawyerId = decoded.lawyerId;
        const userId = decoded.sub || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        const email = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

        if (decoded.exp * 1000 > Date.now()) {
          setUser({ 
            ...decoded, 
            role, 
            clientId, 
            lawyerId,
            userId,
            email
          });
        } else {
          refreshAccessToken();
        }
      } catch (error) {
        console.error("Token inválido:", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const res = await api.post("/Auth/refresh-token", { refreshToken });

      const { token: newToken, refreshToken: newRefreshToken } = res.data;

      localStorage.setItem("token", newToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      const decoded: DecodedToken = jwtDecode(newToken);
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;
      const clientId = decoded.clientId;
      const lawyerId = decoded.lawyerId;
      const userId = decoded.sub || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      const email = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

      setUser({ 
        ...decoded, 
        role, 
        clientId, 
        lawyerId,
        userId,
        email
      });
    } catch (error) {
      console.error("Error al renovar token:", error);
      logout();
    }
  };

  const logout = async () => {
    try {
      // Llamar al endpoint de logout en el backend
      await api.post("/Auth/logout");
    } catch (error) {
      console.error("Error al hacer logout en el servidor:", error);
      // Continuar con el logout local incluso si falla el servidor
    }
    
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    router.push("/");
  };

  return { user, loading, logout, refreshAccessToken };
}
