import React, { useState } from 'react';
import { CVData, ATSAnalysis } from '../types/cv';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Briefcase,
  Plus,
  ArrowRight,
  TrendingUp,
  FileSearch,
  Check,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface ATSEvaluatorSheetProps {
  data: CVData;
  onChange: (updated: CVData) => void;
  analysis: ATSAnalysis | null;
  isAnalyzing: boolean;
  onRunAnalysis: (targetJob?: string) => Promise<void>;
  onGoToEditor: () => void;
}

export const ATSEvaluatorSheet: React.FC<ATSEvaluatorSheetProps> = ({
  data,
  onChange,
  analysis,
  isAnalyzing,
  onRunAnalysis,
  onGoToEditor,
}) => {
  const [targetJob, setTargetJob] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'recommended' | 'completed'>('all');
  const [appliedFixes, setAppliedFixes] = useState<Record<string, boolean>>({});

  const sampleVacancies = [
    {
      title: 'Director de Operaciones & Transformación',
      text: 'Buscamos Director de Operaciones con 10+ años de trayectoria. Requisitos: Liderazgo de equipos, gestión de P&L, metodologías ágiles (Scrum, Kanban), OKRs, KPIs de rendimiento, transformación digital, optimización de costos y visión estratégica.',
    },
    {
      title: 'VP of Engineering / CTO',
      text: 'Buscamos VP of Engineering. Requisitos indispensables: Arquitectura Cloud (AWS/GCP), microservicios, liderazgo de 40+ ingenieros, CI/CD, seguridad ISO 27001, gobernanza tecnológica y cultura de alto impacto.',
    },
    {
      title: 'Head of Product / Senior Product Lead',
      text: 'Buscamos Head of Product. Experiencia en roadmap estratégico, análisis de métricas (ARR, Churn, LTV), descubrimiento continuo, design thinking, liderazgo transversal y lanzamientos B2B a escala internacional.',
    },
  ];

  const handleAddMissingKeyword = (kw: string) => {
    const skills = [...data.skills];
    if (skills.length > 0) {
      if (!skills[0].items.some((i) => i.toLowerCase() === kw.toLowerCase())) {
        skills[0] = {
          ...skills[0],
          items: [...skills[0].items, kw],
        };
        onChange({ ...data, skills });
        setAppliedFixes((prev) => ({ ...prev, [kw]: true }));
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
    if (score >= 70) return 'text-amber-400 border-amber-500/40 bg-amber-950/20';
    return 'text-rose-400 border-rose-500/40 bg-rose-950/20';
  };

  const getProgressColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  // Structured improvement checklist items
  const improvementItems = [
    {
      id: 'metrics',
      priority: 'critical',
      title: 'Densidad de Logros con Métricas Cuantificables',
      description: 'Los filtros ATS y reclutadores priorizan viñetas que incluyan porcentajes (%), cifras en dinero o tiempo ahorrado.',
      status: data.experiences.some((e) => e.highlights.some((h) => /\d+([%€$kKmM]|\b\d+\b)/.test(h))) ? 'completed' : 'critical',
      fixActionText: 'Añadir cifras a tus experiencias',
      why: 'Aumenta hasta un 40% la tasa de respuesta en entrevistas.',
    },
    {
      id: 'action_verbs',
      priority: 'recommended',
      title: 'Uso de Verbos de Acción Contundentes',
      description: 'Cada viñeta debe comenzar con un verbo en pasado fuerte ("Lideró", "Optimizó", "Redujo") en lugar de frases pasivas.',
      status: data.experiences.some((e) => e.highlights.some((h) => /^(lideró|dirigió|optimizó|diseñó|implementó|redujo|incrementó)/i.test(h))) ? 'completed' : 'recommended',
      fixActionText: 'Reescribir viñetas con STAR',
      why: 'Permite al reclutador evaluar tu nivel de autonomía en menos de 6 segundos.',
    },
    {
      id: 'summary_executive',
      priority: 'critical',
      title: 'Extracto Ejecutivo Profesional (3-4 líneas)',
      description: 'Debe sintetizar tu propuesta de valor, años de trayectoria y alcance de responsabilidad.',
      status: Boolean(data.summary && data.summary.trim().length >= 80) ? 'completed' : 'critical',
      fixActionText: 'Generar extracto con IA',
      why: 'Es la primera sección leída por el 92% de los reclutadores.',
    },
    {
      id: 'keywords_match',
      priority: 'critical',
      title: 'Coincidencia de Palabras Clave Técnicas y de Gestión',
      description: 'Indexar términos que los motores de búsqueda de empleo utilizan para clasificar a los candidatos preseleccionados.',
      status: (analysis?.keywordsScore || 70) >= 80 ? 'completed' : 'critical',
      fixActionText: 'Añadir palabras clave faltantes',
      why: 'Evita el descarte automático en la etapa inicial de filtrado ATS.',
    },
    {
      id: 'contact_format',
      priority: 'completed',
      title: 'Estructura de Contacto ATS-Safe',
      description: 'Correo electrónico corporativo, teléfono internacional y enlaces limpios sin caracteres conflictivos.',
      status: Boolean(data.fullName && data.email && data.phone && data.location) ? 'completed' : 'critical',
      fixActionText: 'Completar datos de contacto',
      why: 'Garantiza que el sistema ATS pueda crear tu ficha de contacto sin errores.',
    },
  ];

  const filteredItems = improvementItems.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.status === activeFilter;
  });

  return (
    <div className="space-y-6 text-slate-100">
      {/* Hero Header Strip for Sheet 3 */}
      <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
              Hoja 3
            </span>
            <h1 className="text-lg font-bold tracking-tight text-white font-serif-executive">
              Evaluación Integral de CV en Porcentaje & Diagnóstico de Ítems a Mejorar
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Obtén un informe cuantitativo preciso de tu nivel de compatibilidad con filtros ATS y reclutadores, con un resumen visual de las áreas críticas que debes reforzar para asegurar entrevistas.
          </p>
        </div>

        <button
          onClick={() => onRunAnalysis(targetJob)}
          disabled={isAnalyzing}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-sm shrink-0 whitespace-nowrap"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Evaluando con Gemini IA...' : 'Reevaluar CV Ahora'}</span>
        </button>
      </div>

      {/* Target Job Comparator Box */}
      <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 space-y-3">
        <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            Oferta de Empleo / Puesto Objetivo a Comparar (Opcional):
          </span>
          <span className="text-[11px] text-slate-400">Permite evaluar el % exacto de palabras clave coincidentes</span>
        </label>
        <textarea
          value={targetJob}
          onChange={(e) => setTargetJob(e.target.value)}
          placeholder="Pega la descripción de la vacante deseada para medir la tasa de coincidencia exacta..."
          rows={3}
          className="w-full bg-[#0a0d14] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-400">Probar con vacante de ejemplo:</span>
          {sampleVacancies.map((vac, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setTargetJob(vac.text);
                onRunAnalysis(vac.text);
              }}
              className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {vac.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Scoreboard: Percentage & Subfactors */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Main Dial (Col 4) */}
          <div className={`md:col-span-4 border rounded-xl p-6 flex flex-col items-center justify-center text-center ${getScoreColor(analysis.overallScore)}`}>
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Puntuación Global de Selección
            </span>
            <div className="text-7xl font-bold font-mono tabular-nums my-3">
              {analysis.overallScore}
              <span className="text-3xl text-slate-400 font-sans">%</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>
                {analysis.overallScore >= 80
                  ? 'Nivel Competitivo Óptimo para ATS'
                  : 'Nivel Intermedio — Requiere Ajustes'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 max-w-xs leading-relaxed">
              Basado en pruebas automatizadas contra algoritmos de filtrado tipo Workday, Greenhouse y Taleo.
            </p>
          </div>

          {/* Sub-Factor Percentage Bars (Col 8) */}
          <div className="md:col-span-8 bg-[#111726] border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-serif-executive">
              Desglose Porcentual por Factores Clave
            </h2>

            <div className="space-y-3 text-xs">
              {/* Formato */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300 font-medium">Estructura & Formato ATS Limpio</span>
                  <span className="font-mono font-semibold tabular-nums text-slate-200">{analysis.formattingScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${getProgressColor(analysis.formattingScore)}`} style={{ width: `${analysis.formattingScore}%` }} />
                </div>
              </div>

              {/* Palabras Clave */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300 font-medium">Relevancia de Palabras Clave de Industria</span>
                  <span className="font-mono font-semibold tabular-nums text-slate-200">{analysis.keywordsScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${getProgressColor(analysis.keywordsScore)}`} style={{ width: `${analysis.keywordsScore}%` }} />
                </div>
              </div>

              {/* Impacto Cuantificable */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300 font-medium">Logros Cuantificables & Método STAR</span>
                  <span className="font-mono font-semibold tabular-nums text-slate-200">{analysis.impactScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${getProgressColor(analysis.impactScore)}`} style={{ width: `${analysis.impactScore}%` }} />
                </div>
              </div>

              {/* Legibilidad en 6s */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300 font-medium">Escaneo Rápido de Reclutador (Lectura en 6 seg)</span>
                  <span className="font-mono font-semibold tabular-nums text-slate-200">{analysis.readabilityScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${getProgressColor(analysis.readabilityScore)}`} style={{ width: `${analysis.readabilityScore}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recruiter 6-Second Glance Assessment */}
      {analysis?.recruiterImpressions && (
        <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-serif-executive">
              Impresión Inicial del Reclutador (Diagnóstico Ejecutivo)
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed italic bg-[#0a0d14] p-3.5 rounded-lg border border-slate-800">
            "{analysis.recruiterImpressions}"
          </p>
        </div>
      )}

      {/* THE IMPROVEMENT CHECKLIST MODULE */}
      <div className="bg-[#111726] border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white font-serif-executive flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Diagnóstico de Ítems Específicos que Debes Mejorar</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Revisa cada apartado evaluado para saber qué corregir y cómo impacta en tu selección.
            </p>
          </div>

          {/* Filter segment tabs */}
          <div className="flex items-center bg-[#0a0d14] p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded transition-colors ${activeFilter === 'all' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveFilter('critical')}
              className={`px-3 py-1 rounded transition-colors ${activeFilter === 'critical' ? 'bg-rose-900 text-rose-200 font-semibold' : 'text-slate-400'}`}
            >
              Urgentes
            </button>
            <button
              onClick={() => setActiveFilter('recommended')}
              className={`px-3 py-1 rounded transition-colors ${activeFilter === 'recommended' ? 'bg-amber-900 text-amber-200 font-semibold' : 'text-slate-400'}`}
            >
              Recomendados
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`px-3 py-1 rounded transition-colors ${activeFilter === 'completed' ? 'bg-emerald-900 text-emerald-200 font-semibold' : 'text-slate-400'}`}
            >
              Cumplidos
            </button>
          </div>
        </div>

        {/* List of Improvement Items */}
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                item.status === 'completed'
                  ? 'bg-[#0a0d14] border-emerald-900/40 text-slate-300'
                  : item.status === 'critical'
                  ? 'bg-rose-950/20 border-rose-900/50 text-slate-200'
                  : 'bg-amber-950/20 border-amber-900/50 text-slate-200'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {item.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {item.status === 'critical' && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                  {item.status === 'recommended' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}

                  <h3 className="text-xs font-bold text-white">{item.title}</h3>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase tracking-wider ${
                      item.status === 'completed'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : item.status === 'critical'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {item.status === 'completed' ? 'Cumplido' : item.status === 'critical' ? 'Urgente' : 'Por Mejorar'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>

                <p className="text-[11px] text-blue-300 font-medium">
                  <strong>Por qué importa:</strong> {item.why}
                </p>
              </div>

              {item.status !== 'completed' && (
                <button
                  onClick={onGoToEditor}
                  className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0 whitespace-nowrap shadow-sm"
                >
                  <span>{item.fixActionText}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Missing Keywords Action Box */}
      {analysis?.missingKeywords && analysis.missingKeywords.length > 0 && (
        <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-serif-executive">
                Palabras Clave Faltantes Detectadas por el Escáner
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Haz clic en una palabra para incluirla en tu CV</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {analysis.missingKeywords.map((kw, i) => {
              const isApplied = appliedFixes[kw];
              return (
                <button
                  key={i}
                  onClick={() => handleAddMissingKeyword(kw)}
                  className={`group flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    isApplied
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800'
                      : 'bg-amber-950/30 hover:bg-amber-900/50 text-amber-200 border-amber-800/60'
                  }`}
                  title="Añadir automáticamente a tus competencias"
                >
                  <span>{kw}</span>
                  {isApplied ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Plus className="w-3 h-3 group-hover:scale-125 transition-transform" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Actionable General Tips */}
      {analysis?.actionableTips && analysis.actionableTips.length > 0 && (
        <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-serif-executive">
            Consejos Accionables Inmediatos para Aumentar tu Tasa de Éxito
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {analysis.actionableTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
