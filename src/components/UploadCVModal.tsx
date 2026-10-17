import React, { useState, useRef } from 'react';
import { CVData } from '../types/cv';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Sparkles, Loader2, ArrowRight } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

        setProgressStep('Codificando documento...');
        const reader = new FileReader();

        reader.onload = async () => {
          try {
            const base64Data = (reader.result as string).split(',')[1];
            setProgressStep('Gemini 3.8 Flash extrayendo estructura y logros...');

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
              const err = await res.json();
              throw new Error(err.error || 'Error al procesar el archivo');
            }

            const data = await res.json();
            setProgressStep('¡CV estructurado con éxito!');
            setTimeout(() => {
              onSuccess(data);
              onClose();
            }, 600);
          } catch (err: any) {
            setErrorMsg(err.message || 'Error al comunicarse con el servicio de IA.');
            setIsProcessing(false);
          }
        };

        reader.readAsDataURL(selectedFile);
      } else {
        // Raw text mode
        if (!rawText.trim()) {
          setErrorMsg('Por favor pega el contenido de tu currículum.');
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
          const err = await res.json();
          throw new Error(err.error || 'Error al procesar el texto');
        }

        const data = await res.json();
        setProgressStep('¡CV estructurado con éxito!');
        setTimeout(() => {
          onSuccess(data);
          onClose();
        }, 600);
      }
    } catch (err: any) {
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
            Sube tu currículum en formato <strong className="text-white">PDF</strong>, documento de texto o JSON. Nuestro modelo <strong className="text-blue-400">Gemini 3.8 Flash</strong> extraerá de forma inteligente toda tu trayectoria, datos de contacto, logros y habilidades para que puedas editarlos, optimizarlos para ATS y publicarlos en tu portafolio web.
          </p>

          {/* Mode Tabs */}
          <div className="flex items-center bg-[#0a0d14] p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveMode('file')}
              disabled={isProcessing}
              className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors ${
                activeMode === 'file'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Subir Archivo (PDF / TXT / JSON)
            </button>
            <button
              onClick={() => setActiveMode('text')}
              disabled={isProcessing}
              className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors ${
                activeMode === 'text'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pegar Texto de tu CV
            </button>
          </div>

          {/* File Upload Dropzone */}
          {activeMode === 'file' && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                selectedFile
                  ? 'border-blue-500 bg-blue-950/20'
                  : 'border-slate-700 hover:border-slate-500 bg-[#0a0d14]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.json,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <FileText className="w-10 h-10 text-blue-400" />
                  <span className="text-xs font-bold text-white">{selectedFile.name}</span>
                  <span className="text-[11px] text-slate-400">
                    {(selectedFile.size / 1024).toFixed(1)} KB · Click para cambiar archivo
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <UploadCloud className="w-10 h-10 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-200">
                    Arrastra tu archivo aquí o haz clic para explorar
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Formatos soportados: PDF, TXT o JSON de respaldo
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Paste Raw Text Area */}
          {activeMode === 'text' && (
            <div>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Pega aquí el contenido completo de tu CV (experiencia, educación, contacto, habilidades)..."
                rows={8}
                className="w-full bg-[#0a0d14] border border-slate-700 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono leading-relaxed"
              />
            </div>
          )}

          {/* Error notice */}
          {errorMsg && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Loading status */}
          {isProcessing && (
            <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-lg text-xs text-blue-300 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span className="font-medium">{progressStep}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#0a0d14] border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={processUpload}
            disabled={isProcessing || (activeMode === 'file' && !selectedFile) || (activeMode === 'text' && !rawText.trim())}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-sm"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Extrayendo con IA...</span>
              </>
            ) : (
              <>
                <span>Procesar e Importar al Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
