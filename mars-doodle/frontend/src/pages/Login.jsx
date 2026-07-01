import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/auth.css";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const res = await api.post("/auth/login", form);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            alert("Login Successful!");
            navigate("/dashboard");
        } catch (err) {
            alert(
                err.response?.data?.message || "Login Failed"
            );
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <button className="auth-btn">
                        Login
                    </button>
                </form>

                <div className="switch-link">
                    Don't have an account?
                    <Link to="/register">
                        {" "}Register
                    </Link>
                </div>
            </div>
        </div>
    );
}