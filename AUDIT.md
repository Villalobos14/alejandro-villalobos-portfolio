# 1. Stack

| Elemento | Detectado |
|---|---|
| Framework | Next.js `14.2.20` |
| React instalado | `18.3.1` |
| Bundler | Webpack de Next.js; configuración personalizada: no encontrado |
| Router | App Router (`src/app`) |
| Lenguaje | TypeScript; `typescript` instalado `5.7.3` |
| Gestor de paquetes | npm; `package-lock.json` lockfileVersion `3` |
| Versión de Node fijada | no encontrado |
| Node del entorno auditado | `v25.6.0` |

`dependencies` de `package.json`, verbatim:

```json
  "dependencies": {
    "@headlessui/react": "^2.2.0",
    "@heroicons/react": "^2.2.0",
    "@vercel/analytics": "^1.5.0",
    "lenis": "^1.1.21",
    "motion": "^12.4.7",
    "next": "14.2.20",
    "react": "^18",
    "react-dom": "^18"
  },
```

`devDependencies` de `package.json`, verbatim:

```json
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.20",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
```

# 2. Estructura de archivos

```text
.
├── .eslintrc.json
├── .gitignore
├── AUDIT.md
├── README.md
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── 1.png
│   ├── 2.png
│   ├── 3.png
│   ├── 4.png
│   ├── 5.png
│   ├── aty.png
│   ├── behance.png
│   ├── certificate.png
│   ├── dasoftmock.png
│   ├── dribbbble.png
│   ├── first-project.png
│   ├── leadership.png
│   ├── linkedin.png
│   ├── logo.svg
│   ├── me-and-friends.png
│   ├── monogatari.png
│   ├── myself-emoji.svg
│   ├── nissan.png
│   ├── omimm.png
│   ├── ominiocoer.png
│   ├── second-project.png
│   ├── sharing-knowledge.png
│   ├── smooth-images
│   │   ├── 1.png
│   │   ├── 2.png
│   │   ├── 3.png
│   │   ├── 4.png
│   │   ├── 5.png
│   │   ├── 6.png
│   │   ├── 7.png
│   │   ├── 8.png
│   │   ├── 9.png
│   │   └── 10.png
│   ├── storytelling.png
│   └── third-project.png
├── src
│   ├── app
│   │   ├── favicon.ico
│   │   ├── fonts
│   │   │   ├── SF-Bold.woff
│   │   │   ├── SF-Medium.woff
│   │   │   └── SF-Regular.woff
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── projects
│   │       └── page.tsx
│   └── components
│       ├── About.tsx
│       ├── Experience.tsx
│       ├── Footer.tsx
│       ├── Header.tsx
│       ├── Hero.tsx
│       ├── Projects.tsx
│       ├── Skills.tsx
│       ├── SmoothSection.tsx
│       ├── Works.tsx
│       └── ui
│           ├── FooterTitle.tsx
│           ├── Heading.tsx
│           └── Projects.tsx
├── tailwind.config.ts
└── tsconfig.json
```

# 3. Rutas

| Ruta URL / layout | Archivo | Estática o dinámica | Server o client component | Anidación |
|---|---|---|---|---|
| Layout raíz | `src/app/layout.tsx` | Aplica a todas las rutas | Server | raíz |
| `/` | `src/app/page.tsx` | Estática | Server | bajo layout raíz |
| `/projects` | `src/app/projects/page.tsx` | Estática | Client (`'use client'`) | bajo layout raíz |

- Rutas dinámicas (`[param]`): no encontrado.
- Layouts anidados: no encontrado.

# 4. Configuración de estilos

`tailwind.config.ts`, verbatim:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sf)'],
      }
    },
    colors: {
      'primary': '#0C0D0E',
      'secondary': '#3DD964',
      'white': '#ffffff',
      'black': '#000000',
      'gray': '#8C8C8C',
    },
  },
  plugins: [],
};
export default config;
```

`src/app/globals.css`, verbatim:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

::selection {
  background-color: #000000;
  color: #fff;
}
```

