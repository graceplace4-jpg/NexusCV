import { CVData } from '../types/cv';

export const initialCVData: CVData = {
  fullName: 'Jonathan Patterson',
  title: 'Marketing Manager',
  email: 'hello@reallygreatsite.com',
  phone: '+123-456-7890',
  location: '123 Anywhere St., Any City',
  linkedin: 'linkedin.com/in/jonathan-patterson',
  github: 'github.com/jonathan-patterson',
  website: 'reallygreatsite.com',
  avatarUrl: '/src/assets/images/executive_woman_formal_1792251757360.jpg',
  templateStyle: 'canva-two-col',
  summary:
    'As a marketing manager, I have had the pleasure of working with a diverse range of clients across various industries. I have developed marketing campaigns for startups as well as established organizations, and have consistently delivered results that exceeded their expectations.',
  experiences: [
    {
      id: 'exp-1',
      company: 'Ginyard International Co.',
      role: 'Senior Marketing Manager',
      location: 'New York / Hybrid',
      startDate: '2020',
      endDate: 'Present',
      current: true,
      highlights: [
        'Lideró la estrategia integral de marketing omnicanal para 6 líneas de productos, incrementando la cuota de mercado en un 24% y generando más de $3.8M en ingresos atribuidos.',
        'Dirigió un equipo multidisciplinario de 12 especialistas (creativos, analistas de rendimiento y community managers), elevando el ROI de campañas digitales en un 38%.',
        'Gestionó y optimizó un presupuesto de marketing anual de $1.5M, implementando modelos de atribución multi-touch y reduciendo el CAC en un 22%.',
        'Supervisó el desarrollo y despliegue de campañas de automatización de marketing y nutrición de leads con una tasa de conversión récord del 8.4%.',
      ],
    },
    {
      id: 'exp-2',
      company: 'Arowwai Industries',
      role: 'Marketing Specialist & Growth Lead',
      location: 'Boston, MA',
      startDate: '2018',
      endDate: '2020',
      current: false,
      highlights: [
        'Diseñó e implementó campañas de adquisición digital en Google Ads, LinkedIn y Meta, aumentando el tráfico cualificado al sitio web en un 145%.',
        'Coordinó alianzas estratégicas con influencers de la industria y líderes de opinión B2B, logrando más de 2.5M de impresiones orgánicas por trimestre.',
        'Realizó investigaciones de mercado y análisis competitivo para guiar el posicionamiento de 3 nuevos lanzamientos de software corporativo.',
      ],
    },
    {
      id: 'exp-3',
      company: 'Salford Management Skills Co.',
      role: 'Marketing & Brand Coordinator',
      location: 'Chicago, IL',
      startDate: '2015',
      endDate: '2018',
      current: false,
      highlights: [
        'Apoyó en la producción de contenidos editoriales, notas de prensa y material promocional para conferencias ejecutivas nacionales.',
        'Administró la base de datos de marketing por correo electrónico con más de 85,000 suscriptores, manteniendo tasas de apertura promedio superiores al 27%.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Master of Business Administration (MBA)',
      institution: 'Borcelle University',
      location: 'Boston, MA',
      startYear: '2020',
      endYear: '2022',
      honors: 'Graduada con honores en Dirección de Mercadeo Estratégico',
    },
    {
      id: 'edu-2',
      degree: 'Bachelor of Design & Marketing',
      institution: 'Wardiere University',
      location: 'New York, NY',
      startYear: '2016',
      endYear: '2020',
      honors: 'Mención de excelencia en Comunicación Digital',
    },
  ],
  skills: [
    {
      id: 'skill-1',
      category: 'Estrategia & Negocio',
      items: [
        'Marketing Strategy',
        'Brand Management',
        'Digital Marketing',
        'Team Leadership',
        'Budgeting & P&L ($2M+)',
        'Negotiation & Pitching',
      ],
    },
    {
      id: 'skill-2',
      category: 'Herramientas & Analítica',
      items: [
        'Google Analytics 4 & SEO',
        'CRM (HubSpot / Salesforce)',
        'Growth & Conversion (CRO)',
        'Email & Marketing Automation',
        'Social Media Strategy',
        'Generative AI for Marketing',
      ],
    },
    {
      id: 'skill-3',
      category: 'Idiomas',
      items: ['Español (Nativo)', 'Inglés (Bilingüe C2 / Negocios)', 'Francés (Competencia Profesional B2)'],
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Certified Digital Marketing Professional (CDMP)',
      issuer: 'Digital Marketing Institute (DMI)',
      year: '2021',
    },
    {
      id: 'cert-2',
      name: 'HubSpot Inbound Marketing Executive Certification',
      issuer: 'HubSpot Academy',
      year: '2022',
    },
    {
      id: 'cert-3',
      name: 'Project Management Professional (PMP)®',
      issuer: 'Project Management Institute (PMI)',
      year: '2023',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Campaña Global de Rebranding & Lanzamiento Omnicanal',
      description:
        'Estrategia de reposicionamiento de marca corporativa que integró medios digitales, eventos ejecutivos y PR, alcanzando a 4.2M de usuarios únicos y un crecimiento del 34% en pipeline B2B.',
      role: 'Directora de Proyecto de Marketing',
      technologies: ['HubSpot', 'Google Analytics', 'Brand Strategy', 'Multi-Touch Attribution'],
      link: 'https://reallygreatsite.com/case-study',
      image: '/src/assets/images/project_corporate_mockup_1792197554945.jpg',
    },
    {
      id: 'proj-2',
      name: 'Optimización de Embudo de Conversión & IA Predictiva',
      description:
        'Rediseño del recorrido del cliente e incorporación de tests A/B continuos, elevando la tasa de conversión global del sitio en un 42% y reduciendo el costo por adquisición.',
      role: 'Growth Marketing Lead',
      technologies: ['A/B Testing', 'Optimizely', 'Predictive AI', 'CRO'],
      link: 'https://reallygreatsite.com/growth',
    },
  ],
};
