/**
 * Analyse sémantique des requêtes utilisateur pour la recherche d'ETFs
 * @param {string} query - Requête utilisateur
 * @returns {object} - {keywords, intent, numericCriteria}
 */
export const analyzeUserQuery = (query) => {
  if (!query || typeof query !== 'string') {
    throw new Error('Invalid query input');
  }

  const keywords = extractKeywords(query);
  const queryLower = query.toLowerCase();
  
  // Détection d'intention avec pondération
  const intents = {
    'technologie': { terms: ['tech', 'technologie', 'innovation', 'ai', 'robot'], score: 0 },
    'esg': { terms: ['esg', 'durable', 'durabilité', 'éthique'], score: 0 },
    'dividende': { terms: ['dividende', 'rendement', 'payout', 'dividend'], score: 0 },
    'obligataire': { terms: ['obligataire', 'bond', 'taux', 'fixed income'], score: 0 }
  };

  // Calcul du score d'intention
  Object.keys(intents).forEach(key => {
    intents[key].terms.forEach(term => {
      if (queryLower.includes(term)) {
        intents[key].score += 1;
      }
    });
  });

  // Détermination de l'intention principale
  const primaryIntent = Object.entries(intents).reduce(
    (max, [key, { score }]) => score > max.score ? { key, score } : max,
    { key: 'all', score: 0 }
  ).key;

  // Extraction des critères numériques avancés
  const numericCriteria = extractNumericCriteria(query);

  return { 
    keywords, 
    intent: primaryIntent, 
    numericCriteria,
    queryAnalysis: { intents } // Pour le debug
  };
};

/**
 * Extraction des mots-clés significatifs
 */
const extractKeywords = (query) => {
  const stopWords = new Set(['etf', 'avec', 'pour', 'les', 'des', 'de', 'le', 'la', 'un', 'une']);
  return Array.from(
    new Set(
      query
        .toLowerCase()
        .split(/[\s,;]+/)
        .filter(word => word.length > 2 && !stopWords.has(word))
    )
  );
};

/**
 * Extraction des critères numériques (<0.5%, >3%, etc.)
 */
const extractNumericCriteria = (query) => {
  const criteria = {};
  const numericPatterns = [
    { regex: /([<>]=?|)\s*(\d+\.?\d*)%\s+de\s+frais/i, key: 'maxFees' },
    { regex: /frais\s*([<>]=?|)\s*(\d+\.?\d*)%/i, key: 'maxFees' },
    { regex: /rendement\s*([<>]=?|)\s*(\d+\.?\d*)%/i, key: 'minPerformance' },
    { regex: /([<>]=?|)\s*(\d+\.?\d*)%\s+de\s+rendement/i, key: 'minPerformance' }
  ];

  numericPatterns.forEach(({ regex, key }) => {
    const match = query.match(regex);
    if (match) {
      const [_, operator, value] = match;
      const numValue = parseFloat(value);
      
      if (operator.includes('<')) {
        criteria[key] = numValue;
      } else if (operator.includes('>')) {
        criteria[key] = numValue;
      }
    }
  });

  return criteria;
};