# LexFirm - Sistema de Gestión de Bufete de Abogados

## 📋 Descripción del Proyecto

LexFirm es una aplicación web moderna y completa para la gestión de bufetes de abogados, desarrollada con **Next.js 15**, **React 19**, **TypeScript** y **Tailwind CSS**. El sistema permite la gestión integral de casos legales, clientes, documentos y procesos administrativos.

## 🚀 Características Principales

### 🔐 Sistema de Autenticación Multi-Rol
- **Login Unificado** con selección de rol dinámico
- Autenticación JWT con tokens de refresco
- **3 Tipos de Usuario:**
  - 👨‍💼 **Administrador**: Gestión completa del sistema
  - ⚖️ **Abogado**: Área de trabajo profesional  
  - 👤 **Cliente**: Portal de seguimiento de casos

### 🏢 Panel de Administración (`/dashboard`)
- Dashboard completo con métricas del bufete
- Gestión de abogados, clientes y casos
- Reportes y estadísticas
- Configuración del sistema

### ⚖️ Área de Trabajo del Abogado (`/area-de-trabajo`)
- **📅 Calendario**: Gestión de audiencias, reuniones y fechas límite
- **📁 Mis Casos**: Lista completa de casos activos y cerrados
- **👥 Mis Clientes**: Directorio de clientes asignados
- **📄 Documentos**: Biblioteca de documentos legales organizados
- **⚙️ Configuración**: Perfil profesional y preferencias

### 👤 Portal del Cliente (`/perfil`)
- Dashboard personal del cliente
- **📋 Mis Casos**: Seguimiento de casos en tiempo real
- **💰 Pagos**: Historial y gestión de pagos
- **📞 Contratar**: Solicitud de servicios legales
- **⚙️ Configuración**: Gestión de perfil personal

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15.2.4** con App Router
- **React 19** con Hooks modernos
- **TypeScript 5** para tipado estático
- **Tailwind CSS 4** para estilos responsive
- **shadcn/ui** componentes de interfaz modernos
- **Radix UI** primitivos accesibles
- **Lucide React** iconografía consistente

