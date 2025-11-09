import React, { useState, useEffect } from "react"; 
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUserDetails, logout } from "../utils/auth";
import api from "../utils/api"; 
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton, 
    Badge,      
    Menu,       
    MenuItem,   
} from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications'; 

const Navbar = () => {
    const user = getUserDetails();
    const role = user ? user.role : null;
    const navigate = useNavigate();
    const location = useLocation();

    // ---  State for notifications ---
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // ---  Fetch notifications on login ---
    useEffect(() => {
        if (role === "ADMIN" || role === "STAFF") {
            api.get("/notifications/overdue")
                .then(res => {
                    setNotifications(res.data);
                })
                .catch(err => {
                    console.error("Failed to fetch notifications:", err);
                });
        } else {
            // Clear notifications if user is not admin/staff
            setNotifications([]);
        }
    }, [role]); // Re-run when role changes (on login/logout)

    // ---  Handlers for notification menu ---
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        // todo: Add logic here to mark notifications as read
    };

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

                            <Button
                                component={Link}
                                to="/"
                                sx={{ color: "white" }}
                                startIcon={<HomeIcon />}
                                variant={location.pathname === '/' ? 'outlined' : 'text'}
                            >
                                Home
                            </Button>

                            <Button 
                                component={Link} 
                                to={dashboardPath}
                                sx={{ color: "white" }}
                                startIcon={<DashboardIcon />}
                                variant={location.pathname === dashboardPath ? 'outlined' : 'text'}
                            >
                                Dashboard
                            </Button>

                            <Button 
                                component={Link} 
                                to="/profile" 
                                sx={{ color: "white" }}
                                startIcon={<AccountCircleIcon />}
                                variant={location.pathname === '/profile' ? 'outlined' : 'text'}
                            >
                                Profile
                            </Button>

                            {/* ---  Notification Bell & Menu --- */}
                            {(role === 'ADMIN' || role === 'STAFF') && (
                                <>
                                    <IconButton
                                        size="large"
                                        color="inherit"
                                        aria-label="new notifications"
                                        onClick={handleMenuOpen}
                                    >
                                        <Badge badgeContent={notifications.length} color="error">
                                            <NotificationsIcon />
                                        </Badge>
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleMenuClose}
                                        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                                    >
                                        {notifications.length === 0 ? (
                                            <MenuItem onClick={handleMenuClose}>No new notifications</MenuItem>
                                        ) : (
                                            notifications.map(notif => (
                                                <MenuItem key={notif.id} onClick={handleMenuClose} sx={{whiteSpace: 'normal'}}>
                                                    {notif.message}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Menu>
                                </>
                            )}
                            {/* --- End of Notification Section --- */}


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