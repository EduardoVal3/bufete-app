import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import api from "@/lib/axios";

interface ClientProfile {
  id: number;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  occupation?: string;
  companyName?: string;
  clientCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  totalCases: number;
  activeCases: number;
  totalBilled: number;
  pendingPayments: number;
}

// Cache simple para evitar llamadas duplicadas
let profileCache: ClientProfile | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export function useClientProfile() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ClientProfile | null>(profileCache);
  const [loading, setLoading] = useState(!profileCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (authLoading) return;
      
      if (!user || user.role !== "Cliente") {
        setLoading(false);
        return;
      }

      // Verificar caché
      const now = Date.now();
      if (profileCache && (now - cacheTimestamp < CACHE_DURATION)) {
        setProfile(profileCache);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get(`/Clients/my-profile`);
        
        if (response.data?.data) {
          profileCache = response.data.data;
          cacheTimestamp = now;
          setProfile(profileCache);
        }
      } catch (err: any) {
        console.error("Error al obtener perfil del cliente:", err);
        setError("Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, authLoading]);

  const refreshProfile = async () => {
    if (!user || user.role !== "Cliente") return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/Clients/my-profile`);
      
      if (response.data?.data) {
        profileCache = response.data.data;
        cacheTimestamp = Date.now();
        setProfile(profileCache);
      }
    } catch (err: any) {
      console.error("Error al refrescar perfil del cliente:", err);
      setError("Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar caché
  const clearCache = () => {
    profileCache = null;
    cacheTimestamp = 0;
  };

  return {
    profile,
    loading: loading || authLoading,
    error,
    refreshProfile,
    clearCache,
  };
}
