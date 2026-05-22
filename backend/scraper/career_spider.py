import scrapy
import random
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

class CareerSpider(scrapy.Spider):
    name = "career_spider"
    allowed_domains = ["example-careers.com"]
    start_urls = ["https://example-careers.com/jobs"]

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

    def parse(self, response):
        """Parse the job list page."""
        for job_card in response.css('.job-listing'):
            url = job_card.css('a::attr(href)').get()
            if url:
                # Follow absolute or relative URLs
                yield response.follow(url, self.parse_job)
        
        # Follow pagination
        next_page = response.css('a.next-page::attr(href)').get()
        if next_page:
            yield response.follow(next_page, self.parse)

    def parse_job(self, response):
        """Parse individual job details."""
        # Yielding raw item—further cleaning happens in the pipelines
        yield {
            'job_id': response.url.split('/')[-1] or "empty-id",
            'url': response.url,
            'title': response.css('h1.job-title::text').get(default='').strip(),
            'company': response.css('.company-name::text').get(default='TargetCo').strip(),
            'location': response.css('.location::text').get(default='Remote').strip(),
            'posting_date': response.css('time::attr(datetime)').get(default=datetime.now(timezone.utc).isoformat()),
            'raw_description': response.css('.job-description-content').get(default=''),
            'requirements': response.css('ul.requirements li::text').getall(),
        }
