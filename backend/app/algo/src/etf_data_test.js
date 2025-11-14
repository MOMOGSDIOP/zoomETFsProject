
const etfs = [
  {
    "etfId": "IVV-US-USD",
    "name": "iShares Core S&P 500 ETF",
    "metadata": {
      "issuer": "BlackRock",
      "description": "Seeks to track the investment results of the S&P 500 index",
      "creationDate": "2000-05-15",
      "lastRebalanceDate": "2023-12-15"
    },
    "fundamentals": {
      "priceData": {
        "currentPrice": 425.80,
        "previousClose": 423.25,
        "bidAskSpread": 0.01,
        "nav": 425.65,
        "premiumDiscount": 0.04,
        "52WeekHigh": 435.40,
        "52WeekLow": 382.10
      },
      "costs": {
        "ter": 0.0003,
        "trackingDifference": -0.0008,
        "trackingError": 0.0015,
        "lendingRevenue": 0.0004,
        "transactionCosts": 0.0002
      },
      "liquidity": {
        "avgDailyVolume": 3500000,
        "avgBidAskSpread": 0.01,
        "impliedLiquidity": 12000000,
        "marketImpactScore": 0.10
      }
    },
    "timeSeries": {
      "dailyReturns": [0.0025, -0.011, 0.0075],
      "historicalNav": [
        {"date": "2023-01-03", "value": 385.20},
        {"date": "2023-01-04", "value": 386.85},
        {"date": "2023-01-05", "value": 388.40}
      ],
      "trackingDifferenceHistory": [
        {"date": "2023-01", "value": -0.0010},
        {"date": "2023-02", "value": -0.0008}
      ]
    },
    "portfolio": {
      "holdings": [
        {
          "assetId": "MSFT-US",
          "name": "Microsoft Corporation",
          "weight": 0.068,
          "sector": "Technology",
          "country": "US",
          "contributionToTrackingError": 0.0011
        }
      ],
      "characteristics": {
        "sectorWeights": {
          "Technology": 0.27,
          "Health Care": 0.15,
          "Financials": 0.12
        },
        "countryWeights": {
          "US": 1.00
        },
        "factorExposures": {
          "beta": 1.01,
          "size": 0.96,
          "value": -0.30,
          "momentum": 0.14,
          "quality": 0.80
        }
      }
    },
    "riskAnalysis": {
      "volatility": {
        "30d": 0.135,
        "90d": 0.138,
        "annualized": 0.140
      },
      "drawdowns": {
        "maxDrawdown": -0.235,
        "avgDrawdown": -0.050,
        "recoveryTimeDays": 60
      },
      "correlations": {
        "spx": 0.999,
        "agg": 0.120,
        "gld": -0.032
      },
      "liquidityRisk": {
        "redemptionCost": 0.0015,
        "basketLiquidityScore": 0.94
      }
    },
    "alternativeData": {
      "sentiment": {
        "newsSentiment": 0.75,
        "socialMediaSentiment": 0.68,
        "analystConsensus": 0.83
      },
      "flows": {
        "30dNetFlow": 1200000000,
        "ytdFlow": 10000000000
      },
      "ownership": {
        "institutionalPercentage": 0.65,
        "topHolder": "BlackRock"
      }
    },
    "replication": {
      "method": "Full Replication",
      "optimization": {
        "samplingError": 0.0001,
        "numHoldings": 505,
        "coverage": 1.00
      },
      "lending": {
        "isLending": true,
        "lendingRevenue": 0.0004,
        "collateralQuality": "AAA"
      }
    },
    "peerComparison": {
      "avgTer": 0.0010,
      "avgTrackingError": 0.0020,
      "percentileRank": {
        "cost": 0.98,
        "liquidity": 0.97,
        "tracking": 0.93
      }
    },
    "system": {
      "lastUpdated": "2023-12-20T16:00:00Z",
      "dataSource": "BlackRock/Bloomberg",
      "calculationMethodology": "MSCI RiskMetrics"
    }
  },
  {
    "etfId": "EEM-US-USD",
    "name": "iShares MSCI Emerging Markets ETF",
    "metadata": {
      "issuer": "BlackRock",
      "description": "Seeks to track the investment results of MSCI Emerging Markets Index",
      "creationDate": "2003-04-07",
      "lastRebalanceDate": "2023-11-30"
    },
    "fundamentals": {
      "priceData": {
        "currentPrice": 42.35,
        "previousClose": 42.10,
        "bidAskSpread": 0.05,
        "nav": 42.30,
        "premiumDiscount": 0.12,
        "52WeekHigh": 45.80,
        "52WeekLow": 38.20
      },
      "costs": {
        "ter": 0.0068,
        "trackingDifference": -0.0085,
        "trackingError": 0.0120,
        "lendingRevenue": 0.0012,
        "transactionCosts": 0.0025
      },
      "liquidity": {
        "avgDailyVolume": 45000000,
        "avgBidAskSpread": 0.08,
        "impliedLiquidity": 8000000,
        "marketImpactScore": 0.25
      }
    },
    "timeSeries": {
      "dailyReturns": [0.005, -0.015, 0.010],
      "historicalNav": [
        {"date": "2023-01-03", "value": 39.45},
        {"date": "2023-01-04", "value": 39.80},
        {"date": "2023-01-05", "value": 40.10}
      ],
      "trackingDifferenceHistory": [
        {"date": "2023-01", "value": -0.0080},
        {"date": "2023-02", "value": -0.0090}
      ]
    },
    "portfolio": {
      "holdings": [
        {
          "assetId": "TCS-IND",
          "name": "Tata Consultancy Services",
          "weight": 0.015,
          "sector": "Information Technology",
          "country": "India",
          "contributionToTrackingError": 0.0025
        }
      ],
      "characteristics": {
        "sectorWeights": {
          "Financials": 0.22,
          "Information Technology": 0.18,
          "Consumer Discretionary": 0.12
        },
        "countryWeights": {
          "China": 0.32,
          "Taiwan": 0.15,
          "India": 0.14
        },
        "factorExposures": {
          "beta": 1.15,
          "size": 0.85,
          "value": 0.45,
          "momentum": -0.10,
          "quality": 0.60
        }
      }
    },
    "riskAnalysis": {
      "volatility": {
        "30d": 0.185,
        "90d": 0.190,
        "annualized": 0.195
      },
      "drawdowns": {
        "maxDrawdown": -0.325,
        "avgDrawdown": -0.085,
        "recoveryTimeDays": 120
      },
      "correlations": {
        "spx": 0.75,
        "agg": 0.35,
        "gld": 0.15
      },
      "liquidityRisk": {
        "redemptionCost": 0.0050,
        "basketLiquidityScore": 0.75
      }
    },
    "alternativeData": {
      "sentiment": {
        "newsSentiment": 0.65,
        "socialMediaSentiment": 0.58,
        "analystConsensus": 0.70
      },
      "flows": {
        "30dNetFlow": 800000000,
        "ytdFlow": 5000000000
      },
      "ownership": {
        "institutionalPercentage": 0.55,
        "topHolder": "BlackRock"
      }
    },
    "replication": {
      "method": "Optimized Sampling",
      "optimization": {
        "samplingError": 0.0030,
        "numHoldings": 1250,
        "coverage": 0.85
      },
      "lending": {
        "isLending": true,
        "lendingRevenue": 0.0012,
        "collateralQuality": "AA"
      }
    },
    "peerComparison": {
      "avgTer": 0.0075,
      "avgTrackingError": 0.0150,
      "percentileRank": {
        "cost": 0.85,
        "liquidity": 0.80,
        "tracking": 0.78
      }
    },
    "system": {
      "lastUpdated": "2023-12-20T14:45:00Z",
      "dataSource": "BlackRock/MSCI",
      "calculationMethodology": "MSCI RiskMetrics"
    }
  },
  {
    "etfId": "GLD-US-USD",
    "name": "SPDR Gold Shares",
    "metadata": {
      "issuer": "State Street Global Advisors",
      "description": "Seeks to reflect the performance of the price of gold bullion",
      "creationDate": "2004-11-18",
      "lastRebalanceDate": "2023-12-01"
    },
    "fundamentals": {
      "priceData": {
        "currentPrice": 185.25,
        "previousClose": 184.80,
        "bidAskSpread": 0.10,
        "nav": 185.20,
        "premiumDiscount": 0.03,
        "52WeekHigh": 195.40,
        "52WeekLow": 165.30
      },
      "costs": {
        "ter": 0.0040,
        "trackingDifference": -0.0025,
        "trackingError": 0.0040,
        "lendingRevenue": 0.0000,
        "transactionCosts": 0.0010
      },
      "liquidity": {
        "avgDailyVolume": 8000000,
        "avgBidAskSpread": 0.12,
        "impliedLiquidity": 20000000,
        "marketImpactScore": 0.15
      }
    },
    "timeSeries": {
      "dailyReturns": [0.002, -0.008, 0.005],
      "historicalNav": [
        {"date": "2023-01-03", "value": 172.45},
        {"date": "2023-01-04", "value": 173.10},
        {"date": "2023-01-05", "value": 173.75}
      ],
      "trackingDifferenceHistory": [
        {"date": "2023-01", "value": -0.0020},
        {"date": "2023-02", "value": -0.0030}
      ]
    },
    "portfolio": {
      "holdings": [
        {
          "assetId": "XAU",
          "name": "Gold Bullion",
          "weight": 1.00,
          "sector": "Commodities",
          "country": "Global",
          "contributionToTrackingError": 0.0000
        }
      ],
      "characteristics": {
        "sectorWeights": {
          "Commodities": 1.00
        },
        "countryWeights": {
          "Global": 1.00
        },
        "factorExposures": {
          "beta": -0.15,
          "size": 0.00,
          "value": 0.80,
          "momentum": 0.25,
          "quality": 0.90
        }
      }
    },
    "riskAnalysis": {
      "volatility": {
        "30d": 0.125,
        "90d": 0.130,
        "annualized": 0.135
      },
      "drawdowns": {
        "maxDrawdown": -0.185,
        "avgDrawdown": -0.045,
        "recoveryTimeDays": 90
      },
      "correlations": {
        "spx": -0.10,
        "agg": 0.05,
        "gld": 1.00
      },
      "liquidityRisk": {
        "redemptionCost": 0.0020,
        "basketLiquidityScore": 0.98
      }
    },
    "alternativeData": {
      "sentiment": {
        "newsSentiment": 0.68,
        "socialMediaSentiment": 0.72,
        "analystConsensus": 0.65
      },
      "flows": {
        "30dNetFlow": 500000000,
        "ytdFlow": 3000000000
      },
      "ownership": {
        "institutionalPercentage": 0.45,
        "topHolder": "State Street"
      }
    },
    "replication": {
      "method": "Physical",
      "optimization": {
        "samplingError": 0.0000,
        "numHoldings": 1,
        "coverage": 1.00
      },
      "lending": {
        "isLending": false,
        "lendingRevenue": 0.0000,
        "collateralQuality": "N/A"
      }
    },
    "peerComparison": {
      "avgTer": 0.0045,
      "avgTrackingError": 0.0050,
      "percentileRank": {
        "cost": 0.90,
        "liquidity": 0.95,
        "tracking": 0.92
      }
    },
    "system": {
      "lastUpdated": "2023-12-20T15:15:00Z",
      "dataSource": "State Street/LBMA",
      "calculationMethodology": "LBMA Gold Price"
    }
  },
  {
    "etfId": "VTI-US-USD",
    "name": "Vanguard Total Stock Market ETF",
    "metadata": {
      "issuer": "Vanguard",
      "description": "Seeks to track the performance of the CRSP US Total Market Index",
      "creationDate": "2001-05-24",
      "lastRebalanceDate": "2023-12-15"
    },
    "fundamentals": {
      "priceData": {
        "currentPrice": 215.40,
        "previousClose": 214.20,
        "bidAskSpread": 0.02,
        "nav": 215.35,
        "premiumDiscount": 0.02,
        "52WeekHigh": 225.80,
        "52WeekLow": 190.50
      },
      "costs": {
        "ter": 0.0003,
        "trackingDifference": -0.0005,
        "trackingError": 0.0010,
        "lendingRevenue": 0.0002,
        "transactionCosts": 0.0001
      },
      "liquidity": {
        "avgDailyVolume": 3500000,
        "avgBidAskSpread": 0.03,
        "impliedLiquidity": 10000000,
        "marketImpactScore": 0.08
      }
    },
    "timeSeries": {
      "dailyReturns": [0.0028, -0.0105, 0.0072],
      "historicalNav": [
        {"date": "2023-01-03", "value": 195.20},
        {"date": "2023-01-04", "value": 196.80},
        {"date": "2023-01-05", "value": 197.50}
      ],
      "trackingDifferenceHistory": [
        {"date": "2023-01", "value": -0.0006},
        {"date": "2023-02", "value": -0.0004}
      ]
    },
    "portfolio": {
      "holdings": [
        {
          "assetId": "AAPL-US",
          "name": "Apple Inc.",
          "weight": 0.062,
          "sector": "Technology",
          "country": "US",
          "contributionToTrackingError": 0.0010
        }
      ],
      "characteristics": {
        "sectorWeights": {
          "Technology": 0.25,
          "Health Care": 0.13,
          "Financials": 0.14
        },
        "countryWeights": {
          "US": 1.00
        },
        "factorExposures": {
          "beta": 1.00,
          "size": 0.80,
          "value": -0.20,
          "momentum": 0.10,
          "quality": 0.75
        }
      }
    },
    "riskAnalysis": {
      "volatility": {
        "30d": 0.140,
        "90d": 0.142,
        "annualized": 0.145
      },
      "drawdowns": {
        "maxDrawdown": -0.240,
        "avgDrawdown": -0.055,
        "recoveryTimeDays": 70
      },
      "correlations": {
        "spx": 0.995,
        "agg": 0.130,
        "gld": -0.030
      },
      "liquidityRisk": {
        "redemptionCost": 0.0012,
        "basketLiquidityScore": 0.96
      }
    },
    "alternativeData": {
      "sentiment": {
        "newsSentiment": 0.70,
        "socialMediaSentiment": 0.65,
        "analystConsensus": 0.78
      },
      "flows": {
        "30dNetFlow": 1800000000,
        "ytdFlow": 15000000000
      },
      "ownership": {
        "institutionalPercentage": 0.60,
        "topHolder": "Vanguard Group"
      }
    },
    "replication": {
      "method": "Full Replication",
      "optimization": {
        "samplingError": 0.0001,
        "numHoldings": 3500,
        "coverage": 1.00
      },
      "lending": {
        "isLending": true,
        "lendingRevenue": 0.0002,
        "collateralQuality": "AAA"
      }
    },
    "peerComparison": {
      "avgTer": 0.0010,
      "avgTrackingError": 0.0020,
      "percentileRank": {
        "cost": 0.99,
        "liquidity": 0.95,
        "tracking": 0.96
      }
    },
    "system": {
      "lastUpdated": "2023-12-20T16:30:00Z",
      "dataSource": "Vanguard/CRSP",
      "calculationMethodology": "CRSP Methodology"
    }
  },
  {
    "etfId": "XLK-US-USD",
    "name": "Technology Select Sector SPDR Fund",
    "metadata": {
      "issuer": "State Street Global Advisors",
      "description": "Seeks to provide investment results that correspond to the Technology Select Sector Index",
      "creationDate": "1998-12-16",
      "lastRebalanceDate": "2023-12-15"
    },
    "fundamentals": {
      "priceData": {
        "currentPrice": 175.80,
        "previousClose": 174.50,
        "bidAskSpread": 0.03,
        "nav": 175.75,
        "premiumDiscount": 0.03,
        "52WeekHigh": 185.40,
        "52WeekLow": 150.20
      },
      "costs": {
        "ter": 0.0010,
        "trackingDifference": -0.0015,
        "trackingError": 0.0025,
        "lendingRevenue": 0.0006,
        "transactionCosts": 0.0004
      },
      "liquidity": {
        "avgDailyVolume": 12000000,
        "avgBidAskSpread": 0.04,
        "impliedLiquidity": 8000000,
        "marketImpactScore": 0.15
      }
    },
    "timeSeries": {
      "dailyReturns": [0.004, -0.018, 0.012],
      "historicalNav": [
        {"date": "2023-01-03", "value": 158.20},
        {"date": "2023-01-04", "value": 160.50},
        {"date": "2023-01-05", "value": 162.80}
      ],
      "trackingDifferenceHistory": [
        {"date": "2023-01", "value": -0.0018},
        {"date": "2023-02", "value": -0.0012}
      ]
    },
    "portfolio": {
      "holdings": [
        {
          "assetId": "MSFT-US",
          "name": "Microsoft Corporation",
          "weight": 0.225,
          "sector": "Technology",
          "country": "US",
          "contributionToTrackingError": 0.0030
        }
      ],
      "characteristics": {
        "sectorWeights": {
          "Technology": 1.00
        },
        "countryWeights": {
          "US": 1.00
        },
        "factorExposures": {
          "beta": 1.15,
          "size": 0.90,
          "value": -0.45,
          "momentum": 0.25,
          "quality": 0.85
        }
      }
    },
    "riskAnalysis": {
      "volatility": {
        "30d": 0.185,
        "90d": 0.190,
        "annualized": 0.195
      },
      "drawdowns": {
        "maxDrawdown": -0.320,
        "avgDrawdown": -0.075,
        "recoveryTimeDays": 85
      },
      "correlations": {
        "spx": 0.92,
        "agg": 0.05,
        "gld": -0.10
      },
      "liquidityRisk": {
        "redemptionCost": 0.0025,
        "basketLiquidityScore": 0.90
      }
    },
    "alternativeData": {
      "sentiment": {
        "newsSentiment": 0.78,
        "socialMediaSentiment": 0.82,
        "analystConsensus": 0.85
      },
      "flows": {
        "30dNetFlow": 900000000,
        "ytdFlow": 7000000000
      },
      "ownership": {
        "institutionalPercentage": 0.58,
        "topHolder": "State Street"
      }
    },
    "replication": {
      "method": "Full Replication",
      "optimization": {
        "samplingError": 0.0005,
        "numHoldings": 75,
        "coverage": 1.00
      },
      "lending": {
        "isLending": true,
        "lendingRevenue": 0.0006,
        "collateralQuality": "AAA"
      }
    },
    "peerComparison": {
      "avgTer": 0.0015,
      "avgTrackingError": 0.0030,
      "percentileRank": {
        "cost": 0.92,
        "liquidity": 0.90,
        "tracking": 0.88
      }
    },
    "system": {
      "lastUpdated": "2023-12-20T15:45:00Z",
      "dataSource": "State Street/Bloomberg",
      "calculationMethodology": "S&P Dow Jones Indices"
    }
  },
  {
    "etfId": "IEFA-US-USD",
    "name": "iShares Core MSCI EAFE ETF",
    "metadata": {
      "issuer": "BlackRock",
      "description": "Seeks to track the investment results of the MSCI EAFE Index",
      "creationDate": "2012-10-18",
      "lastRebalanceDate": "2023-11-30"
    },
    "fundamentals": {
      "priceData": {
        "currentPrice": 72.45,
        "previousClose": 72.20,
        "bidAskSpread": 0.04,
        "nav": 72.40,
        "premiumDiscount": 0.07,
        "52WeekHigh": 75.80,
        "52WeekLow": 65.40
      },
      "costs": {
        "ter": 0.0007,
        "trackingDifference": -0.0015,
        "trackingError": 0.0030,
        "lendingRevenue": 0.0008,
        "transactionCosts": 0.0010
      },
      "liquidity": {
        "avgDailyVolume": 8000000,
        "avgBidAskSpread": 0.05,
        "impliedLiquidity": 6000000,
        "marketImpactScore": 0.18
      }
    },
    "timeSeries": {
      "dailyReturns": [0.003, -0.012, 0.008],
      "historicalNav": [
        {"date": "2023-01-03", "value": 68.20},
        {"date": "2023-01-04", "value": 68.50},
        {"date": "2023-01-05", "value": 68.80}
      ],
      "trackingDifferenceHistory": [
        {"date": "2023-01", "value": -0.0018},
        {"date": "2023-02", "value": -0.0012}
      ]
    },
    "portfolio": {
      "holdings": [
        {
          "assetId": "NOVN-CH",
          "name": "Novartis AG",
          "weight": 0.018,
          "sector": "Health Care",
          "country": "Switzerland",
          "contributionToTrackingError": 0.0015
        }
      ],
      "characteristics": {
        "sectorWeights": {
          "Financials": 0.20,
          "Health Care": 0.15,
          "Industrials": 0.14
        },
        "countryWeights": {
          "Japan": 0.25,
          "UK": 0.15,
          "France": 0.12
        },
        "factorExposures": {
          "beta": 0.95,
          "size": 0.75,
          "value": 0.30,
          "momentum": 0.05,
          "quality": 0.70
        }
      }
    },
    "riskAnalysis": {
      "volatility": {
        "30d": 0.155,
        "90d": 0.160,
        "annualized": 0.165
      },
      "drawdowns": {
        "maxDrawdown": -0.280,
        "avgDrawdown": -0.065,
        "recoveryTimeDays": 100
      },
      "correlations": {
        "spx": 0.85,
        "agg": 0.25,
        "gld": 0.10
      },
      "liquidityRisk": {
        "redemptionCost": 0.0030,
        "basketLiquidityScore": 0.85
      }
    },
    "alternativeData": {
      "sentiment": {
        "newsSentiment": 0.62,
        "socialMediaSentiment": 0.58,
        "analystConsensus": 0.68
      },
      "flows": {
        "30dNetFlow": 600000000,
        "ytdFlow": 4000000000
      },
      "ownership": {
        "institutionalPercentage": 0.52,
        "topHolder": "BlackRock"
      }
    },
    "replication": {
      "method": "Optimized Sampling",
      "optimization": {
        "samplingError": 0.0020,
        "numHoldings": 900,
        "coverage": 0.90
      },
      "lending": {
        "isLending": true,
        "lendingRevenue": 0.0008,
        "collateralQuality": "AA"
      }
    },
    "peerComparison": {
      "avgTer": 0.0012,
      "avgTrackingError": 0.0035,
      "percentileRank": {
        "cost": 0.88,
        "liquidity": 0.82,
        "tracking": 0.85
      }
    },
    "system": {
      "lastUpdated": "2023-12-20T14:30:00Z",
      "dataSource": "BlackRock/MSCI",
      "calculationMethodology": "MSCI RiskMetrics"
    }
  },
  {
    "etfId": "LQD-US-USD",
    "name": "iShares iBoxx $ Investment Grade Corporate Bond ETF",
    "metadata": {
      "issuer": "BlackRock",
      "description": "Seeks to track the investment results of the iBoxx $ Liquid Investment Grade Index",
      "creationDate": "2002-07-22",
      "lastRebalanceDate": "2023-12-01"
    },
    "fundamentals": {
      "priceData": {
        "currentPrice": 112.45,
        "previousClose": 112.30,
        "bidAskSpread": 0.08,
        "nav": 112.40,
        "premiumDiscount": 0.04,
        "52WeekHigh": 115.80,
        "52WeekLow": 105.20
      },
      "costs": {
        "ter": 0.0014,
        "trackingDifference": -0.0020,
        "trackingError": 0.0040,
        "lendingRevenue": 0.0005,
        "transactionCosts": 0.0015
      },
      "liquidity": {
        "avgDailyVolume": 5000000,
        "avgBidAskSpread": 0.10,
        "impliedLiquidity": 4000000,
        "marketImpactScore": 0.20
      }
    },
    "timeSeries": {
      "dailyReturns": [0.001, -0.005, 0.003],
      "historicalNav": [
        {"date": "2023-01-03", "value": 108.20},
        {"date": "2023-01-04", "value": 108.40},
        {"date": "2023-01-05", "value": 108.60}
      ],
      "trackingDifferenceHistory": [
        {"date": "2023-01", "value": -0.0025},
        {"date": "2023-02", "value": -0.0018}
      ]
    },
    "portfolio": {
      "holdings": [
        {
          "assetId": "GS-US",
          "name": "Goldman Sachs Group Inc.",
          "weight": 0.015,
          "sector": "Financials",
          "country": "US",
          "contributionToTrackingError": 0.0018
        }
      ],
      "characteristics": {
        "sectorWeights": {
          "Financials": 0.45,
          "Industrials": 0.25,
          "Utilities": 0.10
        },
        "countryWeights": {
          "US": 0.85,
          "UK": 0.05,
          "Canada": 0.04
        },
        "factorExposures": {
          "beta": 0.35,
          "size": 0.20,
          "value": 0.60,
          "momentum": 0.10,
          "quality": 0.65
        }
      }
    },
    "riskAnalysis": {
      "volatility": {
        "30d": 0.085,
        "90d": 0.090,
        "annualized": 0.095
      },
      "drawdowns": {
        "maxDrawdown": -0.185,
        "avgDrawdown": -0.035,
        "recoveryTimeDays": 150
      },
      "correlations": {
        "spx": 0.45,
        "agg": 0.85,
        "gld": 0.15
      },
      "liquidityRisk": {
        "redemptionCost": 0.0040,
        "basketLiquidityScore": 0.80
      }
    },
    "alternativeData": {
      "sentiment": {
        "newsSentiment": 0.58,
        "socialMediaSentiment": 0.52,
        "analystConsensus": 0.62
      },
      "flows": {
        "30dNetFlow": 400000000,
        "ytdFlow": 3000000000
      },
      "ownership": {
        "institutionalPercentage": 0.48,
        "topHolder": "BlackRock"
      }
    },
    "replication": {
      "method": "Optimized Sampling",
      "optimization": {
        "samplingError": 0.0030,
        "numHoldings": 1200,
        "coverage": 0.80
      },
      "lending": {
        "isLending": true,
        "lendingRevenue": 0.0005,
        "collateralQuality": "A"
      }
    },
    "peerComparison": {
      "avgTer": 0.0020,
      "avgTrackingError": 0.0050,
      "percentileRank": {
        "cost": 0.82,
        "liquidity": 0.78,
        "tracking": 0.80
      }
    },
    "system": {
      "lastUpdated": "2023-12-20T13:45:00Z",
      "dataSource": "BlackRock/Markit",
      "calculationMethodology": "Markit iBoxx"
    }
  },
  {
    "etfId": "ARKK-US-USD",
    "name": "ARK Innovation ETF",
    "metadata": {
      "issuer": "ARK Invest",
      "description": "Seeks long-term growth of capital by investing in disruptive innovation companies",
      "creationDate": "2014-10-31",
      "lastRebalanceDate": "2023-12-15"
    },
    "fundamentals": {
      "priceData": {
        "currentPrice": 48.25,
        "previousClose": 47.80,
        "bidAskSpread": 0.15,
        "nav": 48.20,
        "premiumDiscount": 0.10,
        "52WeekHigh": 55.40,
        "52WeekLow": 35.20
      },
      "costs": {
        "ter": 0.0075,
        "trackingDifference": -0.0100,
        "trackingError": 0.0150,
        "lendingRevenue": 0.0010,
        "transactionCosts": 0.0030
      },
      "liquidity": {
        "avgDailyVolume": 15000000,
        "avgBidAskSpread": 0.20,
        "impliedLiquidity": 5000000,
        "marketImpactScore": 0.30
      }
    },
    "timeSeries": {
      "dailyReturns": [0.010, -0.025, 0.018],
      "historicalNav": [
        {"date": "2023-01-03", "value": 40.20},
        {"date": "2023-01-04", "value": 41.50},
        {"date": "2023-01-05", "value": 42.80}
      ],
      "trackingDifferenceHistory": [
        {"date": "2023-01", "value": -0.0120},
        {"date": "2023-02", "value": -0.0080}
      ]
    },
    "portfolio": {
      "holdings": [
        {
          "assetId": "TSLA-US",
          "name": "Tesla Inc.",
          "weight": 0.105,
          "sector": "Consumer Discretionary",
          "country": "US",
          "contributionToTrackingError": 0.0050
        }
      ],
      "characteristics": {
        "sectorWeights": {
          "Technology": 0.45,
          "Health Care": 0.25,
          "Consumer Discretionary": 0.20
        },
        "countryWeights": {
          "US": 0.85,
          "China": 0.10,
          "Israel": 0.03
        },
        "factorExposures": {
          "beta": 1.45,
          "size": 1.20,
          "value": -0.65,
          "momentum": 0.45,
          "quality": 0.55
        }
      }
    },
    "riskAnalysis": {
      "volatility": {
        "30d": 0.285,
        "90d": 0.290,
        "annualized": 0.295
      },
      "drawdowns": {
        "maxDrawdown": -0.485,
        "avgDrawdown": -0.125,
        "recoveryTimeDays": 180
      },
      "correlations": {
        "spx": 0.75,
        "agg": 0.05,
        "gld": 0.10
      },
      "liquidityRisk": {
        "redemptionCost": 0.0080,
        "basketLiquidityScore": 0.65
      }
    },
    "alternativeData": {
      "sentiment": {
        "newsSentiment": 0.72,
        "socialMediaSentiment": 0.78,
        "analystConsensus": 0.65
      },
      "flows": {
        "30dNetFlow": 300000000,
        "ytdFlow": 2000000000
      },
      "ownership": {
        "institutionalPercentage": 0.35,
        "topHolder": "ARK Invest"
      }
    },
    "replication": {
      "method": "Active Management",
      "optimization": {
        "samplingError": 0.0200,
        "numHoldings": 35,
        "coverage": 0.60
      },
      "lending": {
        "isLending": true,
        "lendingRevenue": 0.0010,
        "collateralQuality": "BBB"
      }
    },
    "peerComparison": {
      "avgTer": 0.0080,
      "avgTrackingError": 0.0200,
      "percentileRank": {
        "cost": 0.65,
        "liquidity": 0.70,
        "tracking": 0.60
      }
    },
    "system": {
      "lastUpdated": "2023-12-20T17:00:00Z",
      "dataSource": "ARK Invest/Bloomberg",
      "calculationMethodology": "Proprietary"
    }
  },
  {
    "etfId": "VT-US-USD",
    "name": "Vanguard Total World Stock ETF",
    "metadata": {
      "issuer": "Vanguard",
      "description": "Seeks to track the performance of the FTSE Global All Cap Index",
      "creationDate": "2008-06-24",
      "lastRebalanceDate": "2023-11-30"
    },
    "fundamentals": {
      "priceData": {
        "currentPrice": 98.45,
        "previousClose": 98.20,
        "bidAskSpread": 0.05,
        "nav": 98.40,
        "premiumDiscount": 0.05,
        "52WeekHigh": 102.80,
        "52WeekLow": 88.20
      },
      "costs": {
        "ter": 0.0007,
        "trackingDifference": -0.0012,
        "trackingError": 0.0025,
        "lendingRevenue": 0.0006,
        "transactionCosts": 0.0008
      },
      "liquidity": {
        "avgDailyVolume": 2000000,
        "avgBidAskSpread": 0.06,
        "impliedLiquidity": 5000000,
        "marketImpactScore": 0.12
      }
    },
    "timeSeries": {
      "dailyReturns": [0.002, -0.010, 0.007],
      "historicalNav": [
        {"date": "2023-01-03", "value": 90.20},
        {"date": "2023-01-04", "value": 90.80},
        {"date": "2023-01-05", "value": 91.20}
      ],
      "trackingDifferenceHistory": [
        {"date": "2023-01", "value": -0.0015},
        {"date": "2023-02", "value": -0.0010}
      ]
    },
    "portfolio": {
      "holdings": [
        {
          "assetId": "AAPL-US",
          "name": "Apple Inc.",
          "weight": 0.042,
          "sector": "Technology",
          "country": "US",
          "contributionToTrackingError": 0.0008
        }
      ],
      "characteristics": {
        "sectorWeights": {
          "Technology": 0.20,
          "Financials": 0.18,
          "Health Care": 0.15
        },
        "countryWeights": {
          "US": 0.60,
          "Japan": 0.08,
          "UK": 0.05
        },
        "factorExposures": {
          "beta": 1.00,
          "size": 0.70,
          "value": -0.10,
          "momentum": 0.08,
          "quality": 0.72
        }
      }
    },
    "riskAnalysis": {
      "volatility": {
        "30d": 0.145,
        "90d": 0.150,
        "annualized": 0.155
      },
      "drawdowns": {
        "maxDrawdown": -0.250,
        "avgDrawdown": -0.060,
        "recoveryTimeDays": 90
      },
      "correlations": {
        "spx": 0.92,
        "agg": 0.20,
        "gld": 0.05
      },
      "liquidityRisk": {
        "redemptionCost": 0.0020,
        "basketLiquidityScore": 0.88
      }
    },
    "alternativeData": {
      "sentiment": {
        "newsSentiment": 0.68,
        "socialMediaSentiment": 0.62,
        "analystConsensus": 0.72
      },
      "flows": {
        "30dNetFlow": 500000000,
        "ytdFlow": 4000000000
      },
      "ownership": {
        "institutionalPercentage": 0.50,
        "topHolder": "Vanguard Group"
      }
    },
    "replication": {
      "method": "Optimized Sampling",
      "optimization": {
        "samplingError": 0.0025,
        "numHoldings": 8500,
        "coverage": 0.95
      },
      "lending": {
        "isLending": true,
        "lendingRevenue": 0.0006,
        "collateralQuality": "AA"
      }
    },
    "peerComparison": {
      "avgTer": 0.0012,
      "avgTrackingError": 0.0030,
      "percentileRank": {
        "cost": 0.90,
        "liquidity": 0.85,
        "tracking": 0.88
      }
    },
    "system": {
      "lastUpdated": "2023-12-20T16:15:00Z",
      "dataSource": "Vanguard/FTSE",
      "calculationMethodology": "FTSE Russell"
    }
  },
  {
    "etfId": "QQQ-US-USD",
    "name": "Invesco QQQ Trust",
    "metadata": {
      "issuer": "Invesco",
      "description": "Seeks to track the investment results of the NASDAQ-100 Index",
      "creationDate": "1999-03-10",
      "lastRebalanceDate": "2023-12-15"
    },
    "fundamentals": {
      "priceData": {
        "currentPrice": 385.40,
        "previousClose": 383.20,
        "bidAskSpread": 0.04,
        "nav": 385.35,
        "premiumDiscount": 0.01,
        "52WeekHigh": 395.80,
        "52WeekLow": 320.20
      },
      "costs": {
        "ter": 0.0020,
        "trackingDifference": -0.0025,
        "trackingError": 0.0035,
        "lendingRevenue": 0.0008,
        "transactionCosts": 0.0006
      },
      "liquidity": {
        "avgDailyVolume": 45000000,
        "avgBidAskSpread": 0.05,
        "impliedLiquidity": 20000000,
        "marketImpactScore": 0.10
      }
    },
    "timeSeries": {
      "dailyReturns": [0.005, -0.020, 0.015],
      "historicalNav": [
        {"date": "2023-01-03", "value": 345.20},
        {"date": "2023-01-04", "value": 350.50},
        {"date": "2023-01-05", "value": 355.80}
      ],
      "trackingDifferenceHistory": [
        {"date": "2023-01", "value": -0.0030},
        {"date": "2023-02", "value": -0.0020}
      ]
    },
    "portfolio": {
      "holdings": [
        {
          "assetId": "AAPL-US",
          "name": "Apple Inc.",
          "weight": 0.125,
          "sector": "Technology",
          "country": "US",
          "contributionToTrackingError": 0.0025
        }
      ],
      "characteristics": {
        "sectorWeights": {
          "Technology": 0.50,
          "Communication Services": 0.20,
          "Consumer Discretionary": 0.15
        },
        "countryWeights": {
          "US": 1.00
        },
        "factorExposures": {
          "beta": 1.25,
          "size": 0.85,
          "value": -0.40,
          "momentum": 0.30,
          "quality": 0.80
        }
      }
    },
    "riskAnalysis": {
      "volatility": {
        "30d": 0.205,
        "90d": 0.210,
        "annualized": 0.215
      },
      "drawdowns": {
        "maxDrawdown": -0.350,
        "avgDrawdown": -0.095,
        "recoveryTimeDays": 75
      },
      "correlations": {
        "spx": 0.92,
        "agg": 0.10,
        "gld": -0.15
      },
      "liquidityRisk": {
        "redemptionCost": 0.0018,
        "basketLiquidityScore": 0.95
      }
    },
    "alternativeData": {
      "sentiment": {
        "newsSentiment": 0.80,
        "socialMediaSentiment": 0.85,
        "analystConsensus": 0.88
      },
      "flows": {
        "30dNetFlow": 2000000000,
        "ytdFlow": 15000000000
      },
      "ownership": {
        "institutionalPercentage": 0.60,
        "topHolder": "Invesco"
      }
    },
    "replication": {
      "method": "Full Replication",
      "optimization": {
        "samplingError": 0.0008,
        "numHoldings": 100,
        "coverage": 1.00
      },
      "lending": {
        "isLending": true,
        "lendingRevenue": 0.0008,
        "collateralQuality": "AAA"
      }
    },
    "peerComparison": {
      "avgTer": 0.0025,
      "avgTrackingError": 0.0040,
      "percentileRank": {
        "cost": 0.85,
        "liquidity": 0.98,
        "tracking": 0.90
      }
    },
    "system": {
      "lastUpdated": "2023-12-20T17:30:00Z",
      "dataSource": "Invesco/NASDAQ",
      "calculationMethodology": "NASDAQ-100"
    }
  },
  {
    "etfId": "BND-US-USD",
    "name": "Vanguard Total Bond Market ETF",
    "metadata": {
      "issuer": "Vanguard",
      "description": "Seeks to track the performance of the Bloomberg U.S. Aggregate Float Adjusted Index",
      "creationDate": "2007-04-03",
      "lastRebalanceDate": "2023-12-01"
    },
    "fundamentals": {
      "priceData": {
        "currentPrice": 72.45,
        "previousClose": 72.40,
        "bidAskSpread": 0.06,
        "nav": 72.42,
        "premiumDiscount": 0.04,
        "52WeekHigh": 75.80,
        "52WeekLow": 70.20
      },
      "costs": {
        "ter": 0.0003,
        "trackingDifference": -0.0008,
        "trackingError": 0.0015,
        "lendingRevenue": 0.0002,
        "transactionCosts": 0.0004
      },
      "liquidity": {
        "avgDailyVolume": 3000000,
        "avgBidAskSpread": 0.08,
        "impliedLiquidity": 5000000,
        "marketImpactScore": 0.15
      }
    },
    "timeSeries": {
      "dailyReturns": [0.0005, -0.003, 0.002],
      "historicalNav": [
        {"date": "2023-01-03", "value": 71.20},
        {"date": "2023-01-04", "value": 71.25},
        {"date": "2023-01-05", "value": 71.30}
      ],
      "trackingDifferenceHistory": [
        {"date": "2023-01", "value": -0.0010},
        {"date": "2023-02", "value": -0.0006}
      ]
    },
    "portfolio": {
      "holdings": [
        {
          "assetId": "US-T",
          "name": "US Treasury Note",
          "weight": 0.40,
          "sector": "Government",
          "country": "US",
          "contributionToTrackingError": 0.0005
        }
      ],
      "characteristics": {
        "sectorWeights": {
          "Government": 0.40,
          "Corporate": 0.25,
          "Securitized": 0.30
        },
        "countryWeights": {
          "US": 0.98,
          "Other": 0.02
        },
        "factorExposures": {
          "beta": 0.20,
          "size": 0.10,
          "value": 0.50,
          "momentum": 0.05,
          "quality": 0.70
        }
      }
    },
    "riskAnalysis": {
      "volatility": {
        "30d": 0.045,
        "90d": 0.050,
        "annualized": 0.055
      },
      "drawdowns": {
        "maxDrawdown": -0.125,
        "avgDrawdown": -0.025,
        "recoveryTimeDays": 200
      },
      "correlations": {
        "spx": 0.15,
        "agg": 0.98,
        "gld": 0.10
      },
      "liquidityRisk": {
        "redemptionCost": 0.0015,
        "basketLiquidityScore": 0.92
      }
    },
    "alternativeData": {
      "sentiment": {
        "newsSentiment": 0.55,
        "socialMediaSentiment": 0.48,
        "analystConsensus": 0.60
      },
      "flows": {
        "30dNetFlow": 1000000000,
        "ytdFlow": 8000000000
      },
      "ownership": {
        "institutionalPercentage": 0.45,
        "topHolder": "Vanguard Group"
      }
    },
    "replication": {
      "method": "Optimized Sampling",
      "optimization": {
        "samplingError": 0.0012,
        "numHoldings": 10000,
        "coverage": 0.95
      },
      "lending": {
        "isLending": true,
        "lendingRevenue": 0.0002,
        "collateralQuality": "AAA"
      }
    },
    "peerComparison": {
      "avgTer": 0.0008,
      "avgTrackingError": 0.0020,
      "percentileRank": {
        "cost": 0.98,
        "liquidity": 0.90,
        "tracking": 0.95
      }
    },
    "system": {
      "lastUpdated": "2023-12-20T13:30:00Z",
      "dataSource": "Vanguard/Bloomberg",
      "calculationMethodology": "Bloomberg Barclays"
    }
  },
  {
    "etfId": "SPY-US-USD",
    "name": "SPDR S&P 500 ETF Trust",
    "metadata": {
    "issuer": "State Street Global Advisors",
    "description": "Seeks to provide investment results that correspond to the S&P 500 Index",
    "creationDate": "1993-01-22",
    "lastRebalanceDate": "2023-12-15"
    },
  
  // Données fondamentales enrichies
  "fundamentals": {
    "priceData": {
      "currentPrice": 422.50,
      "previousClose": 420.00,
      "bidAskSpread": 0.02,
      "nav": 422.30,
      "premiumDiscount": 0.05,
      "52WeekHigh": 432.10,
      "52WeekLow": 380.25
    },
    
    "costs": {
      "ter": 0.0009,
      "trackingDifference": -0.0012,
      "trackingError": 0.0021,
      "lendingRevenue": 0.0005,
      "transactionCosts": 0.0003
    },
    
    "liquidity": {
      "avgDailyVolume": 5000000,
      "avgBidAskSpread": 0.02,
      "impliedLiquidity": 15000000,
      "marketImpactScore": 0.12
    }
  },

  // Structure temporelle complète
  "timeSeries": {
    "dailyReturns": [0.003, -0.012, 0.008], // 252 derniers jours
    "historicalNav": [
      {"date": "2023-01-03", "value": 382.45},
      {"date": "2023-01-04", "value": 384.12},
      {"date": "2023-01-05", "value": 385.67}
    ],
    "trackingDifferenceHistory": [
      {"date": "2023-01", "value": -0.0015},
      {"date": "2023-02", "value": -0.0011},
      // Derniers mois
    ]
  },

  // Données de portefeuille détaillées
  "portfolio": {
    "holdings": [
      {
        "assetId": "AAPL-US",
        "name": "Apple Inc.",
        "weight": 0.072,
        "sector": "Technology",
        "country": "US",
        "contributionToTrackingError": 0.0012
      },
     // Tous les constituants
    ],
    
    "characteristics": {
      "sectorWeights": {
        "Technology": 0.28,
        "Health Care": 0.14,
        "Financials": 0.13,
      },
      "countryWeights": {
        "US": 1.00
      },
      "factorExposures": {
        "beta": 1.02,
        "size": 0.95,
        "value": -0.32,
        "momentum": 0.15,
        "quality": 0.78
      }
    }
  },

  // Métriques de risque avancées
  "riskAnalysis": {
    "volatility": {
      "30d": 0.138,
      "90d": 0.140,
      "annualized": 0.142
    },
    "drawdowns": {
      "maxDrawdown": -0.238,
      "avgDrawdown": -0.052,
      "recoveryTimeDays": 63
    },
    "correlations": {
      "spx": 0.998,
      "agg": 0.124,
      "gld": -0.034
    },
    "liquidityRisk": {
      "redemptionCost": 0.0018,
      "basketLiquidityScore": 0.92
    }
  },

  // Données alternatives
  "alternativeData": {
    "sentiment": {
      "newsSentiment": 0.72,
      "socialMediaSentiment": 0.65,
      "analystConsensus": 0.81
    },
    "flows": {
      "30dNetFlow": 1500000000,
      "ytdFlow": 12000000000
    },
    "ownership": {
      "institutionalPercentage": 0.62,
      "topHolder": "Vanguard Group"
    }
  },

  // Mécanisme de réplication
  "replication": {
    "method": "Full Replication",
    "optimization": {
      "samplingError": 0.0002,
      "numHoldings": 503,
      "coverage": 1.00
    },
    "lending": {
      "isLending": true,
      "lendingRevenue": 0.0005,
      "collateralQuality": "AAA"
    }
  },

  // Données comparatives
  "peerComparison": {
    "avgTer": 0.0012,
    "avgTrackingError": 0.0025,
    "percentileRank": {
      "cost": 0.95,
      "liquidity": 0.98,
      "tracking": 0.91
    }
  },

  // Metadata système
  "system": {
    "lastUpdated": "2023-12-20T15:30:00Z",
    "dataSource": "Bloomberg/State Street",
    "calculationMethodology": "MSCI RiskMetrics"
  }
  }
];

export default etfs;