"use client";

import { useState } from "react";
import { Calendar, Clock, Users, MapPin, Plus, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "hearing" | "meeting" | "deadline" | "consultation";
  location?: string;
  participants?: string[];
  caseNumber?: string;
  status: "scheduled" | "completed" | "cancelled";
}

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Audiencia - Caso Civil",
    date: "2025-01-16",
    time: "09:00",
    type: "hearing",
    location: "Juzgado 1ro Civil - Sala 3",
    participants: ["Juan Pérez", "María García"],
    caseNumber: "CASE-2024-001",
    status: "scheduled"
  },
  {
    id: "2",
    title: "Reunión con Cliente",
    date: "2025-01-16", 
    time: "14:30",
    type: "meeting",
    location: "Oficina Principal",
    participants: ["Ana Martínez"],
    caseNumber: "CASE-2024-015",
    status: "scheduled"
  },
  {
    id: "3",
    title: "Entrega de Documentos",
    date: "2025-01-17",
    time: "16:00",
    type: "deadline",
    caseNumber: "CASE-2024-008",
    status: "scheduled"
  },
  {
    id: "4",
    title: "Consulta Inicial",
    date: "2025-01-18",
    time: "10:00",
    type: "consultation",
    location: "Oficina Principal",
    participants: ["Roberto Silva"],
    status: "scheduled"
  }
];

const getEventTypeColor = (type: string) => {
  switch (type) {
    case "hearing": return "bg-red-100 text-red-800 border-red-200";
    case "meeting": return "bg-blue-100 text-blue-800 border-blue-200";
    case "deadline": return "bg-orange-100 text-orange-800 border-orange-200";
    case "consultation": return "bg-green-100 text-green-800 border-green-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getEventTypeLabel = (type: string) => {
  switch (type) {
    case "hearing": return "Audiencia";
    case "meeting": return "Reunión";
    case "deadline": return "Fecha Límite";
    case "consultation": return "Consulta";
    default: return type;
  }
};

const getEventIcon = (type: string) => {
  switch (type) {
    case "hearing": return Calendar;
    case "meeting": return Users;
    case "deadline": return Clock;
    case "consultation": return Users;
    default: return Calendar;
  }
};

export default function CalendarioPage() {
  const [events] = useState<CalendarEvent[]>(mockEvents);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.caseNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || event.type === filterType;
    return matchesSearch && matchesType;
  });

  const todayEvents = filteredEvents.filter(event => event.date === "2025-01-16");
  const upcomingEvents = filteredEvents.filter(event => event.date > "2025-01-16");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendario</h1>
          <p className="text-muted-foreground">
            Gestiona tus citas, audiencias y fechas importantes
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Evento
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <div className="flex-1">
          <Input
            placeholder="Buscar eventos o casos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="hearing">Audiencias</SelectItem>
            <SelectItem value="meeting">Reuniones</SelectItem>
            <SelectItem value="deadline">Fechas Límite</SelectItem>
            <SelectItem value="consultation">Consultas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Today's Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Eventos de Hoy
          </CardTitle>
          <CardDescription>
            {todayEvents.length} eventos programados para hoy
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayEvents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay eventos programados para hoy
            </p>
          ) : (
            <div className="space-y-4">
              {todayEvents.map((event) => {
                const IconComponent = getEventIcon(event.type);
                return (
                  <div key={event.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold truncate">{event.title}</h3>
                        <Badge className={getEventTypeColor(event.type)}>
                          {getEventTypeLabel(event.type)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {event.time}
                        </span>
                        {event.location && (
                          <span className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            {event.location}
                          </span>
                        )}
                        {event.caseNumber && (
                          <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                            {event.caseNumber}
                          </span>
                        )}
                      </div>
                      {event.participants && event.participants.length > 0 && (
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <Users className="mr-1 h-3 w-3" />
                          {event.participants.join(", ")}
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Próximos Eventos
          </CardTitle>
          <CardDescription>
            {upcomingEvents.length} eventos programados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay eventos próximos
            </p>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => {
                const IconComponent = getEventIcon(event.type);
                return (
                  <div key={event.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold truncate">{event.title}</h3>
                        <Badge className={getEventTypeColor(event.type)}>
                          {getEventTypeLabel(event.type)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(event.date).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {event.time}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                          <MapPin className="mr-1 h-3 w-3" />
                          {event.location}
                        </div>
                      )}
                      {event.caseNumber && (
                        <div className="mt-2">
                          <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                            {event.caseNumber}
                          </span>
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
