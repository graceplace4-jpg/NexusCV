import React, { useState } from 'react';
import { CVData } from '../types/cv';
import {
  Download,
  Linkedin,
  Copy,
  Check,
  FileText,
  ExternalLink,
  Upload,
  Layers,
  Sparkles
} from 'lucide-react';

interface ExportPanelProps {
  data: CVData;
  onPrintPDF: () => void;
  onImportJSON: (imported: CVData) => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ data, onPrintPDF, onImportJSON }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  // 1. LinkedIn Headline (limit 220 chars)
  const linkedInHeadline = `${data.title} | ${data.skills.map((s) => s.items.slice(0, 2).join(' · ')).join(' · ')} | Impulsando Crecimiento & Resultados`.slice(0, 220);

  // 2. LinkedIn "Acerca de" (About section)
  const linkedInAbout = `${data.summary}

🔹 Áreas de Especialización:
${data.skills.map((s) => `• ${s.category}: ${s.items.join(', ')}`).join('\n')}

🔹 Logros Destacados:
${data.experiences.slice(0, 2).flatMap((e) => e.highlights.slice(0, 2)).map((h) => `✔ ${h}`).join('\n')}

📫 Contacto directo: ${data.email} | ${data.location}`;

  // 3. LinkedIn Experiences format
  const linkedInExperiencesText = data.experiences
    .map(
      (exp) => `CARGO: ${exp.role}
EMPRESA: ${exp.company}
PERIODO: ${exp.startDate} - ${exp.current ? 'Actualidad' : exp.endDate} (${exp.location})

RESPONSABILIDADES Y LOGROS:
${exp.highlights.map((h) => `• ${h}`).join('\n')}
--------------------------------------------------`
    )
    .join('\n\n');

  // 4. Indeed / InfoJobs Plain Text Format
  const indeedFormatText = `==================================================
${data.fullName.toUpperCase()}
${data.title}
Email: ${data.email} | Tel: ${data.phone} | Ubicación: ${data.location}
LinkedIn: ${data.linkedin}
==================================================

RESUMEN PROFESIONAL
${data.summary}

EXPERIENCIA LABORAL
${data.experiences
  .map(
    (e) => `
