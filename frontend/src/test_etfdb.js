const etfdb = require('etfdb-api');

console.log('Début du test ETFDB');

// Liste des ETFs triés
etfdb
  .listEtfs(50, 1, 'ytd', 'desc')
  .then(result => {
    console.log('✅ Requête réussie - Total ETFs:', result.meta.total_records);
    result.data.forEach(etf => console.log(etf.symbol.text, etf.ytd));
  })
  .catch(err => console.error('❌ Erreur listEtfs:', err));

// Holdings TQQQ
etfdb
  .listHoldings('TQQQ')
  .then(holdings => {
    console.log('✅ Holdings TQQQ (page 1):');
    console.log(holdings);
  })
  .catch(err => console.error('❌ Erreur listHoldings page 1:', err));

// Holdings TQQQ page 3
etfdb
  .listHoldings('TQQQ', 3)
  .then(holdings => {
    console.log('✅ Holdings TQQQ (page 3):');
    console.log(holdings);
  })
  .catch(err => console.error('❌ Erreur listHoldings page 3:', err));
