import asyncio
from bs4 import BeautifulSoup
from app.utils import cache
from app.core import settings

class JustETFScraper:
    BASE_URL = "https://www.justetf.com/en/etf-profile.html"
    PROXY_POOL = settings.PROXY_POOL  # Liste de proxies rotatifs

    async def scrape(self, isin: str, retries=3):
        """Scrape avec rotation de proxies et gestion d'erreurs"""
        for attempt in range(retries):
            proxy = self._get_proxy()
            try:
                async with httpx.AsyncClient(proxies=proxy) as client:
                    response = await client.get(f"{self.BASE_URL}?isin={isin}", timeout=10.0)
                    data = self._parse(response.text)
                    await cache.set(f"justetf:{isin}", data)
                    return data
            except Exception as e:
                if attempt == retries - 1:
                    raise Exception(f"Échec après {retries} tentatives: {str(e)}")

    def _parse(self, html: str) -> dict:
        """Extraction des données depuis le HTML"""
        soup = BeautifulSoup(html, 'html.parser')
        return {
            "isin": soup.find("span", class_="isin").text.strip(),
            "ter": float(soup.find("td", text="Total Expense Ratio").find_next_sibling("td").text.replace('%', '')) / 100,
            "aum": float(soup.find("td", text="Assets Under Management").find_next_sibling("td").text[:-2].replace(',', ''))
        }