${e.role.toUpperCase()} | ${e.company}
${e.startDate} - ${e.current ? 'Presente' : e.endDate} | ${e.location}
${e.highlights.map((h) => `- ${h}`).join('\n')}`
  )
  .join('\n')}

EDUCACIÓN
${data.education
  .map(
    (edu) => `${edu.degree} - ${edu.institution} (${edu.startYear} - ${edu.endYear})${edu.honors ? ` [${edu.honors}]` : ''}`
  )
  .join('\n')}

COMPETENCIAS TÉCNICAS Y HABILIDADES
${data.skills.map((s) => `${s.category}: ${s.items.join(', ')}`).join('\n')}

CERTIFICACIONES
${data.certifications.map((c) => `${c.name} - ${c.issuer} (${c.year})`).join('\n')}
`;

  // JSON Export / Import handler
  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${data.fullName.replace(/\s+/g, '_')}_CV.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.fullName) {
          onImportJSON(parsed);
          alert('¡Currículum importado exitosamente!');
        }
      } catch (err) {
        alert('El archivo no tiene un formato JSON válido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-[#111726] border border-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-bold tracking-tight text-white font-serif-executive">
          Exportación Directa a LinkedIn y Plataformas de Empleo
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Formatos optimizados para copiar con un clic y publicar sin errores en LinkedIn, Indeed, InfoJobs o exportar en PDF certificado para procesos de selección.
        </p>
      </div>

      {/* PDF Card */}
      <div className="bg-[#111726] border border-slate-800 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-serif-executive">
              Descarga Oficial en PDF (Formato A4 ATS-Proof)
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Genera un documento vectorial nítido con texto indexable por parsers ATS (Workday, Greenhouse, Taleo) sin degradación visual.
          </p>
        </div>

        <button
          onClick={onPrintPDF}
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-500 active:bg-blue-700 transition-colors shadow-sm shrink-0 whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          <span>Generar PDF Ahora</span>
        </button>
      </div>

      {/* LinkedIn Export Suite */}
      <div className="bg-[#111726] border border-slate-800 rounded-lg p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#0077b5]/20 text-[#0077b5] rounded border border-[#0077b5]/40">
              <Linkedin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-serif-executive">
                Kit de Exportación para Perfil de LinkedIn
              </h3>
              <p className="text-xs text-slate-400">
                Textos pre-redactados ajustados a los límites y estándares de visibilidad de LinkedIn.
              </p>
            </div>
          </div>

          <a
            href="https://www.linkedin.com/in/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded bg-blue-950/40 border border-blue-800/50 transition-colors whitespace-nowrap"
          >
            <span>Abrir mi perfil en LinkedIn</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 1. Titular de LinkedIn */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300">
              1. Titular Profesional de LinkedIn (Máx. 220 caracteres)
            </label>
            <button
              onClick={() => copyToClipboard(linkedInHeadline, 'headline')}
              className="flex items-center gap-1 text-[11px] text-blue-400 hover:underline"
            >
              {copiedSection === 'headline' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copiar Titular</span>
                </>
              )}
            </button>
          </div>
          <div className="bg-[#0a0d14] p-3 rounded border border-slate-800 text-xs text-slate-200 font-mono">
            {linkedInHeadline}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {linkedInHeadline.length} / 220 caracteres
          </span>
        </div>

        {/* 2. Sección Acerca de */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300">
              2. Sección "Acerca de" (Extracto de Alto Impacto con Llamada a la Acción)
            </label>
            <button
              onClick={() => copyToClipboard(linkedInAbout, 'about')}
              className="flex items-center gap-1 text-[11px] text-blue-400 hover:underline"
            >
              {copiedSection === 'about' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copiar "Acerca de"</span>
                </>
              )}
            </button>
          </div>
          <textarea
            readOnly
            value={linkedInAbout}
            rows={6}
            className="w-full bg-[#0a0d14] p-3 rounded border border-slate-800 text-xs text-slate-200 font-sans leading-relaxed focus:outline-none"
          />
        </div>

        {/* 3. Bloques de Experiencia para LinkedIn */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300">
              3. Experiencias Laborales Formateadas con Viñetas para LinkedIn
            </label>
            <button
              onClick={() => copyToClipboard(linkedInExperiencesText, 'exp')}
              className="flex items-center gap-1 text-[11px] text-blue-400 hover:underline"
            >
              {copiedSection === 'exp' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copiar Experiencias</span>
                </>
              )}
            </button>
          </div>
          <textarea
            readOnly
            value={linkedInExperiencesText}
            rows={6}
            className="w-full bg-[#0a0d14] p-3 rounded border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none"
          />
        </div>
      </div>

      {/* Indeed & InfoJobs Plain Text */}
      <div className="bg-[#111726] border border-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-serif-executive">
                Formato Texto Plano (Indeed, InfoJobs, Glassdoor, Bolsas de Empleo)
              </h3>
              <p className="text-xs text-slate-400">
                Formato sin caracteres conflictivos para portales que exigen pegar el texto completo del currículum.
              </p>
            </div>
          </div>

          <button
            onClick={() => copyToClipboard(indeedFormatText, 'indeed')}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors whitespace-nowrap"
          >
            {copiedSection === 'indeed' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">¡Texto Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Todo el Texto</span>
              </>
            )}
          </button>
        </div>

        <textarea
          readOnly
          value={indeedFormatText}
          rows={8}
          className="w-full bg-[#0a0d14] p-3 rounded border border-slate-800 text-xs text-slate-300 font-mono focus:outline-none leading-relaxed"
        />
      </div>

      {/* JSON Backup & Transfer */}
      <div className="bg-[#111726] border border-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-5 h-5 text-slate-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white font-serif-executive">
            Portabilidad y Copia de Seguridad
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Guarda una copia completa de tus datos en formato JSON para transferirla a otro equipo o restaurarla cuando desees.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar Copia de Seguridad (.json)</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Restaurar desde archivo JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
