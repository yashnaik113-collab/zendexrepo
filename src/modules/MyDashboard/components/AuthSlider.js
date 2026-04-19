import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ArrowForward, RestaurantMenu, Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

const accent = '#f97316';
const accentDark = '#c2410c';
const shellBg = '#fff7ed';
const ink = '#431407';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: ink,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.92)',
    '& fieldset': { borderColor: 'rgba(194, 65, 12, 0.22)' },
    '&:hover fieldset': { borderColor: accent },
    '&.Mui-focused fieldset': { borderColor: accent },
  },
  '& .MuiInputLabel-root': { color: 'rgba(67,20,7,0.68)' },
  '& .MuiInputLabel-root.Mui-focused': { color: accentDark },
};

const AuthSlider = ({ defaultMode = 'login' }) => {
  const [isSignup, setIsSignup] = useState(defaultMode === 'register');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { login, register } = useAuth();
  const { showToast, ToastComponent } = useToast();
  const navigate = useNavigate();

  const updateLoginForm = (field, value) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }));
    setLoginError('');
  };

  const updateRegisterForm = (field, value) => {
    setRegisterForm((prev) => ({ ...prev, [field]: value }));
    setRegisterError('');
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      await login(loginForm.email, loginForm.password);
      showToast('Welcome back to Mealsontheway command', 'success');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Invalid email or password';
      setLoginError(message);
      showToast(message, 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setRegisterError('');

    if (!registerForm.name.trim()) {
      const message = 'Please enter your full name';
      setRegisterError(message);
      showToast(message, 'error');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      const message = 'Passwords do not match';
      setRegisterError(message);
      showToast(message, 'error');
      return;
    }

    if (registerForm.password.length < 6) {
      const message = 'Password must be at least 6 characters';
      setRegisterError(message);
      showToast(message, 'error');
      return;
    }

    setRegisterLoading(true);

    try {
      await register(registerForm.name.trim(), registerForm.email, registerForm.password);
      showToast('Admin account created successfully', 'success');
      navigate('/dashboard');
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      setRegisterError(message);
      showToast(message, 'error');
    } finally {
      setRegisterLoading(false);
    }
  };

  const renderPasswordAdornment = (visible, toggle) => ({
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={toggle} edge="end" sx={{ color: 'rgba(67,20,7,0.65)' }}>
          {visible ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, md: 4 },
        py: 4,
        background:
          'radial-gradient(circle at top left, rgba(251,146,60,0.32), transparent 32%), radial-gradient(circle at bottom right, rgba(249,115,22,0.22), transparent 28%), linear-gradient(135deg, #431407 0%, #7c2d12 45%, #ffedd5 100%)',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1120,
          borderRadius: { xs: 5, md: 8 },
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.28)',
          boxShadow: '0 28px 80px rgba(67, 20, 7, 0.35)',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(18px)',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
            minHeight: { xs: 'auto', md: 720 },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              order: { xs: 2, md: 1 },
              minHeight: { xs: 640, md: '100%' },
              background: shellBg,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                width: '200%',
                height: '100%',
                transform: isSignup ? 'translateX(-50%)' : 'translateX(0%)',
                transition: 'transform 500ms ease',
              }}
            >
              <Box
                sx={{
                  width: '50%',
                  p: { xs: 3, sm: 5, md: 6 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box component="form" onSubmit={handleLogin} sx={{ width: '100%', maxWidth: 420 }}>
                  <Stack spacing={2.5}>
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{ color: accentDark, letterSpacing: '0.2em', fontWeight: 700 }}
                      >
                        Admin Access
                      </Typography>
                      <Typography variant="h3" sx={{ color: ink, fontWeight: 800, lineHeight: 1.1, mt: 1 }}>
                        Sign in to the chef dashboard
                      </Typography>
                      <Typography sx={{ color: 'rgba(67,20,7,0.72)', mt: 1.2 }}>
                        Use your admin email and password to manage orders, dishes, and live customer updates.
                      </Typography>
                    </Box>

                    {loginError && <Alert severity="error">{loginError}</Alert>}

                    <TextField
                      label="Email"
                      type="email"
                      value={loginForm.email}
                      onChange={(event) => updateLoginForm('email', event.target.value)}
                      required
                      fullWidth
                      sx={inputSx}
                    />

                    <TextField
                      label="Password"
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={(event) => updateLoginForm('password', event.target.value)}
                      required
                      fullWidth
                      sx={inputSx}
                      InputProps={renderPasswordAdornment(showLoginPassword, () =>
                        setShowLoginPassword((prev) => !prev)
                      )}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loginLoading}
                      endIcon={!loginLoading && <ArrowForward />}
                      sx={{
                        py: 1.5,
                        borderRadius: 999,
                        bgcolor: accent,
                        fontWeight: 700,
                        '&:hover': { bgcolor: accentDark },
                      }}
                    >
                      {loginLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Submit'}
                    </Button>

                    <Typography sx={{ color: 'rgba(67,20,7,0.68)' }}>
                      Need an account?{' '}
                      <Link
                        component={RouterLink}
                        to="/register"
                        onClick={() => setIsSignup(true)}
                        sx={{ color: accentDark, fontWeight: 700 }}
                      >
                        Create one
                      </Link>
                    </Typography>
                  </Stack>
                </Box>
              </Box>

              <Box
                sx={{
                  width: '50%',
                  p: { xs: 3, sm: 5, md: 6 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box component="form" onSubmit={handleRegister} sx={{ width: '100%', maxWidth: 420 }}>
                  <Stack spacing={2.5}>
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{ color: accentDark, letterSpacing: '0.2em', fontWeight: 700 }}
                      >
                        Join the control room
                      </Typography>
                      <Typography variant="h3" sx={{ color: ink, fontWeight: 800, lineHeight: 1.1, mt: 1 }}>
                        Create an admin account
                      </Typography>
                      <Typography sx={{ color: 'rgba(67,20,7,0.72)', mt: 1.2 }}>
                        Register an admin using the backend API and jump straight into the chef control panel.
                      </Typography>
                    </Box>

                    {registerError && <Alert severity="error">{registerError}</Alert>}

                    <TextField
                      label="Full name"
                      value={registerForm.name}
                      onChange={(event) => updateRegisterForm('name', event.target.value)}
                      required
                      fullWidth
                      sx={inputSx}
                    />

                    <TextField
                      label="Email"
                      type="email"
                      value={registerForm.email}
                      onChange={(event) => updateRegisterForm('email', event.target.value)}
                      required
                      fullWidth
                      sx={inputSx}
                    />

                    <TextField
                      label="Password"
                      type={showSignupPassword ? 'text' : 'password'}
                      value={registerForm.password}
                      onChange={(event) => updateRegisterForm('password', event.target.value)}
                      required
                      fullWidth
                      sx={inputSx}
                      InputProps={renderPasswordAdornment(showSignupPassword, () =>
                        setShowSignupPassword((prev) => !prev)
                      )}
                    />

                    <TextField
                      label="Confirm password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={registerForm.confirmPassword}
                      onChange={(event) => updateRegisterForm('confirmPassword', event.target.value)}
                      required
                      fullWidth
                      sx={inputSx}
                      InputProps={renderPasswordAdornment(showConfirmPassword, () =>
                        setShowConfirmPassword((prev) => !prev)
                      )}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={registerLoading}
                      endIcon={!registerLoading && <ArrowForward />}
                      sx={{
                        py: 1.5,
                        borderRadius: 999,
                        bgcolor: accent,
                        fontWeight: 700,
                        '&:hover': { bgcolor: accentDark },
                      }}
                    >
                      {registerLoading ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                      ) : (
                        'Submit'
                      )}
                    </Button>

                    <Typography sx={{ color: 'rgba(67,20,7,0.68)' }}>
                      Already registered?{' '}
                      <Link
                        component={RouterLink}
                        to="/login"
                        onClick={() => setIsSignup(false)}
                        sx={{ color: accentDark, fontWeight: 700 }}
                      >
                        Sign in
                      </Link>
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              position: 'relative',
              order: { xs: 1, md: 2 },
              p: { xs: 3, sm: 4, md: 5 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              background:
                'linear-gradient(160deg, rgba(67,20,7,0.96) 0%, rgba(124,45,18,0.93) 55%, rgba(249,115,22,0.88) 100%)',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 26%), radial-gradient(circle at 80% 70%, rgba(255,237,213,0.22), transparent 30%)',
              }}
            />

            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: 440,
                minHeight: { xs: 300, md: 560 },
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  transform: isSignup ? 'translateY(-10px)' : 'translateY(10px)',
                  transition: 'transform 500ms ease',
                }}
              >
                <Box
                  sx={{
                    width: 74,
                    height: 74,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    boxShadow: '0 18px 36px rgba(0,0,0,0.16)',
                  }}
                >
                  <RestaurantMenu sx={{ fontSize: 38, color: '#fff7ed' }} />
                </Box>

                <Typography
                  variant="h2"
                  sx={{
                    color: 'white',
                    fontWeight: 800,
                    lineHeight: 1,
                    fontSize: { xs: '2.4rem', md: '3.5rem' },
                  }}
                >
                  {isSignup ? 'Launch your kitchen command center' : 'Take control of the service rush'}
                </Typography>

                <Typography
                  sx={{
                    mt: 2.5,
                    color: 'rgba(255,245,238,0.84)',
                    fontSize: '1.05rem',
                    lineHeight: 1.7,
                    maxWidth: 360,
                  }}
                >
                  {isSignup
                    ? 'Register a new admin account, then jump into your live chef panel to handle dishes, orders, and notifications.'
                    : 'Sign in to monitor incoming orders, publish menu changes, and keep the customer experience updated in real time.'}
                </Typography>

                <Button
                  variant="outlined"
                  onClick={() => setIsSignup((prev) => !prev)}
                  sx={{
                    mt: 4,
                    px: 4,
                    py: 1.4,
                    borderRadius: 999,
                    borderColor: 'rgba(255,255,255,0.4)',
                    color: 'white',
                    fontWeight: 700,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                    },
                  }}
                >
                  {isSignup ? 'Go to Sign In' : 'Go to Sign Up'}
                </Button>

                <Stack direction="row" spacing={1.5} sx={{ mt: 5, flexWrap: 'wrap' }}>
                  {['Chef access', 'Live orders', 'Menu sync'].map((item) => (
                    <Box
                      key={item}
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 999,
                        backgroundColor: 'rgba(255,255,255,0.12)',
                        color: '#fff7ed',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                      }}
                    >
                      {item}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <ToastComponent />
    </Box>
  );
};

export default AuthSlider;
