import React from "react";
// 1. IMPORT `useLocation`
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUserDetails, logout } from "../utils/auth";
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';

const Navbar = () => {
    const user = getUserDetails();
    const role = user ? user.role : null;
    const navigate = useNavigate();
    
    // 2. GET THE CURRENT LOCATION
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const getDashboardPath = (role) => {
        switch(role) {
            case 'ADMIN': return '/admin';
            case 'STAFF': return '/staff';
            case 'STUDENT': return '/student';
            default: return '/';
        }
    };
    const dashboardPath = getDashboardPath(role);

    return (
        <AppBar position="static" sx={{ background: "#282c34" }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography 
                    variant="h6" 
                    component={Link} 
                    to="/" 
                    sx={{ color: "white", textDecoration: "none" }}
                >
                    Equipment Lending Portal
                </Typography>

                <Box>
                    {!role && (
                        <>
                            <Button component={Link} to="/signup" sx={{ color: "white" }}>
                                Signup
                            </Button>
                            <Button component={Link} to="/login" sx={{ color: "white" }}>
                                Login
                            </Button>
                        </>
                    )}
                    {role && (
                        <>
                            <Typography variant="body1" component="span" sx={{ mr: 2, verticalAlign: 'middle' }}>
                                Role: {role}
                            </Typography>

                            {/* 3. SET `variant` BASED ON `location.pathname` */}
                            <Button
                                component={Link}
                                to="/"
                                sx={{ color: "white" }}
                                startIcon={<HomeIcon />}
                                // Check if the path is exactly "/"
                                variant={location.pathname === '/' ? 'outlined' : 'text'}
                            >
                                Home
                            </Button>

                            {/* 4. SET `variant` BASED ON `location.pathname` */}
                            <Button 
                                component={Link} 
                                to={dashboardPath}
                                sx={{ color: "white" }}
                                startIcon={<DashboardIcon />}
                                // Check if the path matches the dashboard path
                                variant={location.pathname === dashboardPath ? 'outlined' : 'text'}
                            >
                                Dashboard
                            </Button>

                            {/* 5. SET `variant` BASED ON `location.pathname` */}
                            <Button 
                                component={Link} 
                                to="/profile" 
                                sx={{ color: "white" }}
                                startIcon={<AccountCircleIcon />}
                                // Check if the path is "/profile"
                                variant={location.pathname === '/profile' ? 'outlined' : 'text'}
                            >
                                Profile
                            </Button>
                            <Button onClick={handleLogout} variant="contained" color="error" sx={{ ml: 1.5 }}>
                                Logout
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;