import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { saveToken } from "../utils/auth";

const Signup = () => {
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "STUDENT" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/signup", form);
            saveToken(res.data.token);
            setMessage("Signup successful!");
            setTimeout(() => navigate("/"), 800); // redirect to landing page
        } catch (err) {
            setMessage("Signup failed!");
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" onChange={handleChange} />
                <input name="email" placeholder="Email" onChange={handleChange} />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} />
                <select name="role" onChange={handleChange}>
                    <option value="STUDENT">STUDENT</option>
                    <option value="STAFF">STAFF</option>
                    <option value="ADMIN">ADMIN</option>
                </select>
                <button type="submit">Signup</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default Signup;
