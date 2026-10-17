import { CVData } from '../types/cv';

export const initialCVData: CVData = {
  fullName: 'Carlos E. Mendoza',
  title: 'Director de Operaciones & Transformación Tecnológica',
  email: 'carlos.mendoza.exec@gmail.com',
  phone: '+34 612 890 453',
  location: 'Madrid, España (Disponible para reubicación)',
  linkedin: 'linkedin.com/in/carlos-mendoza-tech',
  github: 'github.com/carlosmendoza-ops',
  website: 'carlosmendoza.dev',
  avatarUrl: '/src/assets/images/executive_portrait_avatar_1792197555072.jpg',
  summary:
    'Líder ejecutivo con más de 12 años de trayectoria dirigiendo operaciones a gran escala y modernización tecnológica en empresas de rápido crecimiento. Especialista en orquestación de equipos multidisciplinarios de más de 50 profesionales, optimización de P&L de $15M+ y adopción de metodologías ágiles e inteligencia artificial aplicada al negocio.',
  experiences: [
    {
      id: 'exp-1',
      company: 'OmniTech Enterprise Global',
      role: 'Vicepresidente de Operaciones & Ingeniería',
      location: 'Madrid / Remoto Global',
      startDate: '2021',
      endDate: 'Presente',
      current: true,
      highlights: [
        'Lideró la reestructuración operativa de 4 unidades de negocio, reduciendo costos operativos anuales en un 28% ($3.4M USD) sin afectar la plantilla.',
        'Dirigió la entrega y escalamiento de la plataforma en la nube para 1.2M de usuarios activos, garantizando un uptime auditado del 99.98%.',
        'Implementó marco estratégico de OKRs y automatización con IA, acelerando el time-to-market de nuevas funcionalidades en un 42%.',
        'Negoció contratos estratégicos con proveedores clave en Europa y EE.UU., obteniendo ahorros acumulados superiores a $1.8M.',
      ],
    },
    {
      id: 'exp-2',
      company: 'FinanzPro Capital Solutions',
      role: 'Director de Producto & Tecnología (CTO/CPO)',
      location: 'Barcelona, España',
      startDate: '2017',
      endDate: '2021',
      current: false,
      highlights: [
        'Orquestó el desarrollo de la solución core de banca digital desde fase semilla hasta procesar más de €85M mensuales en transacciones.',
        'Escaló la organización de ingeniería de 8 a 46 profesionales, manteniendo un índice de retención de talento del 94% anual.',
        'Aseguró el cumplimiento regulatorio estricto con normativas ISO 27001 y RGPD en auditorías internacionales de primer nivel.',
      ],
    },
    {
      id: 'exp-3',
      company: 'Accenture Strategy & Consulting',
      role: 'Gerente Senior de Transformación Digital',
      location: 'Madrid, España',
      startDate: '2013',
      endDate: '2017',
      current: false,
      highlights: [
        'Asesoró a comités de dirección de empresas IBEX-35 en digitalización de procesos comerciales y gobernanza de datos.',
        'Diseñó e implementó arquitecturas de integración B2B que incrementaron la productividad operativa de clientes en un 35%.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Executive MBA (Magna Cum Laude)',
      institution: 'IE Business School',
      location: 'Madrid, España',
      startYear: '2016',
      endYear: '2017',
      honors: 'Tesis de honor en Gestión de la Innovación y Finanzas Corporativas',
    },
    {
      id: 'edu-2',
      degree: 'Grado en Ingeniería Informática',
      institution: 'Universidad Politécnica de Madrid (UPM)',
      location: 'Madrid, España',
      startYear: '2008',
      endYear: '2012',
    },
  ],
  skills: [
    {
      id: 'skill-1',
      category: 'Liderazgo & Negocio',
      items: [
        'Estrategia Corporativa',
        'Gestión de P&L ($15M+)',
        'Liderazgo de Equipos de Alto Rendimiento',
        'Gestión del Cambio Organizacional',
        'Negociación Ejecutiva',
        'OKRs y KPIs',
      ],
    },
    {
      id: 'skill-2',
      category: 'Tecnología & Arquitectura',
      items: [
        'Cloud Architecture (AWS / GCP)',
        'Adopción de IA Generativa',
        'Microservicios & APIs',
        'Gobernanza de Datos & Seguridad',
        'CI/CD & DevOps',
        'Metodologías Ágiles (Scrum / Kanban)',
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
      name: 'Project Management Professional (PMP)®',
      issuer: 'Project Management Institute (PMI)',
      year: '2019',
    },
    {
      id: 'cert-2',
      name: 'AWS Certified Solutions Architect – Professional',
      issuer: 'Amazon Web Services',
      year: '2022',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Plataforma Digital de Operaciones B2B',
      description:
        'Suite empresarial de automatización de flujos logísticos y análisis en tiempo real con integración de IA predictiva, gestionando más de 50,000 pedidos diarios.',
      role: 'Director de Arquitectura & Operaciones',
      technologies: ['TypeScript', 'Cloud Native', 'Microservicios', 'Predictive AI', 'PostgreSQL'],
      link: 'https://omnitech.example.com',
      image: '/src/assets/images/project_corporate_mockup_1792197554945.jpg',
    },
    {
      id: 'proj-2',
      name: 'Modernización del Core Transaccional Bancario',
      description:
        'Migración integral de infraestructura legada hacia arquitectura de eventos distribuida, reduciendo la latencia de transacciones en un 70%.',
      role: 'Líder Técnico Ejecutivo',
      technologies: ['Kafka', 'Kubernetes', 'Clean Architecture', 'FinTech Security'],
      link: 'https://finanzpro.example.com',
    },
  ],
};