### Backend Integration
- **Axios** para llamadas a API
- **JWT Decode** para manejo de tokens
- **.NET Web API** como backend (C#)
- **Entity Framework** para base de datos

### Herramientas de Desarrollo
- **ESLint** para linting de código
- **PostCSS** para procesamiento de CSS
- **TypeScript** configuración estricta

## 📁 Estructura del Proyecto

```
buffet-app/
├── 📁 app/                          # App Router de Next.js
│   ├── 📁 auth/                     # Autenticación
│   │   └── 📁 login/                # Login unificado
│   ├── 📁 dashboard/                # Panel Administrador
│   │   ├── 📁 history/              # Historial
│   │   └── 📁 starred/              # Marcados
│   ├── 📁 area-de-trabajo/          # Panel Abogado
│   │   ├── 📁 calendario/           # Calendario de eventos
│   │   ├── 📁 casos/                # Gestión de casos
│   │   ├── 📁 clientes/             # Directorio de clientes
│   │   ├── 📁 documentos/           # Biblioteca de documentos
│   │   └── 📁 configuracion/        # Configuración personal
│   ├── 📁 perfil/                   # Portal Cliente
│   │   ├── 📁 casos/                # Seguimiento de casos
│   │   ├── 📁 pagos/                # Gestión de pagos
│   │   ├── 📁 contratar/            # Contratación de servicios
│   │   └── 📁 configuracion/        # Configuración personal
│   ├── 📄 about/page.tsx            # Página "Acerca de"
│   ├── 📄 blog/page.tsx             # Blog legal
│   ├── 📄 contact/page.tsx          # Contacto
│   ├── 📄 services/page.tsx         # Servicios legales
│   ├── 📄 layout.tsx                # Layout principal
│   └── 📄 page.tsx                  # Página de inicio
├── 📁 components/                   # Componentes React
│   ├── 📁 ui/                       # Componentes base (shadcn/ui)
│   ├── 📁 forms/                    # Formularios especializados
│   ├── 📁 animate-ui/               # Componentes animados
│   ├── 📄 app-sidebar.tsx           # Sidebar principal
│   ├── 📄 header.tsx                # Encabezado
│   └── 📄 footer.tsx                # Pie de página
├── 📁 hooks/                        # React Hooks personalizados
│   ├── 📄 useAuth.ts                # Hook de autenticación
│   └── 📄 use-mobile.ts             # Hook de responsive
├── 📁 lib/                          # Utilidades y configuración
│   ├── 📄 axios.ts                  # Configuración de Axios
│   └── 📄 utils.ts                  # Utilidades generales
├── 📁 Models/                       # Modelos de datos (C#)
└── 📁 public/                       # Recursos estáticos
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js 18+**
- **npm** o **yarn**
- **Backend .NET** configurado y ejecutándose

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/EduardoVal3/buffet-app.git
cd buffet-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env.local
NEXT_PUBLIC_API_URL=https://localhost:7037
NEXT_PUBLIC_API_BASE_URL=https://localhost:7037/api
JWT_SECRET=your-super-secret-jwt-key-here
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Compilar para producción**
```bash
npm run build
npm start
```

## 🔐 Sistema de Autenticación

### Flujo de Autenticación
1. **Login Unificado**: Un solo formulario para todos los roles
2. **Selección de Rol**: Cliente, Abogado o Administrador
3. **Validación JWT**: Tokens con información de rol y permisos
4. **Redirección Automática**: Según el rol del usuario
5. **Middleware de Protección**: Rutas protegidas por rol

### Roles y Permisos
- **👨‍💼 Administrador**: Acceso completo al sistema
- **⚖️ Abogado**: Gestión de casos y clientes asignados
- **👤 Cliente**: Seguimiento de sus propios casos

## 📱 Características de UI/UX

### Diseño Responsive
- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: Adaptación automática a tablets y desktop
- **Touch-Friendly**: Interfaces táctiles optimizadas

### Temas y Accesibilidad
- **Modo Oscuro/Claro**: Cambio automático según preferencias del sistema
- **Componentes Accesibles**: Basados en Radix UI
- **Navegación por Teclado**: Soporte completo
- **Lectores de Pantalla**: Compatibilidad total

### Animaciones y Interacciones
- **Transiciones Suaves**: Micro-interacciones elegantes
- **Loading States**: Estados de carga informativos
- **Feedback Visual**: Respuestas inmediatas a acciones

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo

# Producción
npm run build        # Compilar para producción
npm start           # Servidor de producción

# Calidad de Código
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Corregir errores automáticamente

# Utilidades
npm run type-check   # Verificar tipos TypeScript
```

## 🌟 Próximas Funcionalidades

- [ ] **📊 Analytics Avanzados**: Métricas detalladas del bufete
- [ ] **🔔 Notificaciones Push**: Alertas en tiempo real
- [ ] **📧 Sistema de Emails**: Comunicación automatizada
- [ ] **💾 Exportación de Datos**: PDF, Excel, Word
- [ ] **🔍 Búsqueda Avanzada**: Filtros complejos
- [ ] **📱 App Móvil**: React Native companion
- [ ] **🤖 Chat IA**: Asistente legal inteligente
- [ ] **📋 Templates**: Plantillas de documentos legales

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu funcionalidad (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo de Desarrollo

- **Eduardo Valladares** - Desarrollador Full-Stack Principal
- **UNAH** - Universidad Nacional Autónoma de Honduras

## 📞 Soporte

Para soporte técnico o consultas:
- 📧 Email: eduardo.valladares@unah.hn
- 🐛 Issues: [GitHub Issues](https://github.com/EduardoVal3/buffet-app/issues)

---

### 🎯 Estado del Proyecto: ✅ COMPLETADO

**Última Actualización:** Enero 2025  
**Versión:** 1.0.0  
**Estado:** Producción Ready

---

*Desarrollado con ❤️ para la transformación digital del sector legal hondureño*
