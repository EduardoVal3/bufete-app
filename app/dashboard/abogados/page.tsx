"use client"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  Star,
  Briefcase,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  DollarSign,
  FileText,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLawyers, LawyerData } from "@/hooks/useLawyers"
import { useLawyerActions, CreateLawyerData, UpdateLawyerData } from "@/hooks/useLawyerActions"

export default function AbogadosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEspecialidad, setFilterEspecialidad] = useState("todas")
  const [filterEstado, setFilterEstado] = useState("todos")
  const [filterDepartamento, setFilterDepartamento] = useState("todos")
  const [currentPage, setCurrentPage] = useState(1)

  // Estados para modales
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerData | null>(null)
  const [lawyerToDelete, setLawyerToDelete] = useState<LawyerData | null>(null)

  // Estados para contraseña
  const [showPassword, setShowPassword] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  })

  // Estados para formularios
  const [createForm, setCreateForm] = useState<CreateLawyerData>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    specializations: "",
    department: "",
    officeLocation: "",
    licenseNumber: "",
    yearsOfExperience: 0,
    hourlyRate: 0,
    biography: "",
    education: "",
    certifications: "",
  })

  const [editForm, setEditForm] = useState<UpdateLawyerData>({
    id: 0,
    fullName: "",
    specializations: "",
    licenseNumber: "",
    yearsOfExperience: 0,
    phone: "",
    hourlyRate: 0,
    department: "",
    officeLocation: "",
    biography: "",
    education: "",
    certifications: "",
  })

  const { 
    loading: actionLoading, 
    error: actionError, 
    createLawyer, 
    updateLawyer, 
    deleteLawyer, 
    toggleLawyerStatus, 
    getLawyerById 
  } = useLawyerActions();

  // Configurar filtros para el hook
  const filters = useMemo(() => ({
    search: searchTerm,
    specialization: filterEspecialidad !== "todas" ? filterEspecialidad : undefined,
    isActive: filterEstado === "todos" ? undefined : filterEstado === "activo",
    department: filterDepartamento !== "todos" ? filterDepartamento : undefined,
    page: currentPage,
    pageSize: 9, // 3x3 grid
  }), [searchTerm, filterEspecialidad, filterEstado, filterDepartamento, currentPage]);

  const { data, loading, error, refetch, totalCount, updateFilters } = useLawyers(filters);

  // Función para validar contraseña
  const validatePassword = (password: string) => {
    const validation = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
    setPasswordValidation(validation);
    return Object.values(validation).every(Boolean);
  };

  // Función para manejar cambio de contraseña
  const handlePasswordChange = (password: string) => {
    setCreateForm({ ...createForm, password });
    validatePassword(password);
  };

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ 
        search: searchTerm,
        page: 1 // Reset page when searching
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, updateFilters]);

  // Update filters when other filters change
  useEffect(() => {
    updateFilters({
      specialization: filterEspecialidad !== "todas" ? filterEspecialidad : undefined,
      isActive: filterEstado === "todos" ? undefined : filterEstado === "activo",
      department: filterDepartamento !== "todos" ? filterDepartamento : undefined,
      page: 1 // Reset page when changing filters
    });
    setCurrentPage(1);
  }, [filterEspecialidad, filterEstado, filterDepartamento, updateFilters]);

  // Funciones para manejar modales
  const handleViewLawyer = async (lawyer: LawyerData) => {
    setSelectedLawyer(lawyer);
    setShowViewModal(true);
  };

  const handleEditLawyer = async (lawyer: LawyerData) => {
    const detailedLawyer = await getLawyerById(lawyer.id);
    if (detailedLawyer) {
      setEditForm({
        id: detailedLawyer.id,
        fullName: detailedLawyer.fullName,
        specializations: detailedLawyer.specializations,
        licenseNumber: detailedLawyer.licenseNumber,
        yearsOfExperience: detailedLawyer.yearsOfExperience,
        phone: detailedLawyer.phone || "",
        hourlyRate: detailedLawyer.hourlyRate || 0,
        department: detailedLawyer.department || "",
        officeLocation: detailedLawyer.officeLocation || "",
        biography: detailedLawyer.biography || "",
        education: detailedLawyer.education || "",
        certifications: detailedLawyer.certifications || "",
      });
      setSelectedLawyer(detailedLawyer);
      setShowEditModal(true);
    }
  };

  const handleDeleteLawyer = (lawyer: LawyerData) => {
    setLawyerToDelete(lawyer);
    setShowDeleteDialog(true);
  };

  const handleCreateLawyer = () => {
    setCreateForm({
      fullName: "",
      email: "",
      password: "",
      phone: "",
      specializations: "",
      department: "",
      officeLocation: "",
      licenseNumber: "",
      yearsOfExperience: 0,
      hourlyRate: 0,
      biography: "",
      education: "",
      certifications: "",
    });
    setPasswordValidation({
      minLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false,
    });
    setShowPassword(false);
    setShowCreateModal(true);
  };

  const confirmDelete = async () => {
    if (lawyerToDelete) {
      const success = await deleteLawyer(lawyerToDelete.id);
      if (success) {
        await refetch();
        setShowDeleteDialog(false);
        setLawyerToDelete(null);
      }
    }
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar contraseña antes de enviar
    if (!Object.values(passwordValidation).every(Boolean)) {
      return; // No enviar si la contraseña no cumple con todos los requisitos
    }
    
    const success = await createLawyer(createForm);
    if (success) {
      await refetch();
      setShowCreateModal(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateLawyer(editForm);
    if (success) {
      await refetch();
      setShowEditModal(false);
    }
  };

  const handleToggleStatus = async (lawyer: LawyerData) => {
    const success = await toggleLawyerStatus(lawyer.id);
    if (success) {
      await refetch();
    }
  };

  // Funciones para limpiar modales
  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedLawyer(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedLawyer(null);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
  };

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
    setLawyerToDelete(null);
  };

  // Calcular estadísticas
  const stats = useMemo(() => {
    if (!data?.data) return {
      totalLawyers: 0,
      activeLawyers: 0,
      totalActiveCases: 0,
      totalCompletedCases: 0,
      totalBilled: 0
    };

    const lawyers = data.data;
    return {
      totalLawyers: totalCount,
      activeLawyers: lawyers.filter(l => l.isActive).length,
      totalActiveCases: lawyers.reduce((sum, l) => sum + l.activeCases, 0),
      totalCompletedCases: lawyers.reduce((sum, l) => sum + l.completedCases, 0),
      totalBilled: lawyers.reduce((sum, l) => sum + l.totalBilled, 0)
    };
  }, [data?.data, totalCount]);

  // Obtener especialidades únicas para filtros
  const especialidades = useMemo(() => {
    if (!data?.data) return [];
    const specs = data.data.map(l => l.specializations).filter(Boolean);
    return Array.from(new Set(specs));
  }, [data?.data]);

  // Obtener departamentos únicos para filtros
  const departamentos = useMemo(() => {
    if (!data?.data) return [];
    const depts = data.data.map(l => l.department).filter(Boolean);
    return Array.from(new Set(depts));
  }, [data?.data]);

  const getEstadoBadge = (isActive: boolean) => {
    return isActive ? "default" : "destructive";
  }

  const getEstadoText = (isActive: boolean) => {
    return isActive ? "Activo" : "Inactivo";
  }

  // Función para cambiar página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateFilters({ page });
  };

  // Calcular paginación
  const totalPages = Math.ceil(totalCount / (data?.pageSize || 9));

  // Componente de loading
  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Gestión de Abogados</h2>
            <p className="text-muted-foreground">Administra el equipo legal del bufete</p>
          </div>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Abogado
          </Button>
        </div>

        {/* Loading skeletons para estadísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading skeleton para filtros */}
        <Card>
          <CardHeader>
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-[200px] h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-[150px] h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        {/* Loading skeletons para cards de abogados */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Componente de error
  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Gestión de Abogados</h2>
            <p className="text-muted-foreground">Administra el equipo legal del bufete</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <AlertTriangle className="h-12 w-12 text-red-500" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">Error al cargar abogados</h3>
                <p className="text-sm text-gray-600 mt-1">{error}</p>
              </div>
              <Button onClick={refetch} variant="outline">
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Abogados</h2>
          <p className="text-muted-foreground">Administra el equipo legal del bufete</p>
        </div>
        <Button onClick={handleCreateLawyer}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Abogado
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Abogados</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLawyers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeLawyers} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos Activos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActiveCases}</div>
            <p className="text-xs text-muted-foreground">En todos los abogados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos Completados</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompletedCases}</div>
            <p className="text-xs text-muted-foreground">Total histórico</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facturado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalBilled.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Facturación total</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar abogados..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterEspecialidad} onValueChange={setFilterEspecialidad}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Especialidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las especialidades</SelectItem>
                {especialidades.map((esp) => (
                  <SelectItem key={esp} value={esp}>
                    {esp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDepartamento} onValueChange={setFilterDepartamento}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {departamentos.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de abogados */}
      {data?.data && data.data.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.data.map((abogado) => (
              <Card key={abogado.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder.svg" alt={abogado.fullName} />
                        <AvatarFallback>
                          {abogado.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{abogado.fullName}</CardTitle>
                        <CardDescription>{abogado.specializations}</CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewLawyer(abogado)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditLawyer(abogado)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-blue-600" 
                          onClick={() => handleToggleStatus(abogado)}
                        >
                          {abogado.isActive ? (
                            <>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <Star className="mr-2 h-4 w-4" />
                              Activar
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600" 
                          onClick={() => handleDeleteLawyer(abogado)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant={getEstadoBadge(abogado.isActive)}>
                      {getEstadoText(abogado.isActive)}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{abogado.lawyerCode}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{abogado.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{abogado.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{abogado.officeLocation}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{abogado.activeCases}</div>
                      <div className="text-xs text-muted-foreground">Casos Activos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{abogado.completedCases}</div>
                      <div className="text-xs text-muted-foreground">Casos Completados</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Información adicional:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>Licencia: {abogado.licenseNumber}</div>
                      <div>Depto: {abogado.department}</div>
                      <div>Experiencia: {abogado.yearsOfExperience} años</div>
                      <div>Tarifa: ${abogado.hourlyRate}/hr</div>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>Total facturado: ${abogado.totalBilled.toLocaleString()}</span>
                    <span>Desde {new Date(abogado.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (page > totalPages) return null;
                  
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron abogados</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm || filterEspecialidad !== "todas" || filterEstado !== "todos" || filterDepartamento !== "todos"
                ? "Intenta ajustar los filtros de búsqueda para encontrar lo que buscas."
                : "No hay abogados registrados en el sistema."}
            </p>
            {(searchTerm || filterEspecialidad !== "todas" || filterEstado !== "todos" || filterDepartamento !== "todos") && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setFilterEspecialidad("todas");
                  setFilterEstado("todos");
                  setFilterDepartamento("todos");
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal Ver Perfil */}
      <Dialog open={showViewModal} onOpenChange={closeViewModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Perfil del Abogado</DialogTitle>
            <DialogDescription>
              Información completa del abogado
            </DialogDescription>
          </DialogHeader>
          {selectedLawyer && (
            <div className="space-y-6">
              {/* Información personal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Nombre Completo</Label>
                  <p className="text-sm text-muted-foreground">{selectedLawyer.fullName}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Código</Label>
                  <p className="text-sm text-muted-foreground">{selectedLawyer.lawyerCode}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{selectedLawyer.email}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Teléfono</Label>
                  <p className="text-sm text-muted-foreground">{selectedLawyer.phone}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Licencia</Label>
                  <p className="text-sm text-muted-foreground">{selectedLawyer.licenseNumber}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Estado</Label>
                  <Badge variant={selectedLawyer.isActive ? "default" : "destructive"}>
                    {selectedLawyer.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>

              {/* Información profesional */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Información Profesional</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Especialización</Label>
                    <p className="text-sm text-muted-foreground">{selectedLawyer.specializations}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Años de Experiencia</Label>
                    <p className="text-sm text-muted-foreground">{selectedLawyer.yearsOfExperience} años</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Departamento</Label>
                    <p className="text-sm text-muted-foreground">{selectedLawyer.department}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Ubicación</Label>
                    <p className="text-sm text-muted-foreground">{selectedLawyer.officeLocation}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tarifa por Hora</Label>
                    <p className="text-sm text-muted-foreground">${selectedLawyer.hourlyRate}</p>
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Estadísticas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{selectedLawyer.totalCases}</div>
                    <div className="text-xs text-muted-foreground">Total Casos</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{selectedLawyer.activeCases}</div>
                    <div className="text-xs text-muted-foreground">Activos</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{selectedLawyer.completedCases}</div>
                    <div className="text-xs text-muted-foreground">Completados</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">${selectedLawyer.totalBilled.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Facturado</div>
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              {(selectedLawyer.biography || selectedLawyer.education || selectedLawyer.certifications) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Información Adicional</h3>
                  {selectedLawyer.biography && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Biografía</Label>
                      <p className="text-sm text-muted-foreground">{selectedLawyer.biography}</p>
                    </div>
                  )}
                  {selectedLawyer.education && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Educación</Label>
                      <p className="text-sm text-muted-foreground">{selectedLawyer.education}</p>
                    </div>
                  )}
                  {selectedLawyer.certifications && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Certificaciones</Label>
                      <p className="text-sm text-muted-foreground">{selectedLawyer.certifications}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Fechas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Fechas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Fecha de Creación</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedLawyer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Última Actualización</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedLawyer.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeViewModal}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Crear Abogado */}
      <Dialog open={showCreateModal} onOpenChange={closeCreateModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuevo Abogado</DialogTitle>
            <DialogDescription>
              Crear un nuevo abogado en el sistema
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitCreate} className="space-y-4">
            {/* Información personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="create-fullName">Nombre Completo *</Label>
                  <Input
                    id="create-fullName"
                    value={createForm.fullName}
                    onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-email">Email *</Label>
                  <Input
                    id="create-email"
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-password">Contraseña *</Label>
                  <div className="relative">
                    <Input
                      id="create-password"
                      type={showPassword ? "text" : "password"}
                      value={createForm.password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      required
                      className={`pr-10 ${
                        createForm.password && !Object.values(passwordValidation).every(Boolean)
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : createForm.password && Object.values(passwordValidation).every(Boolean)
                          ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                          : ""
                      }`}
                      placeholder="Mínimo 8 caracteres"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  
                  {/* Indicadores de validación */}
                  {createForm.password && (
                    <div className="space-y-1 text-xs">
                      <div className={`flex items-center space-x-1 ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                        <div className={`w-2 h-2 rounded-full ${passwordValidation.minLength ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>Mínimo 8 caracteres</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-red-600'}`}>
                        <div className={`w-2 h-2 rounded-full ${passwordValidation.hasUpperCase ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>Al menos una mayúscula (A-Z)</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-red-600'}`}>
                        <div className={`w-2 h-2 rounded-full ${passwordValidation.hasLowerCase ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>Al menos una minúscula (a-z)</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                        <div className={`w-2 h-2 rounded-full ${passwordValidation.hasNumber ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>Al menos un número (0-9)</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
                        <div className={`w-2 h-2 rounded-full ${passwordValidation.hasSpecialChar ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>Al menos un carácter especial (!@#$%^&*)</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-phone">Teléfono</Label>
                  <Input
                    id="create-phone"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-license">Número de Licencia *</Label>
                  <Input
                    id="create-license"
                    value={createForm.licenseNumber}
                    onChange={(e) => setCreateForm({ ...createForm, licenseNumber: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Información profesional */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Profesional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="create-specializations">Especialización *</Label>
                  <Input
                    id="create-specializations"
                    value={createForm.specializations}
                    onChange={(e) => setCreateForm({ ...createForm, specializations: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-experience">Años de Experiencia *</Label>
                  <Input
                    id="create-experience"
                    type="number"
                    min="0"
                    value={createForm.yearsOfExperience}
                    onChange={(e) => setCreateForm({ ...createForm, yearsOfExperience: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-department">Departamento</Label>
                  <Input
                    id="create-department"
                    value={createForm.department}
                    onChange={(e) => setCreateForm({ ...createForm, department: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-location">Ubicación de Oficina</Label>
                  <Input
                    id="create-location"
                    value={createForm.officeLocation}
                    onChange={(e) => setCreateForm({ ...createForm, officeLocation: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-hourlyRate">Tarifa por Hora</Label>
                  <Input
                    id="create-hourlyRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={createForm.hourlyRate}
                    onChange={(e) => setCreateForm({ ...createForm, hourlyRate: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Adicional</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="create-biography">Biografía</Label>
                  <Textarea
                    id="create-biography"
                    value={createForm.biography}
                    onChange={(e) => setCreateForm({ ...createForm, biography: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-education">Educación</Label>
                  <Textarea
                    id="create-education"
                    value={createForm.education}
                    onChange={(e) => setCreateForm({ ...createForm, education: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-certifications">Certificaciones</Label>
                  <Textarea
                    id="create-certifications"
                    value={createForm.certifications}
                    onChange={(e) => setCreateForm({ ...createForm, certifications: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {actionError && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{actionError}</p>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeCreateModal}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={actionLoading || !Object.values(passwordValidation).every(Boolean)}
              >
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crear Abogado
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Editar Abogado */}
      <Dialog open={showEditModal} onOpenChange={closeEditModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Abogado</DialogTitle>
            <DialogDescription>
              Modificar información del abogado
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit} className="space-y-4">
            {/* Información personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-fullName">Nombre Completo *</Label>
                  <Input
                    id="edit-fullName"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Teléfono</Label>
                  <Input
                    id="edit-phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-license">Número de Licencia *</Label>
                  <Input
                    id="edit-license"
                    value={editForm.licenseNumber}
                    onChange={(e) => setEditForm({ ...editForm, licenseNumber: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Información profesional */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Profesional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-specializations">Especialización *</Label>
                  <Input
                    id="edit-specializations"
                    value={editForm.specializations}
                    onChange={(e) => setEditForm({ ...editForm, specializations: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-experience">Años de Experiencia *</Label>
                  <Input
                    id="edit-experience"
                    type="number"
                    min="0"
                    value={editForm.yearsOfExperience}
                    onChange={(e) => setEditForm({ ...editForm, yearsOfExperience: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Departamento</Label>
                  <Input
                    id="edit-department"
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Ubicación de Oficina</Label>
                  <Input
                    id="edit-location"
                    value={editForm.officeLocation}
                    onChange={(e) => setEditForm({ ...editForm, officeLocation: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-hourlyRate">Tarifa por Hora</Label>
                  <Input
                    id="edit-hourlyRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.hourlyRate}
                    onChange={(e) => setEditForm({ ...editForm, hourlyRate: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Adicional</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-biography">Biografía</Label>
                  <Textarea
                    id="edit-biography"
                    value={editForm.biography}
                    onChange={(e) => setEditForm({ ...editForm, biography: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-education">Educación</Label>
                  <Textarea
                    id="edit-education"
                    value={editForm.education}
                    onChange={(e) => setEditForm({ ...editForm, education: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-certifications">Certificaciones</Label>
                  <Textarea
                    id="edit-certifications"
                    value={editForm.certifications}
                    onChange={(e) => setEditForm({ ...editForm, certifications: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {actionError && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{actionError}</p>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeEditModal}>
                Cancelar
              </Button>
              <Button type="submit" disabled={actionLoading}>
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmación de Eliminación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente al abogado &quot;{lawyerToDelete?.fullName}&quot; del sistema.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={actionLoading}
            >
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
