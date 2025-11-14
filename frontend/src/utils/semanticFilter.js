import { validateETF } from './etfValidation';

/**
 * Vérifie si un ETF correspond aux critères donnés
 */
export function matchETF(etf, criteria) {
  if (!validateETF(etf)) return false;

  // 1️⃣ Secteurs
  if (criteria.sectors?.length) {
    const sectorMatch = criteria.sectors.some(sector =>
      etf.tags?.includes(sector.toLowerCase()) ||
      etf.category?.toLowerCase().includes(sector.toLowerCase())
    );
    if (!sectorMatch) return false;
  }

  // 2️⃣ Frais max
  if (criteria.fees_max !== null && criteria.fees_max !== undefined) {
    if (!etf.fees || etf.fees > criteria.fees_max) return false;
  }

  // 3️⃣ Performance min
  if (criteria.min_performance !== null && criteria.min_performance !== undefined) {
    if (!etf.performance || etf.performance < criteria.min_performance) return false;
  }

  // 4️⃣ Région
  if (criteria.region?.length) {
    if (!criteria.region.includes(etf.region)) return false;
  }

  // 5️⃣ Type
  if (criteria.type?.length) {
    if (!criteria.type.includes(etf.type)) return false;
  }

  // 6️⃣ Réplication
  if (criteria.replication) {
    if (etf.replication?.toLowerCase() !== criteria.replication.toLowerCase()) return false;
  }

  // 7️⃣ Disponibilité
  if (criteria.availability?.length) {
    if (!criteria.availability.includes(etf.availability) && etf.availability !== 'Partout') {
      return false;
    }
  }

  // 8️⃣ Risque
  if (criteria.risk !== null && criteria.risk !== undefined) {
    if (etf.risk !== criteria.risk) return false;
  }

  // 9️⃣ Stratégie
  if (criteria.strategy) {
    if (!etf.strategies?.includes(criteria.strategy)) return false;
  }

  // 🔟 ESG
  if (criteria.esg !== null && criteria.esg !== undefined) {
    if (etf.esgScore < criteria.esg) return false;
  }

  // 1️⃣1️⃣ Émetteur
  if (criteria.emetteur?.length) {
    if (!criteria.emetteur.includes(etf.emetteur)) return false;
  }

  return true;
}

/**
 * Filtre une liste d'ETFs selon les critères donnés
 */
export function filterETFs(etfs, criteria) {
  return etfs.filter(etf => matchETF(etf, criteria));
}