Custom properties:

| Custom property | Archivo | Definición |
|---|---|---|
| `--font-sf` | `src/app/layout.tsx` | configurada mediante `localFont({ variable: '--font-sf' })` |

Fuentes:

| Método | Familia/identificador | Pesos | Archivos | Declaración |
|---|---|---|---|---|
| `next/font/local` | `sanFrancisco`; variable Tailwind `--font-sf` | `400`, `500`, `700` | `SF-Regular.woff`, `SF-Medium.woff`, `SF-Bold.woff` | `src/app/layout.tsx` |
| `@font-face` manual | no encontrado | no encontrado | no encontrado | no encontrado |
| `<link>` externo | no encontrado | no encontrado | no encontrado | no encontrado |

# 5. Tokens en uso real

Alcance: 15 archivos `.tsx`; 752 tokens extraídos de `className`.

## Colores: valores literales en JSX/TSX

| Valor | Frecuencia |
|---|---:|
| `#555555` | 21 |
| `#7b7b7b` | 1 |
| `#d2cfcf` | 1 |
| `#216d34` | 1 |
| `#0d0d0d` | 1 |
| Valores `rgb(...)` | 0 |
| Valores `hsl(...)` | 0 |

## Colores: clases Tailwind en JSX/TSX

| Clase | Frecuencia |
|---|---:|
| `text-white` | 17 |
| `text-gray` | 11 |
| `text-secondary` | 6 |
| `text-black` | 6 |
| `bg-secondary` | 6 |
| `border-gray-300` | 4 |
| `border-white` | 4 |
| `bg-primary` | 3 |
| `text-gray-500` | 3 |
| `text-gray-400` | 2 |
| `hover:text-white` | 2 |
| `text-gray-300` | 2 |
| `border-b-dim-gray` | 1 |
| `text-text` | 1 |
| `bg-black/10` | 1 |
| `hover:bg-black` | 1 |
| `focus:ring-white` | 1 |
| `hover:bg-secondary` | 1 |
| `bg-green-400` | 1 |
| `text-[#7b7b7b]` | 1 |
| `border-gray-700` | 1 |
| `text-[#d2cfcf]` | 1 |
| `hover:bg-[#216d34]` | 1 |
| `hover:text-black` | 1 |
| `bg-[#0d0d0d]` | 1 |

## Tamaños de texto

| Clase | Frecuencia |
|---|---:|
| `text-3xl` | 8 |
| `text-4xl` | 7 |
| `text-xl` | 6 |
| `text-lg` | 6 |
| `text-sm` | 5 |
| `2xl:text-5xl` | 3 |
| `2xl:text-3xl` | 3 |
| `2xl:text-2xl` | 3 |
| `2xl:text-xl` | 3 |
| `text-base` | 3 |
| `2xl:text-6xl` | 1 |
| `xl:text-h6` | 1 |
| `2xl:text-h5` | 1 |
| `xl:text-h7` | 1 |
| `2xl:text-h6` | 1 |
| `xl:text-7xl` | 1 |
| `md:text-5xl` | 1 |
| `text-5xl` | 1 |

## Anchos de contenedor y widths

| Clase | Frecuencia |
|---|---:|
| `max-w-7xl` | 1 |
| `max-w-5xl` | 1 |
| `w-full` | 21 |
| `md:w-1/2` | 8 |
| `w-fit` | 2 |
| `w-56` | 1 |
| `xl:w-96` | 1 |
| `w-auto` | 1 |
| `w-1/4` | 1 |
| `min-w-[250px]` | 1 |
| `w-screen` | 1 |

## Top 10 de gap, padding y margin

| Clase | Frecuencia |
|---|---:|
| `mt-3` | 10 |
| `py-1` | 8 |
| `mt-12` | 7 |
| `gap-x-8` | 6 |
| `md:mt-8` | 6 |
| `px-4` | 6 |
| `gap-y-4` | 5 |
| `mt-4` | 5 |
| `pt-0` | 5 |
| `p-8` | 4 |

