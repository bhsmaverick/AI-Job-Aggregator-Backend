import sys
import os
import re
from bs4 import BeautifulSoup

# Ensure backend root is in Python Path for importing Celery tasks
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from worker import index_job_task

class JobCleaningPipeline:
    def process_item(self, item, spider):
        # 1. HTML Cleaning
        raw_html = item.get('raw_description', '')
        clean_text = ''
        if raw_html:
            # Parse and remove hidden scripts or styles
            soup = BeautifulSoup(raw_html, 'html.parser')
            for element in soup(["script", "style", "noscript"]):
                element.extract()
            # Extract basic text
            clean_text = soup.get_text(separator=' ')
            # Trim and compress internal whitespace
            clean_text = re.sub(r'\s+', ' ', clean_text).strip()
        
        item['description'] = clean_text
        
        # Merge basic requirements into the description space
        reqs = item.get('requirements', [])
        if reqs:
            item['description'] += " " + " ".join(reqs).strip()

        # 2. Keyword Extraction
        # Naïve presence-check extraction. Typically uses spaCy or NER models.
        text_for_keywords = f"{item.get('title', '')} {item['description']}".lower()
        target_skills = ['python', 'java', 'react', 'fastapi', 'docker', 'kubernetes', 'aws', 'sql', 'elasticsearch', 'scrapy', 'celery']
        
        extracted_skills = list(set([skill for skill in target_skills if skill in text_for_keywords]))
        item['skills'] = extracted_skills

        # 3. Structure Payload for Indexer
        job_data = {
            'title': item.get('title'),
            'company': item.get('company'),
            'location': item.get('location'),
            'description': item['description'],
            'skills': item['skills'],
            'posted_at': item.get('posting_date'),
            'url': item.get('url')
        }
        
        # 4. Trigger Celery Task (Fire and Forget)
        # Prevents the spider from waiting synchronously on Elasticsearch.
        index_job_task.delay(item.get('job_id', 'unknown_id'), job_data)
        
        return item
