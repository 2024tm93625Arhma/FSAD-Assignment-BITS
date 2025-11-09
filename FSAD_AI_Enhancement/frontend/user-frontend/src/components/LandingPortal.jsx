import React from "react";
import { getUserDetails } from "../utils/auth";

const LandingPortal = () => {
    const user = getUserDetails();
    const role = user ? user.role : null;
    const name = user ? user.name : null;

    return (
        <div
            style={{
                padding: "50px",
                textAlign: "center",
                backgroundColor: "#f9fafc",
                minHeight: "90vh",
            }}
        >
            <div
                style={{
                    background: "white",
                    display: "inline-block",
                    padding: "40px 60px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                }}
            >
                <h1 style={{ color: "#2c3e50" }}>Welcome to the Lending Portal</h1>
                {name && (
                    <h3 style={{ color: "#34495e", marginTop: "10px" }}>
                        Hello, <span style={{ color: "#007bff" }}>{name}</span>!
                    </h3>
                )}

                {!role && (
                    <p style={{ marginTop: "20px", fontSize: "18px" }}>
                        Please <b>login</b> or <b>signup</b> to access your portal.
                    </p>
                )}

                {role === "ADMIN" && (
                    <p style={{ marginTop: "20px", fontSize: "18px" }}>
                        You are logged in as <b>Admin</b>. You can manage users, inventory, and reports.
                    </p>
                )}

                {role === "STAFF" && (
                    <p style={{ marginTop: "20px", fontSize: "18px" }}>
                        You are logged in as <b>Staff</b>. You can view requests and assist with approvals.
                    </p>
                )}

                {role === "STUDENT" && (
                    <p style={{ marginTop: "20px", fontSize: "18px" }}>
                        You are logged in as <b>Student</b>. Explore available items and manage your requests.
                    </p>
                )}
            </div>
        </div>
    );
};

export default LandingPortal;
