import React from "react";
import { getUserDetails } from "../utils/auth";
import { FaUserCircle, FaEnvelope, FaUserShield } from "react-icons/fa";

const Profile = () => {
    const user = getUserDetails();

    if (!user) {
        return (
            <div
                style={{
                    display: "flex",
                    height: "100vh",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    color: "#555",
                }}
            >
                Please log in to view your profile.
            </div>
        );
    }

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f9f9f9 0%, #e8f0ff 100%)",
                padding: "20px",
            }}
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "40px 50px",
                    borderRadius: "15px",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    maxWidth: "420px",
                    width: "100%",
                    textAlign: "center",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
                }}
            >
                <FaUserCircle size={80} color="#007bff" style={{ marginBottom: "15px" }} />
                <h2 style={{ marginBottom: "25px", color: "#333" }}>User Profile</h2>

                <div style={{ textAlign: "left", fontSize: "17px", lineHeight: "1.8" }}>
                    <p>
                        <FaUserCircle color="#007bff" />{" "}
                        <strong>Name:</strong> {user.name || "N/A"}
                    </p>
                    <p>
                        <FaEnvelope color="#007bff" />{" "}
                        <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                        <FaUserShield color="#007bff" />{" "}
                        <strong>Role:</strong> {user.role}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
