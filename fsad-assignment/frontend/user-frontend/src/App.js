import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";

import AdminDashboard from "./components/AdminDashboard";
import StaffDashboard from "./components/StaffDashboard";
import StudentDashboard from "./components/StudentDashboard";
import LandingPortal from "./components/LandingPortal"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPortal />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
