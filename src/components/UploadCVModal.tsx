import React, { useState } from 'react';
import { CVData } from '../types/cv';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Loader2,
  ArrowRight,
  FolderOpen,
  FileCheck
} from 'lucide-react';

interface UploadCVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: CVData) => void;
}

export const UploadCVModal: React.FC<UploadCVModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeMode, setActiveMode] = useState<'file' | 'text'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setErrorMsg(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setErrorMsg(null);
    }
  };

  const processUpload = async () => {
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      if (activeMode === 'file') {
        if (!selectedFile) {
          setErrorMsg('Por favor selecciona un archivo PDF o documento de CV.');
          setIsProcessing(false);
          return;
        }

        // If it's a JSON backup, parse directly
        if (selectedFile.name.endsWith('.json')) {
          setProgressStep('Leyendo archivo JSON...');
          const text = await selectedFile.text();
          const parsed = JSON.parse(text);
          if (parsed.fullName) {
            onSuccess(parsed);
            onClose();
            return;
          }
        }

        setProgressStep('Leyendo y codificando archivo PDF...');
        const reader = new FileReader();

        reader.onerror = () => {
          setErrorMsg('No se pudo leer el archivo seleccionado en el navegador.');
          setIsProcessing(false);
        };

        reader.onload = async () => {
          try {
            const resultStr = reader.result as string;
            const base64Data = resultStr.includes(',') ? resultStr.split(',')[1] : resultStr;

            setProgressStep('Gemini 3.8 Flash analizando PDF y extrayendo estructura...');

            const res = await fetch('/api/cv/parse-document', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                base64Data,
                mimeType: selectedFile.type || 'application/pdf',
                fileName: selectedFile.name,
              }),
            });

            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(err.error || 'Error al procesar el archivo PDF');
            }

            const data = await res.json();
            setProgressStep('¡Datos extraídos con éxito!');
            setTimeout(() => {
              onSuccess(data);
              onClose();
            }, 500);
          } catch (err: any) {
            console.error('Upload process error:', err);
            setErrorMsg(err.message || 'Error al comunicarse con el servicio de IA. Verifica que el archivo PDF no esté protegido.');
            setIsProcessing(false);
          }
        };

        reader.readAsDataURL(selectedFile);
      } else {
        // Raw text mode
        if (!rawText.trim()) {
          setErrorMsg('Por favor pega el contenido de tu currículum en el área de texto.');
          setIsProcessing(false);
          return;
        }

        setProgressStep('Gemini 3.8 Flash estructurando texto...');
        const res = await fetch('/api/cv/parse-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rawText,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Error al procesar el texto');
        }

        const data = await res.json();
        setProgressStep('¡CV estructurado con éxito!');
        setTimeout(() => {
          onSuccess(data);
          onClose();
        }, 500);
      }
    } catch (err: any) {
      console.error('Unexpected upload error:', err);
      setErrorMsg(err.message || 'Ocurrió un error inesperado al procesar.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f1422] border border-slate-700 w-full max-w-xl rounded-xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white font-serif-executive">
              Cargar y Mejorar tu CV Actual con IA
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Sube tu currículum en formato <strong className="text-white">PDF</strong>. Nuestro modelo <strong className="text-blue-400">Gemini 3.8 Flash</strong> extraerá toda tu trayectoria, datos de contacto, logros cuantificables y habilidades para que puedas editarlos, optimizarlos para ATS y publicarlos.
          </p>

          {/* Mode Tabs */}
          <div className="flex items-center bg-[#0a0d14] p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveMode('file')}
              disabled={isProcessing}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                activeMode === 'file'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Cargar Archivo PDF / Documento</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('text')}
              disabled={isProcessing}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                activeMode === 'text'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Pegar Texto de tu CV</span>
            </button>
          </div>

          {/* File Upload Zone */}
          {activeMode === 'file' && (
            <div className="space-y-3">
              {/* Native, reliable file input wrapped with a real button label */}
              <input
                id="cv-modal-pdf-file"
                type="file"
                accept=".pdf,application/pdf,.txt,.json,.doc,.docx"
                onChange={handleFileChange}
                disabled={isProcessing}
                className="sr-only"
              />

              {!selectedFile ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-6 text-center bg-[#0a0d14] transition-colors flex flex-col items-center justify-center gap-3"
                >
                  <div className="p-3 bg-blue-950/40 rounded-full border border-blue-900/60 text-blue-400">
                    <UploadCloud className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-white">
                      Arrastra tu archivo PDF aquí o selecciónalo desde tu dispositivo
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Formatos soportados: PDF (.pdf), texto plano (.txt) o JSON
                    </p>
                  </div>

                  {/* PROMINENT DIRECT CLICK BUTTON */}
                  <label
                    htmlFor="cv-modal-pdf-file"
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer transition-all shadow-md hover:shadow-blue-600/30 active:scale-95"
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span>Examinar y Seleccionar PDF</span>
                  </label>
                </div>
              ) : (
                /* Selected File State */
                <div className="border border-emerald-900/60 bg-emerald-950/20 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-emerald-900/40 text-emerald-400 border border-emerald-800/60">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white break-all">{selectedFile.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                            PDF Listo
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    </div>

                    <label
                      htmlFor="cv-modal-pdf-file"
                      className="text-xs text-slate-400 hover:text-white underline cursor-pointer shrink-0 ml-2"
                    >
                      Cambiar archivo
                    </label>
                  </div>

                  {/* Immediate Action Button for the selected file */}
                  <button
                    type="button"
                    onClick={processUpload}
                    disabled={isProcessing}
                    className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{progressStep || 'Procesando PDF con Gemini 3.8 Flash...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Procesar este PDF e Importar al Editor</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Paste Raw Text Area */}
          {activeMode === 'text' && (
            <div className="space-y-3">
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Pega aquí el contenido completo de tu CV (datos de contacto, experiencia, formación, competencias)..."
                rows={8}
                className="w-full bg-[#0a0d14] border border-slate-700 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono leading-relaxed"
              />
              <button
                type="button"
                onClick={processUpload}
                disabled={isProcessing || !rawText.trim()}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{progressStep || 'Estructurando texto...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Estructurar Texto e Importar</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Error notice */}
          {errorMsg && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold block">Aviso:</span>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          {/* Processing banner if in progress */}
          {isProcessing && (
            <div className="p-3.5 bg-blue-950/40 border border-blue-800/60 rounded-lg text-xs text-blue-300 flex items-center gap-3 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400 shrink-0" />
              <div>
                <span className="font-semibold block text-white">Extrayendo datos de tu CV</span>
                <span className="text-[11px] text-blue-200">{progressStep}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#0a0d14] border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>

          <span className="text-[11px] text-slate-500 font-mono">
            NexusCV · Gemini 3.8 Flash Parser
          </span>
        </div>
      </div>
    </div>
  );
};
