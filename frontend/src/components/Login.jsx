import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        const url = "http://127.0.0.1:8080/loginUser";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (response.status === 409) {
                const data = await response.json();
                console.log("Logging in existing user:", data.user);
                alert("Welcome back!");
                return;
            }
            
            if (response.status === 401) {
                alert("Incorrect name or password");
                return;
            }
            if (!response.ok) {
                throw new Error("Failed to add new Robot");
            }
            const result = await response.json();
            console.log("Success:", result);
            //navigate away
            setFormData({
                username: "",
                email: "",
                password: "",
            });
        } catch (error) {
            console.error("Error:", error);
            alert("Error adding");
        }
    };
    return (
        <div>
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
        <button type="submit">Login</button>
        </form>
        </div>
    )
}
export default Login