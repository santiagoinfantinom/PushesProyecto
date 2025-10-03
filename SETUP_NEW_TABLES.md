# Configuración de Nuevas Tablas en Supabase

Este documento contiene las instrucciones para agregar las nuevas tablas de `prompts` e `ideas` a tu base de datos de Supabase.

## Instrucciones

1. **Accede a tu proyecto de Supabase**
   - Ve a [https://supabase.com](https://supabase.com)
   - Inicia sesión y selecciona tu proyecto

2. **Abre el Editor SQL**
   - En el menú lateral, haz clic en "SQL Editor"
   - Haz clic en "New Query"

3. **Ejecuta el siguiente script SQL**

Copia y pega el contenido del archivo `supabase/schema.sql` completo, o ejecuta solo las nuevas secciones:

```sql
-- ============================================
-- PROMPTS TABLE
-- ============================================
create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  content text not null,
  category text,
  is_favorite boolean default false,
  tags text[]
);

-- Enable RLS
alter table public.prompts enable row level security;

-- Policies for prompts
drop policy if exists "Allow read prompts" on public.prompts;
create policy "Allow read prompts" on public.prompts for select using (true);

drop policy if exists "Allow insert prompts" on public.prompts;
create policy "Allow insert prompts" on public.prompts for insert with check (true);

drop policy if exists "Allow update prompts" on public.prompts;
create policy "Allow update prompts" on public.prompts for update using (true);

drop policy if exists "Allow delete prompts" on public.prompts;
create policy "Allow delete prompts" on public.prompts for delete using (true);

-- ============================================
-- IDEAS/PROJECTS TABLE
-- ============================================
create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  description text not null,
  status text default 'idea',
  priority text default 'medium',
  tags text[]
);

-- Enable RLS
alter table public.ideas enable row level security;

-- Policies for ideas
drop policy if exists "Allow read ideas" on public.ideas;
create policy "Allow read ideas" on public.ideas for select using (true);

drop policy if exists "Allow insert ideas" on public.ideas;
create policy "Allow insert ideas" on public.ideas for insert with check (true);

drop policy if exists "Allow update ideas" on public.ideas;
create policy "Allow update ideas" on public.ideas for update using (true);

drop policy if exists "Allow delete ideas" on public.ideas;
create policy "Allow delete ideas" on public.ideas for delete using (true);
```

4. **Ejecuta el script**
   - Haz clic en el botón "Run" o presiona `Ctrl/Cmd + Enter`
   - Verifica que no haya errores en la consola

5. **Verifica las tablas**
   - Ve a "Table Editor" en el menú lateral
   - Deberías ver las nuevas tablas `prompts` e `ideas`

## Estructura de las Tablas

### Tabla `prompts`
- `id`: UUID (Primary Key)
- `created_at`: Timestamp con timezone
- `title`: Texto (Título del prompt)
- `content`: Texto (Contenido del prompt)
- `category`: Texto opcional (Categoría)
- `is_favorite`: Boolean (Marcado como favorito)
- `tags`: Array de texto (Tags asociados)

### Tabla `ideas`
- `id`: UUID (Primary Key)
- `created_at`: Timestamp con timezone
- `title`: Texto (Título de la idea)
- `description`: Texto (Descripción de la idea)
- `status`: Texto (Estado: 'idea', 'in_progress', 'completed', 'on_hold')
- `priority`: Texto (Prioridad: 'low', 'medium', 'high')
- `tags`: Array de texto (Tags asociados)

## Notas de Seguridad

⚠️ **IMPORTANTE**: Las políticas RLS actuales permiten acceso completo anónimo (`using (true)`). 

Para producción, considera implementar autenticación y políticas más restrictivas:

```sql
-- Ejemplo para requerir autenticación
create policy "Allow read for authenticated users" 
on public.prompts for select 
using (auth.role() = 'authenticated');
```

## Próximos Pasos

Una vez creadas las tablas:

1. Asegúrate de que tu archivo `.env.local` tenga las credenciales correctas de Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   ```

2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Accede a la aplicación en `http://localhost:3000`

4. Prueba las nuevas páginas:
   - Dashboard: `/`
   - Pushes: `/pushes`
   - Prompt Manager: `/prompts`
   - Ideas/Proyectos: `/ideas`

## Características Implementadas

### 🚀 Seguimiento de Pushes
- Registra commits de GitHub
- Visualiza estadísticas y gráficos semanales
- Búsqueda por fecha
- Historial completo

### 💡 Prompt Manager
- Guarda prompts útiles para IA
- Marca favoritos
- Organiza por categorías
- Sistema de tags
- Búsqueda y filtros avanzados

### ✨ Ideas/Proyectos
- Vista de cartas coloridas
- Estados: Idea, En Progreso, Completado, En Pausa
- Prioridades: Baja, Media, Alta
- Cambio rápido de estado
- Sistema de tags
- Filtros por estado y prioridad

### 📊 Dashboard
- Resumen de toda la actividad
- Estadísticas en tiempo real
- Acceso rápido a todas las secciones
- Vista previa de elementos recientes

