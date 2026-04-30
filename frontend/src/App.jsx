import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import FlightDetails from './components/flightDetails'
import FlightLookup from './components/FlightLookup'
import Payment from './components/payment'
import SearchPage from './components/SearchPage'
import Signup from './components/Signup'
import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Login/>
          }  
        />
        <Route
          path="/flight-details"
          element={
            <FlightDetails/>
          }  
        />
        <Route
          path="/flight-lookup"
          element={
            <FlightLookup/>
          }  
        />
        <Route
          path="/payment"
          element={
            <Payment/>
          }  
        />
        <Route
          path="/search-flights"
          element={
            <SearchPage/>
          }  
        />
        <Route
          path="/signup"
          element={
            <Signup/>
          }  
        />
      </Routes>
      
    </>
  )
}

export default App
