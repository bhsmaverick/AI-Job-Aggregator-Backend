import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const cvText = formData.get('cvText');
  const jobId = formData.get('jobId');

  // Simple mock simulation of an AI match limit/score
  let score = 0;
  let missingSkills = [];
  
  if (!cvText || cvText.toString().length < 10) {
    score = 15;
    missingSkills = ['Please provide more detail in your CV'];
  } else if (jobId === 'job_1') {
    score = 78;
    missingSkills = ['Docker', 'GraphQL'];
    
  } else if (jobId === 'job_2') {
    score = 42;
    missingSkills = ['Python', 'FastAPI', 'PostgreSQL'];
  } else {
    score = 65;
    missingSkills = ['Elasticsearch'];
  }

  return NextResponse.json({
    job_id: jobId,
    match_result: {
      match_percentage: score,
      missing_skills: missingSkills,
      ats_optimization_tips: [
        'Use more action verbs in your recent experience',
        'Highlight quantifiable metrics (e.g. improved performance by X%)'
      ]
    },
    cover_letter: null // Kept null for the auth wall simulation
  });
}
