# ReportingApp 📊

**App de productividad personal** construida con Next.js 15, TypeScript, Supabase y Tailwind CSS.

🔗 **App en producción**: https://pushes-proyecto-q6lt.vercel.app/

## ✨ Características

### 📈 Dashboard
- Vista general de toda tu actividad
- Estadísticas en tiempo real de pushes, prompts e ideas
- Acceso rápido a todas las secciones
- Resumen visual de proyectos activos

### 🚀 Seguimiento de Pushes
- Registra commits de GitHub con enlaces directos
- Visualiza estadísticas y gráficos semanales
- Búsqueda por fecha
- Historial completo con timestamps

### 💡 Prompt Manager
- Guarda prompts útiles para IA y desarrollo
- Marca prompts como favoritos
- Organiza por categorías personalizadas
- Sistema de tags flexible
- Búsqueda y filtros avanzados
- Edición en línea

### ✨ Ideas/Proyectos
- Vista de cartas coloridas y atractivas
- Estados: Idea, En Progreso, Completado, En Pausa
- Prioridades: Baja, Media, Alta
- Cambio rápido de estado mediante dropdown
- Sistema de tags para organización
- Filtros por estado, prioridad y búsqueda de texto

## 🛠️ Tecnologías

- **Framework**: Next.js 15 con App Router
- **Lenguaje**: TypeScript
- **Base de datos**: Supabase (PostgreSQL)
- **Estilos**: Tailwind CSS 4
- **Gráficos**: Recharts
- **Validación**: Zod

## 📋 Requisitos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com)

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
cd ReportingApp/reporting-app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Obtén tus credenciales:
   - URL del proyecto
   - Anon/Public Key
   - (Opcional) Service Role Key

3. Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### 4. Crear tablas en Supabase

1. Ve al **SQL Editor** en tu proyecto de Supabase
2. Ejecuta el script completo que se encuentra en `supabase/schema.sql`

Para instrucciones detalladas, consulta [SETUP_NEW_TABLES.md](./SETUP_NEW_TABLES.md)

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/           # API routes
│   │   ├── pushes/    # CRUD de pushes
│   │   ├── prompts/   # CRUD de prompts
│   │   └── ideas/     # CRUD de ideas
│   ├── pushes/        # Página de seguimiento de pushes
│   ├── prompts/       # Página de prompt manager
│   ├── ideas/         # Página de ideas/proyectos
│   ├── layout.tsx     # Layout principal con navegación
│   └── page.tsx       # Dashboard principal
├── components/
│   ├── Navigation.tsx # Barra de navegación
│   ├── StatsCards.tsx # Tarjetas de estadísticas
│   └── WeeklyChart.tsx # Gráfico semanal
├── lib/
│   └── supabase/      # Cliente de Supabase
└── types/
    ├── push.ts        # Tipos para pushes
    ├── prompt.ts      # Tipos para prompts
    └── idea.ts        # Tipos para ideas
```

## 🎯 Uso

### Dashboard
- Visualiza un resumen completo de tu actividad
- Accede rápidamente a cada sección
- Ve tus últimos pushes, prompts favoritos e ideas activas

### Seguimiento de Pushes
1. Ingresa el link del commit de GitHub
2. Agrega un comentario descriptivo
3. Guarda y visualiza en el historial
4. Busca por fecha específica
5. Elimina pushes antiguos si es necesario

### Prompt Manager
1. Crea un nuevo prompt con título y contenido
2. Asigna una categoría (opcional)
3. Agrega tags para mejor organización
4. Marca como favorito para acceso rápido
5. Edita o elimina prompts existentes
6. Usa filtros para encontrar prompts específicos

### Ideas/Proyectos
1. Agrega una nueva idea con título y descripción
2. Asigna un estado inicial (Idea por defecto)
3. Define la prioridad (Baja, Media, Alta)
4. Agrega tags relacionados
5. Cambia el estado según progresas
6. Visualiza en cartas coloridas según estado
7. Filtra por estado, prioridad o búsqueda

## 🔒 Seguridad

⚠️ **IMPORTANTE**: Las políticas RLS actuales permiten acceso completo anónimo para facilitar el desarrollo. 

**Para producción**, implementa autenticación y actualiza las políticas:

```sql
-- Ejemplo de política restrictiva
create policy "Allow read for authenticated users" 
on public.prompts for select 
using (auth.role() = 'authenticated');
```

## 🚢 Deploy en Vercel

1. Sube tu código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Configura las variables de entorno
4. Deploy automático

## 📝 Notas

- La aplicación usa Server Components y Client Components según sea necesario
- Las APIs usan validación con Zod
- Row Level Security (RLS) está habilitado en todas las tablas
- Los datos se ordenan por fecha de creación (más recientes primero)

## 🤝 Contribuciones

Este es un proyecto personal, pero las sugerencias son bienvenidas.

## 📄 Licencia

MIT
# Updated Sun Oct  5 11:35:15 CEST 2025
