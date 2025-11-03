import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { getUserDetails, logout } from "../utils/auth";


const Navbar = () => {
    const user = getUserDetails();
    const role = user ? user.role : null;

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#282c34",
                padding: "10px 20px",
                color: "white",
            }}
        >
            <div>
                <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                    User Portal
                </Link>
            </div>

            <div>
                {!role && (
                    <>
                        <Link to="/signup" style={{ color: "white", marginRight: "15px" }}>
                            Signup
                        </Link>
                        <Link to="/login" style={{ color: "white" }}>
                            Login
                        </Link>
                    </>
                )}
                {role && (
                    <>
                        <span style={{ marginRight: "15px" }}>Role: {role}</span>
                        <Link
                            to="/profile"
                            style={{ color: "white", marginRight: "15px", textDecoration: "none" }}
                        >
                            Profile
                        </Link>
                        <button onClick={handleLogout} style={{ background: "red", color: "white" }}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
