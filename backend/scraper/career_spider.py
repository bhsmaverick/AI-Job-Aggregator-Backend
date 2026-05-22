import scrapy
import random
import json
from datetime import datetime, timezone

class RotateUserAgentMiddleware:
    """
    Middleware to rotate User-Agent headers per request to avoid basic bans.
    """
    USER_AGENTS = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
    ]

    def process_request(self, request, spider):
        request.headers['User-Agent'] = random.choice(self.USER_AGENTS)

class DynamicCareerSpider(scrapy.Spider):
    name = "dynamic_career_spider"

    # Scrapy limits and behavior specs to avoid bans
    custom_settings = {
        'DOWNLOAD_DELAY': 2.0,                  # Random wait between requests
        'RANDOMIZE_DOWNLOAD_DELAY': True,       # Applies multiplier to download delay
        'CONCURRENT_REQUESTS_PER_DOMAIN': 2,    # Don't hammer the origin server
        'DOWNLOADER_MIDDLEWARES': {
            'scraper.career_spider.RotateUserAgentMiddleware': 400,
        },
        'ITEM_PIPELINES': {
            'scraper.pipelines.JobCleaningPipeline': 300,
        }
    }

    def __init__(self, target_url=None, rules=None, *args, **kwargs):
        super(DynamicCareerSpider, self).__init__(*args, **kwargs)
        self.start_urls = [target_url] if target_url else []
        self.rules = json.loads(rules) if isinstance(rules, str) else (rules or {})
        
        if target_url:
            from urllib.parse import urlparse
            self.allowed_domains = [urlparse(target_url).netloc]

    def parse(self, response):
        """Parse the job list page."""
        list_rule = self.rules.get('list_page', {})
        job_links_css = list_rule.get('job_links_css')
        job_links_xpath = list_rule.get('job_links_xpath')
        
        links = []
        if job_links_css:
            links = response.css(job_links_css).getall()
        elif job_links_xpath:
            links = response.xpath(job_links_xpath).getall()
            
        for url in links:
            if url:
                yield response.follow(url, self.parse_job)
        
        # Follow pagination
        next_page_css = list_rule.get('next_page_css')
        next_page_xpath = list_rule.get('next_page_xpath')
        
        next_page = None
        if next_page_css:
            next_page = response.css(next_page_css).get()
        elif next_page_xpath:
            next_page = response.xpath(next_page_xpath).get()
            
        if next_page:
            yield response.follow(next_page, self.parse)

    def parse_job(self, response):
        """Parse individual job details."""
        detail_rule = self.rules.get('detail_page', {})
        
        def extract(field):
            css_sel = detail_rule.get(f'{field}_css')
            xpath_sel = detail_rule.get(f'{field}_xpath')
            if css_sel:
                return response.css(css_sel).get(default='').strip()
            elif xpath_sel:
                return response.xpath(xpath_sel).get(default='').strip()
            return ''
            
        def extract_all(field):
            css_sel = detail_rule.get(f'{field}_css')
            xpath_sel = detail_rule.get(f'{field}_xpath')
            if css_sel:
                return response.css(css_sel).getall()
            elif xpath_sel:
                return response.xpath(xpath_sel).getall()
            return []

        yield {
            'job_id': response.url.split('/')[-1] or "empty-id",
            'url': response.url,
            'title': extract('title'),
            'company': extract('company'),
            'location': extract('location'),
            'posting_date': extract('posting_date') or datetime.now(timezone.utc).isoformat(),
            'raw_description': extract('description'),
            'requirements': extract_all('skills'),
        }
