export const parseLlamaResponse = (response) => {
  try {
    // Si la réponse est déjà un objet, pas besoin de parser
    const data = typeof response === "string" ? JSON.parse(response) : response;

    return {
      sectors: Array.isArray(data.sectors) ? data.sectors : [],
      feesMax: data.fees_max !== undefined ? Number(data.fees_max) : null,
      minPerformance: data.min_performance !== undefined ? Number(data.min_performance) : null,
      region: Array.isArray(data.region) ? data.region : [],
      type: Array.isArray(data.type) ? data.type : [],
      replication: data.replication || null,
      availability: Array.isArray(data.availability) ? data.availability : [],
      risk: data.risk !== undefined ? Number(data.risk) : null,
      strategy: data.strategy || null,
      esg: data.esg || null,
      emetteur: Array.isArray(data.emetteur) ? data.emetteur : []
    };
  } catch (error) {
    console.error("Erreur d'analyse Llama3 :", error, " - Contenu reçu :", response);
    result = 
    {
      sectors: [],
      feesMax: null,
      minPerformance: null,
      region: [],
      type: [],
      replication: null,
      availability: [],
      risk: null,
      strategy: null,
      esg: null,
      emetteur: []
    };
    print("Resultats  d'analyse Llama3 :", result);
    return result;
  }
};
