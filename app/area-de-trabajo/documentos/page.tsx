"use client";

import { useState } from "react";
import { FileText, Download, Upload, Search, Filter, FolderOpen, Plus, Eye, Trash2, Share } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Document {
  id: string;
  name: string;
  type: "contract" | "evidence" | "pleading" | "correspondence" | "other";
  format: "pdf" | "docx" | "jpg" | "png" | "txt";
  size: string;
  uploadDate: string;
  caseNumber?: string;
  tags: string[];
  isConfidential: boolean;
  lastModified: string;
}

interface DocumentFolder {
  id: string;
  name: string;
  documentCount: number;
  type: "case" | "template" | "archive";
}

const mockFolders: DocumentFolder[] = [
  {
    id: "1",
    name: "Caso Civil - Juan Pérez",
    documentCount: 12,
    type: "case"
  },
  {
    id: "2", 
    name: "Plantillas Legales",
    documentCount: 8,
    type: "template"
  },
  {
    id: "3",
    name: "Contratos Laborales",
    documentCount: 15,
    type: "case"
  },
  {
    id: "4",
    name: "Archivo 2024",
    documentCount: 45,
    type: "archive"
  }
];

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Contrato de Trabajo - Juan Pérez.pdf",
    type: "contract",
    format: "pdf",
    size: "2.4 MB",
    uploadDate: "2025-01-15",
    caseNumber: "CASE-2024-001",
    tags: ["contrato", "laboral", "urgente"],
    isConfidential: true,
    lastModified: "2025-01-15"
  },
  {
    id: "2",
    name: "Evidencia Fotográfica.jpg",
    type: "evidence",
    format: "jpg",
    size: "1.8 MB",
    uploadDate: "2025-01-14",
    caseNumber: "CASE-2024-001",
    tags: ["evidencia", "fotos"],
    isConfidential: false,
    lastModified: "2025-01-14"
  },
  {
    id: "3",
    name: "Demanda Civil.docx",
    type: "pleading",
    format: "docx",
    size: "856 KB",
    uploadDate: "2025-01-13",
    caseNumber: "CASE-2024-015",
    tags: ["demanda", "civil", "borrador"],
    isConfidential: true,
    lastModified: "2025-01-13"
  },
  {
    id: "4",
    name: "Correspondencia Cliente.pdf",
    type: "correspondence",
    format: "pdf",
    size: "445 KB",
    uploadDate: "2025-01-12",
    caseNumber: "CASE-2024-008",
    tags: ["correspondencia", "cliente"],
    isConfidential: false,
    lastModified: "2025-01-12"
  },
  {
    id: "5",
    name: "Plantilla Poder Notarial.docx",
    type: "other",
    format: "docx",
    size: "234 KB",
    uploadDate: "2025-01-10",
    tags: ["plantilla", "poder", "notarial"],
    isConfidential: false,
    lastModified: "2025-01-10"
  }
];

const getDocumentTypeColor = (type: string) => {
  switch (type) {
    case "contract": return "bg-blue-100 text-blue-800 border-blue-200";
    case "evidence": return "bg-green-100 text-green-800 border-green-200";
    case "pleading": return "bg-purple-100 text-purple-800 border-purple-200";
    case "correspondence": return "bg-orange-100 text-orange-800 border-orange-200";
    case "other": return "bg-gray-100 text-gray-800 border-gray-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getDocumentTypeLabel = (type: string) => {
  switch (type) {
    case "contract": return "Contrato";
    case "evidence": return "Evidencia";
    case "pleading": return "Alegato";
    case "correspondence": return "Correspondencia";
    case "other": return "Otro";
    default: return type;
  }
};

const getFormatIcon = (format: string) => {
  switch (format) {
    case "pdf": return "🗎";
    case "docx": return "📝";
    case "jpg":
    case "png": return "🖼️";
    case "txt": return "📄";
    default: return "📁";
  }
};

export default function DocumentosPage() {
  const [documents] = useState<Document[]>(mockDocuments);
  const [folders] = useState<DocumentFolder[]>(mockFolders);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         doc.caseNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
          <p className="text-muted-foreground">
            Gestiona todos tus documentos legales y archivos de casos
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Subir Archivo
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Carpeta
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar documentos, casos o etiquetas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="contract">Contratos</SelectItem>
            <SelectItem value="evidence">Evidencias</SelectItem>
            <SelectItem value="pleading">Alegatos</SelectItem>
            <SelectItem value="correspondence">Correspondencia</SelectItem>
            <SelectItem value="other">Otros</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quick Access Folders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FolderOpen className="mr-2 h-5 w-5" />
            Carpetas de Acceso Rápido
          </CardTitle>
          <CardDescription>
            Accede rápidamente a tus carpetas más importantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {folders.map((folder) => (
              <div key={folder.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FolderOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{folder.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {folder.documentCount} documentos
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Documentos Recientes
              </CardTitle>
              <CardDescription>
                {filteredDocuments.length} documentos encontrados
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No se encontraron documentos</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                      {getFormatIcon(doc.format)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium truncate">{doc.name}</h3>
                      <Badge className={getDocumentTypeColor(doc.type)}>
                        {getDocumentTypeLabel(doc.type)}
                      </Badge>
                      {doc.isConfidential && (
                        <Badge variant="destructive">Confidencial</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>Subido el {new Date(doc.uploadDate).toLocaleDateString('es-ES')}</span>
                      {doc.caseNumber && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                            {doc.caseNumber}
                          </span>
                        </>
                      )}
                    </div>
                    {doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {doc.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
