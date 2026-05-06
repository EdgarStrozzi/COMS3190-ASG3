import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        try {
            const response = await fetch("http://127.0.0.1:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Invalid email or password.");
                return;
            }

            console.log("Logged in user:", data.user);
            setMessage("Welcome back!");

            setFormData({
                email: "",
                password: "",
            });

            setTimeout(() => {
                navigate("/search-flights");
            }, 700);
        } catch (error) {
            console.error("Login error:", error);
            setError("Could not connect to the server.");
        }
    };
    return (
        /*
        <div>
            <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
        Login
        </h2>
        <button className="btn btn-ghost" onClick={() => navigate("/signup")}>Signup</button>
        <form onSubmit={handleSubmit}>
        <input type="text" name="username" value={formData.username}
        onChange={handleChange}
        placeholder="username" required />
        <br /><br />
        <input type="text" name="email" value={formData.email}
        onChange={handleChange}
        placeholder="email" required />
        <br /><br />
        <input type="text" name="password" value={formData.password}
        onChange={handleChange}
        placeholder="password" required />
        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Sign in</button>
        </form>
        </div>
        */


        
    <div className="flex min-h-screen flex-col justify-center bg-[#0B1F3A] px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <p className="text-center text-sm font-bold uppercase tracking-[0.30em] text-[#2EC4B6]">
                Aethera Airways
            </p>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                Log in to your account
            </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="rounded-3xl border border-white/10 bg-white p-8 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-[#0B1F3A]">
                            Email
                        </label>
                        <div className="mt-2">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="email"
                                required
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-[#0B1F3A] outline-none placeholder:text-slate-400 focus:border-[#2EC4B6] focus:ring-4 focus:ring-[#2EC4B6]/20"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#0B1F3A]">
                            Password
                        </label>
                        <div className="mt-2">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="password"
                                required
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-[#0B1F3A] outline-none placeholder:text-slate-400 focus:border-[#2EC4B6] focus:ring-4 focus:ring-[#2EC4B6]/20"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-xl bg-[#2EC4B6] px-4 py-3 text-sm font-bold text-[#0B1F3A] shadow-lg shadow-[#2EC4B6]/20 transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2EC4B6]"
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Do not have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/signup")}
                        className="font-bold text-[#0B1F3A] underline decoration-[#FF9F1C] decoration-2 underline-offset-4 hover:text-[#2EC4B6]"
                    >
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    </div>


        //</div>
    )
}
export default Login