# 6. Componentes

Clasificación por directiva del archivo; los componentes server importados por una página client forman parte de ese client boundary.

| Nombre | Ruta del archivo | Qué hace | Props con tipos | Dónde se usa | Server o client |
|---|---|---|---|---|---|
| `RootLayout` | `src/app/layout.tsx` | Layout HTML raíz, fuente y smooth scroll | `Readonly<{ children: React.ReactNode }>` | App Router | Server |
| `Home` | `src/app/page.tsx` | Compone la página principal | sin props | ruta `/` | Server |
| `Page` | `src/app/projects/page.tsx` | Compone el catálogo y reinicia scroll | sin props | ruta `/projects` | Client |
| `Header` | `src/components/Header.tsx` | Navegación desktop/móvil por secciones | sin props | `/`, `/projects` | Client |
| `Hero` | `src/components/Hero.tsx` | Encabezado principal y badges | sin props | `src/app/page.tsx` | Server |
| `Projects` | `src/components/Projects.tsx` | Muestra tres trabajos seleccionados | sin props | `src/app/page.tsx` | Server |
| `Home` (`SmoothSection`) | `src/components/SmoothSection.tsx` | Galería parallax de cuatro columnas | sin props | `src/app/page.tsx` como `SmoothSection` | Client |
| `Column` | `src/components/SmoothSection.tsx` | Renderiza una columna animada de imágenes | `ColumnProps` | uso interno en `SmoothSection.tsx` | Client |
| `Experience` | `src/components/Experience.tsx` | Lista experiencia laboral y certificado | sin props | `src/app/page.tsx` | Server |
| `SkillsSection` | `src/components/Skills.tsx` | Agrupa skills en cuatro categorías | sin props | `src/app/page.tsx` como `Skills` | Server |
| `SkillPill` | `src/components/Skills.tsx` | Renderiza una skill como pill | `{ skill: string }` | uso interno en `Skills.tsx` | Server |
| `About` | `src/components/About.tsx` | Muestra cuatro bloques biográficos | sin props | `src/app/page.tsx` | Server |
| `Footer` | `src/components/Footer.tsx` | Muestra wordmark y enlaces externos | sin props | `/`, `/projects` | Server por defecto; dentro del boundary client en `/projects` |
| `Works` | `src/components/Works.tsx` | Compone el grid completo de proyectos | sin props | `src/app/projects/page.tsx` | Server por defecto; dentro del boundary client en `/projects` |
| `Projects` (UI) | `src/components/ui/Projects.tsx` | Tarjeta reutilizable de proyecto | `ProjectsProps` | `src/components/Works.tsx` | Server por defecto; dentro del boundary client en `/projects` |
| `Heading` | `src/components/ui/Heading.tsx` | Renderiza título de sección | `{ title: string }` | `src/components/Works.tsx` | Server por defecto; dentro del boundary client en `/projects` |
| `FooterTitle` | `src/components/ui/FooterTitle.tsx` | Renderiza el wordmark SVG del footer | sin props | `src/components/Footer.tsx` | Server por defecto |

- Componentes exportados pero nunca importados: no encontrado.
- `Column` y `SkillPill`: no se importan; son componentes internos y sí se usan en su archivo.

# 7. Datos y contenido

| Contenido | Forma | Archivo |
|---|---|---|
| Proyectos destacados | JSX hardcodeado | `src/components/Projects.tsx` |
| Catálogo de proyectos | Props hardcodeadas en siete instancias | `src/components/Works.tsx` |
| Tipo de proyecto | Interface TypeScript | `src/components/ui/Projects.tsx` |
| JSON | no encontrado | no encontrado |
| MDX | no encontrado | no encontrado |
| CMS | no encontrado | no encontrado |

Definición `ProjectsProps`, verbatim:

```ts
interface ProjectsProps {
  name: string;
  img: StaticImageData
  alt: string;
  link: string;
  description: string;
}
```

