# Reporting App

El app se encuentra en : https://pushes-proyecto-q6lt.vercel.app/
App Next.js + TypeScript con Supabase para registrar pushes (link de GitHub + comentario) y ver historial.

## Requisitos
- Node.js 18+
- Cuenta y proyecto en Supabase

## Configuración
1. Crear proyecto en Supabase y obtener:
   - URL del proyecto
   - ANON public key
   - (Opcional) Service Role Key
2. Variables de entorno (crear `.env.local` en la raíz):
```
NEXT_PUBLIC_SUPABASE_URL=... 
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# Opcional para API server-side
SUPABASE_SERVICE_ROLE_KEY=...
```
3. Crear tabla en la base de datos. En el dashboard de Supabase (SQL editor) ejecutar `supabase/schema.sql`:

```
-- Contenido en supabase/schema.sql
```

## Ejecutar
```
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Uso
- Completa el "Link de GitHub" del commit o PR
- Escribe un comentario del cambio
- Guarda y verás el registro en el historial

## Notas
- Las policies incluidas permiten leer e insertar sin autenticación. Ajusta según tus necesidades de seguridad.
