import { useState, useCallback } from 'react';
import api from '@/lib/axios';

interface CaseDto {
  id: number
  caseNumber: string
  title: string
  description: string
  clientId: number
  clientName: string
  primaryLawyerId?: number
  lawyerName?: string
  specializations?: string
  yearsOfExperience?: string
  biography?: string
  email?: string
  phoneNumber?: string
  officeLocation?: string
  serviceTypeId: number
  serviceTypeName: string
  statusId: number
  statusName: string
  priority: string
  estimatedValue: number
  actualValue: number
  startDate: string
  endDate?: string
  dueDate?: string
  notes?: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
  totalActivities: number
  totalDocuments: number
  lastActivity?: string
  recentActivities: CaseActivityDto[]
  documents: CaseDocumentDto[]
}

interface CaseActivityDto {
  id: number
  caseId: number
  primaryLawyerId: number
  lawyerName: string
  activityType: string
  description: string
  hoursWorked?: number
  billableAmount?: number
  activityDate: string
  createdAt: string
}

interface CaseDocumentDto {
  id: number
  caseId: number
  fileName: string
  originalFileName: string
  filePath: string
  fileType: string
  fileSize: number
  documentType: string
  description?: string
  uploadedById: string
  uploadedByName: string
  uploadedAt: string
  isPublic: boolean
}

interface UseCaseDetailsReturn {
  caseData: CaseDto | null;
  activities: CaseActivityDto[];
  documents: CaseDocumentDto[];
  loading: boolean;
  error: string | null;
  refetch: (caseId: string) => Promise<void>;
}

export const useCaseDetails = (): UseCaseDetailsReturn => {
  const [caseData, setCaseData] = useState<CaseDto | null>(null);
  const [activities, setActivities] = useState<CaseActivityDto[]>([]);
  const [documents, setDocuments] = useState<CaseDocumentDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCaseDetails = useCallback(async (caseId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Llamadas paralelas a multiples endpoints
      const [caseResponse, activitiesResponse, documentsResponse] = await Promise.all([
        api.get(`/Cases/${caseId}`),
        api.get(`/Cases/${caseId}/activities?page=1&pageSize=50`).catch(() => ({ data: { data: [] } })),
        api.get(`/Cases/${caseId}/documents`).catch(() => ({ data: { data: [] } }))
      ]);

      if (!caseResponse.data?.data) {
        throw new Error('Datos del caso no encontrados');
      }

      setCaseData(caseResponse.data.data);
      setActivities(activitiesResponse.data?.data || []);
      setDocuments(documentsResponse.data?.data || []);

    } catch (error: any) {
      console.error('Error fetching case details:', error);
      
      // Manejo de errores específicos
      if (error.response?.status === 404) {
        setError('Caso no encontrado');
      } else if (error.response?.status === 403) {
        setError('No tienes permisos para ver este caso');
      } else if (error.response?.status === 401) {
        setError('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
      } else {
        setError(error.response?.data?.message || 'Error al cargar los detalles del caso');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    caseData,
    activities,
    documents,
    loading,
    error,
    refetch: fetchCaseDetails
  };
};
