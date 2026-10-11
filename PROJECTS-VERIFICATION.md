# /projects — Fase 3b

Implementación contrastada con el frame `134:1887` de Ominio, página “final version”.
Rama: `redesign-pf27`. Verificación: 11 de octubre de 2026.

## Archivos y bloques

- Assets: `public/projects/`, con cinco SVG completos, Ominio, Monogatari,
  cuatro miniaturas del log y las tres imágenes originales de Explorations.
  La procedencia de cada asset está en `public/projects/README.md`.
  Commit: `0e662a0`.
- Profesional: `src/lib/projects.ts`, `src/components/projects/ProfessionalWork.tsx`
  y `ProjectSection.tsx`. Los títulos, descripciones, metadatos y rutas provienen
  de los registros existentes; se agrega Dasoft y la selección de portadas.
  Commit: `cbbfb52`.
- Log: `src/lib/side-projects.ts` y `src/components/projects/SideProjectsLog.tsx`.
  Cinco registros, filtros reales y acordeón accesible con altura animada.
  Commit: `79a2361`.
- Integración: `src/app/projects/page.tsx`, `src/components/projects/ProjectsLog.tsx`
  y este reporte. Monta PageShell y cierra con tres enlaces de `lib/links.ts`.

`Works.tsx` y `ui/Projects.tsx` se conservan como componentes legacy, fuera de esta
ruta. No se modificaron el Home, el footer, el Dock ni las animaciones compartidas.

## Build y lint

- `npm run build`: correcto, 15 páginas generadas; `/projects` estática.
- `npm run lint`: correcto, sin advertencias nuevas.
- Advertencias previas: `<img>` en `HomePersonal.tsx:78` y `HomeTimeline.tsx:102`.
- El build también informa que la base de Browserslist está desactualizada.
- `git diff --check`: correcto.

## Medidas de producción

Chrome headless mediante CDP, fuentes e imágenes cargadas, escala 1. Estado inicial:
filtro All, Monogatari abierto como en el frame. Capturas sin animación de entrada.

| Viewport | Alto total | Alto del main | Primer texto y | Scroll width |
| --- | ---: | ---: | ---: | ---: |
| 1440 | 4396 | 3726.86 | 76 | 1440 |
| 1024 | 3893 | 3224.31 | 76 | 1024 |
| 768 | 3804 | 3135.13 | 76 | 768 |
| 375 | 5307 | 4778.86 | 76 | 375 |

El alto total incluye el footer compartido (567 px en escritorio, 425.66 px a 375)
y los 102 px de reserva del Dock que ya tiene el body. No hay hueco entre main y
footer. El y=76 corresponde al primer texto, medido con Range; usa las variables
de PageShell. La línea de la cabecera lo precede, como en el diseño.

A 1440, gutter 72, ancho útil 1296, columnas 632 y separación 32. Se mantienen
las proporciones de las seis portadas. Un único H1; no hay TopBar ni Calcifer.
Sin desbordamiento horizontal de página en los cuatro anchos. En móvil solo la
fila de filtros desplaza horizontalmente, con scroll-snap; el log usa bloques y
pares etiqueta/valor, sin tabla.

Las ocho hairlines tienen `border-top: 1px solid rgb(234, 234, 234)`, token border:
las dos cabeceras, Dasoft y las cinco entradas del log.

## Interacciones y assets

- Filtros: All 5, Hackathons 2, Open source 1, Team 1 y Visual 1, con un solo
  `aria-pressed=true` y anuncio de cantidad de resultados.
- Los cinco acordeones responden a Enter; solo uno queda abierto. El control
  mantiene el foco y actualiza `aria-expanded`, `aria-controls` y +/−.
- Todas las filas colapsadas miden 101 px a 1440. El cierre de Monogatari varía
  continuamente de 488.91 a 101 px en 300 ms, sin salto de altura.
- Movimiento reducido: cero animaciones activas y `transition-property: none`.
- Toque emulado: funciona; filtros y controles tienen al menos 44 × 44 px.
- Eyebrows sticky desde 1024; al desplazar, el primero queda en y=0.
- Hover fino de portada: escala 1.015. En puntero grueso no se aplica.
- Todas las imágenes locales cargan y tienen dimensiones no nulas. Los cinco
  SVG conservan sus dimensiones raíz y geometría de exportación.
- Cero exportaciones fallidas y cero placeholders. Dasoft reutiliza su imagen
  local equivalente; Ominio y Monogatari usan las imágenes exactas del frame.
- Explorations usa la miniatura completa exportada con sus tres imágenes y
  recortes originales; también quedan guardados los tres fills individuales.

## Copy pendiente de revisión

No se han reemplazado los textos existentes de Home para resolver estas
discrepancias. La nueva ruta lee los mismos registros, por lo que no introduce
una segunda versión divergente. La elección editorial sigue pendiente.

| Registro | Home existente, consumido por ambas rutas | Nuevo Figma |
| --- | --- | --- |
| MLS descripción | From a single code-quality score to prioritized, file-level issues that ML engineers can act on. | From a single code-quality score to file-level issues ML engineers can act on. |
| MLS metadato | ML tooling · 2025 | Shipped 2025 |
| ATM descripción | Mapping the cash-deposit journey across five Mexican banks. | The cash-deposit journey across five Mexican banks. |
| ATM metadato | UX research · Field | Research · Field |
| HSBC Benefits y Mobile Security metadato | UX research · Benchmark | Research |

Ominio y Nissan coinciden en descripción y contexto. No se trasladan los chips
de tecnología de Home al título del catálogo: el contexto procede del eyebrow.

Rutas existentes: MLS → `/work/mlstoolbox`, Ominio → `/work/ominio`, Nissan →
`/work/andanac`. Los tres estudios de HSBC no tienen ruta y no son enlaces.
Dasoft conserva el destino Figma existente. GitHub, Dribbble y Behance son tres
enlaces independientes a las URLs ya definidas en `lib/links.ts`.

## Contenido y comprobaciones pendientes

- Monogatari: su cuerpo y “My part” son exactos del frame. “View project” no
  tiene URL en Figma (hyperlink=null) ni en el repositorio; se omite el enlace
  mientras existe un `TODO(content)` en los datos. No se inventó destino.
- GoodActions, Solary, Parking Go y Explorations: detalle ausente en Figma;
  estructura y `TODO(content)` de cada proyecto conservados, nunca visibles.
  Al abrir muestran solo datos ya existentes; GoodActions añade su enlace
  Behance previamente definido en Works.
- No se probaron Safari, Firefox, dispositivos físicos ni lector de pantalla:
  la verificación autorizada se hizo con Chrome headless y emulación de toque.
- No se verificó la disponibilidad o el contenido de destinos externos. La
  comprobación de enlaces cubre su correspondencia con los datos existentes.

Capturas y resultados de esta sesión: `/private/tmp/pf27-projects-qa/`:
`projects-{1440,1024,768,375}.png`, `measurements.json`, `interactions.json`.
