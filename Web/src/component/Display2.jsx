import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';

function MapT(locationIDs) {
    const [dataMaploader, setdataMaploader] = useState(locationIDs);

    useEffect(() => {
        setdataMaploader(locationIDs);
    }, [locationIDs]);


    const [data, setdata] = useState(null);
    useEffect(() => {
        setdata(dataMaploader);
    }, [dataMaploader]);

    mapboxgl.accessToken = import.meta.env.VITE_KEY_MAPBOX;

    // Load state from local storage or set initial state
    const [centerLat, setCenterLat] = useState([""]);
    const [centerLng, setCenterLng] = useState("");
    const [responsesArray, setResponsesArray] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [hasFetched, setHasFetched] = useState(false);
    const [locationAll, setLocationAll] = useState([]);
    const [directionType, setDirectionType] = useState('driving');
    const [distance, setdistance] = useState([]);
    const [placeNames, setPlaceNames] = useState([]);


    useEffect(() => {
        const getUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                }, (error) => {
                    console.error('Error getting user location:', error);
                });
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        };
        getUserLocation(1);
    }, []);


    useEffect(() => {
        if (data && data.locationIDs && data.locationIDs.locationIDArea) {
            const { lat, lng } = data.locationIDs.locationIDArea;
            setCenterLat(lat.toString());
            setCenterLng(lng.toString());
        }
    }, [data]);


    useEffect(() => {
        const fetchPlaceData = async () => {
            try {
                const promises = data.locationIDs.placeProgram.map(async (place) => {
                    try {
                        const response = await axios.post('http://' + import.meta.env.VITE_IP + ':3000/GoogleMap/textsearch', {
                            FetchData: {
                                query: place.PlaceName.toString(),
                                location: place.LocationID.toString(),
                                radius: 5000,
                                type: place.Type.toString(),
                            }
                        });
                        return response;
                    } catch (error) {
                        console.error(error);
                        return {}; // Return an empty object for failed requests
                    }
                });

                const responses = await Promise.all(promises);
                setResponsesArray(responses);
                setHasFetched(true); // Set the state to indicate that data has been fetched
            } catch (error) {
                return;
            }
        };
        fetchPlaceData();
    }, [data]);



    useEffect(() => {
        if (responsesArray.length > 0) {
            const mappedLocations = responsesArray.map(response => {
                if (response.data && response.data.results && response.data.results.length > 0) {
                    const result = response.data.results[0];
                    const lat = result.geometry.location.lat;
                    const lng = result.geometry.location.lng;
                    return [lng, lat];
                } else {
                    return null;
                }
            }).filter(location => location !== null);
            if (userLocation) {
                const userMappedLocation = [userLocation.lng, userLocation.lat];
                mappedLocations.unshift(userMappedLocation);
            }
            setLocationAll(mappedLocations);
        }
    }, [responsesArray, userLocation]);






    //getplaceNameFrom Geolocation
    async function getPlaceName(latitude, longitude) {
        const reverseGeocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`;
        const response = await fetch(reverseGeocodeUrl);
        const data = await response.json();
        const placeName = data.features[0].place_name;
        return placeName;
    }




    useEffect(() => {
        const centerLongitude = (centerLng); // Convert to float
        const centerLatitude = (centerLat); // Convert to float
        const mapContainer = document.getElementById('mapContainer');

        const map = new mapboxgl.Map({
            container: mapContainer,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [centerLongitude, centerLatitude],
            zoom: 8,
        });

        if (locationAll.length > 0 && userLocation && placeNames && map) {
            // Generate route based on sorted locations
            const waypoints = locationAll.map(item => `${item[0]},${item[1]}`).join(';');
            const directionsRequest = `https://api.mapbox.com/directions/v5/mapbox/${directionType}/${waypoints}?alternatives=true&geometries=polyline&access_token=${mapboxgl.accessToken}`;
            fetch(directionsRequest)
                .then(async response => {
                    const data = await response.json();
                    const distances = data.routes[0].legs.map(leg => {
                        return {
                            distance: leg.distance,
                            summary: leg.summary,
                            duration: leg.duration
                        };
                    });
                    setdistance(distances);

                    map.addSource('route', {
                        type: 'geojson', // Use 'geojson' as the source type
                        data: {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                                type: 'LineString',
                                coordinates: decodePolyline(data.routes[0].geometry),
                            },
                        },
                    });

                    map.addLayer({
                        id: 'route',
                        type: 'line', // Use 'line' as the layer type
                        source: 'route',
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round',
                        },
                        paint: {
                            'line-color': '#3887be',
                            'line-width': 5,
                            'line-opacity': 0.75,
                        },
                    });



                    const placeNamePromises = locationAll.map(location => {
                        const [longitude, latitude] = location;
                        return getPlaceName(latitude, longitude);
                    });





                    // Loop through locationAll to add markers and tooltips
                    Promise.all(placeNamePromises)
                        .then(placeNames => {
                            // Loop through locationAll to add markers and tooltips
                            locationAll.forEach((location, index) => {
                                const markerElement = document.createElement('div');
                                markerElement.className = 'marker'; // Apply marker styling

                                // Set different icons for the first marker (user's location) and others
                                if (index === 0) {
                                    markerElement.innerHTML = '<i class="fas fa-map-marker-alt fa-2x" style="color: #FF5733;"></i>'; // Font Awesome map marker icon for user's location with increased size and red color
                                } else {
                                    markerElement.innerHTML = `<i class="fas fa-map-marker-alt fa-2x" style="color: #3387FF;"></i>`; // Font Awesome map marker icon for other locations with increased size and blue color
                                }
                                // Add a mouseenter event listener to show the popup when hovered over
                                markerElement.addEventListener('mouseenter', () => {
                                    new mapboxgl.Popup()
                                        .setLngLat(location)
                                        .setHTML(index === 0 ? `Your Current Location` : `${distances[index - 1].summary}<br>${placeNames[index]}`) // Set summary text and place name
                                        .addTo(map);
                                });

                                // Add a mouseleave event listener to remove the popup when mouse leaves
                                markerElement.addEventListener('mouseleave', () => {
                                    document.querySelector('.mapboxgl-popup').remove(); // Remove the popup element
                                });

                                // Add the marker to the map
                                new mapboxgl.Marker(markerElement)
                                    .setLngLat(location)
                                    .addTo(map);
                            });
                        })
                        .catch(error => {
                            return;
                        });
                })
                .catch(error => {
                    return;
                });
        }

        return () => {
            if (map) {
                map.remove();
            }
        };
    }, [locationAll, directionType]);






    //decodePolyline
    function decodePolyline(encoded) {
        // array that holds the points
        var points = [];
        var index = 0, len = encoded.length;
        var lat = 0, lng = 0;

        while (index < len) {
            var b, shift = 0, result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            var dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            var dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
            lng += dlng;

            points.push([lng / 1e5, lat / 1e5]);
        }
        return points;
    }

    return (
        <>

            <div className=" items-center relative transition-all duration-[450ms] ease-in-out w-full " style={{ position: 'sticky', top: 0 }}>
                <article className=" border-gray-700 ease-in-out duration-500 left-0 inline-block shadow-lg shadow-black/15 bg-white flex flex-row">
                    <label
                        htmlFor="driving"
                        className="has-[:checked]:shadow-lg relative w-full h-16 p-4 ease-in-out duration-300 border-solid border-black/10 has-[:checked]:border group flex flex-row gap-3 items-center justify-center text-black rounded-xl"
                    >
                        <input
                            className="hidden peer/expand"
                            type="radio"
                            name="path"
                            id="driving"
                            onClick={() => setDirectionType('driving')}
                        />
                        <div
                            className="peer-hover/expand:scale-125 peer-hover/expand:text-blue-400 peer-hover/expand:fill-blue-400 peer-checked/expand:text-blue-400 peer-checked/expand:fill-blue-400 text-2xl peer-checked/expand:scale-125 ease-in-out duration-300"

                        >
                            <i className="fas fa-car-side"></i>
                        </div>
                    </label>
                    <label
                        htmlFor="walking"
                        className="has-[:checked]:shadow-lg relative w-full h-16 p-4 ease-in-out duration-300 border-solid border-black/10 has-[:checked]:border group flex flex-row gap-3 items-center justify-center text-black rounded-xl"
                    >
                        <input className="hidden peer/expand" type="radio" name="path" id="walking" onClick={() => setDirectionType('walking')} />
                        <div
                            className="peer-hover/expand:scale-125 peer-hover/expand:text-blue-400 peer-hover/expand:fill-blue-400 peer-checked/expand:text-blue-400 peer-checked/expand:fill-blue-400 text-2xl peer-checked/expand:scale-125 ease-in-out duration-300"

                        >
                            <i className="fas fa-walking"></i>
                        </div>
                    </label>
                    <label
                        htmlFor="cycling"
                        className="has-[:checked]:shadow-lg relative w-full h-16 p-4 ease-in-out duration-300 border-solid border-black/10 has-[:checked]:border group flex flex-row gap-3 items-center justify-center text-black rounded-xl"
                    >
                        <input
                            className="hidden peer/expand"
                            type="radio"
                            name="path"
                            id="cycling"
                            onClick={() => setDirectionType('cycling')}
                        />
                        <div
                            className="peer-hover/expand:scale-125 peer-hover/expand:text-blue-400 peer-hover/expand:fill-blue-400 peer-checked/expand:text-blue-400 peer-checked/expand:fill-blue-400 text-2xl peer-checked/expand:scale-125 ease-in-out duration-300"

                        >
                            <i className="fas fa-bicycle"></i>
                        </div>
                    </label>


                </article>
                <div id="mapContainer" style={{ width: '100%', height: '75vh' }}></div>
                <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex flex-col gap-4">
                        {distance.map((distanceItem, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className={`w-12 h-12 flex items-center justify-center text-white text-xl bg-indigo-400 sm:w-16 sm:h-16 ${window.innerWidth < 500 && 'hidden'}`}>
                                    {index + 1}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">{distanceItem.summary}</span>
                                    <p className="text-xs text-gray-500">Distance: {(distanceItem.distance / 1000).toFixed(2)} km</p>
                                    <p className="text-xs text-gray-500">Duration: {parseFloat((distanceItem.duration / 3600).toFixed(2))} hours</p>
                                </div>
                            </div>
                        ))}




                    </div>
                </div>




            </div>
        </>
    );
}

export default MapT;
