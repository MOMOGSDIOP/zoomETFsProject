function noterETF(etf) {
  const normalize = (val, min, max) => Math.max(0, Math.min(1, (val - min) / (max - min)));
  const inverseNormalize = (val, min, max) => 1 - normalize(val, min, max);

  const year = new Date().getFullYear();
  const inceptionYear = new Date(etf.inceptionDate).getFullYear();
  const age = Math.max(0, year - inceptionYear);

  const metrics = {
    perf: normalize(etf.performance ?? 0, 0, 20),
    vol: inverseNormalize(etf.volatility ?? 25, 5, 30),
    ter: inverseNormalize(etf.TER ?? 0.5, 0, 1),
    div: normalize(etf.dividendYield ?? 0, 0, 5),
    age: normalize(age, 0, 30),
    volu: normalize(etf.volume ?? 0, 0, 5_000_000),
  };

  const weights = {
    perf: 0.35,
    vol: 0.20,
    ter: 0.15,
    div: 0.10,
    age: 0.10,
    volu: 0.10,
  };

  const scores = {};
  let globalScore = 0;

  for (const key in metrics) {
    const s = metrics[key] * 100;
    scores[key] = s;
    globalScore += s * weights[key];
  }

  function scoreToNote(score) {
    if (score >= 85) return 'AAA';
    if (score >= 75) return 'AA';
    if (score >= 65) return 'A';
    if (score >= 55) return 'BBB';
    if (score >= 45) return 'BB';
    return 'B';
  }

  return {
    globalScore: Math.round(globalScore),
    globalNote: scoreToNote(globalScore),
    scores: {
      performance: scoreToNote(scores.perf),
      volatilite: scoreToNote(scores.vol),
      frais: scoreToNote(scores.ter),
      dividendes: scoreToNote(scores.div),
      anciennete: scoreToNote(scores.age),
      liquidite: scoreToNote(scores.volu),
    },
  };
}

export default noterETF;
