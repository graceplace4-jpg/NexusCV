# Plan de Implementación: NexusCV - Generador de CV Ejecutivo & Portafolio Digital ATS

Plataforma profesional integral para la creación, redacción asistida con IA, escaneo ATS en tiempo real y exportación de CV ejecutivo en PDF de alto contraste, junto con un portafolio web personal estilo tarjeta digital optimizado para dispositivos móviles y exportación directa a LinkedIn y bolsas de empleo.

## Decisiones Críticas y Preferencias Confirmadas

> [!IMPORTANT]
> A continuación se resumen las elecciones confirmadas en la fase de consulta y los fundamentos de diseño aprobados:

- **Estilo Visual Base**: *Ejecutivo corporativo tradicional de alto contraste* (paleta sobria en grafito oscuro `#0A0D14`, blanco puro, acentos en azul corporativo sobrio `#1E3A8A` / `#2563EB`, tipografía de alta jerarquía con serifas de distinción combinadas con sans moderna *Plus Jakarta Sans* y numeración tabular).
- **Estructura de la Web Personal**: *Página minimalista estilo tarjeta digital (Digital Executive vCard)* optimizada para móviles y desktop, con vista previa instantánea, credenciales destacadas, acceso directo al CV interactivo, enlaces profesionales (LinkedIn, GitHub, Portfolio) y botón de contacto directo.
- **Enfoque de Inteligencia Artificial & ATS**: *Analizador ATS en tiempo real con puntuación (0-100)*, comprobación de legibilidad de reclutadores, extractor de palabras clave faltantes según descripción del puesto objetivo y optimizador de redacción de viñetas con verbos de acción y logros cuantificables mediante Gemini 3.8 Flash en backend seguro.
- **Exportación & Distribución**: Generación de PDF profesional ATS-compliant (diseño con estructura semántica imprimible y sin cajas rotas), exportador con un clic a formatos optimizados para LinkedIn (Acerca de, Experiencias formateadas), Indeed e InfoJobs/texto plano.

---

## 1. Visión General y Concepto Principal

- **Propósito**: Empoderar a candidatos y directivos para superar los filtros ATS y captar la atención de reclutadores en los primeros 6 segundos de revisión visual, redactando logros con impacto y publicando su presencia digital al instante.
- **Público Objetivo**: Profesionales en búsqueda de ascensos, ingenieros, consultores y ejecutivos que buscan una presentación impecable tanto en papel/PDF como en enlace digital compartido en redes sociales o solicitudes de empleo.
- **Valor Clave**: Fusión en una sola herramienta de redactor inteligente, diagnóstico predictivo ATS, generador de PDF fidedigno y mini-sitio web personal responsive para compartir con reclutadores.

---

## 2. Experiencia de Usuario y Diseño Visual

### Flujos de Usuario Principales

```
┌────────────────────────────────────────────────────────────────────────┐
│                          BARRA SUPERIOR (3 Zonas)                      │
│ [NexusCV Executive] ── [Editor · Analizador ATS · Portafolio · Exportar] ── [Descargar PDF] │
└────────────────────────────────────────────────────────────────────────┘
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│     PANEL DE EDICIÓN & IA       │   │    VISTA PREVIA EN VIVO (2 MODOS)│
│ · Datos de Contacto y Rol       │   │ ┌─────────────────────────────┐ │
│ · Asistente IA de Redacción     │   │ │ [ Modo CV ] [ Modo Tarjeta ]│ │
│ · Experiencia (Logros STAR)     │   │ └─────────────────────────────┘ │
│ · Formación y Certificaciones   │   │ · Previsualización Documento A4 │
│ · Habilidades Técnicas y Soft   │   │ · Tarjeta Digital Móvil         │
│ · Escáner de Vacante Objetivo   │   │ · Puntuación ATS en Vivo (0-100)│
└─────────────────────────────────┘   └─────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        SUITE DE EXPORTACIÓN DIRECTA                    │
│ · Descarga PDF A4 Certificado ATS                                      │
│ · Exportador a LinkedIn (Titular, Extracto, Experiencias con viñetas)  │
│ · Formato plano optimizado para Indeed / InfoJobs                      │
│ · Modo Portafolio Web Público (Enlace directo con vista responsive)    │
└────────────────────────────────────────────────────────────────────────┘
```

### Identidad Visual y Estilo (Ejecutivo Alto Contraste)
- **Atmósfera**: Corporativo premium, precisión tipográfica, contraste marcado sin saturación estridente.
- **Paleta de Colores**:
  - Lienzo: Blanco nítido `#FFFFFF` y pizarra profunda `#0B0F19` para contraste.
  - Superficies: Gris técnico suave `#F8FAFC` con divisores finos `#E2E8F0`.
  - Acento funcional: Azul marino ejecutivo `#0F294A` y cobalto `#1D4ED8` para estados activos y CTAs.
  - Semáforo ATS: Esmeralda `#059669` (alta compatibilidad), ámbar `#D97706` (por mejorar), rubí `#DC2626` (crítico).
- **Tipografía**:
  - Títulos y membrete del CV: Serif refinado de prestigio (`Georgia` / serif editorial elegante).
  - Cuerpo de lectura: `Plus Jakarta Sans` para máxima legibilidad tanto en pantalla como en impresión.
  - Métricas ATS y cifras: Cifras tabulares monoespaciadas (`font-mono tabular-nums`).
