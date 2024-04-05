import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
function History() {
  const IP = import.meta.env.VITE_IP;
  const [photoReferences, setPhotoReferences] = useState([]);
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [trips, setTrips] = useState([]);
  const navigator = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the token from cookies
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          .split("=")[1];

        // Make a GET request to the backend API with the token in the Authorization header
        const response = await axios.get("http://"+IP+":3001/getUsers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set the user data received from the response
        setUsers(response.data);
      } catch (error) {
        // Handle errors here
        setError(error);
        console.error("Error fetching data:", error);
      }
    };

    fetchData(1); // Fetch user data when component mounts
  }, []); // Empty dependency array ensures the effect runs only once after the initial render

  useEffect(() => {
    const fetchPlans = async () => {
      if (!users) return; // If users data is not available yet, return
      try {
        const clientId = users._id;
        const response = await axios.get(`http://${IP}:3001/find/plan/${clientId}`);
        if (response.data.length === 0) {
          // If no plans are available, don't update the state
          return;
        }
        setTrips(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          return;
        } else {
          return;
        }
      }
    };


    const delay = 5 * 60 * 1000; // 5 minutes in milliseconds

    const fetchPlansWithDelay = async () => {
      await fetchPlans(); // Fetch plans immediately
      const timeoutId = setTimeout(fetchPlans, delay); // Execute fetchPlans again after 5 minutes
      return () => clearTimeout(timeoutId); // Cleanup function to clear timeout
    };

    fetchPlansWithDelay();

  }, [users]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const references = [];

        for (const trip of trips) {
          const area = trip.Plan.TripData[0].PlaceProgram[0].PlaceName;

          // Make a POST request to Google Maps API for each trip
          const response = await axios.post('http://'+IP+':3000/GoogleMap/textsearch', {
            FetchData: {
              query: area,
              location: "",
              radius: 0,
              type: "",
            }
          });

          // Extract photo reference from the response and push it to references array
          references.push(response.data.results[0].photos[0].photo_reference);
        }
        // After fetching data for all trips, set the photo references
        setPhotoReferences(references);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData(1);
  }, [trips]);

  const handleSubmit = async (index) => {
    const selectedTrip = trips[index].Plan;
    navigator('/Show', { state: selectedTrip });
  };

  const handleDelete = async (index) => {
    try {
      const delTrip = trips[index]._id;
      const response = await axios.get(`http://${IP}:3001/delete/plan/${users._id}/${delTrip}`);
      setTrips(trips.filter((trip, i) => i !== index));
    } catch (error) {
      setError(error);
      console.error("Error deleting plan:", error);
    }
  };

  return (
    <>
      <style>{`
        /* Font */
        @import url('https://fonts.googleapis.com/css?family=Quicksand:400,700');

        /* Design */
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        html {
          background-color: #ecf9ff;
        }

        #main {
          max-width: 1200px;
          margin: 0 auto;
          padding-top:8%;
        }

        h1 {
          font-size: 24px;
          font-weight: 400;
          text-align: center;
        }

        img {
          height: auto;
          max-width: 100%;
          vertical-align: middle;
        }
      
      
        .btn {
          color: #ffffff;
          padding: 0.8rem;
          font-size: 14px;
          text-transform: uppercase;
          border-radius: 4px;
          font-weight: 400;
          display: block;
          width: 100%;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: transparent;
        }

        .btn:hover {
          background-color: rgba(255, 255, 255, 0.12);
        }

        #cards {
          display: flex;
          flex-wrap: wrap;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        #cards_item {
          display: flex;
          padding: 1rem;
        }

        @media (min-width: 40rem) {
          #cards_item {
            width: 50%;
          }
        }

        @media (min-width: 56rem) {
          #cards_item {
            width: 33.3333%;
          }
        }

        #card {
          background-color: white;
          border-radius: 0.25rem;
          box-shadow: 0 20px 40px -14px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        #card_content {
          padding: 1rem;
          background: #6495ED;
        }

        #card_title {
          color: #ffffff;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: capitalize;
          margin: 0px;
        }

        #card_text {
          color: #ffffff;
          font-size: 0.875rem;
          line-height: 1.5;
          margin-bottom: 1.25rem;    
          font-weight: 400;
        }

        #made_by {
          font-weight: 400;
          font-size: 13px;
          margin-top: 35px;
          text-align: center;
        } 
      `}</style>
      <div className="h-screen">
        <div id="main">
          <ul id="cards">
            {Array.isArray(trips) && trips.map((trip, index) => (
              <li key={index} id="cards_item" >
                <div id="card" className="shadow-xl" style={{ position: 'relative' }}>
                  <div id="card_image">
                    {photoReferences[index] ? (
                      <img
                        src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&maxheight=600&photoreference=${photoReferences[index]}&key=${import.meta.env.VITE_KEY_GOOGLE}`}
                        alt={`Image ${index}`}
                        style={{ width: "500px", height: "300px" }}
                        onLoad={() => console.log(`Image ${index} loaded successfully`)}
                      />
                    ) : (
                      <div style={{ width: "500px", height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <div className="flex flex-row gap-2">
                          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
                          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
                          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div id="card_content" >
                    <h2 id="card_title" >{trip.Plan.TripData[0].PlaceArea}</h2>
                    <p id="card_text">Date: {trip.Plan.TripData[0].DayDetail} - {trip.Plan.TripData[trip.Plan.TripData.length - 1].DayDetail}</p>
                    <button className="btn" id="card_btn" onClick={() => handleSubmit(index)}>
                      View your trip
                    </button>
                    <button type="button" onClick={() => handleDelete(index)} className="absolute top-2 right-0  inline-flex items-center justify-center p-0.5 mb-1 me-1 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                      <span className="relative px-2 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        X
                      </span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default History;
