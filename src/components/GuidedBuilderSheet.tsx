import React, { useState } from 'react';
import { CVData, ExperienceItem } from '../types/cv';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  User,
  GraduationCap,
  Wand2,
  FileCheck2,
  Plus,
  Trash2,
  Award,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { CVDocument } from './CVDocument';

interface GuidedBuilderSheetProps {
  data: CVData;
  onChange: (updated: CVData) => void;
  showAvatar: boolean;
  onGoToEvaluation: () => void;
  onPrintPDF: () => void;
}

export const GuidedBuilderSheet: React.FC<GuidedBuilderSheetProps> = ({
  data,
  onChange,
  showAvatar,
  onGoToEvaluation,
  onPrintPDF,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // STAR helper state for step 3
  const [starActionVerb, setStarActionVerb] = useState('Lideró');
  const [starTask, setStarTask] = useState('');
  const [starMetric, setStarMetric] = useState('');
  const [selectedExpId, setSelectedExpId] = useState<string>(data.experiences[0]?.id || '');

  // Pre-configured role keywords for step 4
  const industryPacks: Record<string, string[]> = {
    'Dirección & Operaciones': [
      'Gestión de P&L',
      'OKRs y KPIs',
      'Transformación Digital',
      'Liderazgo de Equipos Multidisciplinarios',
      'Optimización de Costos Operativos',
      'Metodologías Ágiles (Scrum, Kanban)',
      'Gobernanza Corporativa',
      'Negociación de Proveedores',
    ],
    'Tecnología & Cloud': [
      'Arquitectura Cloud (AWS / GCP / Azure)',
      'Microservicios & APIs RESTful',
      'CI/CD & DevOps',
      'Gobernanza de Datos & Seguridad ISO 27001',
      'Inteligencia Artificial Aplicada',
      'Escalabilidad de Sistemas Distribuidos',
      'TypeScript / React / Node.js',
    ],
    'Finanzas & Negocio': [
      'Modelos Financieros',
      'Estrategia de Crecimiento ARR / MRR',
      'Control Presupuestario ($10M+)',
      'Auditorías Internacionales & Compliance',
      'Fusiones y Adquisiciones (M&A)',
      'Retorno de Inversión (ROI)',
    ],
  };

  const [selectedIndustry, setSelectedIndustry] = useState<string>('Dirección & Operaciones');

  const actionVerbsList = [
    'Lideró', 'Dirigió', 'Optimizó', 'Transformó', 'Implementó', 'Redujo', 'Incrementó',
    'Escaló', 'Automatizó', 'Diseñó', 'Consolidó', 'Estructuró', 'Supervisó', 'Negoció'
  ];

  const handlePersonalChange = (field: keyof CVData, val: any) => {
    onChange({ ...data, [field]: val });
  };

  // Add constructed STAR bullet to chosen experience
  const handleAddStarBullet = () => {
    if (!starTask.trim() || !selectedExpId) return;
    const constructed = `${starActionVerb} ${starTask.trim()}${starMetric.trim() ? `, alcanzando ${starMetric.trim()}` : ''}.`;

    const updated = data.experiences.map((exp) => {
      if (exp.id === selectedExpId) {
        return {
          ...exp,
          highlights: [...exp.highlights, constructed],
        };
      }
      return exp;
    });

    onChange({ ...data, experiences: updated });
    setStarTask('');
    setStarMetric('');
  };

  const handleAddKeywordToSkills = (kw: string) => {
    const skills = [...data.skills];
    if (skills.length > 0) {
      if (!skills[0].items.some((i) => i.toLowerCase() === kw.toLowerCase())) {
        skills[0] = {
          ...skills[0],
          items: [...skills[0].items, kw],
        };
        onChange({ ...data, skills });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 text-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              Hoja 2
            </span>
            <h1 className="text-lg font-bold tracking-tight text-white font-serif-executive">
              Elaborador Guiado de CV Competitivo & Optimizado para Filtros ATS
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Sigue este proceso paso a paso con validaciones técnicas en tiempo real para estructurar un currículum diseñado para superar los algoritmos de filtrado y captar el interés inmediato del reclutador.
          </p>
        </div>

        {/* Progress pill & buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-slate-300 font-mono">
            Paso {currentStep} de {totalSteps}
          </span>
          <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stepper Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { step: 1, label: '1. Contacto ATS-Safe', icon: User },
          { step: 2, label: '2. Extracto Ejecutivo', icon: Sparkles },
          { step: 3, label: '3. Logros STAR', icon: Briefcase },
          { step: 4, label: '4. Palabras Clave ATS', icon: Wand2 },
          { step: 5, label: '5. Verificación & Lanzamiento', icon: FileCheck2 },
        ].map((s) => {
          const Icon = s.icon;
          const isDone = currentStep > s.step;
          const isCurrent = currentStep === s.step;
          return (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 border ${
                isCurrent
                  ? 'bg-blue-600 border-blue-500 text-white font-semibold'
                  : isDone
                  ? 'bg-slate-900 border-emerald-900/60 text-emerald-400'
                  : 'bg-[#0f1422] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Icon className="w-3.5 h-3.5" />}
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step Container (Split Screen: Step Guidelines & Form on Left, Instant Preview on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Current Wizard Step */}
        <div className="lg:col-span-7 bg-[#111726] border border-slate-800 rounded-xl p-6 text-slate-100 space-y-6">
          {/* PASO 1 */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400">Paso 1 de 5</span>
                <h2 className="text-base font-bold text-white font-serif-executive mt-0.5">
                  Identidad y Datos de Contacto Seguros para ATS
                </h2>
                <div className="flex items-start gap-2 bg-blue-950/30 border border-blue-900/50 p-2.5 rounded-lg text-xs text-blue-200 mt-2">
                  <Lightbulb className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Consejo ATS:</strong> Evita abreviaturas confusas, no uses emojis en tu nombre y coloca tu teléfono con prefijo internacional. Los sistemas ATS extraen estos campos para indexar tu expediente.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    value={data.fullName}
                    onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="Ej. Carlos E. Mendoza"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cargo / Especialidad Principal</label>
                  <input
                    type="text"
                    value={data.title}
                    onChange={(e) => handlePersonalChange('title', e.target.value)}
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="Ej. Director de Operaciones & Transformación"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico Profesional</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => handlePersonalChange('email', e.target.value)}
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="nombre.apellido@dominio.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono con Código de País</label>
                  <input
                    type="text"
                    value={data.phone}
                    onChange={(e) => handlePersonalChange('phone', e.target.value)}
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="+34 600 000 000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ubicación & Disponibilidad</label>
                  <input
                    type="text"
                    value={data.location}
                    onChange={(e) => handlePersonalChange('location', e.target.value)}
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="Madrid, España (Disponible para reubicación)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Enlace de LinkedIn</label>
                  <input
                    type="text"
                    value={data.linkedin}
                    onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="linkedin.com/in/tu-perfil"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 2 */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400">Paso 2 de 5</span>
                <h2 className="text-base font-bold text-white font-serif-executive mt-0.5">
                  Elaboración del Extracto Ejecutivo de Alto Impacto
                </h2>
                <div className="flex items-start gap-2 bg-blue-950/30 border border-blue-900/50 p-2.5 rounded-lg text-xs text-blue-200 mt-2">
                  <Lightbulb className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Fórmula Ganadora (3-4 líneas):</strong> [Años de experiencia] + [Especialidad y funciones clave] + [Volumen de negocio / presupuesto / equipo liderado] + [Visión estratégica y metodologías].
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Redacta o refina tu Perfil Ejecutivo:
                </label>
                <textarea
                  value={data.summary}
                  onChange={(e) => handlePersonalChange('summary', e.target.value)}
                  rows={6}
                  className="w-full bg-[#0a0d14] border border-slate-700 rounded p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-blue-500"
                  placeholder="Líder ejecutivo con más de 10 años dirigiendo operaciones..."
                />
              </div>

              {/* Quick formulas chips */}
              <div className="bg-[#0a0d14] p-3 rounded-lg border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  Estructuras recomendadas para usar de guía:
                </span>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-blue-400 font-semibold">Perfil Estratégico:</span> "Profesional con [X] años de trayectoria liderando [área/industria], especializado en optimización de operaciones y escalamiento de equipos de [N] personas."
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-emerald-400 font-semibold">Perfil Cuantitativo:</span> "Director enfocado en resultados comerciales y de eficiencia, con historial comprobado en gestión de P&L de [$X]M y reducción de costos del [X]%."
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASO 3 */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400">Paso 3 de 5</span>
                <h2 className="text-base font-bold text-white font-serif-executive mt-0.5">
                  Constructor de Logros con Metodología STAR
                </h2>
                <div className="flex items-start gap-2 bg-emerald-950/30 border border-emerald-900/50 p-2.5 rounded-lg text-xs text-emerald-200 mt-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Regla de Oro Reclutador:</strong> Los reclutadores descartan viñetas pasivas ("Responsable de coordinar reuniones"). Construye viñetas activas: [Verbo de Acción] + [Contexto del Reto] + [Métrica Cuantificable].
                  </span>
                </div>
              </div>

              {/* STAR Builder Tool */}
              <div className="bg-[#0a0d14] p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Generador Guiado de Viñeta STAR
                </span>

                {/* Target experience selector */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Selecciona la empresa / cargo a enriquecer:</label>
                  <select
                    value={selectedExpId}
                    onChange={(e) => setSelectedExpId(e.target.value)}
                    className="w-full bg-[#111726] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  >
                    {data.experiences.map((exp) => (
                      <option key={exp.id} value={exp.id}>
                        {exp.role} · {exp.company}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">1. Verbo de Acción</label>
                    <select
                      value={starActionVerb}
                      onChange={(e) => setStarActionVerb(e.target.value)}
                      className="w-full bg-[#111726] border border-slate-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
                    >
                      {actionVerbsList.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">2. Acción & Contexto del Reto</label>
                    <input
                      type="text"
                      value={starTask}
                      onChange={(e) => setStarTask(e.target.value)}
                      placeholder="la migración de arquitectura y reorganización de procesos..."
                      className="w-full bg-[#111726] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    3. Métrica de Impacto Cuantificable (Requerido para pasar ATS)
                  </label>
                  <input
                    type="text"
                    value={starMetric}
                    onChange={(e) => setStarMetric(e.target.value)}
                    placeholder="un incremento del 35% en productividad y ahorro de $1.2M anuales"
                    className="w-full bg-[#111726] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleAddStarBullet}
                  disabled={!starTask.trim()}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insertar Viñeta STAR en el CV</span>
                </button>
              </div>

              {/* Review Current Experience List */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Experiencias Registradas Actualmente ({data.experiences.length}):
                </span>
                {data.experiences.map((exp) => (
                  <div key={exp.id} className="p-3 bg-[#0a0d14] rounded-lg border border-slate-800 space-y-1.5">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="font-bold text-white">{exp.role}</span>
                      <span className="text-slate-400">{exp.company}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Viñetas activas: {exp.highlights.length}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASO 4 */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400">Paso 4 de 5</span>
                <h2 className="text-base font-bold text-white font-serif-executive mt-0.5">
                  Palabras Clave de Reclutamiento por Sector
                </h2>
                <div className="flex items-start gap-2 bg-blue-950/30 border border-blue-900/50 p-2.5 rounded-lg text-xs text-blue-200 mt-2">
                  <Lightbulb className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Estrategia de Indexación:</strong> Los sistemas de selección escanean paquetes de competencias. Haz clic en las palabras clave relevantes para incorporarlas a tu currículum.
                  </span>
                </div>
              </div>

              {/* Industry Selector Tabs */}
              <div className="flex gap-2">
                {Object.keys(industryPacks).map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setSelectedIndustry(ind)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      selectedIndustry === ind
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>

              {/* Keyword Pills with 1-click addition */}
              <div className="bg-[#0a0d14] p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 block">
                  Palabras Clave Críticas en {selectedIndustry} (Click para añadir):
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {industryPacks[selectedIndustry]?.map((kw, i) => (
                    <button
                      key={i}
                      onClick={() => handleAddKeywordToSkills(kw)}
                      className="group flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-blue-900/50 text-slate-300 hover:text-white border border-slate-800 hover:border-blue-700 transition-colors"
                      title="Añadir a Competencias"
                    >
                      <span>{kw}</span>
                      <Plus className="w-3 h-3 text-blue-400 group-hover:scale-125 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Skills in CV */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Competencias Actuales en tu CV:
                </span>
                <div className="space-y-1.5 text-xs bg-[#0a0d14] p-3 rounded-lg border border-slate-800">
                  {data.skills.map((s) => (
                    <div key={s.id} className="text-slate-300">
                      <strong className="text-white">{s.category}:</strong> {s.items.join(' · ')}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PASO 5 */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400">Paso 5 de 5</span>
                <h2 className="text-base font-bold text-white font-serif-executive mt-0.5">
                  Verificación de Competitividad & Lanzamiento
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Tu currículum ha sido estructurado siguiendo los lineamientos de los mejores estándares ATS y de selección ejecutiva.
                </p>
              </div>

              {/* Checklist review */}
              <div className="space-y-2.5">
                {[
                  {
                    label: 'Datos de contacto sin caracteres conflictivos',
                    ok: Boolean(data.fullName && data.email && data.phone),
                  },
                  {
                    label: 'Extracto ejecutivo de alto impacto definido',
                    ok: Boolean(data.summary && data.summary.length > 50),
                  },
                  {
                    label: 'Experiencias con logros cuantificables',
                    ok: data.experiences.some((e) => e.highlights.some((h) => /\d+/.test(h))),
                  },
                  {
                    label: 'Competencias y palabras clave de industria indexadas',
                    ok: data.skills.some((s) => s.items.length >= 3),
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg border text-xs ${
                      item.ok
                        ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-300'
                        : 'bg-amber-950/20 border-amber-800/50 text-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.ok ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      )}
                      <span>{item.label}</span>
                    </div>
                    <span className="font-semibold">{item.ok ? 'Completado' : 'Recomendado'}</span>
                  </div>
                ))}
              </div>

              {/* Launch Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onGoToEvaluation}
                  className="flex-1 py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Evaluar Puntuación ATS en Hoja 3</span>
                </button>

                <button
                  onClick={onPrintPDF}
                  className="flex-1 py-3 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Descargar Documento en PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* Stepper Footer Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(totalSteps, prev + 1))}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-sm"
              >
                <span>Siguiente Paso</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onGoToEvaluation}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm"
              >
                <span>Ir al Evaluador de Puntuación</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Live A4 Visual Preview */}
        <div className="lg:col-span-5">
          <div className="bg-[#111726] border border-slate-800 rounded-lg p-3 mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
            <div>
              <span className="font-semibold text-white">Vista Previa Dinámica</span>
              <span className="ml-1.5 text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded">
                {!data.templateStyle || data.templateStyle === 'canva-two-col'
                  ? 'Estilo Adjunto (2 Col)'
                  : data.templateStyle === 'executive-one-col'
                  ? '1 Columna'
                  : 'Minimalista'}
              </span>
            </div>

            <div className="bg-[#0b0f19] p-0.5 rounded border border-slate-800 flex items-center text-[10px]">
              <button
                type="button"
                onClick={() => onChange({ ...data, templateStyle: 'canva-two-col' })}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  !data.templateStyle || data.templateStyle === 'canva-two-col'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Estilo Adjunto
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...data, templateStyle: 'executive-one-col' })}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  data.templateStyle === 'executive-one-col'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1 Col
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...data, templateStyle: 'minimalist' })}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  data.templateStyle === 'minimalist'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Mini
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg shadow-2xl pb-4">
            <CVDocument data={data} showAvatar={showAvatar} />
          </div>
        </div>
      </div>
    </div>
  );
};
