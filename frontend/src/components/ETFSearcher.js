// src/components/SemanticETFSearcher.jsx
import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Box, Typography,
  Paper, InputAdornment, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Alert, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import etfs from '../data/etfs';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { filterETFs } from '../utils/semanticFilter';

const POPULAR_SUGGESTIONS = [
  { label: "ETF Tech", filter: "technologie" },
  { label: "ETF ESG", filter: "esg" },
  { label: "ETF Europe", filter: "europe" },
  { label: "ETF Dividende", filter: "dividende" }
];

export default function SemanticETFSearcher({ onSelectETF }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    notFound: false,
    input: false,
    server: false
  });
  const [searchMetrics, setSearchMetrics] = useState({
    time: 0,
    keywords: []
  });

  /**
   * Analyse sémantique via Llama3 backend
   */

  const analyzeWithLlama = async (query) => {
  try {
    console.log("[DEBUG] Envoi de la requête à Ollama :", {
      url: `${process.env.REACT_APP_API_URL}semantic/search`,
      payload: { query }
    });

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}semantic/search`,
      { query },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000 // 10 secondes timeout
      }
    );

    console.log("[DEBUG] Réponse Ollama :", {
      status: response.status,
      data: response.data
    });

    return response.data;

  } catch (error) {
    console.error("[ERREUR OLLAMA] Détails complets :", {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
      responseStatus: error.response?.status,
      responseData: error.response?.data,
      isAxiosError: error.isAxiosError,
      request: error.request ? {
        method: error.config?.method,
        url: error.config?.url,
        headers: error.config?.headers
      } : null
    });

    // On renvoie un message clair
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Erreur de traitement sémantique'
    );
  }
};


  /**
   * Filtrage des ETFs basé sur les critères Llama3
   */
  const performSearch = async (term) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const startTime = performance.now();

    try {
      // 1️⃣ Appel au backend
      const { criteria } = await analyzeWithLlama(term);

      setSearchMetrics(prev => ({
        ...prev,
        keywords: criteria?.sectors || []
      }));

      // 2️⃣ Application des filtres via utils
      const matches = filterETFs(etfs, criteria || {});
      setResults(matches);

      setError({
        notFound: matches.length === 0,
        input: false,
        server: false
      });
    } catch {
      setError(prev => ({ ...prev, notFound: true, server: true }));
    } finally {
      setSearchMetrics(prev => ({
        ...prev,
        time: performance.now() - startTime
      }));
      setIsLoading(false);
    }
  };

  // Debounce pour recherches en temps réel
  // useEffect(() => {
    //if (!searchTerm.trim()) {
      //setResults([]);
      //return;
   // }
   // const timer = setTimeout(() => {
     // if (!isLoading) performSearch(searchTerm);
   // }, 500);
   // return () => clearTimeout(timer);
 // }, [searchTerm]);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button onClick={() => navigate('/semanticResearch')}>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            🔍 Recherche Sémantique ETF
          </Typography>
        </Button>
      </Box>

      {/* Champ de recherche */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Ex: ETF technologie avec frais <0.5% et rendement >3%"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          onClick={() => performSearch(searchTerm)}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Analyser"}
        </Button>
      </Box>

      {/* Feedback utilisateur */}
      {error.server && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Le moteur sémantique ne répond pas. Veuillez réessayer plus tard. ETFSearcher
        </Alert>
      )}

      {isLoading && (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Analyse sémantique en cours...
          </Typography>
        </Box>
      )}

      {/* Résultats */}
      {results.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography>
              {results.length} résultat(s) trouvé(s)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Temps: {searchMetrics.time.toFixed(0)}ms
            </Typography>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Nom</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Frais</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Performance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((etf) => (
                  <TableRow
                    key={etf.isin}
                    hover
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectETF?.(etf)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onSelectETF?.(etf);
                      }
                    }}
                  >
                    <TableCell>{etf.name}</TableCell>
                    <TableCell>{etf.price}</TableCell>
                    <TableCell>{etf.performance}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Suggestions */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Exemples de requêtes :
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {POPULAR_SUGGESTIONS.map((item) => (
            <Chip
              key={item.filter}
              label={item.label}
              onClick={() => setSearchTerm(item.filter)}
              variant="outlined"
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
}
