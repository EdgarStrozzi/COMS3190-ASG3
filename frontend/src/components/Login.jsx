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


        
<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Sign in to your account</h2>
  </div>

  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm/6 font-medium text-gray-100">Username</label>
        <div className="mt-2">
            <input type="text" name="username" value={formData.username}
            onChange={handleChange}
            placeholder="username" required />
        </div>

      </div>
      <div>
        <label className="block text-sm/6 font-medium text-gray-100">Email address</label>
        <div className="mt-2">
            <input type="text" name="email" value={formData.email}
            onChange={handleChange}
            placeholder="email" required />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm/6 font-medium text-gray-100">Password</label>
        </div>
        <div className="mt-2">
             <input type="text" name="password" value={formData.password}
            onChange={handleChange}
            placeholder="password" required />
        
        </div>
      </div>

      <div>
        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Sign in</button>
      </div>
    </form>
  </div>
</div>


        //</div>
    )
}
export default Login