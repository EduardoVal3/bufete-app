"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  CheckCircle, 
  CreditCard, 
  Clock, 
  MessageSquare, 
  User, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  Bell
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbsPerfil";
import { useClientDashboard } from "@/hooks/useClientDashboard";
import Link from "next/link";
import { GradientBackground } from '@/components/animate-ui/backgrounds/gradient';

interface ClientProfile {
  id: number;
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

// Optimización: Mover funciones fuera del componente para evitar re-creación
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getActivityIcon(activityType: string) {
  const iconMap: Record<string, any> = {
    document: FileText,
    meeting: Calendar,
    payment: CreditCard,
    message: MessageSquare,
    notification: Bell,
    update: TrendingUp,
    status_update: FileText,
    case_update: FileText,
    comment: MessageSquare,
    invoice: CreditCard,
    appointment: Calendar,
    case_completed: CheckCircle,
    default: FileText,
  };
  
  return iconMap[activityType.toLowerCase()] || iconMap.default;
}

function getActivityColor(activityType: string): string {
  const colorMap: Record<string, string> = {
    document: 'text-blue-600',
    meeting: 'text-green-600',
    payment: 'text-orange-600',
    message: 'text-purple-600',
    notification: 'text-red-600',
    update: 'text-indigo-600',
    status_update: 'text-blue-600',
    case_update: 'text-blue-600',
    comment: 'text-green-600',
    invoice: 'text-emerald-600',
    appointment: 'text-orange-600',
    case_completed: 'text-purple-600',
    default: 'text-gray-600',
  };
  
  return colorMap[activityType.toLowerCase()] || colorMap.default;
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Hace un momento';
  if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} h`;
  if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
  
  return date.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short' 
  });
}

export default function PerfilPage() {
  const { profile, dashboard, notifications, loading, error } = useClientDashboard();

  // Optimización: Memoizar quote para evitar cambios en cada render
  const motivationalQuote = useMemo(() => {
    const quotes = [
      "La justicia es la verdad en acción.",
      "El derecho es el conjunto de condiciones que permiten a la libertad de cada uno acomodarse a la libertad de todos.",
      "La ley es la razón libre de pasión.",
      "Donde no hay justicia es peligroso tener razón.",
      "La justicia sin fuerza es impotente; la fuerza sin justicia es tiránica.",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, []);

  // Optimización: Calcular valores una vez
  const stats = useMemo(() => ({
    activeCases: dashboard?.activeCases || profile?.activeCases || 0,
    completedCases: dashboard?.completedCases || ((profile?.totalCases || 0) - (profile?.activeCases || 0)),
    pendingPayments: dashboard?.pendingInvoices || Math.floor(profile?.pendingPayments || 0),
    pendingAmount: (profile?.pendingPayments || 0).toLocaleString()
  }), [dashboard, profile]);

  // Early returns para mejorar performance
  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <Breadcrumbs />
        <div className="space-y-6">
          <Skeleton className="h-32 w-full rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 p-6">
        <Breadcrumbs />
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <Breadcrumbs />

      {/* Sección de bienvenida */}
      <div className="relative rounded-lg overflow-hidden">
        <GradientBackground className="absolute inset-0 z-0" />
        <div className="relative z-10 bg-opacity-80 p-6 text-white rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-12 w-12 border-2 border-white/20">
              <AvatarImage src="/placeholder.svg" alt={profile?.fullName || "Usuario"} />
              <AvatarFallback className="bg-white/20 text-white font-semibold">
                {profile ? getInitials(profile.fullName) : "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">
                ¡Bienvenido, {profile?.fullName || "Usuario"}!
              </h1>
              <p className="text-blue-100">Aquí tienes un resumen de tu actividad legal</p>
              {profile?.clientCode && (
                <p className="text-blue-200 text-sm">Cliente: {profile.clientCode}</p>
              )}
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sm text-blue-100 mb-1">Frase del día:</p>
            <p className="font-medium italic">&ldquo;{motivationalQuote}&rdquo;</p>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Casos Activos</CardTitle>
            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.activeCases}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              En progreso
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Casos Completados</CardTitle>
            <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.completedCases}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <CheckCircle className="h-3 w-3" />
              Finalizados exitosamente
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pagos Pendientes</CardTitle>
            <div className="h-8 w-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.pendingPayments}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3" />
              ${stats.pendingAmount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actividad reciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboard?.recentActivities && dashboard.recentActivities.length > 0 ? (
              dashboard.recentActivities.slice(0, 5).map((activity) => {
                const IconComponent = getActivityIcon(activity.activityType);
                const activityColor = getActivityColor(activity.activityType);
                
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <IconComponent className={`h-4 w-4 ${activityColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {activity.description}
                      </p>
                      {activity.caseTitle && (
                        <p className="text-xs text-blue-600 mt-1">Caso: {activity.caseTitle}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {getRelativeTime(activity.activityDate)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay actividad reciente</p>
                <p className="text-sm">La actividad de tus casos aparecerá aquí</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones
            {notifications && notifications.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {notifications.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications && notifications.length > 0 ? (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    notification.isRead 
                      ? 'bg-muted/30 border-l-gray-300' 
                      : 'bg-blue-50 dark:bg-blue-950/20 border-l-blue-500'
                  } transition-colors`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium text-sm ${
                        notification.isRead ? 'text-muted-foreground' : 'text-foreground'
                      }`}>
                        {notification.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant={notification.type === 'urgent' ? 'destructive' : 'secondary'} 
                          className="text-xs"
                        >
                          {notification.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {getRelativeTime(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                    {!notification.isRead && (
                      <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tienes notificaciones</p>
                <p className="text-sm">Las notificaciones importantes aparecerán aquí</p>
              </div>
            )}
          </div>
          {notifications && notifications.length > 5 && (
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full" size="sm">
                Ver todas las notificaciones ({notifications.length})
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/perfil/contratar">
          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-4 text-center">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-medium text-sm">Contratar Servicio</h3>
              <p className="text-xs text-muted-foreground mt-1">Solicita nueva consulta</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/perfil/casos">
          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-4 text-center">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-medium text-sm">Ver Casos</h3>
              <p className="text-xs text-muted-foreground mt-1">Revisa tus casos</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/perfil/pagos">
          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-4 text-center">
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-medium text-sm">Pagos</h3>
              <p className="text-xs text-muted-foreground mt-1">Gestiona facturas</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/perfil/configuracion">
          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-4 text-center">
              <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
                <User className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-medium text-sm">Configuración</h3>
              <p className="text-xs text-muted-foreground mt-1">Actualiza tu perfil</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
