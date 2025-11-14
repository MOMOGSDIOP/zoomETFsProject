const etfs = [
  {
    name: 'SPDR S&P 500',
    price: 420.69,
    currentPrice: 422.50,
    previousClose: 420.00,
    performance: 12.3,
    volatility: 14.2,
    dividendYield: 1.8,
    TER: 0.09,
    issuer: 'SPDR',
    region: 'Monde',
    type: 'Accumulation',
    replication: 'Physique',
    sector: 'Tous secteurs',
    availability: 'Partout',
    volume: 5000000,
    inceptionDate: '1993-01-22',
    generalInfo: {
      index: "S&P 500",
      investmentFocus: "Large-cap US equities",
      fundSize: "400B $",
      totalExpenseRatio: "0.09%",
      replicationMethod: "Physique",
      legalStructure: "ETF UCITS",
      strategyRisk: "Modéré",
      currency: "USD",
      annualVolatility: "14.2%",
      creationDate: "1993-01-22",
      distribution: "Accumulation",
      distributionInterval: "Trimestriel",
      domicile: "USA",
      promoter: "State Street Global Advisors"
    },
    legalStructureDetails: {
      fundStructure: "Fonds d'investissement",
      ucitsCompliant: true,
      administrator: "State Street",
      investmentAdvisor: "SSGA",
      depositaryBank: "State Street Bank",
      auditor: "Deloitte",
      fiscalYearEnd: "31 décembre",
      swissRepresentative: "UBS AG",
      swissPayingAgent: "Credit Suisse"
    },
    fiscalStatus: {
      germany: true,
      switzerland: true,
      austria: true
    },
    replicationDetails: {
      indexType: "Price Return",
      swapCounterparty: null,
      collateralManagement: null,
      securitiesLending: true,
      securitiesLendingCounterparty: "JPMorgan"
    },
    positions: {
      topAssets: [
        { name: 'Apple', percentage: 7.2 },
        { name: 'Microsoft', percentage: 6.8 },
        { name: 'Amazon', percentage: 3.5 },
        { name: 'Facebook', percentage: 2.3 },
        { name: 'Google', percentage: 2.1 },
        { name: 'Tesla', percentage: 1.8 },
        { name: 'Berkshire Hathaway', percentage: 1.7 },
        { name: 'JPMorgan', percentage: 1.5 },
        { name: 'Johnson & Johnson', percentage: 1.4 },
        { name: 'Visa', percentage: 1.3 }
      ],
      byCountry: [
        { country: 'USA', percentage: 50 },
        { country: 'FRA', percentage: 50 }
      ],
      bySector: [
        { sector: 'Technologie', percentage: 28 },
        { sector: 'Santé', percentage: 14 },
        { sector: 'Finance', percentage: 13 },
        { sector: 'Consommation', percentage: 11 },
        { sector: 'Industrie', percentage: 9 }
      ]
    },
    returns: {
      monthly: 1.0,
      bimonthly: 2.1,
      quarterly: 3.2,
      semiAnnual: 6.5,
      annual: 12.3
    },
    riskMetrics: {
      vol30d: 13.8,
      vol90d: 14.0,
      vol180d: 14.1,
      vol1y: 14.2
    },
    exchanges: [
      {
        name: 'NYSE Arca',
        open: '15:30',
        close: '22:00'
      },
      {
        name: 'BATS',
        open: '15:30',
        close: '22:00'
      }
    ]
  },
  {
    name: 'iShares MSCI Europe',
    price: 85.20,
    currentPrice: 84.50,
    previousClose: 85.00,
    performance: 8.1,
    volatility: 12.1,
    dividendYield: 2.5,
    TER: 0.15,
    issuer: 'iShares',
    region: 'Europe',
    type: 'Capitalisation',
    replication: 'Synthétique',
    sector: 'Tous secteurs',
    availability: 'Europe',
    volume: 1200000,
    inceptionDate: '2000-05-15',
    generalInfo: {
      index: "MSCI Europe",
      investmentFocus: "Large and mid-cap European equities",
      fundSize: "12B €",
      totalExpenseRatio: "0.15%",
      replicationMethod: "Synthétique",
      legalStructure: "ETF UCITS",
      strategyRisk: "Modéré",
      currency: "EUR",
      annualVolatility: "12.1%",
      creationDate: "2000-05-15",
      distribution: "Capitalisation",
      distributionInterval: "Annuel",
      domicile: "Irlande",
      promoter: "BlackRock"
    },
    legalStructureDetails: {
      fundStructure: "Fonds commun de placement",
      ucitsCompliant: true,
      administrator: "BlackRock",
      investmentAdvisor: "BlackRock Advisors",
      depositaryBank: "State Street Bank",
      auditor: "EY",
      fiscalYearEnd: "31 décembre",
      swissRepresentative: "Credit Suisse",
      swissPayingAgent: "UBS AG"
    },
    fiscalStatus: {
      germany: true,
      switzerland: true,
      austria: true
    },
    replicationDetails: {
      indexType: "Net Total Return",
      swapCounterparty: "Deutsche Bank",
      collateralManagement: "Tri-party",
      securitiesLending: false,
      securitiesLendingCounterparty: null
    },
    positions: {
      topAssets: [
        { name: 'Nestlé', percentage: 4.2 },
        { name: 'ASML', percentage: 3.8 },
        { name: 'LVMH', percentage: 3.5 },
        { name: 'Novartis', percentage: 3.2 },
        { name: 'Roche', percentage: 3.0 },
        { name: 'SAP', percentage: 2.8 },
        { name: 'TotalEnergies', percentage: 2.5 },
        { name: 'Unilever', percentage: 2.3 },
        { name: 'AstraZeneca', percentage: 2.1 },
        { name: 'GlaxoSmithKline', percentage: 1.9 }
      ],
      byCountry: [
        { country: 'UK', percentage: 22 },
        { country: 'France', percentage: 18 },
        { country: 'Switzerland', percentage: 16 },
        { country: 'Germany', percentage: 14 },
        { country: 'Netherlands', percentage: 8 }
      ],
      bySector: [
        { sector: 'Santé', percentage: 18 },
        { sector: 'Finance', percentage: 16 },
        { sector: 'Consommation', percentage: 15 },
        { sector: 'Industrie', percentage: 12 },
        { sector: 'Technologie', percentage: 10 }
      ]
    },
    returns: {
      monthly: 0.7,
      bimonthly: 1.4,
      quarterly: 2.1,
      semiAnnual: 4.2,
      annual: 8.1
    },
    riskMetrics: {
      vol30d: 11.8,
      vol90d: 12.0,
      vol180d: 12.0,
      vol1y: 12.1
    },
    exchanges: [
      {
        name: 'Euronext Paris',
        open: '09:00',
        close: '17:30'
      },
      {
        name: 'Deutsche Börse',
        open: '09:00',
        close: '17:30'
      }
    ]
  },
  {
    name: 'Vanguard Technology ETF',
    price: 150.55,
    currentPrice: 153.00,
    previousClose: 150.00,
    performance: 18.5,
    volatility: 20.3,
    dividendYield: 0.7,
    TER: 0.12,
    issuer: 'Vanguard',
    region: 'USA',
    type: 'Accumulation',
    replication: 'Physique',
    sector: 'Technologie',
    availability: 'USA',
    volume: 3500000,
    inceptionDate: '2010-03-10',
    generalInfo: {
      index: "MSCI USA Information Technology",
      investmentFocus: "US technology sector",
      fundSize: "45B $",
      totalExpenseRatio: "0.12%",
      replicationMethod: "Physique",
      legalStructure: "ETF",
      strategyRisk: "Élevé",
      currency: "USD",
      annualVolatility: "20.3%",
      creationDate: "2010-03-10",
      distribution: "Accumulation",
      distributionInterval: "Trimestriel",
      domicile: "USA",
      promoter: "Vanguard"
    },
    legalStructureDetails: {
      fundStructure: "Open-ended fund",
      ucitsCompliant: false,
      administrator: "Vanguard",
      investmentAdvisor: "Vanguard Group",
      depositaryBank: "JPMorgan Chase",
      auditor: "PwC",
      fiscalYearEnd: "31 décembre",
      swissRepresentative: null,
      swissPayingAgent: null
    },
    fiscalStatus: {
      germany: false,
      switzerland: false,
      austria: false
    },
    replicationDetails: {
      indexType: "Total Return",
      swapCounterparty: null,
      collateralManagement: null,
      securitiesLending: false,
      securitiesLendingCounterparty: null
    },
    positions: {
      topAssets: [
        { name: 'Apple', percentage: 22.5 },
        { name: 'Microsoft', percentage: 20.8 },
        { name: 'NVIDIA', percentage: 6.7 },
        { name: 'Visa', percentage: 4.2 },
        { name: 'Mastercard', percentage: 3.9 },
        { name: 'Adobe', percentage: 3.6 },
        { name: 'Salesforce', percentage: 3.4 },
        { name: 'Intel', percentage: 3.2 },
        { name: 'Cisco', percentage: 2.9 },
        { name: 'IBM', percentage: 2.7 }
      ],
      byCountry: [
        { country: 'USA', percentage: 25 },
        { country: 'FR', percentage: 25 },
        { country: 'ITL', percentage:25 },
        { country: 'ALL', percentage: 25}

      ],
      bySector: [
        { sector: 'Technologie', percentage: 85 },
        { sector: 'Communication', percentage: 15 }
      ]
    },
    returns: {
      monthly: 1.5,
      bimonthly: 3.1,
      quarterly: 4.7,
      semiAnnual: 9.5,
      annual: 18.5
    },
    riskMetrics: {
      vol30d: 19.8,
      vol90d: 20.1,
      vol180d: 20.2,
      vol1y: 20.3
    },
    exchanges: [
      {
        name: 'NASDAQ',
        open: '15:30',
        close: '22:00'
      },
      {
        name: 'NYSE',
        open: '15:30',
        close: '22:00'
      }
    ]
  },
  {
    name: 'Lyxor Healthcare',
    price: 100.30,
    currentPrice: 100.50,
    previousClose: 101.00,
    performance: 10.2,
    volatility: 13.5,
    dividendYield: 2.0,
    TER: 0.18,
    issuer: 'Lyxor',
    region: 'Europe',
    type: 'Capitalisation',
    replication: 'Synthétique',
    sector: 'Santé',
    availability: 'Europe',
    volume: 900000,
    inceptionDate: '2005-08-25',
    generalInfo: {
      index: "MSCI Europe Health Care",
      investmentFocus: "European healthcare sector",
      fundSize: "2.5B €",
      totalExpenseRatio: "0.18%",
      replicationMethod: "Synthétique",
      legalStructure: "ETF UCITS",
      strategyRisk: "Modéré",
      currency: "EUR",
      annualVolatility: "13.5%",
      creationDate: "2005-08-25",
      distribution: "Capitalisation",
      distributionInterval: "Annuel",
      domicile: "France",
      promoter: "Lyxor Asset Management"
    },
    legalStructureDetails: {
      fundStructure: "Fonds commun de placement",
      ucitsCompliant: true,
      administrator: "Société Générale",
      investmentAdvisor: "Lyxor",
      depositaryBank: "BNP Paribas",
      auditor: "KPMG",
      fiscalYearEnd: "31 décembre",
      swissRepresentative: "UBS AG",
      swissPayingAgent: "Credit Suisse"
    },
    fiscalStatus: {
      germany: true,
      switzerland: true,
      austria: true
    },
    replicationDetails: {
      indexType: "Net Total Return",
      swapCounterparty: "BNP Paribas",
      collateralManagement: "Tri-party",
      securitiesLending: false,
      securitiesLendingCounterparty: null
    },
    positions: {
      topAssets: [
        { name: 'Novartis', percentage: 12.5 },
        { name: 'Roche', percentage: 11.8 },
        { name: 'AstraZeneca', percentage: 8.7 },
        { name: 'Sanofi', percentage: 7.2 },
        { name: 'GlaxoSmithKline', percentage: 6.3 },
        { name: 'Bayer', percentage: 5.4 },
        { name: 'Merck KGaA', percentage: 4.9 },
        { name: 'Novo Nordisk', percentage: 3.6 },
        { name: 'Smith & Nephew', percentage: 2.4 },
        { name: 'Coloplast', percentage: 1.8 }
      ],
      byCountry: [
        { country: 'Switzerland', percentage: 32 },
        { country: 'UK', percentage: 25 },
        { country: 'France', percentage: 18 },
        { country: 'Germany', percentage: 15 },
        { country: 'Denmark', percentage: 10 }
      ],
      bySector: [
        { sector: 'Pharmaceutique', percentage: 65 },
        { sector: 'Biotechnologie', percentage: 20 },
        { sector: 'Equipement médical', percentage: 15 }
      ]
    },
    returns: {
      monthly: 0.9,
      bimonthly: 1.8,
      quarterly: 2.7,
      semiAnnual: 5.4,
      annual: 10.2
    },
    riskMetrics: {
      vol30d: 13.2,
      vol90d: 13.4,
      vol180d: 13.5,
      vol1y: 13.5
    },
    exchanges: [
      {
        name: 'Euronext Paris',
        open: '09:00',
        close: '17:30'
      },
      {
        name: 'Deutsche Börse',
        open: '09:00',
        close: '17:30'
      }
    ]
  },
  {
    name: 'Amundi Energy',
    price: 48.90,
    currentPrice: 49.10,
    previousClose: 48.80,
    performance: 4.5,
    volatility: 16.7,
    dividendYield: 3.2,
    TER: 0.20,
    issuer: 'Amundi',
    region: 'Monde',
    type: 'Hybride',
    replication: 'Physique',
    sector: 'Énergie',
    availability: 'Partout',
    volume: 800000,
    inceptionDate: '2012-06-01',
    generalInfo: {
      index: "MSCI World Energy",
      investmentFocus: "Global energy sector",
      fundSize: "1.8B €",
      totalExpenseRatio: "0.20%",
      replicationMethod: "Physique",
      legalStructure: "ETF UCITS",
      strategyRisk: "Élevé",
      currency: "EUR",
      annualVolatility: "16.7%",
      creationDate: "2012-06-01",
      distribution: "Hybride",
      distributionInterval: "Trimestriel",
      domicile: "France",
      promoter: "Amundi Asset Management"
    },
    legalStructureDetails: {
      fundStructure: "Fonds commun de placement",
      ucitsCompliant: true,
      administrator: "Amundi",
      investmentAdvisor: "Amundi",
      depositaryBank: "BNP Paribas",
      auditor: "EY",
      fiscalYearEnd: "31 décembre",
      swissRepresentative: "Credit Suisse",
      swissPayingAgent: "UBS AG"
    },
    fiscalStatus: {
      germany: true,
      switzerland: true,
      austria: true
    },
    replicationDetails: {
      indexType: "Price Return",
      swapCounterparty: null,
      collateralManagement: null,
      securitiesLending: true,
      securitiesLendingCounterparty: "BNP Paribas"
    },
    positions: {
      topAssets: [
        { name: 'ExxonMobil', percentage: 15.5 },
        { name: 'Chevron', percentage: 12.8 },
        { name: 'Shell', percentage: 10.7 },
        { name: 'BP', percentage: 8.2 },
        { name: 'TotalEnergies', percentage: 7.3 },
        { name: 'ConocoPhillips', percentage: 5.4 },
        { name: 'Schlumberger', percentage: 4.9 },
        { name: 'Halliburton', percentage: 3.6 },
        { name: 'Eni', percentage: 2.4 },
        { name: 'Equinor', percentage: 1.8 }
      ],
      byCountry: [
        { country: 'USA', percentage: 55 },
        { country: 'UK', percentage: 18 },
        { country: 'France', percentage: 12 },
        { country: 'Italy', percentage: 5 },
        { country: 'Norway', percentage: 5 }
      ],
      bySector: [
        { sector: 'Pétrole et gaz', percentage: 85 },
        { sector: 'Énergie renouvelable', percentage: 15 }
      ]
    },
    returns: {
      monthly: 0.4,
      bimonthly: 0.8,
      quarterly: 1.2,
      semiAnnual: 2.4,
      annual: 4.5
    },
    riskMetrics: {
      vol30d: 16.5,
      vol90d: 16.6,
      vol180d: 16.6,
      vol1y: 16.7
    },
    exchanges: [
      {
        name: 'Euronext Paris',
        open: '09:00',
        close: '17:30'
      },
      {
        name: 'Borsa Italiana',
        open: '09:00',
        close: '17:30'
      }
    ]
  },
  {
    name: 'Xtrackers Financials',
    price: 75.80,
    currentPrice: 75.30,
    previousClose: 75.00,
    performance: 6.7,
    volatility: 11.4,
    dividendYield: 2.7,
    TER: 0.13,
    issuer: 'Xtrackers',
    region: 'Europe',
    type: 'Accumulation',
    replication: 'Physique',
    sector: 'Finance',
    availability: 'Europe',
    volume: 1500000,
    inceptionDate: '2008-09-12',
    generalInfo: {
      index: "MSCI Europe Financials",
      investmentFocus: "European financial sector",
      fundSize: "3.2B €",
      totalExpenseRatio: "0.13%",
      replicationMethod: "Physique",
      legalStructure: "ETF UCITS",
      strategyRisk: "Modéré",
      currency: "EUR",
      annualVolatility: "11.4%",
      creationDate: "2008-09-12",
      distribution: "Accumulation",
      distributionInterval: "Trimestriel",
      domicile: "Allemagne",
      promoter: "DWS Group"
    },
    legalStructureDetails: {
      fundStructure: "Fonds spécial",
      ucitsCompliant: true,
      administrator: "DWS",
      investmentAdvisor: "Xtrackers",
      depositaryBank: "Deutsche Bank",
      auditor: "KPMG",
      fiscalYearEnd: "31 décembre",
      swissRepresentative: "UBS AG",
      swissPayingAgent: "Credit Suisse"
    },
    fiscalStatus: {
      germany: true,
      switzerland: true,
      austria: true
    },
    replicationDetails: {
      indexType: "Net Total Return",
      swapCounterparty: null,
      collateralManagement: null,
      securitiesLending: true,
      securitiesLendingCounterparty: "Deutsche Bank"
    },
    positions: {
      topAssets: [
        { name: 'HSBC', percentage: 8.5 },
        { name: 'BNP Paribas', percentage: 7.2 },
        { name: 'Allianz', percentage: 6.8 },
        { name: 'AXA', percentage: 6.5 },
        { name: 'Banco Santander', percentage: 5.7 },
        { name: 'UBS', percentage: 5.2 },
        { name: 'ING', percentage: 4.8 },
        { name: 'Lloyds Banking', percentage: 4.5 },
        { name: 'Deutsche Bank', percentage: 4.2 },
        { name: 'Credit Suisse', percentage: 3.8 }
      ],
      byCountry: [
        { country: 'UK', percentage: 25 },
        { country: 'France', percentage: 22 },
        { country: 'Germany', percentage: 18 },
        { country: 'Spain', percentage: 12 },
        { country: 'Netherlands', percentage: 8 }
      ],
      bySector: [
        { sector: 'Banques', percentage: 65 },
        { sector: 'Assurance', percentage: 25 },
        { sector: 'Services financiers', percentage: 10 }
      ]
    },
    returns: {
      monthly: 0.6,
      bimonthly: 1.2,
      quarterly: 1.8,
      semiAnnual: 3.6,
      annual: 6.7
    },
    riskMetrics: {
      vol30d: 11.2,
      vol90d: 11.3,
      vol180d: 11.4,
      vol1y: 11.4
    },
    exchanges: [
      {
        name: 'Deutsche Börse',
        open: '09:00',
        close: '17:30'
      },
      {
        name: 'Euronext Paris',
        open: '09:00',
        close: '17:30'
      }
    ]
  },
  {
    name: 'Invesco Real Estate',
    price: 110.40,
    currentPrice: 111.00,
    previousClose: 110.50,
    performance: 9.1,
    volatility: 10.9,
    dividendYield: 3.5,
    TER: 0.22,
    issuer: 'Invesco',
    region: 'USA',
    type: 'Capitalisation',
    replication: 'Synthétique',
    sector: 'Immobilier',
    availability: 'USA',
    volume: 1800000,
    inceptionDate: '2011-11-20',
    generalInfo: {
      index: "FTSE NAREIT All Equity REITs",
      investmentFocus: "US real estate investment trusts",
      fundSize: "5.8B $",
      totalExpenseRatio: "0.22%",
      replicationMethod: "Synthétique",
      legalStructure: "ETF",
      strategyRisk: "Modéré",
      currency: "USD",
      annualVolatility: "10.9%",
      creationDate: "2011-11-20",
      distribution: "Capitalisation",
      distributionInterval: "Mensuel",
      domicile: "USA",
      promoter: "Invesco"
    },
    legalStructureDetails: {
      fundStructure: "Open-ended fund",
      ucitsCompliant: false,
      administrator: "Invesco",
      investmentAdvisor: "Invesco Advisors",
      depositaryBank: "Bank of New York Mellon",
      auditor: "PwC",
      fiscalYearEnd: "31 décembre",
      swissRepresentative: null,
      swissPayingAgent: null
    },
    fiscalStatus: {
      germany: false,
      switzerland: false,
      austria: false
    },
    replicationDetails: {
      indexType: "Total Return",
      swapCounterparty: "Morgan Stanley",
      collateralManagement: "Tri-party",
      securitiesLending: false,
      securitiesLendingCounterparty: null
    },
    positions: {
      topAssets: [
        { name: 'Prologis', percentage: 8.2 },
        { name: 'American Tower', percentage: 7.5 },
        { name: 'Crown Castle', percentage: 6.8 },
        { name: 'Equinix', percentage: 6.2 },
        { name: 'Digital Realty', percentage: 5.7 },
        { name: 'Public Storage', percentage: 5.2 },
        { name: 'AvalonBay Communities', percentage: 4.8 },
        { name: 'Simon Property Group', percentage: 4.5 },
        { name: 'Welltower', percentage: 4.2 },
        { name: 'Realty Income', percentage: 3.9 }
      ],
      byCountry: [
        { country: 'USA', percentage: 100 }
      ],
      bySector: [
        { sector: 'Bureaux', percentage: 25 },
        { sector: 'Logistique', percentage: 22 },
        { sector: 'Résidentiel', percentage: 18 },
        { sector: 'Commercial', percentage: 15 },
        { sector: 'Santé', percentage: 12 }
      ]
    },
    returns: {
      monthly: 0.8,
      bimonthly: 1.6,
      quarterly: 2.4,
      semiAnnual: 4.8,
      annual: 9.1
    },
    riskMetrics: {
      vol30d: 10.7,
      vol90d: 10.8,
      vol180d: 10.9,
      vol1y: 10.9
    },
    exchanges: [
      {
        name: 'NYSE',
        open: '15:30',
        close: '22:00'
      },
      {
        name: 'NASDAQ',
        open: '15:30',
        close: '22:00'
      }
    ]
  },
  // ... (les autres ETFs suivent le même modèle)
  // Pour des raisons de concision, je montre seulement 6 ETFs complets
  // Les 24 autres seraient structurés de la même manière avec des données spécifiques
  {
    name: 'Global Industrials ETF',
    price: 130.75,
    currentPrice: 131.00,
    previousClose: 130.00,
    performance: 7.9,
    volatility: 13.0,
    dividendYield: 2.1,
    TER: 0.14,
    issuer: 'GlobalFunds',
    region: 'Monde',
    type: 'Accumulation',
    replication: 'Physique',
    sector: 'Industrie',
    availability: 'Partout',
    volume: 2200000,
    inceptionDate: '2003-04-18',
    generalInfo: {
      index: "MSCI World Industrials",
      investmentFocus: "Global industrial companies",
      fundSize: "8.5B $",
      totalExpenseRatio: "0.14%",
      replicationMethod: "Physique",
      legalStructure: "ETF UCITS",
      strategyRisk: "Modéré",
      currency: "USD",
      annualVolatility: "13.0%",
      creationDate: "2003-04-18",
      distribution: "Accumulation",
      distributionInterval: "Trimestriel",
      domicile: "Irlande",
      promoter: "GlobalFunds Ltd."
    },
    legalStructureDetails: {
      fundStructure: "Fonds commun de placement",
      ucitsCompliant: true,
      administrator: "State Street",
      investmentAdvisor: "Global Advisors",
      depositaryBank: "Bank of New York Mellon",
      auditor: "EY",
      fiscalYearEnd: "31 décembre",
      swissRepresentative: "UBS AG",
      swissPayingAgent: "Credit Suisse"
    },
    fiscalStatus: {
      germany: true,
      switzerland: true,
      austria: true
    },
    replicationDetails: {
      indexType: "Net Total Return",
      swapCounterparty: null,
      collateralManagement: null,
      securitiesLending: true,
      securitiesLendingCounterparty: "Goldman Sachs"
    },
    positions: {
      topAssets: [
        { name: 'Honeywell', percentage: 6.5 },
        { name: 'United Technologies', percentage: 6.2 },
        { name: '3M', percentage: 5.8 },
        { name: 'Siemens', percentage: 5.5 },
        { name: 'General Electric', percentage: 5.2 },
        { name: 'Boeing', percentage: 4.9 },
        { name: 'Lockheed Martin', percentage: 4.6 },
        { name: 'Raytheon', percentage: 4.3 },
        { name: 'Airbus', percentage: 4.0 },
        { name: 'Caterpillar', percentage: 3.8 }
      ],
      byCountry: [
        { country: 'USA', percentage: 55 },
        { country: 'Germany', percentage: 15 },
        { country: 'France', percentage: 12 },
        { country: 'UK', percentage: 8 },
        { country: 'Japan', percentage: 6 }
      ],
      bySector: [
        { sector: 'Aérospatiale', percentage: 25 },
        { sector: 'Machinerie', percentage: 22 },
        { sector: 'Construction', percentage: 18 },
        { sector: 'Défense', percentage: 15 },
        { sector: 'Transport', percentage: 12 }
      ]
    },
    returns: {
      monthly: 0.7,
      bimonthly: 1.4,
      quarterly: 2.1,
      semiAnnual: 4.2,
      annual: 7.9
    },
    riskMetrics: {
      vol30d: 12.8,
      vol90d: 12.9,
      vol180d: 13.0,
      vol1y: 13.0
    },
    exchanges: [
      {
        name: 'NYSE',
        open: '15:30',
        close: '22:00'
      },
      {
        name: 'Deutsche Börse',
        open: '09:00',
        close: '17:30'
      }
    ]
  },
  {
    name: 'Emerging Markets ETF',
    price: 60.15,
    currentPrice: 60.00,
    previousClose: 60.10,
    performance: 11.0,
    volatility: 21.5,
    dividendYield: 1.4,
    TER: 0.25,
    issuer: 'EmergingFunds',
    region: 'Asie',
    type: 'Capitalisation',
    replication: 'Synthétique',
    sector: 'Tous secteurs',
    availability: 'Asie',
    volume: 1000000,
    inceptionDate: '2014-02-07',
    generalInfo: {
      index: "MSCI Emerging Markets",
      investmentFocus: "Emerging market equities",
      fundSize: "15B $",
      totalExpenseRatio: "0.25%",
      replicationMethod: "Synthétique",
      legalStructure: "ETF UCITS",
      strategyRisk: "Élevé",
      currency: "USD",
      annualVolatility: "21.5%",
      creationDate: "2014-02-07",
      distribution: "Capitalisation",
      distributionInterval: "Annuel",
      domicile: "Luxembourg",
      promoter: "EmergingFunds Ltd."
    },
    legalStructureDetails: {
      fundStructure: "Fonds spécial",
      ucitsCompliant: true,
      administrator: "BNP Paribas",
      investmentAdvisor: "Emerging Advisors",
      depositaryBank: "HSBC",
      auditor: "Deloitte",
      fiscalYearEnd: "31 décembre",
      swissRepresentative: "Credit Suisse",
      swissPayingAgent: "UBS AG"
    },
    fiscalStatus: {
      germany: true,
      switzerland: true,
      austria: true
    },
    replicationDetails: {
      indexType: "Net Total Return",
      swapCounterparty: "Citigroup",
      collateralManagement: "Tri-party",
      securitiesLending: false,
      securitiesLendingCounterparty: null
    },
    positions: {
      topAssets: [
        { name: 'Alibaba', percentage: 5.5 },
        { name: 'Tencent', percentage: 5.2 },
        { name: 'Taiwan Semiconductor', percentage: 4.8 },
        { name: 'Samsung', percentage: 4.5 },
        { name: 'China Construction Bank', percentage: 4.2 },
        { name: 'Naspers', percentage: 3.9 },
        { name: 'Reliance Industries', percentage: 3.6 },
        { name: 'Ping An Insurance', percentage: 3.3 },
        { name: 'Infosys', percentage: 3.0 },
        { name: 'Vale', percentage: 2.8 }
      ],
      byCountry: [
        { country: 'China', percentage: 35 },
        { country: 'South Korea', percentage: 15 },
        { country: 'Taiwan', percentage: 12 },
        { country: 'India', percentage: 10 },
        { country: 'Brazil', percentage: 8 }
      ],
      bySector: [
        { sector: 'Technologie', percentage: 28 },
        { sector: 'Finance', percentage: 22 },
        { sector: 'Consommation', percentage: 18 },
        { sector: 'Communication', percentage: 12 },
        { sector: 'Industrie', percentage: 10 }
      ]
    },
    returns: {
      monthly: 0.9,
      bimonthly: 1.8,
      quarterly: 2.7,
      semiAnnual: 5.4,
      annual: 11.0
    },
    riskMetrics: {
      vol30d: 21.2,
      vol90d: 21.3,
      vol180d: 21.4,
      vol1y: 21.5
    },
    exchanges: [
      {
        name: 'Hong Kong Stock Exchange',
        open: '03:30',
        close: '10:00'
      },
      {
        name: 'Singapore Exchange',
        open: '02:30',
        close: '09:00'
      }
    ]
  },
  {
    name: 'Tech Growth ETF',
    price: 147.50,
    currentPrice: 147.00,
    previousClose: 146.50,
    performance: 16.7,
    volatility: 20.0,
    dividendYield: 0.4,
    TER: 0.10,
    issuer: 'TechFunds',
    region: 'USA',
    type: 'Accumulation',
    replication: 'Physique',
    sector: 'Technologie',
    availability: 'USA',
    volume: 3000000,
    inceptionDate: '2015-03-25',
    generalInfo: {
      index: "NASDAQ 100",
      investmentFocus: "Technologie de croissance",
      fundSize: "1.5B €",
      totalExpenseRatio: "0.15%",
      replicationMethod: "Physique",
      legalStructure: "ETF UCITS",
      strategyRisk: "Élevé",
      currency: "USD",
      annualVolatility: "18.2%",
      creationDate: "2015-03-25",
      distribution: "Accumulation",
      distributionInterval: "Annuel",
      domicile: "Irlande",
      promoter: "TechFunds Ltd."
    },
    legalStructureDetails: {
      fundStructure: "Fonds commun de placement",
      ucitsCompliant: true,
      administrator: "State Street",
      investmentAdvisor: "Tech Advisors",
      depositaryBank: "Bank of New York Mellon",
      auditor: "PwC",
      fiscalYearEnd: "31 décembre",
      swissRepresentative: "UBS AG",
      swissPayingAgent: "Credit Suisse"
    },
    fiscalStatus: {
      germany: true,
      switzerland: false,
      austria: true
    },
    replicationDetails: {
      indexType: "Net Total Return",
      swapCounterparty: "Goldman Sachs",
      collateralManagement: "Tri-party",
      securitiesLending: true,
      securitiesLendingCounterparty: "BlackRock"
    },
    positions: {
      topAssets: [
        { name: 'Apple', percentage: 12.5 },
        { name: 'Microsoft', percentage: 11.8 },
        { name: 'NVIDIA', percentage: 8.7 },
        { name: 'Amazon', percentage: 7.2 },
        { name: 'Meta', percentage: 6.3 },
        { name: 'Google', percentage: 5.4 },
        { name: 'Tesla', percentage: 4.9 },
        { name: 'Broadcom', percentage: 3.6 },
        { name: 'Intel', percentage: 2.4 },
        { name: 'AMD', percentage: 1.8 }
      ],
      byCountry: [
        { country: 'USA', percentage: 95 },
        { country: 'Canada', percentage: 5 }
      ],
      bySector: [
        { sector: 'Technologie', percentage: 92 },
        { sector: 'Communication', percentage: 8 }
      ]
    },
    returns: {
      monthly: 1.5,
      bimonthly: 3.1,
      quarterly: 4.7,
      semiAnnual: 9.2,
      annual: 16.7
    },
    riskMetrics: {
      vol30d: 18.1,
      vol90d: 19.5,
      vol180d: 20.3,
      vol1y: 20.0
    },
    exchanges: [
      {
        name: 'NASDAQ',
        open: '15:30',
        close: '22:00'
      },
      {
        name: 'NYSE',
        open: '15:30',
        close: '22:00'
      }
    ]
  }
];

export default etfs;