import React from 'react';
import { Download, Sparkles, FileText, Smartphone, Share2, UploadCloud, Compass, CheckSquare } from 'lucide-react';

export type AppTab = 'review' | 'guided' | 'evaluate' | 'portfolio' | 'export';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onPrintPDF: () => void;
  onOpenUpload: () => void;
  atsScore?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onPrintPDF,
  onOpenUpload,
  atsScore,
}) => {
  return (
    <header className="no-print bg-[#0a0d14] border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-bold tracking-tight text-white font-serif-executive">
            NexusCV
          </span>
          <span className="text-[10px] uppercase tracking-widest text-blue-400 font-mono bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800/40 hidden sm:inline">
            Executive Suite
          </span>
        </div>

        {/* Zone 2: 3 Primary Sheets + Auxiliary Views */}
        <nav className="flex items-center gap-1 sm:gap-4 text-xs font-medium overflow-x-auto no-scrollbar">
          {/* HOJA 1 */}
          <button
            onClick={() => setActiveTab('review')}
            className={`flex items-center gap-1.5 py-2 px-3 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'review'
                ? 'border-blue-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>1. Cargar & Optimizar</span>
          </button>

          {/* HOJA 2 */}
          <button
            onClick={() => setActiveTab('guided')}
            className={`flex items-center gap-1.5 py-2 px-3 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'guided'
                ? 'border-blue-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>2. Creador Guiado ATS</span>
          </button>

          {/* HOJA 3 */}
          <button
            onClick={() => setActiveTab('evaluate')}
            className={`flex items-center gap-1.5 py-2 px-3 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'evaluate'
                ? 'border-blue-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>3. Evaluación & %</span>
            {atsScore !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                atsScore >= 80 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                {atsScore}%
              </span>
            )}
          </button>

          {/* AUX: Portafolio */}
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-1.5 py-2 px-3 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'portfolio'
                ? 'border-blue-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Portafolio Móvil</span>
          </button>

          {/* AUX: Exportar */}
          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-1.5 py-2 px-3 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'export'
                ? 'border-blue-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold tracking-wide text-slate-200 bg-slate-800/90 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 rounded transition-colors whitespace-nowrap shrink-0 shadow-sm"
            title="Cargar un archivo de CV (PDF o texto) para editarlo y mejorarlo con IA"
          >
            <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">Cargar</span> CV
          </button>

          <button
            onClick={onPrintPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold tracking-wide text-white bg-blue-600 rounded hover:bg-blue-500 active:bg-blue-700 transition-colors whitespace-nowrap shrink-0 shadow-sm"
            title="Descargar o imprimir CV en formato PDF de alta definición"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
