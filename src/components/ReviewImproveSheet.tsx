import React, { useState } from 'react';
import { CVData } from '../types/cv';
import { CVDocument } from './CVDocument';
import { CVEditor } from './CVEditor';
import {
  UploadCloud,
  Sparkles,
  FileText,
  Download,
  Eye,
  Check,
  Edit3,
  Wand2,
  Sliders,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface ReviewImproveSheetProps {
  data: CVData;
  onChange: (updated: CVData) => void;
  showAvatar: boolean;
  setShowAvatar: (val: boolean) => void;
  onOpenUpload: () => void;
  onPrintPDF: () => void;
  onGoToGuidedBuilder: () => void;
}

export const ReviewImproveSheet: React.FC<ReviewImproveSheetProps> = ({
  data,
  onChange,
  showAvatar,
  setShowAvatar,
  onOpenUpload,
  onPrintPDF,
  onGoToGuidedBuilder,
}) => {
  const [mobileSubTab, setMobileSubTab] = useState<'editor' | 'preview'>('editor');
  const [proposals, setProposals] = useState<{
    visualHeadline?: string;
    improvedSummaryProposal?: string;
    presentationTips?: string[];
    suggestedStyle?: string;
  } | null>(null);
  const [isLoadingProposals, setIsLoadingProposals] = useState(false);
  const [appliedProposal, setAppliedProposal] = useState(false);

  const fetchPresentationProposals = async () => {
    setIsLoadingProposals(true);
    setAppliedProposal(false);
    try {
      const res = await fetch('/api/cv/presentation-proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData: data }),
      });
      const result = await res.json();
      setProposals(result);
    } catch (err) {
      console.error('Error fetching proposals:', err);
    } finally {
      setIsLoadingProposals(false);
    }
  };

  const handleApplySummaryProposal = () => {
    if (proposals?.improvedSummaryProposal) {
      onChange({ ...data, summary: proposals.improvedSummaryProposal });
      setAppliedProposal(true);
      setTimeout(() => setAppliedProposal(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Action Strip for Sheet 1 */}
      <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 text-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
              Hoja 1
            </span>
            <h1 className="text-lg font-bold tracking-tight text-white font-serif-executive">
              Cargar, Revisar y Editar con Propuestas de Mejora de Presentación
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Sube tu currículum existente en PDF, Word o texto, visualízalo en tiempo real con maquetación de alto contraste y recibe propuestas de diseño y redacción ejecutiva para perfeccionar su impacto visual.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-sm"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Cargar Archivo de CV</span>
          </button>

          <button
            onClick={fetchPresentationProposals}
            disabled={isLoadingProposals}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 text-blue-400 ${isLoadingProposals ? 'animate-spin' : ''}`} />
            <span>{isLoadingProposals ? 'Generando...' : 'Propuestas de Mejora con IA'}</span>
          </button>
        </div>
      </div>

      {/* AI Presentation Proposals Banner */}
      {proposals && (
        <div className="bg-gradient-to-r from-blue-950/40 via-[#0e1422] to-slate-900 border border-blue-900/60 rounded-xl p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-blue-900/40 pb-3">
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white font-serif-executive">
                Propuestas de Mejora Editorial y de Presentación
              </h2>
            </div>
            <span className="text-[11px] text-blue-300 font-mono">
              Estilo recomendado: {proposals.suggestedStyle || 'Ejecutivo Tradicional'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Proposal 1: Summary Refinement */}
            <div className="bg-[#0a0d14] p-4 rounded-lg border border-slate-800 space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                Propuesta de Extracto Ejecutivo Pulido
              </span>
              <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/60 p-3 rounded border border-slate-800">
                "{proposals.improvedSummaryProposal}"
              </p>
              <button
                onClick={handleApplySummaryProposal}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
              >
                {appliedProposal ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{appliedProposal ? '¡Extracto Aplicado al CV!' : 'Aplicar esta Redacción al CV'}</span>
              </button>
            </div>

            {/* Proposal 2: Visual and Formatting Tips */}
            <div className="bg-[#0a0d14] p-4 rounded-lg border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                Claves de Presentación para Impactar al Reclutador
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {(proposals.presentationTips || []).map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex items-center bg-[#111726] border border-slate-800 rounded-lg p-1">
        <button
          onClick={() => setMobileSubTab('editor')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded transition-colors ${
            mobileSubTab === 'editor' ? 'bg-blue-600 text-white' : 'text-slate-400'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Formulario de Edición</span>
        </button>
        <button
          onClick={() => setMobileSubTab('preview')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded transition-colors ${
            mobileSubTab === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-400'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Vista Previa Impresa A4</span>
        </button>
      </div>

      {/* Main Split Grid: Editor (Left) & High-Contrast Document Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Editor */}
        <div className={`lg:col-span-6 ${mobileSubTab === 'editor' ? 'block' : 'hidden lg:block'}`}>
          <CVEditor
            data={data}
            onChange={onChange}
            showAvatar={showAvatar}
            setShowAvatar={setShowAvatar}
            onOpenUpload={onOpenUpload}
          />
        </div>

        {/* Right Column: Live Printable Document Review */}
        <div className={`lg:col-span-6 ${mobileSubTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-[#111726] border border-slate-800 rounded-lg p-3 mb-3 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-white">Presentación Impresa A4 (Alto Contraste)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onPrintPDF}
                className="text-xs px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar PDF</span>
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
