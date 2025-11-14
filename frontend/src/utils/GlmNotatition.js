function noterETFavecGLM(etf) {
  const normalize = (val, min, max) => Math.max(0, Math.min(1, (val - min) / (max - min)));
  const inverseNormalize = (val, min, max) => 1 - normalize(val, min, max);

  const currentYear = new Date().getFullYear();
  const inceptionYear = new Date(etf.inceptionDate).getFullYear();
  const age = Math.max(0, currentYear - inceptionYear);

  // Variables normalisées (features)
  const x = {
    performance: normalize(etf.performance ?? 0, 0, 20),
    volatility: inverseNormalize(etf.volatility ?? 25, 5, 30),
    ter: inverseNormalize(etf.TER ?? 0.5, 0, 1),
    dividend: normalize(etf.dividendYield ?? 0, 0, 5),
    age: normalize(age, 0, 30),
    volume: normalize(etf.volume ?? 0, 0, 5_000_000),
  };

  // Coefficients appris via régression linéaire (ex. depuis Python sklearn)
  const beta = {
    intercept: 0.15,             // β₀
    performance: 0.40,           // β₁
    volatility: 0.25,            // β₂
    ter: 0.10,                   // β₃
    dividend: 0.05,              // β₄
    age: 0.10,                   // β₅
    volume: 0.10,                // β₆
  };

  // Calcul du score GLM
  let score =
    beta.intercept +
    beta.performance * x.performance +
    beta.volatility * x.volatility +
    beta.ter * x.ter +
    beta.dividend * x.dividend +
    beta.age * x.age +
    beta.volume * x.volume;

  // Mise à l’échelle sur 100
  const globalScore = Math.round(score * 100);

  // Conversion en note
  function scoreToNote(score) {
    if (score >= 85) return 'AAA';
    if (score >= 75) return 'AA';
    if (score >= 65) return 'A';
    if (score >= 55) return 'BBB';
    if (score >= 45) return 'BB';
    return 'B';
  }

  return {
    globalScore,
    globalNote: scoreToNote(globalScore),
    features: x,
  };
}

export default noterETFavecGLM;