- **Disciplina Anti-Slop**:
  - Sin píldoras estáticas envolviendo cada fecha o etiqueta; metadatos limpios separados por `·` o `/`.
  - Encabezados claros en español natural, sin prefijos de código `//` ni etiquetas ficticias.
  - Controles de una sola línea (`whitespace-nowrap shrink-0`) y áreas táctiles $\ge 44\text{px}$ en móvil.

---

## 3. Decisiones de Producto y Compensaciones de Diseño

1. **Motor de PDF (Nativo Imprimible vs Lienzo Canvas)**:
   - *Enfoque*: Generación mediante CSS `@media print` de alta definición y exportador descargable con estructura tipográfica vectorial pura (evita distorsiones de texto pixelado o no seleccionable, garantizando que los parsers ATS puedan extraer 100% del texto).
   - *Motivo*: Los reclutadores y sistemas ATS (Workday, Greenhouse, Taleo) penalizan CVs con capas canvas no indexables.
2. **Arquitectura de Inteligencia Artificial (Backend Seguro)**:
   - *Enfoque*: Rutas API Express proxy en `/api/cv/*` utilizando el SDK oficial `@google/genai` con modelo `gemini-3.8-flash`.
   - *Motivo*: Protección estricta de la clave `GEMINI_API_KEY` fuera del navegador, respuestas estructuradas en JSON validadas tipográficamente.
3. **Persistencia Local y Exportabilidad**:
   - *Enfoque*: Almacenamiento instantáneo en `localStorage` con autoguardado, importación/exportación de copias de seguridad en formato JSON, y pre-llenado con perfil de ejemplo de alta gama (Director de Operaciones / Tech Lead) para probar al instante.

---

## 4. Arquitectura Técnica y Estrategia de Datos

```
┌────────────────────────────────────────────────────────────────┐
│                       FRONTEND (React 19)                      │
│                                                                │
│  ┌──────────────┐   ┌─────────────────┐   ┌─────────────────┐  │
│  │ CVEditorForm │   │ LiveResumeView  │   │ DigitalCardView │  │
│  └──────┬───────┘   └────────┬────────┘   └────────┬────────┘  │
│         │                    │                     │           │
│         └───────────┬────────┴─────────────────────┘           │
│                     ▼                                          │
│             useCVStore / Hook de Estado Central                │
│             (Autoguardado Local + Validaciones)                │
└─────────────────────┬──────────────────────────────────────────┘
                      │ Peticiones Fetch `/api/*`
                      ▼
┌────────────────────────────────────────────────────────────────┐
│                 BACKEND PROXY (Express / Node.js)              │
│                                                                │
│  POST /api/cv/analyze-ats  ──► Analiza CV vs Oferta de Empleo  │
│  POST /api/cv/enhance-bullet► Reformula logros con métricas    │
│  POST /api/cv/gen-summary  ──► Genera perfil profesional       │
│                     │                                          │
│                     ▼ GoogleGenAI ('gemini-3.8-flash')         │
│               [Servicio Gemini AI Server-Side]                 │
└────────────────────────────────────────────────────────────────┘
```

### Endpoints del Backend
- `POST /api/cv/analyze-ats`: Recibe el contenido del CV y los requisitos de la vacante; retorna puntuación global (0-100), desglose de secciones (formato, impacto cuantificable, verbos de acción), lista de palabras clave presentes y ausentes, y recomendaciones accionables.
- `POST /api/cv/enhance-bullet`: Recibe un texto preliminar de una experiencia laboral y lo reescribe con metodología STAR (Situación, Tarea, Acción, Resultado), optimizando palabras clave para el sector.
- `POST /api/cv/gen-summary`: Crea un extracto profesional ejecutivo de 3 a 4 líneas de alto impacto con palabras clave del sector seleccionado.

### Módulos del Frontend
1. **Header Contract**: Wordmark institucional NexusCV, navegación limpia entre pestañas (*Editor*, *Optimización ATS*, *Portafolio Digital*, *Exportador LinkedIn/Plataformas*), y acción primaria con selector de descarga.
2. **Editor Modular**:
   - Datos personales y redes profesionales (LinkedIn, GitHub, Web, Email, Teléfono, Ubicación).
   - Resumen ejecutivo con botón rápido "Mejorar con IA".
   - Experiencias laborales con generador de viñetas de impacto.
   - Educación, certificaciones y cursos relevantes.
   - Habilidades categorizadas (Técnicas, Gestión, Herramientas, Idiomas).
   - Proyectos clave (con título, descripción, tecnologías y enlace).
3. **Escáner ATS en Vivo**:
   - Comparador de vacante (pegar descripción del puesto).
   - Indicador de puntaje ATS en tiempo real.
   - Listado interactivo de palabras clave recomendadas que se pueden añadir con un clic.
4. **Vista de Portafolio / Tarjeta Digital Móvil**:
   - Modo visual de vCard profesional personal con diseño ultra limpio, enlace a proyectos, descarga directa de CV en PDF y botón de contacto por WhatsApp / Mailto.
   - Interruptor de vista previa responsive (móvil vs pantalla completa).
5. **Centro de Exportación Multicanal**:
   - Descarga directa de PDF optimizado para impresión A4 con maquetación de alto contraste.
   - Formato LinkedIn: Texto generado listo para copiar en la sección "Acerca de" y experiencias con formato de viñetas para LinkedIn.
   - Formato Indeed / InfoJobs: Texto limpio sin caracteres problemáticos para formularios de subida de currículum.
   - Exportación / Importación en JSON para portabilidad total de datos.