| Métrica | Cantidad |
|---|---:|
| Instancias en el catálogo `/projects` | 7 |
| Instancias destacadas en `/` | 3 |
| Nombres únicos en el catálogo | 6 |
| Páginas internas de case study | 0 |
| Proyecto rotulado explícitamente como “Case Study” | 1 (`Ominio Case Study`, enlace externo a Figma) |

# 8. Animación

| Librería instalada | Versión instalada | Inicialización | Archivos que la usan | Efectos |
|---|---:|---|---|---|
| `lenis` | `1.1.21` | `<ReactLenis root options={{ lerp: 0.5, duration: 0.8 }}>` | `src/app/layout.tsx` | smooth scroll global |
| `motion` | `12.4.7` | no encontrado | no encontrado por ese nombre de paquete | no encontrado |
| `framer-motion` (transitiva de `motion`) | `12.4.7` | hooks dentro del componente | `src/components/SmoothSection.tsx` | parallax ligado al scroll con `useScroll`, `useTransform` y `motion.div` |

- Smooth scroll: montado en `src/app/layout.tsx`, alrededor de `{children}`.
- Scroll suave nativo: `scrollIntoView({ behavior: "smooth" })` en `src/components/Header.tsx`.
- Hover/transiciones CSS: `About.tsx`, `Experience.tsx`, `Footer.tsx`, `Header.tsx`, `Projects.tsx`, `Skills.tsx`, `ui/Projects.tsx`.
- Animaciones de entrada: no encontrado.
- Cursor animado: no encontrado.
- Transiciones de página: no encontrado.
- GSAP: no encontrado.
- Plugins GSAP registrados: no encontrado.

# 9. Assets

Contenido de `/public`:

| Tipo | Archivos | Peso total |
|---|---:|---:|
| Imagen PNG | 32 | 80,784,086 bytes (77.04 MiB) |
| SVG | 2 | 175,719 bytes (0.17 MiB) |
| Video | 0 | 0 bytes |
| Fuente | 0 | 0 bytes |
| Total | 34 | 80,959,805 bytes (77.21 MiB) |

Diez archivos más pesados:

| # | Archivo | Tamaño |
|---:|---|---:|
| 1 | `public/first-project.png` | 5,305,968 bytes (5.06 MiB) |
| 2 | `public/aty.png` | 4,495,353 bytes (4.29 MiB) |
| 3 | `public/smooth-images/5.png` | 4,421,126 bytes (4.22 MiB) |
| 4 | `public/smooth-images/4.png` | 4,242,624 bytes (4.05 MiB) |
| 5 | `public/me-and-friends.png` | 4,024,807 bytes (3.84 MiB) |
| 6 | `public/smooth-images/8.png` | 3,768,404 bytes (3.59 MiB) |
| 7 | `public/ominiocoer.png` | 3,585,034 bytes (3.42 MiB) |
| 8 | `public/sharing-knowledge.png` | 3,269,575 bytes (3.12 MiB) |
| 9 | `public/nissan.png` | 3,214,345 bytes (3.07 MiB) |
| 10 | `public/storytelling.png` | 3,181,223 bytes (3.03 MiB) |

| Renderizado de imágenes | Resultado |
|---|---|
| Archivos que importan `next/image` | 6 |
| Apariciones JSX de `<Image` | 11 |
| Apariciones JSX de `<img` directo | 0 |

# 10. Responsive

- Breakpoints personalizados en `tailwind.config.ts`: no encontrado.
- Breakpoints efectivos por defecto de Tailwind CSS 3.4.17:

| Prefijo | Min-width |
|---|---:|
| `sm:` | `640px` |
| `md:` | `768px` |
| `lg:` | `1024px` |
| `xl:` | `1280px` |
| `2xl:` | `1536px` |

Prefijos responsive usados:

| Prefijo | Frecuencia |
|---|---:|
| `md:` | 46 |
| `2xl:` | 16 |
| `sm:` | 10 |
| `xl:` | 8 |
| `lg:` | 1 |

