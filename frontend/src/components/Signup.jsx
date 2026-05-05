import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

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
                headers: {
                    "Content-Type": "application/json",
                },
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
        <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
            <section className="w-full max-w-md rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-[#0B1F3A] px-8 py-7">
                    <p className="text-[#2EC4B6] text-sm font-semibold tracking-[0.25em] uppercase">
                        Aethera Airways
                    </p>
                    <h1 className="mt-3 text-3xl font-bold text-white">
                        Create Account
                    </h1>
                    <p className="mt-2 text-slate-300">
                        Sign up to search flights, select seats, and manage bookings.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-[#0B1F3A] mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Edgar Test"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-[#0B1F3A] outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/25"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#0B1F3A] mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="edgar@example.com"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-[#0B1F3A] outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/25"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#0B1F3A] mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-[#0B1F3A] outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/25"
                        />
                    </div>

                    {message && (
                        <p className="rounded-xl bg-[#2EC4B6]/10 border border-[#2EC4B6]/30 px-4 py-3 text-sm font-semibold text-[#0B1F3A]">
                            {message}
                        </p>
                    )}

                    {error && (
                        <p className="rounded-xl bg-[#FF9F1C]/10 border border-[#FF9F1C]/40 px-4 py-3 text-sm font-semibold text-[#0B1F3A]">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-[#2EC4B6] px-4 py-3 font-bold text-[#0B1F3A] transition hover:brightness-95"
                    >
                        Sign Up
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 font-semibold text-[#0B1F3A] transition hover:border-[#2EC4B6] hover:bg-[#2EC4B6]/10"
                    >
                        I already have an account
                    </button>
                </form>
            </section>
        </main>
    );
};

export default Signup;