from elasticsearch import Elasticsearch
import os

ELASTICSEARCH_URL = os.getenv("ELASTICSEARCH_URL", "http://localhost:9200")
es = Elasticsearch(ELASTICSEARCH_URL)

INDEX_NAME = "jobs"

def create_index():
    """
    Creates the 'jobs' index with optimized mappings for:
    - Full-text search on 'title' and 'description'
    - Exact filtering on 'skills', 'location', and 'company'
    """
    mapping = {
        "mappings": {
            "properties": {
                "title": {
                    "type": "text",
                    "analyzer": "standard"
                },
                "description": {
                    "type": "text",
                    "analyzer": "english" # Using english analyzer for stemming/stopwords on longer descriptions
                },
                "company": {
                    "type": "keyword"
                },
                "location": {
                    "type": "keyword"
                },
                "skills": {
                    "type": "keyword"
                },
                "salary_min": {
                    "type": "integer"
                },
                "salary_max": {
                    "type": "integer"
                },
                "posted_at": {
                    "type": "date"
                }
            }
        }
    }

    if not es.indices.exists(index=INDEX_NAME):
        es.indices.create(index=INDEX_NAME, body=mapping)
        print(f"Index '{INDEX_NAME}' created successfully.")
    else:
        print(f"Index '{INDEX_NAME}' already exists.")

def index_job(job_id, job_document):
    """
    Indexes a single job document
    """
    es.index(index=INDEX_NAME, id=job_id, document=job_document)

def search_jobs(query_text=None, company=None, location=None, skills=None):
    """
    Builds and executes an Elasticsearch query matching the optimized mappings.
    """
    must_clauses = []
    filter_clauses = []

    if query_text:
        must_clauses.append({
            "multi_match": {
                "query": query_text,
                "fields": ["title^3", "description"] # Heavily boost title matches over description
            }
        })
    else:
        must_clauses.append({"match_all": {}})

    if company:
        filter_clauses.append({"term": {"company": company}})
    
    if location:
        filter_clauses.append({"term": {"location": location}})
    
    if skills:
        # If skills is a list, match jobs that have these skills
        for skill in skills:
            filter_clauses.append({"term": {"skills": skill}})

    query = {
        "query": {
            "bool": {
                "must": must_clauses,
                "filter": filter_clauses
            }
        }
    }

    return es.search(index=INDEX_NAME, body=query)
