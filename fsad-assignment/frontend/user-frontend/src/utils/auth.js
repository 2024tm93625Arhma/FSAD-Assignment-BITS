import { jwtDecode } from "jwt-decode";

export const saveToken = (token) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const logout = () => localStorage.removeItem("token");

export const getUserDetails = () => {
    const token = getToken();
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        return decoded; // includes name, email, role, id if backend added them
    } catch (err) {
        console.error("Invalid token:", err);
        return null;
    }
};
