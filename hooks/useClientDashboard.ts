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

interface ClientDashboard {
  myCases: number;
  activeCases: number;
  completedCases: number;
  totalInvoices: number;
  pendingInvoices: number;
  paidInvoices: number;
  totalAmountDue: number;
  recentActivities: RecentActivity[];
  upcomingAppointments: Appointment[];
  casesByStatus: CaseStatus[];
}

interface RecentActivity {
  id: number;
  activityType: string;
  title: string;
  description: string;
  caseTitle?: string;
  activityDate: string;
  createdAt: string;
}

interface Appointment {
  id: number;
  title: string;
  description: string;
  scheduledDate: string;
  location?: string;
  isConfirmed: boolean;
}

interface CaseStatus {
  status: string;
  count: number;
  color: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  relatedCaseId?: number;
}

interface ClientDashboardData {
  profile: ClientProfile | null;
  dashboard: ClientDashboard | null;
  notifications: Notification[];
}

export function useClientDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<ClientDashboardData>({
    profile: null,
    dashboard: null,
    notifications: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      if (authLoading) return;
      
      if (!user || user.role !== "Cliente") {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // UNA SOLA llamada API que traiga todo
        const [profileRes, dashboardRes, notificationsRes] = await Promise.all([
          api.get("/Clients/my-profile"),
          api.get("/Dashboard/client"),
          api.get("/Dashboard/notifications").catch(() => ({ data: { data: [] } })) // Opcional
        ]);

        setData({
          profile: profileRes.data?.data || null,
          dashboard: dashboardRes.data?.data || null,
          notifications: notificationsRes.data?.data || []
        });
        console.log("Datos del dashboard obtenidos:", {
          profile: profileRes.data?.data,
          dashboard: dashboardRes.data?.data,
          notifications: notificationsRes.data?.data
        });
        console.log("Datos del cliente:", dashboardRes.data?.data);
      } catch (err: any) {
        console.error("Error al obtener datos del dashboard:", err);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user, authLoading]);

  const refreshData = async () => {
    if (!user || user.role !== "Cliente") return;

    try {
      setLoading(true);
      setError(null);
      
      const [profileRes, dashboardRes, notificationsRes] = await Promise.all([
        api.get("/Clients/my-profile"),
        api.get("/Dashboard/client"),
        api.get("/Dashboard/notifications").catch(() => ({ data: { data: [] } }))
      ]);

      setData({
        profile: profileRes.data?.data || null,
        dashboard: dashboardRes.data?.data || null,
        notifications: notificationsRes.data?.data || []
      });
    } catch (err: any) {
      console.error("Error al refrescar datos:", err);
      setError("Error al actualizar los datos");
    } finally {
      setLoading(false);
    }
  };

  return {
    ...data,
    loading: loading || authLoading,
    error,
    refreshData,
  };
}
