import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import BusOperatorPanel from "./components/busOperatorPanel";
import BookingSystem from "./components/bookingSystem";
import Register from "./components/register";
import Login from "./components/login";

const App = () => {
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole"); // Get role from localStorage

  // Add console logs to ensure values are correct
  console.log("Token:", token);
  console.log("User Role:", userRole);

  return (
    <Router>
      <Routes>
        {/* Default route, redirect based on the role */}
        <Route
          path="/"
          element={
            token ? (
              userRole === "operator" ? (
                <Navigate to="/operator" />
              ) : (
                <Navigate to="/booking-system" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Registration page */}
        <Route path="/register" element={<Register />} />

        {/* Operator page */}
        <Route
          path="/operator"
          element={
            userRole === "operator" ? <BusOperatorPanel /> : <Navigate to="/" />
          }
        />
        {/* Operator Booking System - Placeholder */}
        <Route
          path="/operator/booking-system"
          element={
            userRole === "operator" ? (
              <BookingSystem />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Booking system page */}
        <Route
          path="/booking-system"
          element={
            userRole === "user" ? <BookingSystem /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
