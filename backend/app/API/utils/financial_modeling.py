import httpx

async def fetch_fmp_data(api_key: str, ticker: str):
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"https://financialmodelingprep.com/api/v3/etf-holder/{ticker}?apikey={api_key}"
        )
        return {"holders": r.json()}