export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
  honors?: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  items: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
  url?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  role: string;
  technologies: string[];
  link?: string;
  image?: string;
}

export interface CVData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  avatarUrl: string;
  summary: string;
  experiences: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
}

export interface ATSAnalysis {
  overallScore: number;
  formattingScore: number;
  keywordsScore: number;
  impactScore: number;
  readabilityScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recruiterImpressions: string;
  actionableTips: string[];
}
