import os
import json
from google import genai
from google.genai import types
from pydantic import BaseModel
from typing import List

# The client automatically picks up GEMINI_API_KEY from the environment
CLIENT = genai.Client()

class MatchScoreResult(BaseModel):
    match_percentage: int
    missing_skills: List[str]
    ats_optimization_tips: List[str]

def calculate_match_score(cv_text: str, job_description: str) -> dict:
    """
    Acts as a strict ATS to calculate match score and provide optimization tips.
    Uses Structured Outputs (response_schema) to guarantee JSON format.
    """
    prompt = f"""
    Act as a strict ATS (Applicant Tracking System). Analyze the following CV against the provided Job Description.
    
    Job Description:
    {job_description}
    
    Candidate CV:
    {cv_text}
    """
    
    response = CLIENT.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=MatchScoreResult,
            temperature=0.2, # Low temperature for strict, analytical assessment
        ),
    )
    
    # Extract structural dict
    return json.loads(response.text)

def generate_cover_letter(cv_text: str, job_data: dict, target_language: str) -> str:
    """
    Generates a tailored, professional cover letter in the requested target language.
    Tone: Confident, professional, but not arrogant.
    """
    prompt = f"""
    Write a highly tailored, professional cover letter for the job described below, based on the candidate's CV.
    
    Target Language: {target_language}
    Tone Requirements: Confident, professional, but absolutely NOT arrogant. Focus on value alignment and concrete achievements.
    
    Job Details:
    Title: {job_data.get('title', 'N/A')}
    Company: {job_data.get('company', 'N/A')}
    Description: {job_data.get('description', 'N/A')}
    
    Candidate CV:
    {cv_text}
    
    Please output ONLY the cover letter content. Do not include placeholder brackets for things that are not provided; write creatively based strictly on the available CV facts.
    """
    
    response = CLIENT.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.7, # Higher temperature for creative, natural writing
        ),
    )
    return response.text
