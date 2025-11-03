import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { saveToken } from "../utils/auth";
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/login", form);
            const token = res.data.token;
            saveToken(token);
            const decoded = jwtDecode(token);
            const role = decoded.role;

            // redirect based on role
            if (role === "ADMIN") navigate("/admin");
            else if (role === "STAFF") navigate("/staff");
            else navigate("/student");
        } catch (err) {
            setMessage("Invalid credentials!");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input name="email" placeholder="Email" onChange={handleChange} />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} />
                <button type="submit">Login</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default Login;
