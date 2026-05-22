import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  const jobs = [
    {
      id: 'job_1',
      title: 'Senior Frontend Engineer (React/Next.js)',
      company: 'TechNova',
      location: 'Remote',
      description: 'We are looking for an experienced Frontend Engineer with strong React and Next.js skills to build beautiful user interfaces.',
      skills: ['React', 'Next.js', 'TypeScript', 'TailwindCSS'],
      posted_at: new Date().toISOString()
    },
    {
      id: 'job_2',
      title: 'Backend Developer (Python/FastAPI)',
      company: 'DataFlow Inc',
      location: 'New York, NY',
      description: 'Join our data platform team building high-performance microservices with FastAPI and PostgreSQL.',
      skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
      posted_at: new Date().toISOString()
    },
    {
      id: 'job_3',
      title: 'Full Stack Engineer (TypeScript/Node)',
      company: 'Innovate AI',
      location: 'San Francisco, CA (Hybrid)',
      description: 'Build end-to-end features for our core AI application. Experience with Node.js and modern frontend frameworks required.',
      skills: ['TypeScript', 'Node.js', 'React', 'Elasticsearch'],
      posted_at: new Date().toISOString()
    }
  ];

  const filteredJobs = q 
    ? jobs.filter(j => j.title.toLowerCase().includes(q.toLowerCase()) || j.description.toLowerCase().includes(q.toLowerCase()))
    : jobs;

  return NextResponse.json({ hits: filteredJobs });
}
