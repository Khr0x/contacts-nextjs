# Contacts App

Aplicacion web para gestionar contactos y organizaciones, construida con Next.js 16.

## Acerca del proyecto

Esta aplicacion permite a los usuarios autenticarse, crear organizaciones y gestionar contactos dentro de cada organizacion. Es un proyecto full-stack que utiliza Next.js como framework principal con autenticacion integrada mediante better-auth.

## Stack tecnologico

- **Framework:** Next.js 16.2.1 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS 4
- **UI Components:** shadcn/ui + Radix UI
- **Formularios:** React Hook Form + Zod
- **Autenticacion:** better-auth
- **Icons:** hugeicons

## Requisitos previos

- Node.js 20+
- [Bun](https://bun.sh) (recomendado) o npm/yarn/pnpm

## Instalacion de Bun (si no tienes bun)

### macOS

```bash
curl -fsSL https://bun.sh/install | bash
```

### Linux

```bash
curl -fsSL https://bun.sh/install | bash
```

### Windows

```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

### Usando npm

```bash
npm install -g bun
```

Verifica la instalacion:

```bash
bun --version
```

## Instalacion del proyecto

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd contacts-nextjs
```

2. Instala las dependencias:

```bash
bun install
# o
npm install
```

3. Configura las variables de entorno:

```bash
cp .env.example .env.local
```

4. Edita `.env.local` y configura la URL del backend si es necesario.

## Uso

### Desarrollo

Ejecuta el servidor de desarrollo:

```bash
bun dev
# o
npm run dev
```

La aplicacion estara disponible en [http://localhost:3001](http://localhost:3001).

### Produccion

```bash
bun build
bun start
# o
npm run build
npm run start
```

## Estructura del proyecto

```
├── pages/              # Paginas de la aplicacion (Next.js Pages Router)
├── components/         # Componentes React
├── app/                # App Router (si se usa)
├── styles/             # Estilos globales
└── .env.local          # Variables de entorno (no committed)
```

## Scripts disponibles

- `bun dev` - Inicia el servidor de desarrollo
- `bun build` - Construye la aplicacion para produccion
- `bun start` - Inicia el servidor de produccion
- `bun lint` - Ejecuta el linter

## Variables de entorno

Ver `.env.example` para las variables requeridas.
