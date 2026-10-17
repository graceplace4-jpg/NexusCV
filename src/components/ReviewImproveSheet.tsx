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

  const [isDirectUploading, setIsDirectUploading] = useState(false);
  const [directUploadStatus, setDirectUploadStatus] = useState<string>('');

  const handleDirectFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsDirectUploading(true);
    setDirectUploadStatus('Leyendo archivo PDF...');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const resultStr = reader.result as string;
          const base64Data = resultStr.includes(',') ? resultStr.split(',')[1] : resultStr;
          setDirectUploadStatus('Gemini 3.8 Flash extrayendo estructura del PDF...');

          const res = await fetch('/api/cv/parse-document', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              base64Data,
              mimeType: file.type || 'application/pdf',
              fileName: file.name,
            }),
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Error al procesar el PDF');
          }

          const parsed = await res.json();
          onChange(parsed);
          setDirectUploadStatus('¡PDF cargado exitosamente!');
          setTimeout(() => {
            setIsDirectUploading(false);
            setDirectUploadStatus('');
          }, 1500);
        } catch (err: any) {
          console.error('Direct upload error:', err);
          alert(err.message || 'Error al procesar el archivo PDF');
          setIsDirectUploading(false);
          setDirectUploadStatus('');
        }
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsDirectUploading(false);
      setDirectUploadStatus('');
    }
  };

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
          {/* Direct File Picker (Native label/input that triggers immediately) */}
          <input
            id="sheet1-direct-pdf-input"
            type="file"
            accept=".pdf,application/pdf,.txt,.json,.doc,.docx"
            onChange={handleDirectFileSelect}
            disabled={isDirectUploading}
            className="sr-only"
          />
          <label
            htmlFor="sheet1-direct-pdf-input"
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-500 cursor-pointer transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isDirectUploading ? directUploadStatus || 'Cargando PDF...' : 'Seleccionar Archivo PDF'}</span>
          </label>

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
            title="Abrir ventana con opción de arrastrar o pegar texto"
          >
            <span>Pegar Texto / Más</span>
          </button>

          <button
            onClick={fetchPresentationProposals}
            disabled={isLoadingProposals}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            <Sparkles className={`w-3.5 h-3.5 text-blue-400 ${isLoadingProposals ? 'animate-spin' : ''}`} />
            <span>{isLoadingProposals ? 'Generando...' : 'Propuestas de Mejora'}</span>
          </button>
        </div>
      </div>

      {/* Direct upload loading banner */}
      {isDirectUploading && (
        <div className="p-3.5 bg-blue-950/60 border border-blue-800 rounded-xl text-xs text-blue-200 flex items-center gap-3 animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-400 shrink-0" />
          <span className="font-semibold">{directUploadStatus}</span>
        </div>
      )}

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
          <div className="bg-[#111726] border border-slate-800 rounded-lg p-3 mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-white">Presentación Impresa A4</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded">
                {data.templateStyle === 'executive-one-col'
                  ? '1 Columna'
                  : data.templateStyle === 'minimalist'
                  ? 'Minimalista'
                  : 'Estilo Adjunto (2 Col)'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <div className="bg-[#0b0f19] p-0.5 rounded border border-slate-800 flex items-center text-[11px]">
                <button
                  type="button"
                  onClick={() => onChange({ ...data, templateStyle: 'canva-two-col' })}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    !data.templateStyle || data.templateStyle === 'canva-two-col'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Formato de 2 columnas con barra lateral y foto circular según el diseño adjunto"
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
                  title="Formato corporativo tradicional 1 columna de alto contraste"
                >
                  1 Columna
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ ...data, templateStyle: 'minimalist' })}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    data.templateStyle === 'minimalist'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Formato minimalista editorial"
                >
                  Minimalista
                </button>
              </div>

              <button
                onClick={onPrintPDF}
                className="text-xs px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1.5 transition-colors shadow-sm ml-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF A4</span>
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
