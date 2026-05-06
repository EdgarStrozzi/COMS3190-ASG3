import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const FlightDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [flight, setFlight] = useState(null);
    const [selectedClass, setSelectedClass] = useState("economy");
    const [seatCount, setSeatCount] = useState(1);
    const [error, setError] = useState("");

    useEffect(() => {
        const getFlight = async () => {
            try {
                const response = await fetch(`http://localhost:8080/flights/${id}`);
                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || "Could not load flight details.");
                    return;
                }

                setFlight(data);
            } catch (error) {
                console.error("Flight details error:", error);
                setError("Could not connect to the server.");
            }
        };

        getFlight();
    }, [id]);

    const formatDateTime = (dateTime) => {
        return new Date(dateTime).toLocaleString([], {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        return `${hours}h ${mins}m`;
    };

    const classLabels = {
        economy: "Economy",
        premiumEconomy: "Premium Economy",
        firstClass: "First Class",
    };

    const handleContinue = () => {
        if (!flight) {
            return;
        }

        const availableSeats = flight.seats[selectedClass].available;

        if (seatCount < 1) {
            setError("Please select at least one seat.");
            return;
        }

        if (seatCount > availableSeats) {
            setError("Selected seats exceed availability.");
            return;
        }

        const bookingData = {
            flightId: flight.id,
            flightNumber: flight.flightNumber,
            origin: flight.origin,
            originName: flight.originName,
            destination: flight.destination,
            destinationName: flight.destinationName,
            departureTime: flight.departureTime,
            arrivalTime: flight.arrivalTime,
            selectedClass,
            seatCount: Number(seatCount),
            pricePerSeat: flight.seats[selectedClass].price,
            totalAmount: Number(seatCount) * flight.seats[selectedClass].price,
        };

        navigate("/payment", {
            state: bookingData,
        });
    };

    if (error && !flight) {
        return (
            <main className="min-h-screen bg-[#0B1F3A] px-6 py-12 text-white">
                <section className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-[#0B1F3A] shadow-2xl">
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#FF9F1C]">
                        Flight Details
                    </p>
                    <h1 className="mt-4 text-3xl font-bold">Unable to load flight</h1>
                    <p className="mt-3 text-slate-600">{error}</p>
                    <button
                        onClick={() => navigate("/search-flights")}
                        className="mt-6 rounded-xl bg-[#2EC4B6] px-5 py-3 font-bold text-[#0B1F3A]"
                    >
                        Back to Search
                    </button>
                </section>
            </main>
        );
    }

    if (!flight) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#0B1F3A] px-6 text-white">
                <p className="text-lg font-semibold">Loading flight details...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0B1F3A] px-6 py-12">
            <section className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
                <div className="bg-[#0B1F3A] px-8 py-8 text-white">
                    <p className="text-sm font-bold uppercase tracking-[0.30em] text-[#2EC4B6]">
                        Aethera Airways
                    </p>

                    <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-4xl font-bold">
                                {flight.origin} to {flight.destination}
                            </h1>
                            <p className="mt-2 text-slate-300">
                                {flight.originName} to {flight.destinationName}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-left">
                            <p className="text-sm text-slate-300">Flight</p>
                            <p className="text-2xl font-bold text-[#FF9F1C]">
                                {flight.flightNumber}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <div>
                        <h2 className="text-2xl font-bold text-[#0B1F3A]">
                            Flight Information
                        </h2>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <p className="text-sm font-semibold text-slate-500">
                                    Departure
                                </p>
                                <p className="mt-2 font-bold text-[#0B1F3A]">
                                    {formatDateTime(flight.departureTime)}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <p className="text-sm font-semibold text-slate-500">
                                    Arrival
                                </p>
                                <p className="mt-2 font-bold text-[#0B1F3A]">
                                    {formatDateTime(flight.arrivalTime)}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <p className="text-sm font-semibold text-slate-500">
                                    Duration
                                </p>
                                <p className="mt-2 font-bold text-[#0B1F3A]">
                                    {formatDuration(flight.duration)}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <p className="text-sm font-semibold text-slate-500">
                                    Aircraft
                                </p>
                                <p className="mt-2 font-bold text-[#0B1F3A]">
                                    {flight.aircraft}
                                </p>
                            </div>
                        </div>

                        <h2 className="mt-8 text-2xl font-bold text-[#0B1F3A]">
                            Seat Classes
                        </h2>

                        <div className="mt-5 grid gap-4">
                            {Object.entries(flight.seats).map(([seatClass, info]) => (
                                <button
                                    key={seatClass}
                                    type="button"
                                    onClick={() => setSelectedClass(seatClass)}
                                    className={`rounded-2xl border p-5 text-left transition ${
                                        selectedClass === seatClass
                                            ? "border-[#2EC4B6] bg-[#2EC4B6]/10 ring-4 ring-[#2EC4B6]/15"
                                            : "border-slate-200 bg-white hover:border-[#2EC4B6]"
                                    }`}
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-lg font-bold text-[#0B1F3A]">
                                                {classLabels[seatClass]}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {info.available} seats available from {info.capacity}
                                            </p>
                                        </div>

                                        <p className="text-xl font-bold text-[#0B1F3A]">
                                            ${info.price.toFixed(2)}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <aside className="h-fit rounded-3xl border border-slate-200 bg-slate-50 p-6">
                        <h2 className="text-2xl font-bold text-[#0B1F3A]">
                            Select Seats
                        </h2>

                        <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
                            <p className="text-sm font-semibold text-slate-500">
                                Selected Class
                            </p>
                            <p className="mt-1 text-xl font-bold text-[#0B1F3A]">
                                {classLabels[selectedClass]}
                            </p>

                            <p className="mt-4 text-sm font-semibold text-slate-500">
                                Price per Seat
                            </p>
                            <p className="mt-1 text-xl font-bold text-[#0B1F3A]">
                                ${flight.seats[selectedClass].price.toFixed(2)}
                            </p>
                        </div>

                        <label className="mt-5 block text-sm font-semibold text-[#0B1F3A]">
                            Number of Seats
                        </label>
                        <input
                            type="number"
                            min="1"
                            max={flight.seats[selectedClass].available}
                            value={seatCount}
                            onChange={(event) => setSeatCount(Number(event.target.value))}
                            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[#0B1F3A] outline-none focus:border-[#2EC4B6] focus:ring-4 focus:ring-[#2EC4B6]/20"
                        />

                        <div className="mt-5 rounded-2xl border border-[#FF9F1C]/40 bg-[#FF9F1C]/10 p-5">
                            <p className="text-sm font-semibold text-[#0B1F3A]">
                                Estimated Total
                            </p>
                            <p className="mt-1 text-3xl font-bold text-[#0B1F3A]">
                                $
                                {(
                                    Number(seatCount || 0) *
                                    flight.seats[selectedClass].price
                                ).toFixed(2)}
                            </p>
                        </div>

                        {error && (
                            <p className="mt-4 rounded-xl border border-[#FF9F1C]/50 bg-[#FF9F1C]/15 px-4 py-3 text-sm font-semibold text-[#0B1F3A]">
                                {error}
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={handleContinue}
                            className="mt-6 w-full rounded-xl bg-[#2EC4B6] px-4 py-3 font-bold text-[#0B1F3A] shadow-lg shadow-[#2EC4B6]/20 transition hover:brightness-95"
                        >
                            Continue to Booking
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/search-flights")}
                            className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 font-semibold text-[#0B1F3A] transition hover:border-[#2EC4B6] hover:bg-[#2EC4B6]/10"
                        >
                            Back to Search
                        </button>
                    </aside>
                </div>
            </section>
        </main>
    );
};

export default FlightDetails;