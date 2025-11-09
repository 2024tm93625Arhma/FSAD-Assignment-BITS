import React, { useState } from "react";
import api from "../utils/api";
import { saveToken } from "../utils/auth";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            const res = await api.post("/users/login", { email, password });
            const token = res.data.token;
            saveToken(token);
            const decoded = jwtDecode(token);
            const role = decoded.role;

            // redirect based on role
            if (role === "ADMIN") navigate("/admin");
            else if (role === "STAFF") navigate("/staff");
            else navigate("/student");
        } catch (err) {
            console.error('Login error:', err);
            const errorMessage = err.response?.data?.error || 'Login failed. Please check your credentials and try again.';
            setError(errorMessage);
        }
    };

    return (
        <Grid
          container
          component="main"
          sx={{
            height: '100vh',
            background: 'linear-gradient(135deg, #e3f2fd, #fff)',
          }}
        >
          <Grid
            item
            xs={12}
            sm={8}
            md={4}
            component={Paper}
            elevation={6}
            square
            sx={{
              m: 'auto',
              borderRadius: 3,
              p: 4,
              boxShadow: 4,
              backgroundColor: '#ffffffdd',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
                Log In
              </Typography>
    
              {error && (
                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                  {error}
                </Alert>
              )}
    
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.2,
                    background:
                      'linear-gradient(90deg, #1976d2, #42a5f5)',
                    '&:hover': {
                      background:
                        'linear-gradient(90deg, #1565c0, #1e88e5)',
                    },
                  }}
                >
                  Log In
                </Button>
    
                {/* <Grid container justifyContent="space-between">
                  <Grid item>
                    <Link
                      to="/signup"
                      style={{
                        textDecoration: 'none',
                        color: '#1976d2',
                        fontSize: '0.9rem',
                      }}
                    >
                      Sign Up
                    </Link>
                  </Grid>
                </Grid> */}
              </Box>
            </Box>
          </Grid>
        </Grid>
      );
};

export default Login;

