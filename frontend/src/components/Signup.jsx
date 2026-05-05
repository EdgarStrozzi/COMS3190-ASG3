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
        <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#0B1F3A]">
            <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl md:grid-cols-2">
                <div className="relative hidden bg-[#0B1F3A] p-10 text-white md:block">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(46,196,182,0.35),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(255,159,28,0.30),transparent_28%)]" />

                    <div className="relative z-10 flex h-full flex-col justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#2EC4B6]">
                                Aethera Airways
                            </p>

                            <h1 className="mt-8 text-5xl font-bold leading-tight">
                                Premium travel from the heart of ORD.
                            </h1>

                            <p className="mt-5 max-w-md text-lg leading-8 text-slate-300">
                                Create your passenger account to search flights, choose your class,
                                and manage reservations.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                            <p className="text-sm font-semibold text-[#FF9F1C]">
                                Hub-and-spoke network
                            </p>
                            <p className="mt-2 text-sm text-slate-300">
                                All routes connect through Chicago O&apos;Hare International Airport.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 sm:p-10">
                    <div className="mb-8">
                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#2EC4B6] md:hidden">
                            Aethera Airways
                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-[#0B1F3A]">
                            Create Account
                        </h2>

                        <p className="mt-2 text-slate-600">
                            Sign up to begin your Aethera booking experience.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#0B1F3A]">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Edgar Test"
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[#0B1F3A] outline-none transition placeholder:text-slate-400 focus:border-[#2EC4B6] focus:ring-4 focus:ring-[#2EC4B6]/20"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#0B1F3A]">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="edgar@example.com"
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[#0B1F3A] outline-none transition placeholder:text-slate-400 focus:border-[#2EC4B6] focus:ring-4 focus:ring-[#2EC4B6]/20"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#0B1F3A]">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[#0B1F3A] outline-none transition placeholder:text-slate-400 focus:border-[#2EC4B6] focus:ring-4 focus:ring-[#2EC4B6]/20"
                            />
                        </div>

                        {message && (
                            <p className="rounded-xl border border-[#2EC4B6]/40 bg-[#2EC4B6]/10 px-4 py-3 text-sm font-semibold text-[#0B1F3A]">
                                {message}
                            </p>
                        )}

                        {error && (
                            <p className="rounded-xl border border-[#FF9F1C]/50 bg-[#FF9F1C]/15 px-4 py-3 text-sm font-semibold text-[#0B1F3A]">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-[#2EC4B6] px-4 py-3 font-bold text-[#0B1F3A] shadow-lg shadow-[#2EC4B6]/20 transition hover:-translate-y-0.5 hover:brightness-95"
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
                </div>
            </section>
        </main>
    );
};

export default Signup;