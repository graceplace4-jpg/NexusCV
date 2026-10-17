import React from 'react';
import { CVData, TemplateStyle } from '../types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe, Github, Award, CheckCircle } from 'lucide-react';

interface CVDocumentProps {
  data: CVData;
  showAvatar?: boolean;
  templateStyle?: TemplateStyle;
}

export const CVDocument: React.FC<CVDocumentProps> = ({
  data,
  showAvatar = true,
  templateStyle = 'canva-two-col',
}) => {
  const currentStyle: TemplateStyle = data.templateStyle || templateStyle || 'canva-two-col';

  // Only display photograph if explicitly attached/uploaded by the user and enabled
  const rawAvatarUrl = (data.avatarUrl || '').trim();
  const cleanAvatarUrl = rawAvatarUrl.replace(/^\/src\/assets\/images\//, '/images/');
  const hasAttachedPhoto = Boolean(
    showAvatar &&
    cleanAvatarUrl &&
    !cleanAvatarUrl.includes('executive_portrait_avatar')
  );

  // ==========================================
  // FORMAT 1: CANVA 2-COLUMN (ESTILO ADJUNTO)
  // ==========================================
  if (currentStyle === 'canva-two-col') {
    return (
      <article className="printable-cv-root bg-white text-slate-900 shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] border border-slate-200 text-[12.5px] leading-relaxed transition-all flex flex-col md:flex-row overflow-hidden font-sans">
        {/* LEFT COLUMN / SIDEBAR (34% width with subtle stone/slate tint) */}
        <aside className="w-full md:w-[34%] bg-[#f8fafc] border-b md:border-b-0 md:border-r border-slate-200/90 p-6 sm:p-7 flex flex-col gap-5 shrink-0 print:bg-[#f8fafc]">
          {/* Circular Executive Portrait (Only rendered if user attached a photo) */}
          {hasAttachedPhoto && (
            <div className="flex justify-center pt-1 pb-1">
              <div className="relative">
                <img
                  src={cleanAvatarUrl}
                  alt={data.fullName || 'Fotografía Profesional'}
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow-md ring-1 ring-slate-200/80"
                  referrerPolicy="no-referrer"
                />
                <span className="sr-only">Foto formal de perfil profesional</span>
              </div>
            </div>
          )}

          {/* CONTACT SECTION */}
          <section className="page-break-avoid">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900 border-b-2 border-slate-900 pb-1 mb-2.5">
              Contacto
            </h2>
            <div className="space-y-2 text-[11.5px] text-slate-700">
              {data.phone && (
                <div className="flex items-start gap-2.5">
                  <Phone className="w-3.5 h-3.5 text-slate-800 shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-900">{data.phone}</span>
                </div>
              )}

              {data.email && (
                <div className="flex items-start gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-slate-800 shrink-0 mt-0.5" />
                  <a href={`mailto:${data.email}`} className="hover:underline text-slate-900 break-all">
                    {data.email}
                  </a>
                </div>
              )}

              {data.location && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-800 shrink-0 mt-0.5" />
                  <span>{data.location}</span>
                </div>
              )}

              {data.website && (
                <div className="flex items-start gap-2.5">
                  <Globe className="w-3.5 h-3.5 text-slate-800 shrink-0 mt-0.5" />
                  <a
                    href={data.website.startsWith('http') ? data.website : `https://${data.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline text-slate-900 break-all"
                  >
                    {data.website.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                </div>
              )}

              {data.linkedin && (
                <div className="flex items-start gap-2.5">
                  <Linkedin className="w-3.5 h-3.5 text-slate-800 shrink-0 mt-0.5" />
                  <a
                    href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline text-slate-900 break-all"
                  >
                    {data.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                </div>
              )}

              {data.github && (
                <div className="flex items-start gap-2.5">
                  <Github className="w-3.5 h-3.5 text-slate-800 shrink-0 mt-0.5" />
                  <span className="text-slate-800 break-all">{data.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
                </div>
              )}
            </div>
          </section>

          {/* EDUCATION SECTION IN SIDEBAR (Canva template style) */}
          {data.education && data.education.length > 0 && (
            <section className="page-break-avoid">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900 border-b-2 border-slate-900 pb-1 mb-2.5">
                Educación
              </h2>
              <div className="space-y-3">
                {data.education.map((edu) => (
                  <div key={edu.id} className="text-[11.5px]">
                    <div className="text-[11px] font-semibold text-slate-600 font-mono">
                      {edu.startYear} — {edu.endYear}
                    </div>
                    <div className="font-bold text-slate-950 mt-0.5 leading-snug">
                      {edu.degree}
                    </div>
                    <div className="text-slate-700 text-[11px] mt-0.5">
                      {edu.institution} {edu.location && `· ${edu.location}`}
                    </div>
                    {edu.honors && (
                      <p className="text-[10.5px] italic text-slate-500 mt-0.5 leading-snug">
                        {edu.honors}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SKILLS SECTION IN SIDEBAR */}
          {data.skills && data.skills.length > 0 && (
            <section className="page-break-avoid">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900 border-b-2 border-slate-900 pb-1 mb-2.5">
                Habilidades
              </h2>
              <div className="space-y-2.5">
                {data.skills.map((cat) => (
                  <div key={cat.id}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      {cat.category}
                    </span>
                    <ul className="space-y-1 text-[11.5px] text-slate-800">
                      {cat.items.map((skill, sIdx) => (
                        <li key={sIdx} className="flex items-center gap-1.5 leading-tight">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-800 shrink-0"></span>
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CERTIFICATIONS IN SIDEBAR */}
          {data.certifications && data.certifications.length > 0 && (
            <section className="page-break-avoid">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
                Certificaciones
              </h2>
              <div className="space-y-1.5 text-[11px]">
                {data.certifications.map((cert) => (
                  <div key={cert.id} className="leading-snug">
                    <div className="font-bold text-slate-900">{cert.name}</div>
                    <div className="text-slate-600 text-[10.5px]">
                      {cert.issuer} {cert.year && `· ${cert.year}`}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* RIGHT COLUMN / MAIN CONTENT (66% width) */}
        <main className="w-full md:w-[66%] p-7 sm:p-9 flex flex-col justify-start bg-white">
          {/* HEADER: NAME & PROFESSIONAL TITLE */}
          <header className="border-b-2 border-slate-900 pb-4 mb-5">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 uppercase font-serif-executive">
              {data.fullName || 'Jonathan Patterson'}
            </h1>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-slate-600 mt-1">
              {data.title || 'Marketing Manager'}
            </p>
          </header>

          {/* ABOUT ME / PERFIL PROFESIONAL */}
          {data.summary && (
            <section className="mb-5 page-break-avoid">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900 border-b border-slate-300 pb-1 mb-2">
                Perfil Profesional
              </h2>
              <p className="text-slate-700 leading-relaxed text-[12px] text-justify">
                {data.summary}
              </p>
            </section>
          )}

          {/* WORK EXPERIENCE */}
          {data.experiences && data.experiences.length > 0 && (
            <section className="mb-5">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900 border-b border-slate-300 pb-1 mb-3">
                Experiencia Laboral
              </h2>
              <div className="space-y-4">
                {data.experiences.map((exp) => (
                  <div key={exp.id} className="page-break-avoid">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-0.5">
                      <h3 className="font-bold text-slate-950 text-[13px]">
                        {exp.role}
                      </h3>
                      <div className="text-[11px] font-semibold text-slate-600 font-mono shrink-0">
                        {exp.startDate} — {exp.current ? 'Presente' : exp.endDate}
                      </div>
                    </div>

                    <div className="text-[11.5px] font-medium text-slate-600 mb-1">
                      {exp.company} {exp.location && <span className="font-normal text-slate-500">· {exp.location}</span>}
                    </div>

                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 text-[11.5px] leading-relaxed">
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

          {/* PROJECTS & ACHIEVEMENTS */}
          {data.projects && data.projects.length > 0 && (
            <section className="page-break-avoid">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900 border-b border-slate-300 pb-1 mb-2">
                Proyectos & Logros Clave
              </h2>
              <div className="space-y-2.5 text-[11.5px]">
                {data.projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex items-baseline justify-between">
                      <span className="font-bold text-slate-900">{proj.name}</span>
                      {proj.role && <span className="text-[10.5px] text-slate-500 italic">{proj.role}</span>}
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5 leading-snug">
                      {proj.description}
                    </p>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="text-slate-500 text-[10.5px] mt-0.5">
                        <span className="font-semibold text-slate-700">Herramientas:</span>{' '}
                        {proj.technologies.join(' · ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </article>
    );
  }

  // ==========================================
  // FORMAT 2: EXECUTIVE 1-COLUMN (CORPORATIVO ATS)
  // ==========================================
  if (currentStyle === 'executive-one-col') {
    return (
      <article className="printable-cv-root bg-white text-slate-900 shadow-xl mx-auto w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 border border-slate-200 text-[13px] leading-relaxed transition-all">
        {/* Executive Header */}
        <header className="border-b-2 border-slate-900 pb-5 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 font-serif-executive">
              {data.fullName || 'Jonathan Patterson'}
            </h1>
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-700 mt-1">
              {data.title || 'Marketing Manager'}
            </p>

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
              {data.website && (
                <>
                  <span aria-hidden="true" className="text-slate-400">·</span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-700" />
                    <span className="text-slate-800">{data.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  </span>
                </>
              )}
              {data.linkedin && (
                <>
                  <span aria-hidden="true" className="text-slate-400">·</span>
                  <span className="flex items-center gap-1">
                    <Linkedin className="w-3 h-3 text-slate-700" />
                    <span className="text-slate-800">{data.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  </span>
                </>
              )}
            </div>
          </div>

          {hasAttachedPhoto && (
            <div className="shrink-0">
              <img
                src={cleanAvatarUrl}
                alt={data.fullName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-slate-300 shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </header>

        {/* Resumen Ejecutivo */}
        {data.summary && (
          <section className="mb-5 page-break-avoid">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-serif-executive">
              Perfil Profesional
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
              Experiencia Laboral
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

        {/* Competencias Clave */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-5 page-break-avoid">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-serif-executive">
              Competencias Clave & Habilidades
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
              Educación
            </h2>
            <div className="space-y-2.5">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex flex-col sm:flex-row sm:items-baseline justify-between text-[12.5px]">
                  <div>
                    <h3 className="font-bold text-slate-950">{edu.degree}</h3>
                    <div className="text-slate-700 text-xs">
                      {edu.institution} {edu.location && `· ${edu.location}`}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-mono tabular-nums shrink-0 mt-0.5 sm:mt-0">
                    {edu.startYear} — {edu.endYear}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    );
  }

  // ==========================================
  // FORMAT 3: MINIMALIST (EDITORIAL)
  // ==========================================
  return (
    <article className="printable-cv-root bg-white text-slate-900 shadow-xl mx-auto w-full max-w-[210mm] min-h-[297mm] p-10 border border-slate-200 text-[12px] leading-relaxed transition-all">
      <header className="flex items-center justify-between border-b border-slate-200 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-light tracking-wide text-slate-950 uppercase">
            {data.fullName || 'Jonathan Patterson'}
          </h1>
          <p className="text-xs tracking-[0.2em] uppercase text-blue-600 font-semibold mt-1">
            {data.title || 'Marketing Manager'}
          </p>
          <div className="flex gap-3 text-xs text-slate-500 mt-2">
            <span>{data.email}</span>
            <span>·</span>
            <span>{data.phone}</span>
            <span>·</span>
            <span>{data.location}</span>
          </div>
        </div>
        {hasAttachedPhoto && (
          <img
            src={cleanAvatarUrl}
            alt={data.fullName}
            className="w-20 h-20 rounded-full object-cover border border-slate-200"
          />
        )}
      </header>

      {data.summary && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Perfil</h2>
          <p className="text-slate-700 leading-relaxed">{data.summary}</p>
        </section>
      )}

      {data.experiences && data.experiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Experiencia</h2>
          <div className="space-y-4">
            {data.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-medium text-slate-900">
                  <span>{exp.role} · <span className="text-slate-600">{exp.company}</span></span>
                  <span className="text-xs text-slate-400">{exp.startDate} — {exp.current ? 'Presente' : exp.endDate}</span>
                </div>
                <ul className="list-disc ml-4 mt-1 text-slate-600 space-y-0.5">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
