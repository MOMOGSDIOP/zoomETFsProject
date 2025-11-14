import React, { useState, useContext, useEffect } from 'react';
import { Button, TextField, Typography, Box, Tabs, Tab } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState(0); // 0=sign in, 1=sign up
  const [step, setStep] = useState(1); // 1=email/password, 2=code verification (sign up only)
  const navigate = useNavigate();
  const { isLoggedIn, login } = useContext(AuthContext);

  // Reset form when switching tabs
  useEffect(() => {
    setStep(1);
    setEmail('');
    setPassword('');
    setCode('');
    setMessage('');
  }, [activeTab]);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Existing user login
  const handleSignIn = async () => {
    if (!email || !password) {
      setMessage('Veuillez saisir votre email et mot de passe.');
      return;
    }
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}auth/request-code`, { 
        email, 
        password 
      });
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setMessage('Identifiants incorrects.');
    }
  };

  // New user registration - step 1: email/password submission
  const handleSignUpSubmit = async () => {
    if (!email || !password) {
      setMessage('Veuillez saisir votre email et choisir un mot de passe.');
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}auth/request-code`, { 
        email,
        password 
      });
      setStep(2);
      setMessage('Code de vérification envoyé à votre email.');
    } catch (err) {
      setMessage("Erreur: " + (err.response?.data?.detail || err.message));
    }
  };

  // New user registration - step 2: code verification
  const handleVerifyCode = async () => {
    if (!code) {
      setMessage('Veuillez saisir le code reçu.');
      return;
    }
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}auth/verify-code`, { 
        email, 
        code,
        password // Include password again for final registration
      });
      login(res.data.token);
      setMessage('Inscription réussie !');
      navigate('/dashboard');
    } catch (err) {
      setMessage('Code invalide ou expiré.');
    }
  };

  return (
    <Box sx={{ mt: 8, mx: 'auto', width: 320 }}>
      <Typography variant="h5" gutterBottom>
        {activeTab === 0 ? 'Connexion' : 'Inscription'}
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Se connecter" />
        <Tab label="S'inscrire" />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {/* Common email field */}
        <TextField
          fullWidth
          label="Adresse email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          disabled={activeTab === 1 && step === 2}
        />

        {/* Password field (shown in step 1 for both tabs) */}
        {(activeTab === 0 || (activeTab === 1 && step === 1)) && (
          <TextField
            fullWidth
            label={activeTab === 0 ? "Mot de passe" : "Choisir un mot de passe"}
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        )}

        {/* Code verification (sign up step 2 only) */}
        {activeTab === 1 && step === 2 && (
          <TextField
            fullWidth
            label="Code de vérification"
            variant="outlined"
            margin="normal"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        )}

        {/* Action buttons */}
        {activeTab === 0 ? (
          <Button 
            fullWidth 
            variant="contained" 
            onClick={handleSignIn} 
            sx={{ mt: 2 }}
          >
            Se connecter
          </Button>
        ) : (
          step === 1 ? (
            <Button 
              fullWidth 
              variant="contained" 
              onClick={handleSignUpSubmit} 
              sx={{ mt: 2 }}
            >
              Valider l'inscription
            </Button>
          ) : (
            <Button 
              fullWidth 
              variant="contained" 
              onClick={handleVerifyCode} 
              sx={{ mt: 2 }}
            >
              Vérifier le code
            </Button>
          )
        )}

        {message && (
          <Typography variant="body2" color={message.includes('succès') ? 'success' : 'error'} sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
}