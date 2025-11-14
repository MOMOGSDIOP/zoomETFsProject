/**
 * Validateur avancé d'objets ETF
 * @module etfValidator
 */

/**
 * Validation principale d'un ETF
 * @param {Object} etf - L'objet ETF à valider
 * @param {Object} [options] - Options de configuration
 * @param {Array} [options.requiredFields] - Champs obligatoires
 * @param {Array} [options.numericFields] - Champs numériques
 * @param {Object} [options.fieldValidators] - Validateurs personnalisés par champ
 * @returns {Object} - { isValid: boolean, errors: Array<string> | null }
 */
export const validateETF = (etf, options = {}) => {
  const config = {
    requiredFields: [
      'name', 'isin', 'category', // champs de base
      'sectors', 'region', 'type', // champs Llama
    ],
    numericFields: [
      'fees', 'performance', 'risk', 'esg'
    ],
    fieldValidators: {
      isin: validateISIN,
      fees: (val) => validateNumericField(val, { min: 0, max: 5 }),
      performance: (val) => validateNumericField(val, { min: -100, max: 500 }),
      risk: (val) => validateNumericField(val, { min: 1, max: 7 }),
      esg: (val) => validateNumericField(val, { min: 0, max: 100 })
    },
    ...options
  };

  const errors = [];

  // Structure de base
  if (!etf || typeof etf !== 'object' || Array.isArray(etf)) {
    return { isValid: false, errors: ['Invalid ETF object structure'] };
  }

  // Champs obligatoires
  config.requiredFields.forEach(field => {
    if (!(field in etf) || etf[field] === '' || etf[field] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Champs numériques
  config.numericFields.forEach(field => {
    if (field in etf && etf[field] !== undefined && etf[field] !== null) {
      if (!validateNumericField(etf[field])) {
        errors.push(`Invalid numeric value for field: ${field}`);
      }
    }
  });

  // Validateurs personnalisés
  Object.entries(config.fieldValidators).forEach(([field, validator]) => {
    if (field in etf && etf[field] !== undefined && etf[field] !== null) {
      if (!validator(etf[field])) {
        errors.push(`Validation failed for field: ${field}`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors: errors.length ? errors : null
  };
};

/**
 * Validation ISIN
 * Format standard: 2 lettres, 9 caractères alphanumériques, 1 chiffre
 */
export const validateISIN = (isin) => {
  return typeof isin === 'string' && /^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(isin);
};

/**
 * Validateur réutilisable pour les champs numériques
 * @param {number} value - Valeur à valider
 * @param {Object} [constraints] - { min?: number, max?: number }
 * @returns {boolean}
 */
export const validateNumericField = (value, constraints = {}) => {
  if (typeof value !== 'number' || isNaN(value)) return false;
  if (constraints.min !== undefined && value < constraints.min) return false;
  if (constraints.max !== undefined && value > constraints.max) return false;
  return true;
};
