import axios from "axios";
import { useEffect, useState } from "react";
import LogoutButton from "./logout";


const BookingSystem = () => {
  
  const url = "http://localhost:5000";

  const [schedules, setSchedules] = useState([]);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [seats, setSeats] = useState([]); 
  const [availableSeats, setAvailableSeats] = useState(0); 

  useEffect(() => {

    axios
      .get(`${url}/api/schedules`)
      .then((response) => setSchedules(response.data))
      .catch((error) => console.error(error));
  }, []);

  const fetchSeatAvailability = (scheduleId) => {
    axios
      .get(`${url}/api/seats/${scheduleId}`)
      .then((response) => {
        const seatAvailability = response.data;
        setSeats(seatAvailability);
        setAvailableSeats(seatAvailability.filter((seat) => seat).length); 
        localStorage.setItem(
          `seats_${scheduleId}`,
          JSON.stringify(seatAvailability)
        );
      })
      .catch((error) => console.error(error));
  };

  const handleBooking = (scheduleId, seatIndex) => {
    const seatNumber = seatIndex + 1; 
    if (!seats[seatIndex]) {
      alert("This seat is already booked.");
      return;
    }
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to make a booking.");
      return;
    }
    // Make API call to book the seat
    axios
      .post(`${url}/api/bookings`, {
        user_name: "john",
        schedule_id: scheduleId,
        seat_number: seatNumber, // Send seat number to backend
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in Authorization header
        },
      }
    )
      
      .then((response) => {
        setBookingInfo(response.data);
        alert(`Booking successful! Seat number: ${response.data.seat_number}`);

        // Update the seats state and the available seats count
        setSeats((prevSeats) => {
          const updatedSeats = [...prevSeats];
          updatedSeats[seatIndex] = false; // Mark the seat as booked
          return updatedSeats;
        });

        // Decrease available seats
        setAvailableSeats((prev) => prev - 1);

        // Save updated seats to localStorage after state change
        setSeats((prevSeats) => {
          const updatedSeats = [...prevSeats];
          updatedSeats[seatIndex] = false; // Mark seat as booked
          localStorage.setItem(
            `seats_${scheduleId}`,
            JSON.stringify(updatedSeats)
          ); // Save the updated seat info in localStorage
          return updatedSeats; 
        });
      })
      .catch((error) => {
        alert(
          "Booking failed: " + error.response?.data?.error || error.message
        );
      });
  };

  const handleScheduleSelection = (schedule) => {
    setSelectedSchedule(schedule);
    const savedSeats = JSON.parse(localStorage.getItem(`seats_${schedule.id}`));
    if (savedSeats) {
      setSeats(savedSeats);
      setAvailableSeats(savedSeats.filter((seat) => seat).length);
    } else {
      fetchSeatAvailability(schedule.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Bus Booking System
        </h1>
        <div className="flex justify-end">
          <LogoutButton />
        </div>

        <h2 className="text-xl font-medium text-gray-700 mb-4">
          Available Schedules:
        </h2>
        <ul className="space-y-4">
          {schedules.length > 0 ? (
            schedules.map((schedule) => (
              <li
                key={schedule.id}
                className="bg-gray-50 p-4 rounded-md shadow-sm flex justify-between items-center"
              >
                <div className="text-gray-800">
                  <p className="font-semibold text-lg">
                    {schedule.starting_point} to {schedule.destination}
                  </p>
                  <p className="text-sm text-gray-500">
                    {schedule.departure_time} - {schedule.arrival_time}
                  </p>
                </div>
                <button
                  onClick={() => handleScheduleSelection(schedule)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  View Seats
                </button>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-600">No schedules available</p>
          )}
        </ul>

        {selectedSchedule && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Select a Seat
            </h3>
            {availableSeats === 0 ? (
              <p className="text-center text-red-600">Sold Out</p>
            ) : (
              <div className="grid grid-cols-5 gap-4">
                {seats.map((isAvailable, index) => (
                  <button
                    key={index}
                    onClick={() => handleBooking(selectedSchedule.id, index)}
                    disabled={!isAvailable}
                    className={`px-4 py-2 rounded-md ${
                      isAvailable
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-300 cursor-not-allowed"
                    } text-white`}
                  >
                    Seat
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {bookingInfo && (
          <div className="mt-6 bg-blue-50 p-4 rounded-md shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700">
              Booking Confirmation
            </h3>
            <p className="text-gray-600">
              {bookingInfo.user_name} - Seat {bookingInfo.seat_number} on bus{" "}
              {bookingInfo.bus_id} from {bookingInfo.starting_point} to{" "}
              {bookingInfo.destination}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSystem;
