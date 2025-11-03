import React from "react";
import { getUserDetails } from "../utils/auth";

const Profile = () => {
    const user = getUserDetails();

    if (!user) {
        return <p>Please log in to view your profile.</p>;
    }

    return (
        <div
            style={{
                padding: "40px",
                maxWidth: "400px",
                margin: "40px auto",
                border: "1px solid #ddd",
                borderRadius: "10px",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}
        >
            <h2 style={{ textAlign: "center" }}>User Profile</h2>
            <div style={{ marginTop: "20px", fontSize: "18px" }}>
                <p><strong>Name:</strong> {user.name || "N/A"}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
            </div>
        </div>
    );
};

export default Profile;
