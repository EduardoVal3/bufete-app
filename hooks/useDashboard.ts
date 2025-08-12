import { useState, useEffect } from "react";
import api from "@/lib/axios";

interface DashboardData {
  totalCases: number;
  activeCases: number;
  totalClients: number;
  totalLawyers: number;
  newCasesThisMonth: number;
  newClientsThisMonth: number;
  invoicesThisMonth: number;
  totalRevenue: number;
  revenueThisMonth: number;
  pendingInquiries: number;
  pendingTestimonials: number;
  casesByPriority: Array<{
    priority: string;
    count: number;
    color: string;
  }>;
  casesByStatus: Array<{
    status: string;
    count: number;
    color: string;
  }>;
}

interface UseDashboardReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/Dashboard/overview");
      
      if (response.data && response.data.data) {
        setData(response.data.data);
      } else {
        throw new Error("Formato de respuesta inesperado");
      }
    } catch (err: any) {
      console.error("Error al cargar datos del dashboard:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Error al cargar los datos del dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