Bloques desktop/mobile duplicados mediante visibilidad:

| Archivo | Patrón | Frecuencia | Uso |
|---|---|---:|---|
| `src/components/Header.tsx` | `sm:hidden` | 2 | botón/panel móvil |
| `src/components/Header.tsx` | `hidden` | 2 | navegación desktop e icono cerrado |
| `src/components/Header.tsx` | `sm:block` | 1 | navegación desktop |
| `src/components/Header.tsx` | `block` | 2 | icono e ítems móviles |
| `src/components/Header.tsx` | `group-data-open:hidden` | 1 | alternancia de icono |
| `src/components/Header.tsx` | `group-data-open:block` | 1 | alternancia de icono |

# 11. Estado del proyecto

## TypeScript

Comando ejecutado: `npx tsc --noEmit`. Código de salida: `0`.

Salida completa:

```text
npm warn Unknown env config "devdir". This will stop working in the next major version of npm.
```

Errores de TypeScript: no encontrado.

## Lint

Comando ejecutado desde `package.json`: `npm run lint`. Código de salida: `0`.

Salida completa:

```text
npm warn Unknown env config "devdir". This will stop working in the next major version of npm.

> villaportfolio@0.1.0 lint
> next lint

✔ No ESLint warnings or errors
npm notice
npm notice New minor version of npm available! 11.8.0 -> 11.19.1
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.19.1
npm notice To update run: npm install -g npm@11.19.1
npm notice
```

## Dependencias instaladas pero nunca importadas

Imports literales buscados en `src/**/*.{ts,tsx}`:

| Dependencia directa | Import literal | Nota factual |
|---|---|---|
| `@vercel/analytics` | no encontrado | instalada en `package.json` |
| `motion` | no encontrado | `framer-motion`, dependencia transitiva, sí se importa |
| `react-dom` | no encontrado | dependencia runtime de Next/React |

## TODOs, FIXMEs y código comentado

| Elemento | Resultado |
|---|---|
| `TODO` en código fuente | no encontrado |
| `FIXME` en código fuente | no encontrado |
| Bloques comentados grandes | no encontrado |
| Código comentado | una asignación `href` en `src/components/Projects.tsx`; una asignación `link` en `src/components/Works.tsx` |
| Comentarios JSX | encabezados breves de sección en `Hero.tsx` y `Experience.tsx` |

## Deploy y CI

| Archivo/configuración | Resultado |
|---|---|
| `vercel.json` | no encontrado |
| `netlify.toml` | no encontrado |
| `Dockerfile` | no encontrado |
| `.github/workflows` | no encontrado |
| Otra configuración CI | no encontrado |

## Tests y entorno

| Elemento | Resultado |
|---|---|
| Archivos `*.test.*` o `*.spec.*` | no encontrado |
| Script `test` | no encontrado |
| Configuración Jest/Vitest/Playwright/Cypress | no encontrado |
| Archivos `.env*` | no encontrado |
| Referencias `process.env`, `import.meta.env` o `NEXT_PUBLIC_*` | no encontrado |
| Llaves de entorno requeridas | no encontrado |

# 12. Resumen en 10 bullets

- Es un portfolio personal construido con Next.js 14.2.20, React 18 y TypeScript.
- Usa App Router con dos rutas: `/` y `/projects`.
- La ruta `/` es un Server Component y `/projects` declara `'use client'`.
- La interfaz usa Tailwind CSS 3.4.17 con cinco colores configurados.
- La fuente local carga tres archivos SF en pesos 400, 500 y 700.
- El contenido de proyectos está hardcodeado en componentes TSX.
- El catálogo contiene siete instancias de proyecto y seis nombres únicos.
- La animación usa Lenis para smooth scroll y Framer Motion para una galería parallax.
- El directorio `/public` contiene 34 assets con un peso total de 80,959,805 bytes.
- TypeScript y ESLint terminan con código 0; no hay tests, CI ni variables de entorno detectadas.
