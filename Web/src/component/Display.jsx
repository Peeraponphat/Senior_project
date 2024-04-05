import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MapT from './Display2';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLocation, selectLocation } from '../store/locationSlice';
import { useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function Base() {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 500);
  const [placeInfo, setPlaceInfo] = useState(null);
  const [error, setError] = useState(null);
  const reduxLocation = useSelector(selectLocation)
  const location = useLocation();
  const { index } = location.state || {};
  const [Eatplace, setEatplace] = useState([]);
  const [DatatoMap, setDatatoMap] = useState([]);
  const [loactionIDArea, setLoactionIDArea] = useState(null);
  const Date = reduxLocation.location.state.TripData[index].DayDetail;
  const PlaceProgram = reduxLocation.location.state.TripData[index].PlaceProgram;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : 3, // Show 1 slide on mobile, 3 slides on larger screens
    slidesToScroll: isMobile ? 1 : 3,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const AREA = reduxLocation.location.state.TripData[index].PlaceArea;
        const response = await axios.post('http://'+import.meta.env.VITE_IP+':3000/GoogleMap/textsearch', {
          FetchData: {
            query: AREA.toString(),
            location: "",
            radius: 0,
            type: "",
          }
        });
        const result = response.data.results[0].geometry.location;
        setLoactionIDArea(result);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData(1);
  }, [reduxLocation]);


  useEffect(() => {
    if (reduxLocation.location && reduxLocation.location.state && reduxLocation.location.state.TripData) {
      const placeProgram = reduxLocation.location.state.TripData[index].PlaceProgram;
      const data = {
        placeProgram: placeProgram,
        locationIDArea: loactionIDArea
      };
      setDatatoMap(data);
    }
  }, [loactionIDArea, index]);

  //renderStar
  function renderRatingStars(rating) {
    const starCount = Math.round(rating);
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < starCount) {
        stars.push(<span key={i} className="text-yellow-400">&#9733;</span>); // Render a filled star
      } else {
        stars.push(<span key={i} className="text-gray-300">&#9733;</span>); // Render an empty star
      }
    }

    return stars;
  }
  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180); // Difference in latitude in radians
    const dLon = (lon2 - lon1) * (Math.PI / 180); // Difference in longitude in radians
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }



  //Find Restaurant
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sortedPlaces = []; // Initialize an array to store sorted places

        await Promise.all(PlaceProgram.map(async (place, index) => {
          const response = await axios.post('http://'+import.meta.env.VITE_IP+':3000/GoogleMap/nearbysearch', {
            location: place.LocationID
          });

          // Get the filtered results
          const filteredResults = response.data.results.filter(place => {
            return place.user_ratings_total > 100 && place.rating > 3.5; // Example filtering criteria
          });

          // Calculate distances for each restaurant
          const placesWithDistance = filteredResults.map(restaurant => {
            const distance = haversine(place.LocationID.lat, place.LocationID.lng, restaurant.geometry.location.lat, restaurant.geometry.location.lng);
            return { ...restaurant, distance };
          });

          // Sort places by distance
          const sortedPlacesForCurrentLocation = placesWithDistance.sort((a, b) => a.distance - b.distance);

          // Add sorted results to the array
          sortedPlaces.push({ tag: `place ${index + 1}`, places: sortedPlacesForCurrentLocation });
        }));

        if (sortedPlaces.length > 0) {
          setEatplace(sortedPlaces); // Set the state with sorted results
        } else {
          // Handle case where sortedPlaces is empty
          setError("No restaurants found.");
        }
      } catch (err) {
        setError(err.message); // Handle errors
      }
    };

    fetchData(1);
  }, [PlaceProgram]);


  function getPriceLevelText(priceLevel) {
    switch (priceLevel) {
      case 0:
        return 'Free';
      case 1:
        return '$';
      case 2:
        return '$$';
      case 3:
        return '$$$';
      case 4:
        return '$$$$';
      default:
        return '-';
    }
  }



  //Find PlaceProgram
  useEffect(() => {
    const fetchData = async () => {
      try {
        const placeInfoArray = [];

        for (const place of PlaceProgram) {
          const response = await axios.post('http://'+import.meta.env.VITE_IP+':3000/GoogleMap/textsearch', {
            FetchData: {
              query: place.PlaceName,
              location: place.LocationID,
              radius: 5000,
              type: place.Type,
            },
          });

          const result = response.data.results[0];

          const rating = result && result.rating ? result.rating : null;
          const ratings_total = result && result.user_ratings_total ? result.user_ratings_total : null;
          const opening_hours = result && result.opening_hours?.open_now !== undefined ? result.opening_hours.open_now : null;
          const place_type = result && result.types ? result.types : null;
          const price_level = result && result.price_level ? result.price_level : null;
          const formatted_address = result && result.formatted_address ? result.formatted_address : null;

          const placeInfo = {
            data: result,
            rating: rating,
            user_ratings_total: ratings_total,
            opening_hours: opening_hours,
            place_type: place_type,
            price_level: price_level,
            formatted_address: formatted_address,
          };

          placeInfoArray.push(placeInfo);
        }

        setPlaceInfo(placeInfoArray); // Set placeInfoArray as the state for placeInfo
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData(1);
  }, [PlaceProgram], [index]);

  // Update PlaceProgram in reduxLocation and dispatch to Redux
  const updatePlaceProgram = (updatedProgram) => {
    const updatedLocation = {
      ...reduxLocation,
      state: {
        ...reduxLocation.location.state,
        TripData: reduxLocation.location.state.TripData.map((trip, i) => {
          if (i === index) {
            return {
              ...trip,
              PlaceProgram: updatedProgram,
            };
          }
          return trip;
        }),
      },
    };
    dispatch(setLocation(updatedLocation));
  };

  // Move item up in PlaceProgram array
  const moveItemUp = (index) => {
    const updatedProgram = [...PlaceProgram];
    if (index > 0) {
      const temp = updatedProgram[index];
      updatedProgram[index] = updatedProgram[index - 1];
      updatedProgram[index - 1] = temp;
      updatePlaceProgram(updatedProgram);
    }
  };

  // Move item down in PlaceProgram array
  const moveItemDown = (index) => {
    const updatedProgram = [...PlaceProgram];
    if (index < updatedProgram.length - 1) {
      const temp = updatedProgram[index];
      updatedProgram[index] = updatedProgram[index + 1];
      updatedProgram[index + 1] = temp;
      updatePlaceProgram(updatedProgram);
    }
  };
  return (

    <div className="relative flex flex-col lg:flex-row">
      <div className="lg:w-3/5 md:w-3/5 sm:w-full">
        <nav className="container w-full mx-auto flex flex-col">
          <div className="px-5 xl:px-12 py-6 flex w-full items-center justify-between">
            <div className="flex items-center space-x-5">
              <Link to="/Show" className="flex items-center hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <a className="text-3xl font-bold font-heading" href="#">
                Itchyfeet
              </a>
            </div>
            <ul className="hidden md:flex px-4 font-semibold font-heading space-x-12">
              <li><a>{Date}</a></li>
            </ul>
          </div>
        </nav>

        {error && <p>Error: {error}</p>}
        {placeInfo && placeInfo.map((place, index) => (
          <div key={index} className="container mx-auto flex flex-col mb-8 bg-blue-50 rounded-lg border border-gray-300 border-blue-500">

            <div className="inline-flex flex gap-1 justify-end">
              <button
                className="py-1.5 px-3 hover:text-green-600 hover:scale-105 hover:shadow text-center border border-gray-300 rounded-md border-gray-400 h-8 text-sm flex items-center gap-1 lg:gap-2"
                onClick={() => moveItemUp(index)} // Move up
              >
                <i className="fas fa-angle-up"></i>
              </button>
              <button
                className="py-1.5 px-3 hover:text-red-600 hover:scale-105 hover:shadow text-center border border-gray-300 rounded-md border-gray-400 h-8 text-sm flex items-center gap-1 lg:gap-2"
                onClick={() => moveItemDown(index)} // Move down
              >
                <i className="fas fa-angle-down"></i>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row overflow-hidden bg-white rounded-lg shadow-xl mt-4 mx-2">
              <div className="h-62 w-full sm:w-1/2 mb-4 sm:mb-0">
                {place.data && place.data.photos && place.data.photos[0] ? (
                  <img
                    className="h-full w-full object-cover object-center transition-transform duration-500 transform hover:scale-110"
                    style={{ maxHeight: '250px' }}
                    src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=${place.data.photos[0].photo_reference}&key=${import.meta.env.VITE_KEY_GOOGLE}`}
                    alt=""
                  />
                ) : (
                  <img
                    className="h-full w-full object-cover object-center transition-transform duration-500 transform hover:scale-110"
                    style={{ maxHeight: '250px' }}
                    src="https://hspicturesstudio.com/img/no_image.png"
                    alt=""
                  />
                )}
              </div>

              <div className="w-full py-4 px-6 text-gray-800 flex flex-col justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    {place.data && <p className="font-semibold text-lg leading-tight truncate">{place.data.name}</p>}
                    <p className="mt-2">Rating: {renderRatingStars(place.rating)}</p>
                    <p className="mt-2">User ratings total: {place.user_ratings_total}</p>
                  </div>
                  <div>
                    <p className="mt-2">Open status: {place.opening_hours !== null ? (place.opening_hours ? 'Open' : 'Closed') : 'unknown'}</p>
                    <p className="mt-2">Type: {place.place_type ? place.place_type.join(', ') : 'Unknown'}</p>
                    <p className="mt-2">Price level: {getPriceLevelText(place.price_level)}</p>
                    <p className="mt-2">Address: {(place.formatted_address)}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 m-5 mb-10">
              {error && <p>Error: {error}</p>}
              {Eatplace[index] && Eatplace[index].places && (Eatplace[index].places.length === 1 || Eatplace[index].places.length === 2) ? (
                Eatplace[index].places.map((place, idx) => (
                  <div key={`${place.place_id}-${idx}`} className="flex flex-roww-full lg:max-w-full lg:flex ">
                    <div className=" h-48 lg:h-48 lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden" style={{ backgroundImage: `url(https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos && place.photos.length > 0 ? place.photos[0].photo_reference : ''}&key=${import.meta.env.VITE_KEY_GOOGLE})` }} title={place.name}></div>
                    <div className="w-full border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                      <div className="mb-8 flex flex-row">
                        <div className="basis-1/3">
                          <div className="text-gray-900 font-bold text-xl mb-2 ">{place.name}</div>
                          <p className="text-gray-900 leading-none mt-5">{renderRatingStars(place.rating)}</p>
                          <p className="text-gray-700 text-base">User ratings total: {place.user_ratings_total}</p>
                          <p className="text-gray-700 text-base">Status: {place.opening_hours && place.opening_hours.open_now ? "Open" : "closed"}</p>
                        </div>
                        <div className="basis-1/3">
                        </div>
                        <div className="basis-1/3">
                          <a href={`https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat},${place.geometry.location.lng}`} target="_blank">
                            <i className="fas fa-map-marker-alt mr-2 mt-10"></i> View on Google Maps
                          </a>

                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <Slider {...carouselSettings} className="w-full">
                  {Eatplace[index]?.places?.map((restaurant, index) => (
                    <div key={`${restaurant.place_id}-${index}`} className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
                      <div className="mx-auto">
                        {/* Render details for each restaurant */}
                        {restaurant.photos && restaurant.photos.length > 0 && (
                          <div className="h-[120px] sm:h-[150px] md:h-[180px]" style={{ backgroundImage: `url(https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${restaurant.photos[0].photo_reference}&key=${import.meta.env.VITE_KEY_GOOGLE})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                          </div>
                        )}
                        <div className="p-4 sm:p-6">
                          <p className="text-gray-700 text-sm sm:text-base leading-7 mb-1 overflow-ellipsis">{restaurant.name}</p>
                          <div className="flex flex-row">
                            <p className="text-[#3C3C4399] text-base sm:text-lg mr-2">{renderRatingStars(restaurant.rating)}</p>
                            <span className="text-[#3C3C4399] text-base sm:text-lg">{getPriceLevelText(restaurant.price_level)}</span>
                          </div>
                          <a target="_blank" href={`https://www.google.com/maps/place/?q=place_id:${restaurant.place_id}`} className="block mt-6 w-full px-4 py-3 font-medium tracking-wide text-center capitalize transition-colors duration-300 transform bg-[#FFC933] rounded-[14px] hover:bg-[#FFC933DD] focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-80">
                            View on Google Maps
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              )}
            </div>
          </div>
        ))}




      </div>
      <div className="lg:w-2/5 md:w-2/5 sm:w-full">
        <MapT locationIDs={DatatoMap} />
      </div>
    </div>
  );
}

export default Base;
