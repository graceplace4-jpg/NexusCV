import React, { useState } from 'react';
import { CVData, ATSAnalysis } from '../types/cv';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Plus, RefreshCw, Briefcase, FileSearch } from 'lucide-react';

interface ATSScannerProps {
  cvData: CVData;
  onUpdateCV: (updated: CVData) => void;
  analysis: ATSAnalysis | null;
  isAnalyzing: boolean;
  onRunAnalysis: (targetJob?: string) => Promise<void>;
}

export const ATSScanner: React.FC<ATSScannerProps> = ({
  cvData,
  onUpdateCV,
  analysis,
  isAnalyzing,
  onRunAnalysis,
}) => {
  const [targetJob, setTargetJob] = useState('');

  // Sample quick vacancies
  const sampleVacancies = [
    {
      title: 'Director de Operaciones & Transformación',
      text: 'Buscamos un Director de Operaciones con 10+ años de trayectoria. Requisitos: Liderazgo de equipos, gestión de P&L, metodologías ágiles (Scrum, Kanban), OKRs, KPIs de rendimiento, transformación digital, inteligencia artificial, optimización de costos, gobernanza de datos y visión estratégica.',
    },
    {
      title: 'VP of Engineering / CTO',
      text: 'Buscamos VP of Engineering. Requisitos indispensables: Arquitectura Cloud (AWS/GCP), Microservicios, escalabilidad, liderazgo técnico de 40+ ingenieros, CI/CD, seguridad ISO 27001, gestión de presupuestos tecnológicos, reclutamiento y cultura de alto rendimiento.',
    },
    {
      title: 'Senior Product Manager / Head of Product',
      text: 'Se requiere Head of Product. Experiencia en visión de producto, roadmap estratégico, análisis de métricas (ARR, Churn, LTV), descubrimiento continuo, design thinking, liderazgo transversal (cross-functional) y lanzamientos B2B a escala internacional.',
    },
  ];

  const handleAddKeywordToSkills = (keyword: string) => {
    // Add to the first skill category or create a new one
    const skills = [...cvData.skills];
    if (skills.length > 0) {
      if (!skills[0].items.some((i) => i.toLowerCase() === keyword.toLowerCase())) {
        skills[0] = {
          ...skills[0],
          items: [...skills[0].items, keyword],
        };
        onUpdateCV({ ...cvData, skills });
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

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner & Scanner Action */}
      <div className="bg-[#111726] border border-slate-800 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold tracking-tight text-white font-serif-executive">
                Analizador ATS & Simulador de Reclutadores
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Algoritmo de escaneo que simula los filtros de Workday, Greenhouse y Taleo, verificando la densidad de palabras clave, impacto de métricas y legibilidad de 6 segundos.
            </p>
          </div>

          <button
            onClick={() => onRunAnalysis(targetJob)}
            disabled={isAnalyzing}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-sm shrink-0 whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Escaneando con IA...' : 'Escanear CV Ahora'}
          </button>
        </div>

        {/* Target Job Box */}
        <div className="mt-5 pt-5 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              Comparar con Oferta de Empleo / Vacante Objetivo (Opcional):
            </span>
            <span className="text-[11px] text-slate-400">Pegar texto para encontrar palabras clave faltantes</span>
          </label>
          <textarea
            value={targetJob}
            onChange={(e) => setTargetJob(e.target.value)}
            placeholder="Pega la descripción de la vacante aquí (responsabilidades, requisitos, habilidades técnicas)..."
            rows={3}
            className="w-full bg-[#0a0d14] border border-slate-700 rounded p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-[11px] text-slate-400">Probar ejemplo rápido:</span>
            {sampleVacancies.map((vac, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTargetJob(vac.text)}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                {vac.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Output Section */}
      {analysis && (
        <div className="space-y-6">
          {/* Main Score & Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Global Score Dial */}
            <div className={`md:col-span-2 border rounded-lg p-5 flex flex-col items-center justify-center text-center ${getScoreColor(analysis.overallScore)}`}>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Puntuación ATS General
              </span>
              <div className="text-6xl font-bold font-mono tabular-nums my-2">
                {analysis.overallScore}
                <span className="text-2xl text-slate-400 font-sans">/100</span>
              </div>
              <p className="text-xs font-medium max-w-xs mt-1">
                {analysis.overallScore >= 80
                  ? 'Listo para pasar el filtro de reclutadores y sistemas de seguimiento de postulantes.'
                  : 'Requiere ajustes antes de postularse para asegurar altas tasas de apertura.'}
              </p>
            </div>

            {/* Sub-Metric Bars */}
            <div className="md:col-span-3 bg-[#111726] border border-slate-800 rounded-lg p-5 space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-serif-executive">
                Desglose por Factores de Selección
              </h3>

              {/* Formato */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Estructura & Formato ATS</span>
                  <span className="font-mono font-semibold tabular-nums text-slate-200">{analysis.formattingScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${getProgressColor(analysis.formattingScore)}`} style={{ width: `${analysis.formattingScore}%` }} />
                </div>
              </div>

              {/* Palabras Clave */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Relevancia de Palabras Clave</span>
                  <span className="font-mono font-semibold tabular-nums text-slate-200">{analysis.keywordsScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${getProgressColor(analysis.keywordsScore)}`} style={{ width: `${analysis.keywordsScore}%` }} />
                </div>
              </div>

              {/* Métricas de Impacto */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Logros Cuantificables & Método STAR</span>
                  <span className="font-mono font-semibold tabular-nums text-slate-200">{analysis.impactScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${getProgressColor(analysis.impactScore)}`} style={{ width: `${analysis.impactScore}%` }} />
                </div>
              </div>

              {/* Legibilidad Reclutador */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Escaneo Rápido de Reclutador (6 seg)</span>
                  <span className="font-mono font-semibold tabular-nums text-slate-200">{analysis.readabilityScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${getProgressColor(analysis.readabilityScore)}`} style={{ width: `${analysis.readabilityScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Recruiter Impression Card */}
          <div className="bg-[#111726] border border-slate-800 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-2">
              <FileSearch className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-serif-executive">
                Evaluación en Primera Lectura del Reclutador
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic bg-[#0a0d14] p-3 rounded border border-slate-800">
              "{analysis.recruiterImpressions}"
            </p>
          </div>

          {/* Keywords Match & Missing Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matched */}
            <div className="bg-[#111726] border border-slate-800 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-serif-executive">
                  Palabras Clave Detectadas en tu CV
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysis.matchedKeywords && analysis.matchedKeywords.length > 0 ? (
                  analysis.matchedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/60"
                    >
                      {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">Ninguna detectada.</span>
                )}
              </div>
            </div>

            {/* Missing */}
            <div className="bg-[#111726] border border-slate-800 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-serif-executive">
                    Palabras Clave Faltantes Críticas
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400">Click para añadir</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysis.missingKeywords && analysis.missingKeywords.length > 0 ? (
                  analysis.missingKeywords.map((kw, i) => (
                    <button
                      key={i}
                      onClick={() => handleAddKeywordToSkills(kw)}
                      className="group flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-amber-950/30 hover:bg-amber-900/50 text-amber-300 border border-amber-800/60 transition-colors"
                      title="Añadir automáticamente esta palabra clave a tu sección de competencias"
                    >
                      <span>{kw}</span>
                      <Plus className="w-3 h-3 group-hover:scale-125 transition-transform" />
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-emerald-400">¡Todas las palabras clave requeridas están presentes!</span>
                )}
              </div>
            </div>
          </div>

          {/* Actionable Tips */}
          {analysis.actionableTips && analysis.actionableTips.length > 0 && (
            <div className="bg-[#111726] border border-slate-800 rounded-lg p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 font-serif-executive">
                Recomendaciones Accionables para Elevar la Tasa de Selección
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {analysis.actionableTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
