import React from 'react';
import {
  TextField, Button, Box, Typography,
  Paper, InputAdornment, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Alert, CircularProgress, Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InfoIcon from '@mui/icons-material/Info';
import etfs from '../data/etfs';
import { analyzeUserQuery } from '../utils/semanticAnalysis';
import { validateETF } from '../utils/etfValidation';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const POPULAR_SUGGESTIONS = [
  { label: "ETF Tech", filter: "technologie frais <0.5%" },
  { label: "ETF ESG", filter: "ESG score >8" },
  { label: "ETF Europe", filter: "Europe rendement >3%" },
  { label: "ETF Dividende", filter: "dividende rendement >4%" },
  { label: "ETF Obligataire", filter: "obligataire risque <3" }
];

export default function ETFSearcher({ onSelectETF }) {

    const { toggleTheme, mode } = useTheme();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { isLoggedIn } = React.useContext(AuthContext);

    const handleMenuClick = (event) => {
          setAnchorEl(event.currentTarget);
    };
    
    
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    
    const handleNavigation = (path) => {
        handleMenuClose();
        navigate(path);
    };
    

  const [searchMetrics, setSearchMetrics] = useState({ 
    time: 0, 
    keywords: [],
    analysis: null 
  });

  const performSearch = useCallback(async (term) => {
    if (!term.trim()) {
      setResults([]);
      setError(prev => ({ ...prev, notFound: false }));
      return;
    }

    setIsLoading(true);
    const startTime = performance.now();

    try {
      // Analyse sémantique avancée
      const { keywords, intent, numericCriteria, queryAnalysis } = analyzeUserQuery(term);
      
      // Filtrage et scoring
      const processedETFs = etfs
        .filter(etf => validateETF(etf))
        .map(etf => ({
          ...etf,
          matchScore: calculateMatchScore(etf, keywords, intent, numericCriteria)
        }))
        .filter(etf => etf.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore);

      setResults(processedETFs);
      setSearchMetrics({
        time: performance.now() - startTime,
        keywords,
        analysis: queryAnalysis
      });
      setError({
        notFound: processedETFs.length === 0,
        input: false,
        server: false
      });
    } catch (err) {
      console.error('Search error:', err);
      setError({ notFound: true, input: false, server: true });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const calculateMatchScore = (etf, keywords, intent, numericCriteria) => {
    let score = 0;
    
    // Matching des mots-clés
    const content = `${etf.name} ${etf.description} ${etf.tags?.join(' ')}`.toLowerCase();
    keywords.forEach(keyword => {
      if (content.includes(keyword)) score += 2;
    });

    // Matching de l'intention
    if (intent !== 'all' && etf.tags?.includes(intent)) {
      score += 5;
    }

    // Critères numériques
    if (numericCriteria.maxFees && etf.fees <= numericCriteria.maxFees) {
      score += 3;
    }
    if (numericCriteria.minPerformance && etf.performance >= numericCriteria.minPerformance) {
      score += 3;
    }

    return score;
  };

  // Debounce et gestion des erreurs
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        performSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, performSearch]);

  return (
    <Paper elevation={3} sx={{ p: 3, bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          🔍 Recherche Intelligente d'ETFs
        </Typography>
        <Tooltip title="Ex: 'ETF tech frais <0.5% rendement >3%'">
          <InfoIcon color="action" />
        </Tooltip>
      </Box>

      {/* Interface utilisateur et résultats... */}
    </Paper>
  );
}