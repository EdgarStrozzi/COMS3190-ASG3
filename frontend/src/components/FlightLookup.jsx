import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FlightLookup = ({setSelectedFlight}) => {
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
            if (Array.isArray(data)) {
                setFlights(data);
            } else {
                setFlights([]); // clear results on error
            }
            
        } catch (error) {
            console.error("Error fetching flights:", error);
        }
    }
    const selectFlight = (flight) => {
        setSelectedFlight(flight.id);
        navigate("/flight-details");
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
        <div className="list">

            <div className="mt-6 text-white">
                <ul role="list" className="divide-y divide-gray-100">
  {flights.length === 0 ? (
    <li>
    <p>No flights found</p>
    </li>
  ) : (
    flights.map((f) => (
        <li key={f.id} onClick={() => {selectFlight(f)}} className="flex justify-between gap-x-6 py-5">
      <div className="flex min-w-0 gap-x-4">
        <div className="min-w-0 flex-auto">
        <p className="text-sm/6 font-semibold text-gray-900">{f.flightNumber} — {f.origin} → {f.destination}</p>
        <p className="mt-1 truncate text-xs/5 text-gray-500">Departs: {f.departureTime}</p>
        <p className="mt-1 truncate text-xs/5 text-gray-500">Arrives: {f.arrivalTime}</p>
        <p className="mt-1 truncate text-xs/5 text-gray-500">{f.seats.economy.available} economy seats at ${f.seats.economy.price}</p>
        <p className="mt-1 truncate text-xs/5 text-gray-500">{f.seats.premiumEconomy.available} premium economy seats at ${f.seats.premiumEconomy.price}</p>
        <p className="mt-1 truncate text-xs/5 text-gray-500">{f.seats.firstClass.available} first class seats at ${f.seats.firstClass.price}</p>
        </div>
        </div>
      </li>

    ))
  )}
  </ul>
</div>

        </div>
        </div>
    )
}

export default FlightLookup