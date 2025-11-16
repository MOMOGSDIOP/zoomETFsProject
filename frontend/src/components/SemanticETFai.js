import React, { useState, useCallback, useEffect } from 'react';
import {
  TextField, Button, Box, Typography,
  Paper, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Alert, CircularProgress, Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import etfs from '../data/etfs';
import { filterETFs } from '../utils/semanticFilter';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

export default function SemanticETFai({ onSelectETF }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ notFound: false, server: false });
  const [searchMetrics, setSearchMetrics] = useState({ time: 0, keywords: [], analysis: null });

  const { mode } = useTheme();
  const navigate = useNavigate();
  const { isLoggedIn } = React.useContext(AuthContext);

  /**
   * Analyse sémantique via Llama3 backend - Repris de ETFSearcher
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

      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Erreur de traitement sémantique'
      );
    }
  };

  /**
   * Recherche principale avec communication LLM - Repris de ETFSearcher
   */
  const performSearch = useCallback(async (term) => {
    if (!term.trim()) {
      setResults([]);
      setError({ notFound: false, server: false });
      return;
    }

    setIsLoading(true);
    const startTime = performance.now();

    try {
      // 1️⃣ Appel au backend Llama3 - Repris de ETFSearcher
      const { criteria } = await analyzeWithLlama(term);

      setSearchMetrics(prev => ({
        ...prev,
        keywords: criteria?.sectors || [],
        analysis: criteria
      }));

      // 2️⃣ Application des filtres via utils - Repris de ETFSearcher
      const matches = filterETFs(etfs, criteria || {});
      setResults(matches);

      setError({
        notFound: matches.length === 0,
        server: false
      });
    } catch (err) {
      console.error('Search error:', err);
      setError({ notFound: true, server: true });
      setResults([]);
    } finally {
      setSearchMetrics(prev => ({
        ...prev,
        time: performance.now() - startTime
      }));
      setIsLoading(false);
    }
  }, []);

  // Debounce pour recherches en temps réel
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) performSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, performSearch]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', pb: 8 }}>
      <Paper elevation={3} sx={{ p: 3, bgcolor: 'background.paper', flexGrow: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            🔍 Recherche Intelligente d'ETFs
          </Typography>
          <Tooltip title="Ex: 'ETF tech frais <0.5% rendement >3%'">
            <InfoIcon color="action" />
          </Tooltip>
        </Box>

        {/* Feedback utilisateur - Repris de ETFSearcher */}
        {error.server && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Le moteur sémantique ne répond pas. Veuillez réessayer plus tard. SemanticETFai
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
                      <TableCell>{etf.issuer}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {error.notFound && !error.server && !isLoading && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Aucun ETF trouvé pour votre recherche. Essayez avec d'autres critères.
          </Alert>
        )}
      </Paper>

      {/* Champ de recherche fixe en bas */}
      <Paper
        elevation={3}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          bgcolor: 'background.paper',
          zIndex: 1000,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, maxWidth: '1200px', margin: '0 auto', alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Décrivez votre recherche d'ETF (ex: ETF technologie avec frais <0.5% et rendement >3%)"
            multiline
            maxRows={4}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { fontSize: '1rem', padding: '10px' }
            }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '50px', paddingRight: '10px' },
              flexGrow: 1
            }}
          />
          <Button
            variant="contained"
            size="large"
            onClick={() => performSearch(searchTerm)}
            disabled={isLoading || !searchTerm.trim()}
            sx={{ borderRadius: '50px', px: 4, py: 1.5, minWidth: '120px' }}
          >
            {isLoading ? <CircularProgress size={24} /> : "Recherche"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
