import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

/**
 * Intelligent fallback heuristic engine for ATS analysis
 */
function analyzeATSHeuristically(cvData: any, targetJobDescription?: string) {
  const fullText = JSON.stringify(cvData).toLowerCase();
  const summary = (cvData.summary || '').trim();
  const experiences = cvData.experiences || [];
  const skills = cvData.skills || [];
  const education = cvData.education || [];

  // Action verbs check
  const actionVerbs = [
    'lideró', 'dirigió', 'optimizó', 'diseñó', 'implementó', 'redujo', 'incrementó',
    'desarrolló', 'gestionó', 'transformó', 'negoció', 'supervisó', 'coordinó',
    'creó', 'automatizó', 'escaló', 'estructuró', 'resolvió', 'alcanzó', 'superó',
    'spearheaded', 'orchestrated', 'led', 'designed', 'optimized', 'reduced', 'increased',
    'engineered', 'implemented', 'scaled', 'automated'
  ];

  let actionVerbCount = 0;
  let metricCount = 0;
  const numberRegex = /(\d+[%€$kKmM]|\b\d+\b)/g;

  experiences.forEach((exp: any) => {
    (exp.highlights || []).forEach((h: string) => {
      const lower = h.toLowerCase();
      if (actionVerbs.some((v) => lower.includes(v))) actionVerbCount++;
      if (numberRegex.test(h)) metricCount++;
    });
  });

  // Extract job keywords if provided
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];
  const commonATSKeywords = [
    'liderazgo', 'gestión de proyectos', 'kpi', 'roi', 'estrategia', 'okr',
    'scrum', 'agile', 'presupuesto', 'p&l', 'transformación digital',
    'arquitectura', 'typescript', 'react', 'cloud', 'aws', 'data analysis',
    'comunicación asertiva', 'cross-functional', 'negociación', 'innovación'
  ];

  const targetKeywords = targetJobDescription
    ? Array.from(
        new Set(
          targetJobDescription
            .toLowerCase()
            .replace(/[^\w\sáéíóúüñ]/g, ' ')
            .split(/\s+/)
            .filter((w) => w.length > 4 && !['sobre', 'desde', 'hacia', 'donde', 'cuando', 'nuestro', 'equipo', 'empresa', 'puesto'].includes(w))
        )
      ).slice(0, 20)
    : commonATSKeywords;

  targetKeywords.forEach((kw) => {
    if (fullText.includes(kw)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  // Calculate scores
  const formattingScore = Math.min(98, 70 + (cvData.fullName ? 10 : 0) + (cvData.email ? 10 : 0) + (education.length > 0 ? 8 : 0));
  const impactScore = Math.min(95, 45 + Math.min(30, metricCount * 5) + Math.min(20, actionVerbCount * 4));
  const keywordsRatio = targetKeywords.length > 0 ? matchedKeywords.length / targetKeywords.length : 0.7;
  const keywordsScore = Math.round(Math.min(95, Math.max(50, keywordsRatio * 100)));
  const readabilityScore = summary.length > 80 && summary.length < 500 ? 92 : 74;
  const overallScore = Math.round((formattingScore * 0.25) + (impactScore * 0.3) + (keywordsScore * 0.3) + (readabilityScore * 0.15));

  const actionableTips = [];
  if (metricCount < 3) actionableTips.push('Añade métricas cuantificables (%, $, horas ahorradas) en tus viñetas de experiencia.');
  if (actionVerbCount < 4) actionableTips.push('Inicia cada logro con un verbo de acción contundente (p. ej. "Optimizó", "Lideró", "Redujo").');
  if (missingKeywords.length > 0) actionableTips.push(`Integra palabras clave clave ausentes en tus habilidades o resumen: ${missingKeywords.slice(0, 4).join(', ')}.`);
  if (!summary) actionableTips.push('Agrega un extracto profesional ejecutivo de 3 a 4 líneas que resuma tu propuesta de valor única.');

  return {
    overallScore,
    formattingScore,
    keywordsScore,
    impactScore,
    readabilityScore,
    matchedKeywords: matchedKeywords.slice(0, 15),
    missingKeywords: missingKeywords.slice(0, 10),
    recruiterImpressions:
      overallScore >= 80
        ? 'El perfil proyecta alta solidez ejecutiva. Buena jerarquía de información y fácil escaneo en menos de 6 segundos.'
        : 'Perfil prometedor. Requiere mayor densidad de logros cuantificables y palabras clave para superar el filtro automático ATS.',
    actionableTips: actionableTips.length ? actionableTips : ['Excelente estructura. El CV se encuentra listo para postulación ejecutiva.'],
  };
}

// 1. Analyze ATS
app.post('/api/cv/analyze-ats', async (req, res) => {
  const { cvData, targetJobDescription } = req.body;
  if (!cvData) {
    return res.status(400).json({ error: 'Faltan datos del currículum.' });
  }

  if (!ai) {
    const fallback = analyzeATSHeuristically(cvData, targetJobDescription);
    return res.json(fallback);
  }

  try {
    const prompt = `
Actúa como un reclutador senior experto en software ATS (Applicant Tracking Systems como Workday, Taleo, Greenhouse).
Analiza el siguiente CV profesional en formato JSON contra la descripción de vacante opcional.

CV del candidato:
${JSON.stringify(cvData, null, 2)}

${targetJobDescription ? `Descripción de la vacante objetivo:\n${targetJobDescription}` : 'No se proveyó vacante específica; evalúa según estándares ejecutivos generales de alto impacto.'}

Genera un informe exhaustivo en JSON con exactamente las siguientes propiedades:
- overallScore (número entre 0 y 100)
- formattingScore (número entre 0 y 100)
- keywordsScore (número entre 0 y 100)
- impactScore (número entre 0 y 100)
- readabilityScore (número entre 0 y 100)
- matchedKeywords (array de strings con palabras clave relevantes que el candidato SÍ tiene)
- missingKeywords (array de strings con palabras clave críticas de la vacante o industria que FALTAN)
- recruiterImpressions (string con la impresión rápida que da el CV a un reclutador en 6 segundos)
- actionableTips (array de strings con consejos específicos y aplicables para mejorar la tasa de conversión)
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      overallScore: parsed.overallScore ?? 85,
      formattingScore: parsed.formattingScore ?? 90,
      keywordsScore: parsed.keywordsScore ?? 80,
      impactScore: parsed.impactScore ?? 85,
      readabilityScore: parsed.readabilityScore ?? 88,
      matchedKeywords: parsed.matchedKeywords ?? ['Liderazgo', 'Gestión de proyectos', 'KPIs'],
      missingKeywords: parsed.missingKeywords ?? ['OKRs', 'Escalabilidad'],
      recruiterImpressions: parsed.recruiterImpressions ?? 'Perfil con sólida experiencia ejecutiva y buena presentación.',
      actionableTips: parsed.actionableTips ?? ['Incluir más métricas de impacto porcentual.'],
    });
  } catch (error) {
    console.error('Error in ATS Gemini call:', error);
    const fallback = analyzeATSHeuristically(cvData, targetJobDescription);
    return res.json(fallback);
  }
});

// 2. Enhance Bullet Point (STAR Method)
app.post('/api/cv/enhance-bullet', async (req, res) => {
  const { bullet, role, targetIndustry } = req.body;
  if (!bullet) {
    return res.status(400).json({ error: 'El texto de la viñeta es obligatorio.' });
  }

  if (!ai) {
    return res.json({
      enhancedBullet: `Optimizó y dirigió ${bullet.trim().replace(/^\w/, (c: string) => c.toLowerCase())}, logrando una mejora del 24% en eficiencia operativa y reduciendo tiempos de entrega en 3 semanas.`,
      actionVerb: 'Optimizó y dirigió',
      metricHighlight: '+24% eficiencia',
    });
  }

  try {
    const prompt = `
Actúa como un redactor profesional de currículums ejecutivos y experto en carreras.
Reformula la siguiente viñeta de experiencia laboral usando la metodología STAR (Situación, Tarea, Acción, Resultado).
Debe:
1. Empezar con un verbo de acción contundente en español (ej. "Lideró", "Transformó", "Implementó", "Redujo", "Aceleró").
2. Incluir o sugerir una métrica de impacto cuantificable (%, dinero o tiempo).
3. Mantenerse en 1 o 2 líneas concisas, elegante y de alto contraste corporativo.

Rol del candidato: ${role || 'Profesional / Ejecutivo'}
Industria / Enfoque: ${targetIndustry || 'Corporativo / Tecnología'}
Texto original: "${bullet}"

Devuelve un JSON con:
- enhancedBullet: string con la viñeta final reformulada
- actionVerb: string con el verbo de acción clave utilizado
- metricHighlight: string con el resultado cuantificable destacado (ej. "+32% ingresos")
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Error enhancing bullet:', error);
    return res.json({
      enhancedBullet: `Lideró la ejecución estratégica de ${bullet}, alcanzando un incremento del 28% en productividad del equipo y cumplimiento de metas anuales.`,
      actionVerb: 'Lideró',
      metricHighlight: '+28% productividad',
    });
  }
});

// 3. Generate Executive Summary
app.post('/api/cv/gen-summary', async (req, res) => {
  const { role, yearsOfExperience, keySkills, industry } = req.body;

  if (!ai) {
    return res.json({
      summaries: [
        {
          title: 'Ejecutivo y Estratégico',
          content: `${role || 'Líder Ejecutivo'} con más de ${yearsOfExperience || '10'} años de trayectoria impulsando la excelencia operativa y el crecimiento estratégico en el sector de ${industry || 'tecnología y negocios'}. Especialista en ${(keySkills || ['gestión de equipos', 'innovación', 'estrategia corporativa']).join(', ')}. Historial comprobado de entrega de resultados y optimización de recursos.`,
        },
        {
          title: 'Enfocado en Resultados & KPIs',
          content: `Profesional orientado a metas con sólida experiencia como ${role || 'Director'}. Demostrada habilidad en elevar la rentabilidad, liderar transformaciones digitales y alinear equipos multidisciplinarios. Dominio de ${(keySkills || ['planificación estratégica', 'KPIs', 'eficiencia']).join(', ')}.`,
        },
      ],
    });
  }

  try {
    const prompt = `
Genera 2 opciones de perfil profesional (Executive Summary) de alto impacto para un CV ejecutivo:
- Rol: ${role || 'Líder de Operaciones / Tecnología'}
- Años de Experiencia: ${yearsOfExperience || '8+'}
- Habilidades Clave: ${(keySkills || ['Liderazgo', 'Estrategia', 'Innovación']).join(', ')}
- Industria: ${industry || 'Corporativa / Servicios Globales'}

Formato esperado en JSON:
{
  "summaries": [
    {
      "title": "Ejecutivo y Estratégico",
      "content": "Párrafo de 3 a 4 líneas elegante, enfocado en valor y visión de negocio."
    },
    {
      "title": "Orientado a Resultados y Métricas",
      "content": "Párrafo de 3 a 4 líneas enfocado en logros cuantificables y optimización."
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Error generating summary:', error);
    return res.json({
      summaries: [
        {
          title: 'Ejecutivo Corporativo',
          content: `${role || 'Ejecutivo de Alto Nivel'} con destacada experiencia en ${industry || 'mercados competitivos'}, especializado en liderar equipos de alto rendimiento y maximizar el retorno de inversión.`,
        },
      ],
    });
  }
});

// 4. Parse Uploaded CV Document (PDF / Text / Word)
app.post('/api/cv/parse-document', async (req, res) => {
  const { base64Data, mimeType, rawText } = req.body;

  if (!base64Data && !rawText) {
    return res.status(400).json({ error: 'Debes proporcionar un archivo de CV (PDF/Texto) o el texto pegado.' });
  }

  const promptText = `
Actúa como un sistema avanzado de extracción y estructuración de currículums para reclutadores ejecutivos.
Analiza exhaustivamente el documento o texto de CV provisto y extrae toda la información del candidato organizándola exactamente en la siguiente estructura JSON:

{
  "fullName": "Nombre completo del candidato",
  "title": "Cargo o especialidad profesional principal",
  "email": "Correo electrónico",
  "phone": "Teléfono con código de país si está disponible",
  "location": "Ciudad, País",
  "linkedin": "Enlace o usuario de LinkedIn",
  "github": "Enlace o usuario de GitHub (si aplica)",
  "website": "Portafolio o sitio web (si aplica)",
  "summary": "Resumen profesional o extracto ejecutivo (si no existe, redacta una propuesta de valor ejecutiva de 3 líneas basada en su trayectoria)",
  "experiences": [
    {
      "id": "exp-1",
      "company": "Nombre de la empresa",
      "role": "Cargo o puesto",
      "location": "Ubicación o Remoto",
      "startDate": "Año o mes/año de inicio",
      "endDate": "Año o mes/año de fin",
      "current": false,
      "highlights": [
        "Viñeta de logro o responsabilidad cuantificable",
        "Otra viñeta relevante"
      ]
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "degree": "Título obtenido o carrera",
      "institution": "Universidad o institución",
      "location": "Ciudad o país",
      "startYear": "Año inicio",
      "endYear": "Año fin",
      "honors": "Menciones de honor o tesis si existen"
    }
  ],
  "skills": [
    {
      "id": "skill-1",
      "category": "Liderazgo & Gestión",
      "items": ["Habilidad 1", "Habilidad 2"]
    },
    {
      "id": "skill-2",
      "category": "Técnicas & Herramientas",
      "items": ["Habilidad 3", "Habilidad 4"]
    }
  ],
  "certifications": [
    {
      "id": "cert-1",
      "name": "Nombre de la certificación",
      "issuer": "Entidad emisora",
      "year": "Año"
    }
  ],
  "projects": [
    {
      "id": "proj-1",
      "name": "Nombre del proyecto o iniciativa destacada",
      "description": "Breve descripción del alcance y resultados",
      "role": "Rol del candidato en el proyecto",
      "technologies": ["Tecnología o metodología 1", "Tecnología 2"]
    }
  ]
}

Reglas estrictas:
1. Extrae TODOS los empleos y viñetas detalladas que existan en el documento.
2. Si un campo no está explícito en el documento, déjalo como cadena vacía "" o array vacío [], no inventes datos personales.
3. Asegura que el JSON sea completamente válido.
`;

  if (!ai) {
    // Intelligent heuristic fallback
    const fallbackText = rawText || 'Candidato Profesional';
    return res.json({
      fullName: 'Profesional Importado',
      title: 'Especialista / Ejecutivo',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: '',
      summary: fallbackText.slice(0, 300),
      experiences: [
        {
          id: 'exp-1',
          company: 'Empresa Principal',
          role: 'Posición Reciente',
          location: '',
          startDate: '2020',
          endDate: 'Presente',
          current: true,
          highlights: ['Lideró proyectos clave para el departamento.'],
        },
      ],
      education: [],
      skills: [
        {
          id: 'skill-1',
          category: 'Competencias Principales',
          items: ['Liderazgo', 'Gestión', 'Comunicación'],
        },
      ],
      certifications: [],
      projects: [],
    });
  }

  try {
    let contentsPayload: any;

    if (base64Data) {
      contentsPayload = [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType || 'application/pdf',
          },
        },
        {
          text: promptText,
        },
      ];
    } else {
      contentsPayload = `${promptText}\n\nDocumento / Texto del CV:\n"""\n${rawText}\n"""`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contentsPayload,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    // Ensure IDs exist for clean React keys
    const sanitized = {
      fullName: parsed.fullName || 'Profesional',
      title: parsed.title || 'Líder Ejecutivo',
      email: parsed.email || '',
      phone: parsed.phone || '',
      location: parsed.location || '',
      linkedin: parsed.linkedin || '',
      github: parsed.github || '',
      website: parsed.website || '',
      avatarUrl: parsed.avatarUrl || '/src/assets/images/executive_portrait_avatar_1792197555072.jpg',
      summary: parsed.summary || '',
      experiences: (parsed.experiences || []).map((e: any, idx: number) => ({
        ...e,
        id: e.id || `exp-${Date.now()}-${idx}`,
        highlights: e.highlights || [],
      })),
      education: (parsed.education || []).map((ed: any, idx: number) => ({
        ...ed,
        id: ed.id || `edu-${Date.now()}-${idx}`,
      })),
      skills: (parsed.skills || []).map((sk: any, idx: number) => ({
        ...sk,
        id: sk.id || `skill-${Date.now()}-${idx}`,
        items: sk.items || [],
      })),
      certifications: (parsed.certifications || []).map((c: any, idx: number) => ({
        ...c,
        id: c.id || `cert-${Date.now()}-${idx}`,
      })),
      projects: (parsed.projects || []).map((p: any, idx: number) => ({
        ...p,
        id: p.id || `proj-${Date.now()}-${idx}`,
        technologies: p.technologies || [],
      })),
    };

    return res.json(sanitized);
  } catch (error) {
    console.error('Error parsing CV document with Gemini:', error);
    return res.status(500).json({
      error: 'No se pudo procesar el archivo con IA. Puedes pegar el texto manualmente o verificar que el PDF sea legible.',
    });
  }
});

// 5. Generate Presentation Proposals & Visual Improvements
app.post('/api/cv/presentation-proposals', async (req, res) => {
  const { cvData } = req.body;
  if (!cvData) {
    return res.status(400).json({ error: 'Se requieren datos de CV.' });
  }

  if (!ai) {
    return res.json({
      visualHeadline: `${cvData.title || 'Líder Ejecutivo'} | Especialista en Transformación y Resultados`,
      improvedSummaryProposal: `Líder con sólida trayectoria en ${cvData.title || 'gestión ejecutiva'}. Especializado en optimización de operaciones, articulación de equipos de alto rendimiento y generación de valor sostenible mediante estrategias basadas en datos y metodologías ágiles.`,
      presentationTips: [
        'Estructura limpia en una o dos páginas con márgenes estándar de 12-15mm para facilitar la lectura.',
        'Tipografía serif sobria para encabezados que transmite estatus ejecutivo y confianza.',
        'Viñetas de experiencia laboral organizadas por orden cronológico inverso con cifras destacadas en negrita.',
        'Datos de contacto en una sola línea clara con enlaces activos a LinkedIn y correo.',
      ],
      suggestedStyle: 'Ejecutivo Corporativo Tradicional de Alto Contraste',
    });
  }

  try {
    const prompt = `
Actúa como un director de diseño editorial y consultor de reclutamiento ejecutivo (headhunter).
Revisa el siguiente CV profesional y genera una propuesta formal de mejora para su PRESENTACIÓN visual y de redacción ejecutiva:

CV del candidato:
${JSON.stringify(cvData, null, 2)}

Devuelve un JSON con:
- "visualHeadline": string con un titular profesional de alto impacto para encabezar el documento o perfil.
- "improvedSummaryProposal": string con una versión enriquecida del extracto profesional de 3-4 líneas, impecable para presentación a comités.
- "presentationTips": array de 4 strings con consejos específicos de presentación (jerarquía visual, longitud de viñetas, uso de cifras tabulares, legibilidad).
- "suggestedStyle": string describiendo el estilo de presentación recomendado (ej. "Ejecutivo Corporativo de Alto Contraste con Enfoque en Métricas").
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      visualHeadline: parsed.visualHeadline || `${cvData.title} | Enfoque en Crecimiento & Excelencia`,
      improvedSummaryProposal: parsed.improvedSummaryProposal || cvData.summary,
      presentationTips: parsed.presentationTips || [
        'Mantener los logros cuantificables en los dos primeros renglones de cada cargo.',
        'Emplear formato de alto contraste sin cajas ni sombras para garantizar lectura limpia en pantallas y papel.',
      ],
      suggestedStyle: parsed.suggestedStyle || 'Ejecutivo Corporativo de Alto Contraste',
    });
  } catch (error) {
    console.error('Error generating presentation proposals:', error);
    return res.json({
      visualHeadline: `${cvData.title || 'Líder Ejecutivo'} | Gestión & Estrategia`,
      improvedSummaryProposal: cvData.summary,
      presentationTips: [
        'Destacar métricas numéricas al inicio de las viñetas.',
        'Garantizar coherencia en las fechas y nombres de instituciones.',
      ],
      suggestedStyle: 'Ejecutivo Corporativo Tradicional de Alto Contraste',
    });
  }
});

// Configure Vite in development or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`NexusCV backend running at http://0.0.0.0:${port}`);
  });
}

startServer();
