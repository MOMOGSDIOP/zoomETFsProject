// frontend/src/services/etfService.js

export async function fetchETF() {
  const response = await fetch(`http://localhost:8000/etfs/full`);
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des données des etfs ");
  }
  return response.json();
}