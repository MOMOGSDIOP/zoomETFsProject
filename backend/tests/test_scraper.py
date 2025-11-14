# test_scraper.py
import asyncio
from app.services import JustETFScraper

async def main():
    scraper = JustETFScraper()
    data = await scraper.scrape("IE00B4L5Y983")
    print(data)

if __name__ == "__main__":
    asyncio.run(main())