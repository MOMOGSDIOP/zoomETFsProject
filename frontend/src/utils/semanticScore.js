
/**
 * Module de calcul du score de correspondance pour un ETF
 * @module etfScoring
 */

/**
 * Calcule un score de pertinence entre un ETF et les critères de recherche
 * @param {Object} etf - L'objet ETF à évaluer
 * @param {Array<string>} keywords - Liste des mots-clés analysés
 * @param {string} intent - Intention principale détectée
 * @param {Object} numericCriteria - Contraintes numériques (maxFees, minPerformance, etc.)
 * @returns {number} - Score de correspondance (plus élevé = plus pertinent)
 */
export const calculateMatchScore = (etf, keywords = [], intent = 'all', numericCriteria = {}) => {
  let score = 0;

  // Concaténation des infos principales en minuscule pour la recherche textuelle
  const content = `${etf.name} ${etf.description || ''} ${etf.tags?.join(' ') || ''}`.toLowerCase();

  // Bonus si le contenu contient les mots-clés
  keywords.forEach(keyword => {
    if (content.includes(keyword.toLowerCase())) {
      score += 2;
    }
  });

  // Bonus si l'intention correspond aux tags de l'ETF
  if (intent !== 'all' && etf.tags?.includes(intent)) {
    score += 5;
  }

  // Bonus si l'ETF respecte les critères numériques
  if (numericCriteria.maxFees !== undefined && etf.fees <= numericCriteria.maxFees) {
    score += 3;
  }
  if (numericCriteria.minPerformance !== undefined && etf.performance >= numericCriteria.minPerformance) {
    score += 3;
  }

  return score;
};
