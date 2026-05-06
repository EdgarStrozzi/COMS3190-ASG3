import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
    const navigate = useNavigate();

    const [flights, setFlights] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        origin: "",
        destination: "",
        date: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setHasSearched(true);

        const params = new URLSearchParams();

        if (formData.origin) {
            params.append("origin", formData.origin);
        }

        if (formData.destination) {
            params.append("destination", formData.destination);
        }

        if (formData.date) {
            params.append("date", formData.date);
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:8080/flights?${params.toString()}`
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Could not search flights.");
                setFlights([]);
                return;
            }

            setFlights(data);
        } catch (error) {
            console.error("Error fetching flights:", error);
            setError("Could not connect to the server.");
            setFlights([]);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1F3A] px-6 py-12">
            <form onSubmit={handleSubmit}>
                <div className="text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.30em] text-[#2EC4B6]">
                        Aethera Airways
                    </p>
                    <h1 className="mt-4 text-3xl font-bold text-white">
                        Flight Search
                    </h1>
                    <p className="mt-2 text-slate-300">
                        Search non-stop flights to or from the ORD.
                    </p>
                </div>

                <div className="mt-8 flex w-full justify-center">
                    <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-lg md:flex-row md:items-center">
                        <input
                            type="text"
                            placeholder="Origin"
                            name="origin"
                            value={formData.origin}
                            onChange={handleChange}
                            className="px-4 py-2 rounded-md border border-slate-300 text-[#0B1F3A] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                        />

                        <input
                            type="text"
                            placeholder="Destination"
                            name="destination"
                            value={formData.destination}
                            onChange={handleChange}
                            className="px-4 py-2 rounded-md border border-slate-300 text-[#0B1F3A] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                        />

                        <input
                            type="date"
                            name="date"
                            value={formData.date}
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

            <div className="mx-auto mt-8 max-w-4xl">
                <div className="rounded-xl bg-white p-6 shadow-lg">
                    {error && (
                        <p className="mb-4 rounded-md border border-[#FF9F1C] bg-[#FF9F1C]/15 p-3 font-semibold text-[#0B1F3A]">
                            {error}
                        </p>
                    )}

                    <ul role="list" className="divide-y divide-gray-200">
                        {flights.length === 0 ? (
                            <li className="py-5">
                                <p className="text-gray-500">
                                    {hasSearched ? "No flights found" : "Search for flights to begin.   Ex: Origin: ORD - LAX: 2026-06-05"}
                                </p>
                            </li>
                        ) : (
                            flights.map((f) => (
                                <li key={f.id} className="flex justify-between gap-x-6 py-5">
                                    <div className="flex min-w-0 gap-x-4">
                                        <div className="min-w-0 flex-auto">
                                            <p className="text-sm/6 font-semibold text-[#0B1F3A]">
                                                {f.flightNumber} — {f.origin} → {f.destination}
                                            </p>
                                            <p className="mt-1 truncate text-xs/5 text-gray-500">
                                                Departs: {f.departureTime}
                                            </p>
                                            <p className="mt-1 truncate text-xs/5 text-gray-500">
                                                Arrives: {f.arrivalTime}
                                            </p>
                                            <p className="mt-1 truncate text-xs/5 text-gray-500">
                                                {f.seats.economy.available} economy seats at ${f.seats.economy.price}
                                            </p>
                                            <p className="mt-1 truncate text-xs/5 text-gray-500">
                                                {f.seats.premiumEconomy.available} premium economy seats at ${f.seats.premiumEconomy.price}
                                            </p>
                                            <p className="mt-1 truncate text-xs/5 text-gray-500">
                                                {f.seats.firstClass.available} first class seats at ${f.seats.firstClass.price}
                                            </p>
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
    );
};

export default SearchPage;