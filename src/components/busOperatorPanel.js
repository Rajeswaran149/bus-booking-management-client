import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import LogoutButton from "./logout";
import { Link } from "react-router-dom";
import '../styles/operatorPanel.css';

const BusOperatorPanel = () => {

  const url = "http://localhost:5000";

  const [buses, setBuses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [newBus, setNewBus] = useState({ name: "", total_seats: "" });
  const [newSchedule, setNewSchedule] = useState({
    bus_id: "",
    departure_time: "",
    arrival_time: "",
    starting_point: "",
    destination: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage

  // Fetch buses and schedules
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const busResponse = await axios.get(`${url}/api/buses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBuses(busResponse.data);

      const scheduleResponse = await axios.get(
        `${url}/api/schedules`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSchedules(scheduleResponse.data);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle bus form submission
  const handleBusSubmit = async (e) => {
    e.preventDefault();
    if (!newBus.name || !newBus.total_seats) {
      setError("Please fill in all the fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${url}/api/operator/buses`,
        newBus,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBuses([...buses, response.data]);
      setNewBus({ name: "", total_seats: "" });
      setError("");
    } catch (err) {
      setError("Failed to add bus. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle schedule form submission
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (
      !newSchedule.bus_id ||
      !newSchedule.departure_time ||
      !newSchedule.arrival_time ||
      !newSchedule.starting_point ||
      !newSchedule.destination
    ) {
      setError("Please fill in all the fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${url}/api/operator/schedules`,
        newSchedule,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSchedules([...schedules, response.data]);
      setNewSchedule({
        bus_id: "",
        departure_time: "",
        arrival_time: "",
        starting_point: "",
        destination: "",
      });
      setError("");
    } catch (err) {
      setError("Failed to add schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="operator-panel-container">
      <div className="operator-panel">
        <h1 className="operator-panel-title">
          Bus Operator Panel
        </h1>

        <div className="flex justify-end">
          <LogoutButton />
        </div>
        
        {/* Display error message */}
        {error && (
          <div className="operator-panel-error">
            <p>{error}</p>
          </div>
        )}

        {/* Display loading spinner */}
        {loading && (
          <div className="operator-panel-spinner">
            <div className="loader"></div>
          </div>
        )}

        {/* Add Bus Form */}
        <form onSubmit={handleBusSubmit} className="operator-panel-form">
          <h2 className="text-2xl font-medium text-gray-700">Add Bus</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Bus Name"
              value={newBus.name}
              onChange={(e) => setNewBus({ ...newBus, name: e.target.value })}
              className="operator-panel-form-input"
            />
            <input
              type="number"
              placeholder="Total Seats"
              value={newBus.total_seats}
              onChange={(e) =>
                setNewBus({ ...newBus, total_seats: e.target.value })
              }
              className="operator-panel-form-input"
            />
          </div>
          <button
            type="submit"
            className="operator-panel-form-button"
          >
            Add Bus
          </button>
        </form>

        {/* Add Schedule Form */}
        <form onSubmit={handleScheduleSubmit} className="operator-panel-form">
          <h2 className="text-2xl font-medium text-gray-700">Add Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              value={newSchedule.bus_id}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, bus_id: e.target.value })
              }
              className="operator-panel-form-input"
            >
              <option value="">Select Bus</option>
              {buses.map((bus) => (
                <option key={bus.id} value={bus.id}>
                  {bus.name}
                </option>
              ))}
            </select>
            <input
              type="time"
              value={newSchedule.departure_time}
              onChange={(e) =>
                setNewSchedule({
                  ...newSchedule,
                  departure_time: e.target.value,
                })
              }
              className="operator-panel-form-input"
            />
            <input
              type="time"
              value={newSchedule.arrival_time}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, arrival_time: e.target.value })
              }
              className="operator-panel-form-input"
            />
            <input
              type="text"
              placeholder="Starting Point"
              value={newSchedule.starting_point}
              onChange={(e) =>
                setNewSchedule({
                  ...newSchedule,
                  starting_point: e.target.value,
                })
              }
              className="operator-panel-form-input"
            />
            <input
              type="text"
              placeholder="Destination"
              value={newSchedule.destination}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, destination: e.target.value })
              }
              className="operator-panel-form-input"
            />
          </div>
          <button
            type="submit"
            className="operator-panel-form-button"
          >
            Add Schedule
          </button>
        </form>

        {/* View Bookings */}
        <div>
          <h2 className="text-2xl font-medium text-gray-700 mb-4">Bookings</h2>
          <ul className="operator-panel-bookings-list">
            {schedules.map((schedule) => (
              <li
                key={schedule.id}
                className="operator-panel-booking-item"
              >
                <div className="operator-panel-booking-info">
                  <p className="font-semibold">
                    {schedule.starting_point} to {schedule.destination}
                  </p>
                  <p className="operator-panel-booking-details">
                    {schedule.departure_time} - {schedule.arrival_time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Link to Booking System */}
        <Link to="/operator/booking-system" className="flex justify-center mt-2 btn btn-primary underline">
          Go to Booking System
        </Link>
      </div>
    </div>
  );
};

export default BusOperatorPanel;
