import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FlightLookup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        destination: "",
        date: "",
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
        
        const { destination, date } = formData;
        
        try {
            const response = await fetch(
                `http://127.0.0.1:8080/flights?destination=${encodeURIComponent(
                    destination
                )}&date=${date}`
            );
            
            const data = await response.json();
            console.log("Flight results:", data);
            
        } catch (error) {
            console.error("Error fetching flights:", error);
        }
    }
    return (
        <div>
        <form onSubmit={handleSubmit}>
        <div>
        <p>Flight search</p>
        </div>
        <div className="w-full bg-gray-900 p-6 flex justify-center">
        <div className="flex gap-4 items-center bg-gray-800 p-4 rounded-xl shadow-lg">
        
        <input
        type="text"
        placeholder="Destination"
        name="destination"
        onChange={handleChange}
        className="px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        
        <input
        type="date"
        name="date"
        onChange={handleChange}
        className="px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        
        <button
        type="submit"
        
        className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-400 transition"
        >
        Search
        </button>
        
        </div>
        </div>
        </form>
        </div>
    )
}

export default FlightLookup