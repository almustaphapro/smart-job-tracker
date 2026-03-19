import type { Job, AISuggestion } from '../types';

export const generateAISuggestions = async (job: Job): Promise<AISuggestion> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const keywords = [
    'React', 'TypeScript', 'Node.js', 'Python', 'AWS', 
    'Docker', 'Kubernetes', 'REST APIs', 'GraphQL', 'MongoDB',
    'PostgreSQL', 'CI/CD', 'Agile', 'Scrum', 'Git'
  ];

  const missingSkills = [
    'Cloud computing experience',
    'Team leadership',
    'Performance optimization',
  ];

  const improvements = [
    `Add more quantifiable achievements in your ${job.position} role`,
    `Highlight experience with ${keywords.slice(0, 3).join(', ')}`,
    `Include specific projects that demonstrate problem-solving skills`,
    `Add keywords from the job description to pass ATS screening`,
    `Emphasize collaboration and communication skills`,
  ];

  const atsScore = Math.floor(Math.random() * 30) + 70; // 70-100

  return {
    keywords: keywords.slice(0, 10),
    missingSkills: missingSkills,
    improvements: improvements,
    atsScore,
  };
};