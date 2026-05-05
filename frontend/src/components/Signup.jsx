import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ name: "", email: "", password: ""});

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        try {
            const response = await fetch("http://localhost:8080/auth/signup", {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Signup failed.");
                return;
            }

            setMessage("Account created successfully.");

            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (error) {
            console.error("Signup error:", error);
            setError("Could not connect to the server.");
        }
    };

    return (
        <main className="page-container">
            <section className="auth-card">
                <h1>Create Account</h1>
                <p className="subtitle">Join Aethera Airways & Start booking.</p>

                <form onSubmit={handleSubmit} className="form">
                    <label>
                        Name
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                        />
                    </label>

                    <label>
                        Email
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                    </label>

                    <label>
                        Password
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                        />
                    </label>

                    {message && <p className="success-message">{message}</p>}
                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="primary-button">
                        Sign Up
                    </button>
                </form>

                <button className="link-button" onClick={() => navigate("/")}>
                    I already have an account
                </button>
            </section>
        </main>
    );
};

export default Signup;