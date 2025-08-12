import { useState } from "react";
import api from "@/lib/axios";
import { LawyerData } from "./useLawyers";

interface CreateLawyerData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  specializations: string;
  department: string;
  officeLocation: string;
  yearsOfExperience?: number;
  hourlyRate?: number;
  biography?: string;
  education?: string;
  certifications?: string;
  licenseNumber: string;
}

interface UpdateLawyerData {
  id: number;
  fullName: string;
  specializations: string;
  licenseNumber: string;
  yearsOfExperience: number;
  phone?: string;
  hourlyRate?: number;
  department?: string;
  officeLocation?: string;
  biography?: string;
  education?: string;
  certifications?: string;
}

// DTOs para la API
interface CreateLawyerDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  licenseNumber: string;
  specializations: string;
  yearsOfExperience: number;
  phoneNumber?: string;
  hourlyRate?: number;
  department?: string;
  officeLocation?: string;
  biography?: string;
  education?: string;
  certifications?: string;
}

interface UpdateLawyerDTO {
  firstName: string;
  lastName: string;
  licenseNumber: string;
  specializations: string;
  yearsOfExperience: number;
  phoneNumber?: string;
  hourlyRate?: number;
  department?: string;
  officeLocation?: string;
  biography?: string;
  education?: string;
  certifications?: string;
}

interface UseLawyerActionsReturn {
  loading: boolean;
  error: string | null;
  createLawyer: (data: CreateLawyerData) => Promise<boolean>;
  updateLawyer: (data: UpdateLawyerData) => Promise<boolean>;
  deleteLawyer: (id: number) => Promise<boolean>;
  toggleLawyerStatus: (id: number) => Promise<boolean>;
  getLawyerById: (id: number) => Promise<LawyerData | null>;
}

export function useLawyerActions(): UseLawyerActionsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to split fullName into firstName and lastName
  const splitFullName = (fullName: string): { firstName: string; lastName: string } => {
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length === 1) {
      return { firstName: nameParts[0], lastName: '' };
    }
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    return { firstName, lastName };
  };

  // Helper function to map CreateLawyerData to CreateLawyerDTO
  const mapToCreateDTO = (data: CreateLawyerData): CreateLawyerDTO => {
    const { firstName, lastName } = splitFullName(data.fullName);
    return {
      firstName,
      lastName,
      email: data.email,
      password: data.password,
      licenseNumber: data.licenseNumber,
      specializations: data.specializations,
      yearsOfExperience: data.yearsOfExperience || 0,
      phoneNumber: data.phone || undefined,
      hourlyRate: data.hourlyRate || undefined,
      department: data.department || undefined,
      officeLocation: data.officeLocation || undefined,
      biography: data.biography || undefined,
      education: data.education || undefined,
      certifications: data.certifications || undefined,
    };
  };

  // Helper function to map UpdateLawyerData to UpdateLawyerDTO
  const mapToUpdateDTO = (data: UpdateLawyerData): UpdateLawyerDTO => {
    const { firstName, lastName } = splitFullName(data.fullName);
    return {
      firstName,
      lastName,
      licenseNumber: data.licenseNumber,
      specializations: data.specializations,
      yearsOfExperience: data.yearsOfExperience,
      phoneNumber: data.phone || undefined,
      hourlyRate: data.hourlyRate || undefined,
      department: data.department || undefined,
      officeLocation: data.officeLocation || undefined,
      biography: data.biography || undefined,
      education: data.education || undefined,
      certifications: data.certifications || undefined,
    };
  };

  const createLawyer = async (data: CreateLawyerData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const dto = mapToCreateDTO(data);
      const response = await api.post("/Lawyers", dto);
      
      if (response.data) {
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Error al crear abogado:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Error al crear el abogado"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateLawyer = async (data: UpdateLawyerData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { id, ...updateData } = data;
      const dto = mapToUpdateDTO(updateData as UpdateLawyerData);
      const response = await api.put(`/Lawyers/${id}`, dto);
      
      if (response.data) {
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Error al actualizar abogado:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Error al actualizar el abogado"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteLawyer = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.delete(`/Lawyers/${id}`);
      
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Error al eliminar abogado:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Error al eliminar el abogado"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleLawyerStatus = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.patch(`/Lawyers/${id}/toggle-status`);
      
      if (response.data) {
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Error al cambiar estado del abogado:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Error al cambiar el estado del abogado"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getLawyerById = async (id: number): Promise<LawyerData | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/Lawyers/${id}`);
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (err: any) {
      console.error("Error al obtener abogado:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Error al obtener los datos del abogado"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createLawyer,
    updateLawyer,
    deleteLawyer,
    toggleLawyerStatus,
    getLawyerById,
  };
}

export type { CreateLawyerData, UpdateLawyerData };
