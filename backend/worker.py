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
def run_spider_task(self, locale=None, target_url=None, rules=None):
    """
    Runs the DynamicCareerSpider with the given locale or specific target URL.
    """
    try:
        # Run Scrapy crawler in-process
        # Note: Celery worker must allow this without reactor conflicts. 
        # For production with multiple spiders per process, consider using subprocess orchestration or scrapyd.
        process = CrawlerProcess(get_project_settings())
        process.crawl(
            DynamicCareerSpider, 
            locale=locale,
            target_url=target_url, 
            rules=rules
        )
        process.start()
        
        return {"status": "success", "locale": locale, "target_url": target_url}
    except Exception as exc:
        return {"status": "error", "message": str(exc)}
