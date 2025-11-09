import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { saveToken } from "../utils/auth";
import {
    Avatar,
    Button,
    TextField,
    Grid,
    Paper,
    Typography,
    Alert,
    Box,
    Select,
    MenuItem
  } from '@mui/material';
  import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Signup = () => {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState("STUDENT");
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError(''); // Clear previous errors

        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            const res = await api.post("/users/signup", { name, email, password, role });
            saveToken(res.data.token);
            setMessage("Signup successful!");
            setTimeout(() => navigate("/admin"), 800); // redirect to landing page
        } catch (err) {
            setError("Signup Failed");
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
                Sign Up
              </Typography>
    
              {error && (
                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                    {error}
                </Alert>
              )}
              {message && (
                <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                    {message}
                </Alert>
              )}
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="Name"
                  autoComplete="Name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
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
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={role}
                  label="Role"
                  onChange={(e) => setRole(e.target.value)}
                >
                    <MenuItem value="STUDENT">STUDENT</MenuItem>
                    <MenuItem value="STAFF">STAFF</MenuItem>
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                </Select>

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
                  Sign Up
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )

};

export default Signup;
