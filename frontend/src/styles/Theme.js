import { createTheme } from '@mui/material/styles';

const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
            // Thème sombre professionnel (style finance)
            background: {
              default: '#1a1d21',       // Fond principal gris très sombre
              paper: '#25292e',          // Surface des cartes/panneaux
            },
            text: {
              primary: '#e0e0e0',        // Texte principal blanc cassé
              secondary: '#a0a0a0',      // Texte secondaire gris
            },
            primary: {
              main: '#3a7bd5',           // Bleu professionnel
              contrastText: '#ffffff',
            },
            secondary: {
              main: '#4caf50',           // Vert pour indicateurs positifs
            },
            error: {
              main: '#f44336',           // Rouge pour indicateurs négatifs
            },
            divider: '#2f343a',         // Couleur des séparateurs
            action: {
              hover: '#353b43',         // Couleur de survol
            }
          }
        : {
            // Thème clair équilibré
            background: {
              default: '#f5f5f5',
              paper: '#ffffff',
            },
            text: {
              primary: '#1a1a1a',
              secondary: '#5f6368',
            },
            primary: {
              main: '#1976d2',
              contrastText: '#ffffff',
            },
            secondary: {
              main: '#4caf50',           // Conservé vert pour cohérence
            },
            divider: '#e0e0e0',
          }),
    },
    typography: {
      fontFamily: "'Roboto', 'Segoe UI', 'Helvetica Neue', sans-serif",
      fontSize: 14,
      h1: { 
        fontSize: '2.2rem', 
        fontWeight: 600,
        letterSpacing: '-0.5px'
      },
      h2: { 
        fontSize: '1.8rem', 
        fontWeight: 600,
        letterSpacing: '-0.3px'
      },
      h3: { 
        fontSize: '1.5rem', 
        fontWeight: 600 
      },
      h4: { 
        fontSize: '1.3rem', 
        fontWeight: 500 
      },
      h5: { 
        fontSize: '1.1rem', 
        fontWeight: 500 
      },
      h6: { 
        fontSize: '1rem', 
        fontWeight: 500 
      },
      body1: { 
        fontSize: '0.95rem', 
        lineHeight: 1.6 
      },
      body2: { 
        fontSize: '0.85rem', 
        lineHeight: 1.5 
      },
      button: { 
        textTransform: 'none', 
        fontWeight: 500,
        letterSpacing: '0.3px'
      },
      caption: {
        fontSize: '0.75rem',
        color: mode === 'dark' ? '#a0a0a0' : '#5f6368'
      }
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            padding: '8px 16px',
            fontSize: '0.875rem',
            transition: 'all 0.2s ease',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: mode === 'dark' 
                ? '0 2px 8px rgba(58, 123, 213, 0.4)' 
                : '0 2px 8px rgba(25, 118, 210, 0.3)',
            }
          },
          outlined: {
            borderWidth: '1.5px',
            '&:hover': {
              borderWidth: '1.5px'
            }
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: mode === 'dark'
              ? '0 2px 10px rgba(0,0,0,0.3)'    // Ombre plus prononcée en mode sombre
              : '0 1px 6px rgba(0,0,0,0.1)',
            border: mode === 'dark' 
              ? '1px solid #2f343a'               // Bordure subtile en mode sombre
              : '1px solid #e0e0e0',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: mode === 'dark' 
              ? '1px solid #2f343a' 
              : '1px solid rgba(224, 224, 224, 1)',
          },
          head: {
            fontWeight: 600,
            backgroundColor: mode === 'dark' ? '#1f2328' : '#f5f5f5',
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#25292e' : '#1976d2',
            boxShadow: 'none',
            borderBottom: mode === 'dark' ? '1px solid #2f343a' : 'none'
          }
        }
      }
    },
    shape: {
      borderRadius: 8
    }
  });

export default getTheme;