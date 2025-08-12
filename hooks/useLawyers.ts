import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";

export interface LawyerData {
  id: number;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  lawyerCode: string;
  licenseNumber: string;
  specializations: string;
  yearsOfExperience: number;
  hourlyRate: number;
  department: string;
  officeLocation: string;
  biography: string | null;
  education: string | null;
  certifications: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  totalCases: number;
  activeCases: number;
  completedCases: number;
  totalBilled: number;
}

interface LawyersResponse {
  data: LawyerData[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

interface LawyerFilters {
  search?: string;
  specialization?: string;
  isActive?: boolean;
  department?: string;
  page?: number;
  pageSize?: number;
}

interface UseLawyersReturn {
  data: LawyersResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  totalCount: number;
  updateFilters: (newFilters: Partial<LawyerFilters>) => void;
}

export function useLawyers(initialFilters: LawyerFilters = {}): UseLawyersReturn {
  const [data, setData] = useState<LawyersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LawyerFilters>({
    page: 1,
    pageSize: 10,
    ...initialFilters,
  });

  const fetchLawyers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Construir query params
      const queryParams = new URLSearchParams();
      
      if (filters.search && filters.search.trim()) {
        queryParams.append('Search', filters.search.trim());
      }
      
      if (filters.specialization && filters.specialization !== 'todas') {
        queryParams.append('Specialization', filters.specialization);
      }
      
      if (filters.isActive !== undefined) {
        queryParams.append('IsActive', filters.isActive.toString());
      }
      
      if (filters.department && filters.department !== 'todos') {
        queryParams.append('Department', filters.department);
      }
      
      if (filters.page) {
        queryParams.append('Page', filters.page.toString());
      }
      
      if (filters.pageSize) {
        queryParams.append('PageSize', filters.pageSize.toString());
      }

      const url = `/Lawyers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      
      if (response.data) {
        setData(response.data);
      } else {
        throw new Error("Formato de respuesta inesperado");
      }
    } catch (err: any) {
      console.error("Error al cargar abogados:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Error al cargar los datos de abogados"
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<LawyerFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      // Reset page to 1 when changing filters (except when explicitly changing page)
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  }, []);

  const refetch = useCallback(async () => {
    await fetchLawyers();
  }, [fetchLawyers]);

  useEffect(() => {
    fetchLawyers();
  }, [fetchLawyers]);

  return {
    data,
    loading,
    error,
    refetch,
    totalCount: data?.totalCount || 0,
    updateFilters,
  };
}
