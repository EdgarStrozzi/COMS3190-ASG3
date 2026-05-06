import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FlightLookup = () => {
    const navigate = useNavigate();
    const [flights, setFlights] = useState([]);

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
            setFlights(data);
            
        } catch (error) {
            console.error("Error fetching flights:", error);
        }
    }

    return (
        <div className="min-h-screen bg-[#0B1F3A]">
            <form onSubmit={handleSubmit}>
                <div className="pt-10 text-center">
                    <p className="text-3xl font-bold text-white">Flight search</p>
                </div>

                <div className="w-full p-6 flex justify-center">
                    <div className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-lg">
                        <input
                            type="text"
                            placeholder="Destination"
                            name="destination"
                            onChange={handleChange}
                            className="px-4 py-2 rounded-md border border-slate-300 text-[#0B1F3A] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                        />
                        
                        <input
                            type="date"
                            name="date"
                            onChange={handleChange}
                            className="px-4 py-2 rounded-md border border-slate-300 text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                        />
                        
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#2EC4B6] text-[#0B1F3A] font-semibold rounded-md hover:brightness-95 transition"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </form>

            <div className="list mx-auto max-w-4xl px-6">
                <div className="mt-6 bg-white rounded-xl p-6 shadow-lg">
                    <ul role="list" className="divide-y divide-gray-200">
                        {flights.length === 0 ? (
                            <li>
                                <p className="text-gray-500">No flights found</p>
                            </li>
                        ) : (
                            flights.map((f) => (
                                <li key={f.id} className="flex justify-between gap-x-6 py-5">
                                    <div className="flex min-w-0 gap-x-4">
                                        <div className="min-w-0 flex-auto">
                                            <p className="text-sm/6 font-semibold text-[#0B1F3A]">
                                                {f.flightNumber} — {f.origin} → {f.destination}
                                            </p>
                                            <p className="mt-1 truncate text-xs/5 text-gray-500">Departs: {f.departureTime}</p>
                                            <p className="mt-1 truncate text-xs/5 text-gray-500">Arrives: {f.arrivalTime}</p>
                                            <p className="mt-1 truncate text-xs/5 text-gray-500">{f.seats.economy.available} economy seats at ${f.seats.economy.price}</p>
                                            <p className="mt-1 truncate text-xs/5 text-gray-500">{f.seats.premiumEconomy.available} premium economy seats at ${f.seats.premiumEconomy.price}</p>
                                            <p className="mt-1 truncate text-xs/5 text-gray-500">{f.seats.firstClass.available} first class seats at ${f.seats.firstClass.price}</p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => navigate(`/flight-details/${f.id}`)}
                                        className="h-fit rounded-md bg-[#FF9F1C] px-4 py-2 text-sm font-semibold text-[#0B1F3A] hover:brightness-95"
                                    >
                                        View Details
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default FlightLookup;