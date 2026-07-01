import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/auth.css";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
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
            await api.post("/auth/register", form);
            alert("Registration Successful!");
            navigate("/");
        } catch (err) {
            alert(
                err.response?.data?.message || "Registration Failed"
            );
        }
    };
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Create Account</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            name="username"
                            onChange={handleChange}
                            required
                        />

                    </div>

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
                        Register
                    </button>

                </form>

                <div className="switch-link">
                    Already have an account?
                    <Link to="/">
                        {" "}Login
                    </Link>

                </div>
            </div>
        </div>
    );
}