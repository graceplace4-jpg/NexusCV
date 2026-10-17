import React, { useState } from 'react';
import { CVData } from '../types/cv';
import {
  Smartphone,
  Monitor,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Download,
  ExternalLink,
  MessageSquare,
  Copy,
  Check,
  Briefcase,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface DigitalCardPortfolioProps {
  data: CVData;
  onPrintPDF: () => void;
}

export const DigitalCardPortfolio: React.FC<DigitalCardPortfolioProps> = ({ data, onPrintPDF }) => {
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [copiedLink, setCopiedLink] = useState(false);
  const [expandedExpId, setExpandedExpId] = useState<string | null>(data.experiences[0]?.id || null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const getCleanPhone = (phone: string) => phone.replace(/[^\d+]/g, '');

  return (
    <div className="space-y-6">
      {/* Viewport Control Bar */}
      <div className="bg-[#111726] border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-serif-executive">
            Portafolio Web Personal · Tarjeta Digital Móvil
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Página pública optimizada para dispositivos móviles y reclutadores que acceden desde redes o correo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center bg-[#0a0d14] p-1 rounded border border-slate-800">
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                viewMode === 'mobile'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Vista Móvil</span>
            </button>
            <button
              onClick={() => setViewMode('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                viewMode === 'desktop'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Pantalla Completa</span>
            </button>
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors whitespace-nowrap"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
          </button>
        </div>
      </div>

      {/* Main Container / Mobile Frame */}
      <div className={`mx-auto transition-all ${viewMode === 'mobile' ? 'max-w-[420px]' : 'max-w-4xl'}`}>
        <div className="bg-[#0e131f] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
          {/* Cover & Brand Accent */}
          <div className="h-32 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 relative border-b border-slate-800/80">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute top-3 right-3">
              <span className="text-[10px] tracking-widest uppercase font-mono px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/50">
                Nexus Executive vCard
              </span>
            </div>
          </div>

          {/* Profile Card Body */}
          <div className="px-6 pb-8 -mt-16">
            {/* Avatar & Status */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="relative inline-block">
                <img
                  src={data.avatarUrl || '/src/assets/images/executive_portrait_avatar_1792197555072.jpg'}
                  alt={data.fullName}
                  className="w-28 h-28 rounded-xl object-cover border-4 border-[#0e131f] shadow-lg bg-slate-800"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={onPrintPDF}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar CV</span>
                </button>

                {data.phone && (
                  <a
                    href={`https://wa.me/${getCleanPhone(data.phone)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 rounded-lg hover:bg-emerald-900/40 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}

                {data.email && (
                  <a
                    href={`mailto:${data.email}`}
                    className="p-2 text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                    title="Enviar Correo"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Candidate Identity */}
            <div className="mt-4">
              <h1 className="text-2xl font-bold tracking-tight text-white font-serif-executive">
                {data.fullName}
              </h1>
              <p className="text-sm font-semibold text-blue-400 mt-0.5">
                {data.title}
              </p>

              {/* Metadatos limpios sin píldoras */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 mt-2 font-normal">
                {data.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{data.location}</span>
                  </span>
                )}
                {data.email && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{data.email}</span>
                  </>
                )}
                {data.phone && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{data.phone}</span>
                  </>
                )}
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-3 gap-2 py-4 my-5 border-y border-slate-800 text-center">
              <div>
                <div className="text-lg font-bold font-mono text-white tabular-nums">12+</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400">Años Exp.</div>
              </div>
              <div className="border-x border-slate-800">
                <div className="text-lg font-bold font-mono text-white tabular-nums">$15M+</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400">P&L Gestionado</div>
              </div>
              <div>
                <div className="text-lg font-bold font-mono text-white tabular-nums">50+</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400">Equipo Liderado</div>
              </div>
            </div>

            {/* Social & Professional Links */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {data.linkedin && (
                <a
                  href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              )}

              {data.github && (
                <a
                  href={data.github.startsWith('http') ? data.github : `https://${data.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                >
                  <Github className="w-3.5 h-3.5 text-slate-400" />
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              )}

              {data.website && (
                <a
                  href={data.website.startsWith('http') ? data.website : `https://${data.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sitio Web</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              )}
            </div>

            {/* Bio / Summary */}
            {data.summary && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-serif-executive">
                  Propuesta de Valor & Visión
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#0a0d14] p-3.5 rounded-lg border border-slate-800">
                  {data.summary}
                </p>
              </div>
            )}

            {/* Featured Projects / Case Studies */}
            {data.projects && data.projects.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-serif-executive flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  <span>Proyectos & Casos de Éxito Destacados</span>
                </h3>

                <div className="space-y-3">
                  {data.projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="bg-[#0a0d14] border border-slate-800 rounded-lg overflow-hidden transition-all hover:border-slate-700"
                    >
                      {proj.image && (
                        <div className="w-full h-36 bg-slate-900 overflow-hidden">
                          <img
                            src={proj.image}
                            alt={proj.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-baseline justify-between">
                          <h4 className="text-xs font-bold text-white font-serif-executive">
                            {proj.name}
                          </h4>
                          {proj.link && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-blue-400 hover:underline flex items-center gap-0.5"
                            >
                              <span>Ver Proyecto</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                        {proj.role && <p className="text-[11px] text-slate-400 mt-0.5">{proj.role}</p>}
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                          {proj.description}
                        </p>
                        {proj.technologies && (
                          <div className="flex flex-wrap gap-1 mt-2.5">
                            {proj.technologies.map((tech, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accordion Experiences */}
            {data.experiences && data.experiences.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-serif-executive">
                  Trayectoria Profesional Reciente
                </h3>
                <div className="space-y-2">
                  {data.experiences.map((exp) => {
                    const isExpanded = expandedExpId === exp.id;
                    return (
                      <div
                        key={exp.id}
                        className="bg-[#0a0d14] border border-slate-800 rounded-lg p-3 transition-colors"
                      >
                        <button
                          onClick={() => setExpandedExpId(isExpanded ? null : exp.id)}
                          className="w-full flex items-center justify-between text-left"
                        >
                          <div>
                            <div className="text-xs font-bold text-white">{exp.role}</div>
                            <div className="text-[11px] text-slate-400">
                              {exp.company} · {exp.startDate} — {exp.current ? 'Presente' : exp.endDate}
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                        </button>

                        {isExpanded && exp.highlights && (
                          <ul className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300 list-disc list-outside ml-4">
                            {exp.highlights.map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Certifications Highlights */}
            {data.certifications && data.certifications.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-serif-executive flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-blue-400" />
                  <span>Certificaciones & Credenciales</span>
                </h3>
                <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-300">
                  {data.certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-center justify-between p-2 rounded bg-[#0a0d14] border border-slate-800"
                    >
                      <span className="font-medium text-slate-200">{cert.name}</span>
                      <span className="text-[11px] text-slate-400">{cert.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Footer CTA */}
            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <button
                onClick={onPrintPDF}
                className="w-full py-3 px-4 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 active:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Currículum Completo en PDF</span>
              </button>
              <p className="text-[11px] text-slate-500 mt-2 font-mono">
                NexusCV Executive · A4 ATS Certified
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
