import os
import json
from celery import Celery
from es_client import index_job
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from scraper.career_spider import DynamicCareerSpider

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "job_aggregator_worker",
    broker=REDIS_URL,
    backend=REDIS_URL
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    worker_prefetch_multiplier=1, # process one task per worker at a time for stability
)

@celery_app.task(name="worker.index_job_task", bind=True, max_retries=3)
def index_job_task(self, job_id, job_document):
    """
    Asynchronously indexes a cleaned job document into Elasticsearch.
    """
    try:
        index_job(job_id, job_document)
        return {"status": "success", "job_id": job_id}
    except Exception as exc:
        # Retry with exponential backoff on ES/network failures
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)

@celery_app.task(name="worker.run_spider_task", bind=True)
def run_spider_task(self, profile_name):
    """
    Runs the DynamicCareerSpider with the given configuration profile.
    """
    config_path = os.path.join(os.path.dirname(__file__), 'scraper', 'config', 'scraper_rules.json')
    try:
        with open(config_path, 'r') as f:
            config = json.load(f)
            
        profile = config.get('profiles', {}).get(profile_name)
        if not profile:
            return {"status": "error", "message": f"Profile '{profile_name}' not found."}
            
        # Run Scrapy crawler in-process
        # Note: Celery worker must allow this without reactor conflicts. 
        # For production with multiple spiders per process, consider using subprocess orchestration or scrapyd.
        process = CrawlerProcess(get_project_settings())
        process.crawl(
            DynamicCareerSpider, 
            target_url=profile['target_url'], 
            rules=json.dumps(profile['rules'])
        )
        process.start()
        
        return {"status": "success", "profile": profile_name}
    except Exception as exc:
        return {"status": "error", "message": str(exc)}
