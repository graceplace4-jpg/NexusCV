import React, { useState, useEffect } from 'react';
import { CVData, ATSAnalysis } from './types/cv';
import { initialCVData } from './data/initialCV';
import { Header, AppTab } from './components/Header';
import { CVDocument } from './components/CVDocument';
import { ReviewImproveSheet } from './components/ReviewImproveSheet';
import { GuidedBuilderSheet } from './components/GuidedBuilderSheet';
import { ATSEvaluatorSheet } from './components/ATSEvaluatorSheet';
import { DigitalCardPortfolio } from './components/DigitalCardPortfolio';
import { ExportPanel } from './components/ExportPanel';
import { UploadCVModal } from './components/UploadCVModal';

const LOCAL_STORAGE_KEY = 'nexus_cv_data_v1';

export default function App() {
  const [cvData, setCvData] = useState<CVData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only keep photo if explicitly attached by user (remove previous demo photos)
        if (
          parsed.avatarUrl &&
          (parsed.avatarUrl.includes('executive_woman_formal') ||
           parsed.avatarUrl.includes('executive_portrait_avatar') ||
           parsed.avatarUrl.startsWith('/src/assets/images/'))
        ) {
          parsed.avatarUrl = '';
        }
        if (!parsed.templateStyle) {
          parsed.templateStyle = 'canva-two-col';
        }
        return parsed;
      }
      return initialCVData;
    } catch {
      return initialCVData;
    }
  });

  const [activeTab, setActiveTab] = useState<AppTab>('review');
  const [showAvatar, setShowAvatar] = useState(true);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cvData));
      setSaveToast(true);
      const timer = setTimeout(() => setSaveToast(false), 1500);
      return () => clearTimeout(timer);
    } catch (e) {
      console.error('Error saving CV to localStorage:', e);
    }
  }, [cvData]);

  // Initial ATS run on mount
  useEffect(() => {
    runATSAnalysis();
  }, []);

  const runATSAnalysis = async (targetJob?: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/cv/analyze-ats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvData,
          targetJobDescription: targetJob,
        }),
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error('Error running ATS analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrintPDF = () => {
    // Trigger native browser print which renders A4 PDF via @media print
    window.print();
  };

  const handleImportJSON = (imported: CVData) => {
    setCvData(imported);
    runATSAnalysis();
  };

  const handleUploadSuccess = (imported: CVData) => {
    setCvData(imported);
    setActiveTab('review');
    // Refresh ATS score with newly imported CV
    setTimeout(() => {
      runATSAnalysis();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#070a10] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 3-Zone Header Contract (Sheets 1, 2, 3 Navigation) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPrintPDF={handlePrintPDF}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        atsScore={analysis?.overallScore}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 print:hidden">
        {/* Autosave subtle indicator */}
        <div className="no-print flex items-center justify-between text-[11px] text-slate-500 mb-4 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Autoguardado en tiempo real activo</span>
            {saveToast && <span className="text-emerald-400 font-medium">· Cambios guardados</span>}
          </div>

          <div className="text-slate-400 hidden sm:block">
            <span>Plantilla: {!cvData.templateStyle || cvData.templateStyle === 'canva-two-col' ? 'Estilo Adjunto (2 Col)' : cvData.templateStyle === 'executive-one-col' ? 'Ejecutivo 1 Columna' : 'Minimalista'}</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>A4 ATS-Verified</span>
          </div>
        </div>

        {/* HOJA 1: CARGAR, REVISAR, EDITAR CON PROPUESTAS DE MEJORA DE PRESENTACIÓN */}
        {activeTab === 'review' && (
          <ReviewImproveSheet
            data={cvData}
            onChange={setCvData}
            showAvatar={showAvatar}
            setShowAvatar={setShowAvatar}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onPrintPDF={handlePrintPDF}
            onGoToGuidedBuilder={() => setActiveTab('guided')}
          />
        )}

        {/* HOJA 2: ELABORACIÓN GUIADA PASO A PASO (CV COMPETITIVO & ATS-PROOF) */}
        {activeTab === 'guided' && (
          <GuidedBuilderSheet
            data={cvData}
            onChange={setCvData}
            showAvatar={showAvatar}
            onGoToEvaluation={() => setActiveTab('evaluate')}
            onPrintPDF={handlePrintPDF}
          />
        )}

        {/* HOJA 3: EVALUACIÓN DE CV (% Y RESUMEN DE ÍTEMS A MEJORAR) */}
        {activeTab === 'evaluate' && (
          <div className="no-print max-w-5xl mx-auto">
            <ATSEvaluatorSheet
              data={cvData}
              onChange={setCvData}
              analysis={analysis}
              isAnalyzing={isAnalyzing}
              onRunAnalysis={runATSAnalysis}
              onGoToEditor={() => setActiveTab('review')}
            />
          </div>
        )}

        {/* VISTA AUXILIAR: PORTAFOLIO WEB PERSONAL (TARJETA DIGITAL MÓVIL) */}
        {activeTab === 'portfolio' && (
          <div className="no-print">
            <DigitalCardPortfolio data={cvData} onPrintPDF={handlePrintPDF} />
          </div>
        )}

        {/* VISTA AUXILIAR: EXPORTACIÓN LINKEDIN, INDEED & COPIA JSON */}
        {activeTab === 'export' && (
          <div className="no-print max-w-4xl mx-auto">
            <ExportPanel
              data={cvData}
              onPrintPDF={handlePrintPDF}
              onImportJSON={handleImportJSON}
            />
          </div>
        )}
      </main>

      {/* Hidden container for print when outside review tab */}
      <div className="hidden print:block printable-cv-root">
        <CVDocument data={cvData} showAvatar={showAvatar} />
      </div>

      {/* Footer */}
      <footer className="no-print border-t border-slate-900 bg-[#06080e] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300 font-serif-executive">NexusCV</span>
            <span aria-hidden="true">·</span>
            <span>Suite Ejecutiva de Alto Contraste & ATS-Proof</span>
          </div>

          <div className="text-slate-400">
            <span>Optimizado para procesos de selección y reclutamiento ejecutivo</span>
          </div>
        </div>
      </footer>

      {/* Modal para Carga de CV (PDF / Texto / JSON) con IA */}
      <UploadCVModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}
