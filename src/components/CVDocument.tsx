import React from 'react';
import { CVData } from '../types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe, Github } from 'lucide-react';

interface CVDocumentProps {
  data: CVData;
  showAvatar?: boolean;
}

export const CVDocument: React.FC<CVDocumentProps> = ({ data, showAvatar = true }) => {
  return (
    <article className="printable-cv-root bg-white text-slate-900 shadow-xl mx-auto w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 border border-slate-200 text-[13px] leading-relaxed transition-all">
      {/* Executive Header */}
      <header className="border-b-2 border-slate-900 pb-5 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 font-serif-executive">
            {data.fullName || 'Tu Nombre Completo'}
          </h1>
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-700 mt-1">
            {data.title || 'Título Profesional / Cargo Ejecutivo'}
          </p>

          {/* Contact Details (Clean Unboxed Metadata with Typographic Separators) */}
          <div className="flex flex-wrap items-center gap-y-1 gap-x-2 text-xs text-slate-600 mt-3 font-normal">
            {data.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-700" />
                <a href={`mailto:${data.email}`} className="hover:underline text-slate-800">
                  {data.email}
                </a>
              </span>
            )}

            {data.phone && (
              <>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-700" />
                  <span>{data.phone}</span>
                </span>
              </>
            )}

            {data.location && (
              <>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-700" />
                  <span>{data.location}</span>
                </span>
              </>
            )}

            {data.linkedin && (
              <>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="flex items-center gap-1">
                  <Linkedin className="w-3 h-3 text-slate-700" />
                  <a
                    href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline text-slate-800"
                  >
                    {data.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                </span>
              </>
            )}

            {data.website && (
              <>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-slate-700" />
                  <a
                    href={data.website.startsWith('http') ? data.website : `https://${data.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline text-slate-800"
                  >
                    {data.website.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                </span>
              </>
            )}

            {data.github && (
              <>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="flex items-center gap-1">
                  <Github className="w-3 h-3 text-slate-700" />
                  <span className="text-slate-800">{data.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Executive Portrait (Optional for ATS or High-end applications) */}
        {showAvatar && data.avatarUrl && (
          <div className="shrink-0">
            <img
              src={data.avatarUrl}
              alt={data.fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded object-cover border border-slate-300 shadow-sm"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Resilient fallback
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </header>

      {/* Resumen Ejecutivo */}
      {data.summary && (
        <section className="mb-5 page-break-avoid">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-serif-executive">
            Perfil Ejecutivo & Propuesta de Valor
          </h2>
          <p className="text-slate-800 leading-relaxed text-[12.5px] text-justify">
            {data.summary}
          </p>
        </section>
      )}

      {/* Experiencia Laboral */}
      {data.experiences && data.experiences.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3 font-serif-executive">
            Experiencia Profesional
          </h2>
          <div className="space-y-4">
            {data.experiences.map((exp) => (
              <div key={exp.id} className="page-break-avoid">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-0.5">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-bold text-slate-950 text-[13.5px]">
                      {exp.role}
                    </h3>
                    <span className="text-slate-600 font-medium">| {exp.company}</span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono tabular-nums shrink-0 mt-0.5 sm:mt-0">
                    <span>{exp.startDate}</span> — <span>{exp.current ? 'Presente' : exp.endDate}</span>
                    {exp.location && <span className="ml-2 text-slate-400">({exp.location})</span>}
                  </div>
                </div>

                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1.5 space-y-1 text-slate-800 text-[12px] leading-relaxed">
                    {exp.highlights.map((highlight, idx) => (
                      <li key={idx} className="pl-0.5">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Competencias Estratégicas y Técnicas (ATS Keywords Section) */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-5 page-break-avoid">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-serif-executive">
            Competencias Clave & Palabras Clave de Reclutamiento
          </h2>
          <div className="space-y-1.5 text-[12px]">
            {data.skills.map((cat) => (
              <div key={cat.id} className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                <span className="font-semibold text-slate-900 sm:w-44 shrink-0">
                  {cat.category}:
                </span>
                <span className="text-slate-700">
                  {cat.items.join('  ·  ')}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Educación y Formación */}
      {data.education && data.education.length > 0 && (
        <section className="mb-5 page-break-avoid">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3 font-serif-executive">
            Educación & Formación Ejecutiva
          </h2>
          <div className="space-y-2.5">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex flex-col sm:flex-row sm:items-baseline justify-between text-[12.5px]">
                <div>
                  <h3 className="font-bold text-slate-950">
                    {edu.degree}
                  </h3>
                  <div className="text-slate-700 text-xs">
                    {edu.institution} {edu.location && `· ${edu.location}`}
                  </div>
                  {edu.honors && (
                    <p className="text-xs italic text-slate-600 mt-0.5">
                      {edu.honors}
                    </p>
                  )}
                </div>
                <div className="text-xs text-slate-500 font-mono tabular-nums shrink-0 mt-0.5 sm:mt-0">
                  {edu.startYear} — {edu.endYear}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certificaciones */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-5 page-break-avoid">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-serif-executive">
            Certificaciones Internacionales
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="flex items-baseline justify-between">
                <div>
                  <span className="font-semibold text-slate-900">{cert.name}</span>
                  <span className="text-slate-500 ml-1.5 text-xs">({cert.issuer})</span>
                </div>
                <span className="text-xs text-slate-400 font-mono tabular-nums shrink-0 ml-2">
                  {cert.year}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Proyectos Estratégicos Seleccionados */}
      {data.projects && data.projects.length > 0 && (
        <section className="page-break-avoid">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-serif-executive">
            Proyectos de Alto Impacto
          </h2>
          <div className="space-y-2 text-[12px]">
            {data.projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-slate-950">{proj.name}</span>
                  {proj.role && <span className="text-xs text-slate-600 italic">{proj.role}</span>}
                </div>
                <p className="text-slate-700 text-[11.5px] mt-0.5">
                  {proj.description}
                </p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    <span className="font-medium text-slate-600">Herramientas:</span> {proj.technologies.join(' · ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
