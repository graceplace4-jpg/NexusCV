import React, { useState } from 'react';
import { CVData, ExperienceItem, EducationItem, SkillCategory, CertificationItem, ProjectItem } from '../types/cv';
import {
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Plus,
  Trash2,
  Wand2,
  Award,
  FolderGit2,
  RotateCcw,
  Eye,
  Check,
  ChevronDown,
  ChevronUp,
  UploadCloud
} from 'lucide-react';
import { initialCVData } from '../data/initialCV';

interface CVEditorProps {
  data: CVData;
  onChange: (updated: CVData) => void;
  showAvatar: boolean;
  setShowAvatar: (val: boolean) => void;
  onOpenUpload: () => void;
}

export const CVEditor: React.FC<CVEditorProps> = ({
  data,
  onChange,
  showAvatar,
  setShowAvatar,
  onOpenUpload,
}) => {
  const [activeSection, setActiveSection] = useState<'personal' | 'summary' | 'experience' | 'skills' | 'education' | 'projects'>('personal');
  const [enhancingBulletIndex, setEnhancingBulletIndex] = useState<{ expId: string; index: number } | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryOptions, setSummaryOptions] = useState<{ title: string; content: string }[] | null>(null);

  // Field change helpers
  const handlePersonalChange = (field: keyof CVData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  // Enhance specific bullet point with AI (STAR Method)
  const handleEnhanceBullet = async (expId: string, bulletIndex: number, currentText: string) => {
    if (!currentText.trim()) return;
    setEnhancingBulletIndex({ expId, index: bulletIndex });
    setIsEnhancing(true);

    try {
      const exp = data.experiences.find((e) => e.id === expId);
      const res = await fetch('/api/cv/enhance-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullet: currentText,
          role: exp?.role || data.title,
          targetIndustry: 'Ejecutivo y Tecnología',
        }),
      });
      const result = await res.json();
      if (result.enhancedBullet) {
        const updatedExperiences = data.experiences.map((e) => {
          if (e.id === expId) {
            const newHighlights = [...e.highlights];
            newHighlights[bulletIndex] = result.enhancedBullet;
            return { ...e, highlights: newHighlights };
          }
          return e;
        });
        onChange({ ...data, experiences: updatedExperiences });
      }
    } catch (err) {
      console.error('Error enhancing bullet:', err);
    } finally {
      setIsEnhancing(false);
      setEnhancingBulletIndex(null);
    }
  };

  // Generate executive summaries with AI
  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    setSummaryOptions(null);
    try {
      const res = await fetch('/api/cv/gen-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: data.title,
          yearsOfExperience: '10+',
          keySkills: data.skills.flatMap((s) => s.items.slice(0, 3)),
          industry: 'Liderazgo Corporativo & Tecnología',
        }),
      });
      const result = await res.json();
      if (result.summaries) {
        setSummaryOptions(result.summaries);
      }
    } catch (err) {
      console.error('Error generating summary:', err);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Add/Remove Experience
  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: 'Nueva Empresa / Corporación',
      role: 'Cargo Ejecutivo / Director',
      location: 'Madrid, España',
      startDate: '2022',
      endDate: 'Presente',
      current: true,
      highlights: [
        'Lideró el equipo hacia un incremento del 20% en objetivos clave anuales.',
      ],
    };
    onChange({ ...data, experiences: [newExp, ...data.experiences] });
  };

  const handleRemoveExperience = (id: string) => {
    onChange({ ...data, experiences: data.experiences.filter((e) => e.id !== id) });
  };

  const handleAddHighlight = (expId: string) => {
    const updated = data.experiences.map((exp) => {
      if (exp.id === expId) {
        return { ...exp, highlights: [...exp.highlights, ''] };
      }
      return exp;
    });
    onChange({ ...data, experiences: updated });
  };

  const handleRemoveHighlight = (expId: string, index: number) => {
    const updated = data.experiences.map((exp) => {
      if (exp.id === expId) {
        const h = [...exp.highlights];
        h.splice(index, 1);
        return { ...exp, highlights: h };
      }
      return exp;
    });
    onChange({ ...data, experiences: updated });
  };

  const handleHighlightChange = (expId: string, index: number, val: string) => {
    const updated = data.experiences.map((exp) => {
      if (exp.id === expId) {
        const h = [...exp.highlights];
        h[index] = val;
        return { ...exp, highlights: h };
      }
      return exp;
    });
    onChange({ ...data, experiences: updated });
  };

  // Reset to Demo
  const handleResetDemo = () => {
    if (window.confirm('¿Deseas restaurar los datos del CV de demostración ejecutiva?')) {
      onChange(initialCVData);
    }
  };

  return (
    <div className="bg-[#111726] border border-slate-800 rounded-lg p-5 text-slate-100 space-y-6">
      {/* Top Section Nav Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'personal', label: 'Contacto & Rol', icon: User },
            { id: 'summary', label: 'Resumen Ejecutivo', icon: Sparkles },
            { id: 'experience', label: 'Experiencias (STAR)', icon: Briefcase },
            { id: 'skills', label: 'Competencias ATS', icon: Wand2 },
            { id: 'education', label: 'Educación & Cursos', icon: GraduationCap },
            { id: 'projects', label: 'Proyectos & Portafolio', icon: FolderGit2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* Avatar Toggle */}
          <button
            onClick={() => setShowAvatar(!showAvatar)}
            className={`text-xs px-2.5 py-1 rounded border transition-colors flex items-center gap-1 ${
              showAvatar ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-transparent border-slate-800 text-slate-500'
            }`}
            title="Alternar inclusión de fotografía ejecutiva en el CV impreso"
          >
            <Eye className="w-3 h-3" />
            <span>Foto en CV: {showAvatar ? 'Sí' : 'No'}</span>
          </button>

          <button
            onClick={handleResetDemo}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Restaurar datos ejecutivos iniciales"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restaurar Demo</span>
          </button>
        </div>
      </div>

      {/* Quick Upload Action Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-blue-950/30 border border-blue-900/50 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30 shrink-0">
            <UploadCloud className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">¿Tienes tu CV en PDF o documento?</h4>
            <p className="text-[11px] text-slate-400">Cárgalo para que Gemini 3.8 Flash extraiga y optimice tu información al instante.</p>
          </div>
        </div>
        <button
          onClick={onOpenUpload}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded transition-colors whitespace-nowrap shrink-0 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cargar Archivo de CV</span>
        </button>
      </div>

      {/* 1. INFORMACIÓN PERSONAL */}
      {activeSection === 'personal' && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-serif-executive">
            Datos Personales y Contacto Directo
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo</label>
              <input
                type="text"
                value={data.fullName}
                onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                className="w-full bg-[#0a0d14] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Título Profesional / Cargo Ejecutivo</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => handlePersonalChange('title', e.target.value)}
                className="w-full bg-[#0a0d14] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => handlePersonalChange('email', e.target.value)}
                className="w-full bg-[#0a0d14] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono / WhatsApp</label>
              <input
                type="text"
                value={data.phone}
                onChange={(e) => handlePersonalChange('phone', e.target.value)}
                className="w-full bg-[#0a0d14] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ubicación y Disponibilidad</label>
              <input
                type="text"
                value={data.location}
                onChange={(e) => handlePersonalChange('location', e.target.value)}
                className="w-full bg-[#0a0d14] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                placeholder="Ej. Madrid, España (Disponible para reubicación)"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Perfil de LinkedIn (URL o slug)</label>
              <input
                type="text"
                value={data.linkedin}
                onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                className="w-full bg-[#0a0d14] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                placeholder="linkedin.com/in/tu-perfil"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Sitio Web Personal / Portafolio</label>
              <input
                type="text"
                value={data.website}
                onChange={(e) => handlePersonalChange('website', e.target.value)}
                className="w-full bg-[#0a0d14] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                placeholder="tuweb.com"
              />
            </div>

            <div className="sm:col-span-2 bg-[#0d121f] border border-slate-700/80 rounded-lg p-3">
              <label className="block text-xs font-semibold text-slate-200 mb-2">
                Fotografía del CV (Mujer ejecutiva 40 años formal o personalizada)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <img
                  src={data.avatarUrl || '/src/assets/images/executive_woman_formal_1792251757360.jpg'}
                  alt="Avatar"
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 shadow-sm shrink-0"
                />
                <div className="flex-1 w-full space-y-1.5">
                  <input
                    type="text"
                    value={data.avatarUrl}
                    onChange={(e) => handlePersonalChange('avatarUrl', e.target.value)}
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono text-[11px]"
                    placeholder="URL de foto o ruta de archivo"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handlePersonalChange(
                          'avatarUrl',
                          '/src/assets/images/executive_woman_formal_1792251757360.jpg'
                        )
                      }
                      className="text-[11px] px-2 py-0.5 rounded bg-blue-600/20 text-blue-300 border border-blue-500/40 hover:bg-blue-600/30 transition-colors"
                    >
                      Usar foto ejecutiva (Mujer 40 años formal)
                    </button>
                    <label className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 cursor-pointer transition-colors">
                      Subir desde mi equipo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              handlePersonalChange('avatarUrl', reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. RESUMEN EJECUTIVO & IA */}
      {activeSection === 'summary' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-serif-executive">
                Perfil Ejecutivo & Propuesta de Valor
              </h3>
              <p className="text-xs text-slate-400">
                El extracto que los reclutadores leen en los primeros 6 segundos.
              </p>
            </div>

            <button
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-500 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingSummary ? 'animate-spin' : ''}`} />
              <span>{isGeneratingSummary ? 'Redactando con IA...' : 'Generar Opciones con IA'}</span>
            </button>
          </div>

          <textarea
            value={data.summary}
            onChange={(e) => handlePersonalChange('summary', e.target.value)}
            rows={5}
            className="w-full bg-[#0a0d14] border border-slate-700 rounded p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-blue-500"
            placeholder="Redacta tu propuesta de valor, años de experiencia, principales fortalezas y métricas clave..."
          />

          {/* AI Generated Suggestions Box */}
          {summaryOptions && (
            <div className="bg-[#0a0d14] border border-blue-900/60 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300 font-serif-executive">
                  Propuestas Generadas por Gemini 3.8 Flash
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {summaryOptions.map((opt, i) => (
                  <div key={i} className="bg-[#111726] p-3 rounded border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-slate-300 block">{opt.title}</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{opt.content}</p>
                    <button
                      onClick={() => handlePersonalChange('summary', opt.content)}
                      className="text-xs px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1 transition-colors"
                    >
                      <Check className="w-3 h-3" />
                      <span>Usar este Resumen</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. EXPERIENCIA LABORAL (STAR METHOD) */}
      {activeSection === 'experience' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-serif-executive">
                Experiencia Profesional (Metodología STAR)
              </h3>
              <p className="text-xs text-slate-400">
                Logros con impacto cuantificable y verbos de acción contundentes.
              </p>
            </div>

            <button
              onClick={handleAddExperience}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-500 transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Experiencia</span>
            </button>
          </div>

          <div className="space-y-6">
            {data.experiences.map((exp) => (
              <div key={exp.id} className="bg-[#0a0d14] border border-slate-800 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-slate-200">
                    {exp.role} · <span className="text-blue-400">{exp.company}</span>
                  </span>
                  <button
                    onClick={() => handleRemoveExperience(exp.id)}
                    className="text-rose-400 hover:text-rose-300 p-1"
                    title="Eliminar experiencia"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Empresa</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = data.experiences.map((item) =>
                          item.id === exp.id ? { ...item, company: e.target.value } : item
                        );
                        onChange({ ...data, experiences: updated });
                      }}
                      className="w-full bg-[#111726] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Cargo / Posición</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const updated = data.experiences.map((item) =>
                          item.id === exp.id ? { ...item, role: e.target.value } : item
                        );
                        onChange({ ...data, experiences: updated });
                      }}
                      className="w-full bg-[#111726] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Ubicación</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => {
                        const updated = data.experiences.map((item) =>
                          item.id === exp.id ? { ...item, location: e.target.value } : item
                        );
                        onChange({ ...data, experiences: updated });
                      }}
                      className="w-full bg-[#111726] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Fechas (Inicio - Fin)</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => {
                          const updated = data.experiences.map((item) =>
                            item.id === exp.id ? { ...item, startDate: e.target.value } : item
                          );
                          onChange({ ...data, experiences: updated });
                        }}
                        className="w-16 bg-[#111726] border border-slate-700 rounded px-1.5 py-1.5 text-xs text-white focus:outline-none text-center"
                        placeholder="2020"
                      />
                      <span className="text-slate-500">—</span>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => {
                          const updated = data.experiences.map((item) =>
                            item.id === exp.id ? { ...item, endDate: e.target.value } : item
                          );
                          onChange({ ...data, experiences: updated });
                        }}
                        className="w-20 bg-[#111726] border border-slate-700 rounded px-1.5 py-1.5 text-xs text-white focus:outline-none text-center"
                        placeholder="Presente"
                      />
                    </div>
                  </div>
                </div>

                {/* Highlights (STAR Achievements) */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-300">
                      Logros y Responsabilidades (Formato STAR)
                    </span>
                    <button
                      onClick={() => handleAddHighlight(exp.id)}
                      className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Añadir logro</span>
                    </button>
                  </div>

                  {exp.highlights.map((highlight, idx) => {
                    const isBeingEnhanced =
                      enhancingBulletIndex?.expId === exp.id &&
                      enhancingBulletIndex?.index === idx;

                    return (
                      <div key={idx} className="flex items-start gap-2">
                        <textarea
                          value={highlight}
                          onChange={(e) => handleHighlightChange(exp.id, idx, e.target.value)}
                          rows={2}
                          placeholder="Describe la acción y resultado cuantificable (ej. Lideró la reducción del 25% en costos)..."
                          className="flex-1 bg-[#111726] border border-slate-700 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed"
                        />

                        {/* AI Enhance Button */}
                        <button
                          onClick={() => handleEnhanceBullet(exp.id, idx, highlight)}
                          disabled={isEnhancing || !highlight.trim()}
                          className="px-2.5 py-2 text-[11px] font-medium rounded bg-blue-950/60 hover:bg-blue-900 text-blue-300 border border-blue-800 transition-colors disabled:opacity-40 flex items-center gap-1 whitespace-nowrap shrink-0"
                          title="Reescribir logro con verbos de acción y método STAR usando Gemini IA"
                        >
                          <Sparkles className={`w-3 h-3 ${isBeingEnhanced ? 'animate-spin text-amber-300' : 'text-blue-400'}`} />
                          <span>{isBeingEnhanced ? 'Mejorando...' : 'IA STAR'}</span>
                        </button>

                        <button
                          onClick={() => handleRemoveHighlight(exp.id, idx)}
                          className="p-2 text-slate-500 hover:text-rose-400 transition-colors shrink-0"
                          title="Eliminar logro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. COMPETENCIAS ATS */}
      {activeSection === 'skills' && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-serif-executive">
            Competencias Clave y Palabras Clave de Reclutamiento
          </h3>
          <p className="text-xs text-slate-400">
            Los filtros ATS escanean estas palabras clave directamente para calificar coincidencias con la vacante.
          </p>

          <div className="space-y-4">
            {data.skills.map((cat, catIdx) => (
              <div key={cat.id} className="bg-[#0a0d14] border border-slate-800 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={cat.category}
                    onChange={(e) => {
                      const updated = [...data.skills];
                      updated[catIdx].category = e.target.value;
                      onChange({ ...data, skills: updated });
                    }}
                    className="bg-transparent font-bold text-xs text-white border-b border-transparent hover:border-slate-700 focus:border-blue-500 focus:outline-none pb-0.5"
                  />
                  <span className="text-[11px] text-slate-500">Separar por comas</span>
                </div>

                <textarea
                  value={cat.items.join(', ')}
                  onChange={(e) => {
                    const updated = [...data.skills];
                    updated[catIdx].items = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                    onChange({ ...data, skills: updated });
                  }}
                  rows={2}
                  className="w-full bg-[#111726] border border-slate-700 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. EDUCACIÓN & CERTIFICACIONES */}
      {activeSection === 'education' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-serif-executive mb-3">
              Educación & Formación Ejecutiva
            </h3>
            <div className="space-y-3">
              {data.education.map((edu, idx) => (
                <div key={edu.id} className="bg-[#0a0d14] border border-slate-800 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Título / Grado</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...data.education];
                        updated[idx].degree = e.target.value;
                        onChange({ ...data, education: updated });
                      }}
                      className="w-full bg-[#111726] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Institución</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = [...data.education];
                        updated[idx].institution = e.target.value;
                        onChange({ ...data, education: updated });
                      }}
                      className="w-full bg-[#111726] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Años (Inicio - Fin)</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={edu.startYear}
                        onChange={(e) => {
                          const updated = [...data.education];
                          updated[idx].startYear = e.target.value;
                          onChange({ ...data, education: updated });
                        }}
                        className="w-16 bg-[#111726] border border-slate-700 rounded px-1.5 py-1.5 text-xs text-white text-center"
                      />
                      <span className="text-slate-500">—</span>
                      <input
                        type="text"
                        value={edu.endYear}
                        onChange={(e) => {
                          const updated = [...data.education];
                          updated[idx].endYear = e.target.value;
                          onChange({ ...data, education: updated });
                        }}
                        className="w-16 bg-[#111726] border border-slate-700 rounded px-1.5 py-1.5 text-xs text-white text-center"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-serif-executive mb-3">
              Certificaciones Internacionales
            </h3>
            <div className="space-y-2">
              {data.certifications.map((cert, idx) => (
                <div key={cert.id} className="bg-[#0a0d14] border border-slate-800 rounded-lg p-3 flex items-center gap-3">
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => {
                      const updated = [...data.certifications];
                      updated[idx].name = e.target.value;
                      onChange({ ...data, certifications: updated });
                    }}
                    className="flex-1 bg-[#111726] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    placeholder="Nombre de la certificación"
                  />
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => {
                      const updated = [...data.certifications];
                      updated[idx].issuer = e.target.value;
                      onChange({ ...data, certifications: updated });
                    }}
                    className="w-40 bg-[#111726] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    placeholder="Entidad emisora"
                  />
                  <input
                    type="text"
                    value={cert.year}
                    onChange={(e) => {
                      const updated = [...data.certifications];
                      updated[idx].year = e.target.value;
                      onChange({ ...data, certifications: updated });
                    }}
                    className="w-16 bg-[#111726] border border-slate-700 rounded px-1.5 py-1.5 text-xs text-white text-center"
                    placeholder="Año"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. PROYECTOS & PORTAFOLIO */}
      {activeSection === 'projects' && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-serif-executive">
            Proyectos de Portafolio & Casos de Éxito
          </h3>
          <div className="space-y-4">
            {data.projects.map((proj, idx) => (
              <div key={proj.id} className="bg-[#0a0d14] border border-slate-800 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Nombre del Proyecto</label>
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) => {
                        const updated = [...data.projects];
                        updated[idx].name = e.target.value;
                        onChange({ ...data, projects: updated });
                      }}
                      className="w-full bg-[#111726] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Rol Desempeñado</label>
                    <input
                      type="text"
                      value={proj.role}
                      onChange={(e) => {
                        const updated = [...data.projects];
                        updated[idx].role = e.target.value;
                        onChange({ ...data, projects: updated });
                      }}
                      className="w-full bg-[#111726] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Descripción y Resultados</label>
                  <textarea
                    value={proj.description}
                    onChange={(e) => {
                      const updated = [...data.projects];
                      updated[idx].description = e.target.value;
                      onChange({ ...data, projects: updated });
                    }}
                    rows={2}
                    className="w-full bg-[#111726] border border-slate-700 rounded p-2 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Tecnologías (Separadas por comas)</label>
                    <input
                      type="text"
                      value={proj.technologies.join(', ')}
                      onChange={(e) => {
                        const updated = [...data.projects];
                        updated[idx].technologies = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                        onChange({ ...data, projects: updated });
                      }}
                      className="w-full bg-[#111726] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Enlace / Demo URL</label>
                    <input
                      type="text"
                      value={proj.link || ''}
                      onChange={(e) => {
                        const updated = [...data.projects];
                        updated[idx].link = e.target.value;
                        onChange({ ...data, projects: updated });
                      }}
                      className="w-full bg-[#111726] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
