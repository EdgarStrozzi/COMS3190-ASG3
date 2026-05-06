import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const bookingData = location.state;

    const [passenger, setPassenger] = useState({
        firstName: "",
        lastName: "",
    });

    const [payment, setPayment] = useState({
        cardName: "",
        cardNumber: "",
    });

    const [confirmationNumber, setConfirmationNumber] = useState("");
    const [error, setError] = useState("");

    const handlePassengerChange = (event) => {
        const { name, value } = event.target;

        setPassenger((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handlePaymentChange = (event) => {
        const { name, value } = event.target;

        setPayment((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!bookingData) {
            setError("Missing booking information. Please select a flight first.");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8080/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: null,
                    flightId: bookingData.flightId,
                    passengers: [
                        {
                            firstName: passenger.firstName,
                            lastName: passenger.lastName,
                        },
                    ],
                    seatsBooked: {
                        [bookingData.selectedClass]: bookingData.seatCount,
                    },
                    totalAmount: bookingData.totalAmount,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Could not complete booking.");
                return;
            }

            setConfirmationNumber(data.confirmationNumber);
        } catch (error) {
            console.error("Payment error:", error);
            setError("Could not connect to the server.");
        }
    };

    if (!bookingData) {
        return (
            <div className="min-h-screen bg-[#0B1F3A] px-6 py-12 text-white">
                <div className="mx-auto max-w-xl rounded-xl bg-white p-6 text-[#0B1F3A] shadow-lg">
                    <h1 className="text-2xl font-bold">No booking selected</h1>
                    <p className="mt-2 text-slate-600">
                        Please search for a flight and select seats before payment.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate("/search-flights")}
                        className="mt-5 rounded-md bg-[#2EC4B6] px-6 py-2 font-semibold text-[#0B1F3A]"
                    >
                        Search Flights
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B1F3A] px-6 py-12">
            <div className="mx-auto max-w-4xl">
                <div className="text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.30em] text-[#2EC4B6]">
                        Aethera Airways
                    </p>
                    <h1 className="mt-4 text-3xl font-bold text-white">
                        Payment & Confirmation
                    </h1>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-[1fr_0.8fr]">
                    <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-[#0B1F3A]">
                            Passenger Details
                        </h2>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <input
                                type="text"
                                name="firstName"
                                value={passenger.firstName}
                                onChange={handlePassengerChange}
                                placeholder="First Name"
                                required
                                className="rounded-md border border-slate-300 px-4 py-2 text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                            />

                            <input
                                type="text"
                                name="lastName"
                                value={passenger.lastName}
                                onChange={handlePassengerChange}
                                placeholder="Last Name"
                                required
                                className="rounded-md border border-slate-300 px-4 py-2 text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                            />
                        </div>

                        <h2 className="mt-6 text-xl font-bold text-[#0B1F3A]">
                            Payment
                        </h2>

                        <div className="mt-4 grid gap-4">
                            <input
                                type="text"
                                name="cardName"
                                value={payment.cardName}
                                onChange={handlePaymentChange}
                                placeholder="Name on Card"
                                required
                                className="rounded-md border border-slate-300 px-4 py-2 text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                            />

                            <input
                                type="text"
                                name="cardNumber"
                                value={payment.cardNumber}
                                onChange={handlePaymentChange}
                                placeholder="Card Number"
                                required
                                className="rounded-md border border-slate-300 px-4 py-2 text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                            />
                        </div>

                        {error && (
                            <p className="mt-4 rounded-md border border-[#FF9F1C] bg-[#FF9F1C]/15 p-3 font-semibold text-[#0B1F3A]">
                                {error}
                            </p>
                        )}

                        {confirmationNumber && (
                            <div className="mt-4 rounded-md border border-[#2EC4B6] bg-[#2EC4B6]/10 p-4">
                                <p className="font-semibold text-[#0B1F3A]">
                                    Booking confirmed!
                                </p>
                                <p className="mt-1 text-2xl font-bold text-[#0B1F3A]">
                                    {confirmationNumber}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={Boolean(confirmationNumber)}
                            className="mt-6 w-full rounded-md bg-[#2EC4B6] px-6 py-3 font-bold text-[#0B1F3A] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Complete Booking
                        </button>

                        {confirmationNumber && (
                            <button
                                type="button"
                                onClick={() => navigate("/flight-lookup")}
                                className="mt-3 w-full rounded-md bg-[#FF9F1C] px-6 py-3 font-bold text-[#0B1F3A] hover:brightness-95"
                            >
                                Lookup Booking
                            </button>
                        )}
                    </form>

                    <div className="rounded-xl bg-white p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-[#0B1F3A]">
                            Booking Summary
                        </h2>

                        <div className="mt-4 space-y-3 text-sm text-slate-600">
                            <p>
                                <span className="font-semibold text-[#0B1F3A]">Flight:</span>{" "}
                                {bookingData.flightNumber}
                            </p>
                            <p>
                                <span className="font-semibold text-[#0B1F3A]">Route:</span>{" "}
                                {bookingData.origin} → {bookingData.destination}
                            </p>
                            <p>
                                <span className="font-semibold text-[#0B1F3A]">Class:</span>{" "}
                                {bookingData.selectedClass}
                            </p>
                            <p>
                                <span className="font-semibold text-[#0B1F3A]">Seats:</span>{" "}
                                {bookingData.seatCount}
                            </p>
                            <p>
                                <span className="font-semibold text-[#0B1F3A]">Price per seat:</span>{" "}
                                ${Number(bookingData.pricePerSeat).toFixed(2)}
                            </p>
                        </div>

                        <div className="mt-5 rounded-lg border border-[#FF9F1C]/40 bg-[#FF9F1C]/10 p-4">
                            <p className="text-sm font-semibold text-[#0B1F3A]">
                                Total Amount
                            </p>
                            <p className="mt-1 text-3xl font-bold text-[#0B1F3A]">
                                ${Number(bookingData.totalAmount).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;