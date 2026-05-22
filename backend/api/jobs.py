import io
from fastapi import APIRouter, File, Form, UploadFile, HTTPException, Depends, Header
from typing import Optional
from PyPDF2 import PdfReader
from ai_service import calculate_match_score, generate_cover_letter
from es_client import es, INDEX_NAME

router = APIRouter(prefix="/api/v1/jobs", tags=["jobs"])

# --- Rate Limiting Mock / Consideration ---
# In production, use `slowapi` or FastAPI-Limiter backed by our Redis container.
# E.g.: @limiter.limit("5/minute")
async def verify_rate_limit():
    """Dependency to check rate limits for outbound AI calls to prevent abuse."""
    # check_redis_rate_limit(user_id) 
    pass

@router.post("/match", dependencies=[Depends(verify_rate_limit)])
async def match_job(
    job_id: str = Form(...),
    accept_language: Optional[str] = Header(None),
    file: Optional[UploadFile] = File(None),
    cvText: Optional[str] = Form(None)
):
    """
    Extracts text from a CV PDF, looks up the target job in Elasticsearch, 
    and uses Gemini API to score the match and write a cover letter.
    """
    # Extract language logic from header
    target_language = "EN"
    if accept_language:
        # e.g. "en-US,en;q=0.9" -> "en-US" -> "en"
        target_language = accept_language.split(",")[0].split("-")[0].upper()

    cv_text_str = ""

    if file:
        # 1. Validate File
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported.")
            
        try:
            # 2. Extract CV Text using PyPDF2
            contents = await file.read()
            pdf_reader = PdfReader(io.BytesIO(contents))
            for page in pdf_reader.pages:
                cv_text_str += page.extract_text() or ""
                
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error reading PDF: {str(e)}")
    elif cvText:
        cv_text_str = cvText
        
    if not cv_text_str.strip():
        raise HTTPException(status_code=400, detail="Could not extract any text from the PDF or text input.")

    try:
        # 3. Retrieve Job Data from Elasticsearch
        es_response = es.get(index=INDEX_NAME, id=job_id)
        job_data = es_response.get('_source', {})
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Job ID '{job_id}' not found in Elasticsearch search index: {str(e)}")

    # 4. Invoke LLM generation synchronously 
    # (for heavier loads, offload to Celery, but keeping simple for endpoint response)
    try:
        job_description = job_data.get('description', '')
        
        match_score = calculate_match_score(cv_text_str, job_description)
        cover_letter = generate_cover_letter(cv_text_str, job_data, target_language)

        return {
            "job_id": job_id,
            "match_result": match_score,
            "cover_letter": cover_letter
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")
