import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setLocation, selectLocation } from '../store/locationSlice';
import { motion, useAnimation } from 'framer-motion';
import styles from '../css/styles.module.css';

const Card = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (location && location.state !== null) {
            localStorage.setItem('location', JSON.stringify(location));
            dispatch(setLocation(location));
        }
    }, [location, dispatch]);

    const reduxLocation = useSelector(selectLocation);
    const Dataload = reduxLocation?.location?.state;// Using optional chaining to handle null values

    const [backgroundImage, setBackgroundImage] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [responsesArray, setResponsesArray] = useState([]);
    const [hasFetched, setHasFetched] = useState(false);
    const [placeInfo, setPlaceInfo] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedDayImage, setSelectedDayImage] = useState(null);
    const [selectedDayRate, setSelectedDayRate] = useState(null);
    const [selectedDayPeople, setSelectedDayPeople] = useState(null);
    const [selectedcomment, setSelectedComment] = useState(null);

    const controls = useAnimation();
    const [users, setUsers] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Retrieve the token from cookies
                const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

                // Make a GET request to the backend API with the token in the Authorization header
                const response = await axios.get('http://'+import.meta.env.VITE_IP+':3001/getUsers', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Set the user data received from the response
                setUsers(response.data);

            } catch (error) {
                navigate('/error-page');
                console.error("Error fetching data:", error);
            }
        };

        // Call the fetchData function when the component mounts
        fetchData(1);
    }, []);



    const savePlan = async () => {
        try {
            await axios.post('http://' + import.meta.env.VITE_IP + ':3001/save/plan', {
                planData: Dataload,
                clientId: users._id,
            },);
            navigate('/myTrip');
        } catch (error) {
            console.error("Error saving plan:", error);
        }
    };


    useEffect(() => {
        if (Dataload) {
            const searchData = Dataload.TripData.map(dayData => ({
                placeName: dayData.PlaceProgram[0].PlaceName,
                position: dayData.PlaceProgram[0].LocationID,
                type: dayData.PlaceProgram[0].Type,
            }));
            setSearchData(searchData);
        }
    }, [Dataload]);


    useEffect(() => {
        const fetchDataWithDelay = async () => {
            try {
                if (Dataload && Dataload.TripData && Dataload.TripData.length > 0) {
                    const place = Dataload.TripData[0].PlaceArea;
                    const response = await axios.post('http://' + import.meta.env.VITE_IP + ':3000/GoogleMap/textsearch', {
                        FetchData: {
                            query: place.toString(),
                            location: '',
                            radius: 0,
                            type: '',
                        }
                    });
                    const result = response.data.results[0];
                    setPlaceInfo({ data: result });
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchDataWithDelay(1);
    }, [Dataload]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const place = Dataload.TripData[0].PlaceArea;
                const response = await axios.get('https://api.unsplash.com/search/photos', {
                    params: {
                        query: place.split(',')[0].toString(),
                        per_page: 1,
                        client_id: import.meta.env.VITE_KEY_UNSPLASH, // Replace with your Unsplash API access key
                    },
                    withCredentials: false,
                });
                if (response.data.results.length > 0) {
                    setBackgroundImage(response.data.results[0].urls.regular);
                    setLoading(false); // Set loading to false in case of error
                }
            } catch (error) {
                console.error('Error fetching images:', error);
                setLoading(true);
            }
        };
        fetchData(1)
    }, [Dataload]);

    useEffect(() => {
        const fetchPlaceData = async () => {
            try {
                if (!searchData.length || hasFetched) return;

                const promises = searchData.map(async (searchDataItem) => {
                    try {
                        const response = await axios.post('http://' + import.meta.env.VITE_IP + ':3000/GoogleMap/textsearch', {
                            FetchData: {
                                query: searchDataItem.placeName.toString(),
                                location: searchDataItem.position.toString(),
                                radius: 5000,
                                type: searchDataItem.type.toString(),
                            }
                        });
                        return response.data;
                    } catch (error) {
                        console.error(error);
                        window.location.reload();
                    }
                });

                const responses = await Promise.all(promises);
                setResponsesArray(responses);
                setHasFetched(true);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPlaceData(1);
    }, [searchData, hasFetched]);

    useEffect(() => {
        // Ensure responsesArray is not empty and contains results
        if (responsesArray && responsesArray.length > 0 && responsesArray[0].results && responsesArray[0].results.length > 0) {
            const firstResult = responsesArray[0].results[0];

            if (firstResult.photos && firstResult.photos.length > 0) {
                setSelectedDayImage(firstResult.photos[0].photo_reference);
            } else {
                setSelectedDayImage(null); // Set default value if photos array is empty
            }

            setSelectedDayRate(firstResult.rating || null); // Set selectedDayRate
            setSelectedDayPeople(firstResult.user_ratings_total || null); // Set selectedDayPeople
            setSelectedDay(firstResult); // Set selectedDay to firstResult
        } else {
            setSelectedDay(null); // Reset selectedDay if responsesArray is null or empty
            setSelectedDayImage(null);
            setSelectedDayRate(null);
            setSelectedDayPeople(null);
        }
    }, [responsesArray]);




    const handleViewDetail = (index) => {
        navigate('/Display', { state: { index } });
    };





    const toggleTimeline = async (dayNum, index) => {
        controls.start({ x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.5 } });

        setSelectedDay((prevDay) => (prevDay === dayNum ? null : dayNum));
        if (
            responsesArray[index] &&
            responsesArray[index].results &&
            responsesArray[index].results[0] &&
            responsesArray[index].results[0].photos &&
            responsesArray[index].results[0].photos[0]?.photo_reference
        ) {
            const photoReference = responsesArray[index].results[0].photos[0].photo_reference;
            setSelectedDayImage(photoReference);
        } else {
            setSelectedDayImage(null);
        }
        if (
            responsesArray[index] &&
            responsesArray[index].results &&
            responsesArray[index].results[0] &&
            responsesArray[index].results[0].rating
        ) {
            const Rating = responsesArray[index].results[0].rating;
            setSelectedDayRate(Rating);
        } else {
            setSelectedDayRate(null);
        }
        if (
            responsesArray[index] &&
            responsesArray[index].results &&
            responsesArray[index].results[0] &&
            responsesArray[index].results[0].user_ratings_total
        ) {
            const People = responsesArray[index].results[0].user_ratings_total;
            setSelectedDayPeople(People);
        } else {
            setSelectedDayPeople(null);
        }
        if (
            responsesArray[index] &&
            responsesArray[index].results &&
            responsesArray[index].results[0] &&
            responsesArray[index].results[0].place_id
        ) {
            const placeId = responsesArray[index].results[0].place_id;

            try {
                const apiUrl = `http://` + import.meta.env.VITE_IP + `:3000/GoogleMap/getPlaceDetails?placeId=${placeId}`;
                const response = await fetch(apiUrl);
                const reviews = await response.json();

                setSelectedComment(reviews);
                controls.start({ x: 0 });
            } catch (error) {
                console.log(error)
            }
        }
    };

    const renderStarRating = (rating) => {
        const roundedRating = Math.round(rating * 2) / 2; // Round to the nearest half
        const starCount = Math.floor(roundedRating);
        const hasHalfStar = roundedRating % 1 !== 0;

        const stars = [];

        for (let i = 0; i < starCount; i++) {
            stars.push(<i key={i} className="fas fa-star text-yellow-500"></i>);
        }

        if (hasHalfStar) {
            stars.push(<i key="half" className="fas fa-star-half-alt text-yellow-500"></i>);
        }

        return <div>{stars}</div>;
    };



    return (
        <>
            <div className="mt-50 w-full">
                {loading ? (
                    <div><div className="flex flex-row gap-2">
                        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
                        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
                        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
                    </div></div> // Or any loading indicator you want to show
                ) : (
                    <>
                        {placeInfo?.data && placeInfo.data.photos && placeInfo.data.photos[0] && (
                            <section
                                className="relative flex items-center justify-center bg-cover bg-center bg-no-repeat w-full h-[50vh]"
                                style={{
                                    backgroundImage: `url('${backgroundImage}')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    position: 'relative'
                                }}
                            >
                                <div className='absolute top-4 left-4 p-2 rounded-full'>
                                    <Link className={styles['close-button']} to="/myTrip">
                                        Back
                                    </Link>
                                </div>
                                <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8 text-center">
                                    <div className="max-w-xl text-center mx-auto">
                                        <h1 className="text-3xl font-extrabold sm:text-5xl text-white">
                                            <strong className="block">
                                                {Dataload && (
                                                    <>
                                                        {Dataload.TripData[0].PlaceArea.split(',').slice(0)[0].trim()}{' '}
                                                    </>
                                                )}
                                            </strong>
                                        </h1>
                                        <p className="mt-4 max-w-lg mx-auto text-white sm:text-2xl">
                                            {Dataload && Dataload.TripData[0].DayDetail}--
                                            {Dataload && Dataload.TripData[Dataload.TripData.length - 1].DayDetail}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>

            <div className="self-center mt-0 w-full max-w-full max-md:mt-10 max-md:max-w-full z-10 bg-teal-50">
                <div
                    className="flex gap-5 max-md:flex-col max-md:gap-0 max-md:"
                >
                    <div className="flex flex-col w-[62%] max-md:ml-0 max-md:w-full">
                        <div className="flex flex-col grow px-5 text-2xl text-gray-500 max-md:mt-10 max-md:max-w-full">
                            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 w-full">
                                {Dataload && Dataload.TripData && Dataload.TripData.map((dayData, index) => (
                                    <article
                                        key={index}
                                        className="rounded-xl border-2 border-gray-100 bg-white cursor-pointer mb-5"
                                        onClick={() => toggleTimeline(dayData.DayNum, index)}
                                    >

                                        <div className="flex items-start gap-4 p-4 sm:p-6 lg:p-8">

                                            <div>
                                                <h3 className="font-medium text-left text-4xl">
                                                    <a className="hover:underline">
                                                        DAY-{dayData.DayNum}
                                                    </a>
                                                </h3>

                                                {dayData.DayDetail && (
                                                    <p className="line-clamp-2 text-xl text-gray-700">
                                                        {(() => {
                                                            const dateParts = dayData.DayDetail.split("/");
                                                            const formattedDate = new Date(
                                                                `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
                                                            ).toLocaleDateString("en-US", {
                                                                weekday: "long",
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                            });
                                                            return formattedDate;
                                                        })()}
                                                    </p>
                                                )}

                                                <div className="mt-2 sm:flex sm:items-center sm:gap-2">

                                                    <div className="flex items-center gap-1 text-gray-500"></div>
                                                </div>
                                            </div>
                                        </div>
                                        {selectedDay === dayData.DayNum && (
                                            <div className="flex-1 bg-white rounded-lg shadow-xl mt-0 p-8">
                                                <h4 className="text-xl text-gray-900 font-bold text-left text-xl">
                                                    Activity log
                                                </h4>
                                                <div className="relative px-4">

                                                    <div className="absolute h-full border border-dashed border-opacity-20 border-secondary"></div>

                                                    {/* Fetch and render PlaceProgram */}
                                                    {dayData.PlaceProgram.map((place, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center w-full my-6 -ml-1.5"
                                                        >
                                                            <div className="w-1/12 z-10">
                                                                <div className="w-3.5 h-3.5 bg-blue-600 rounded-full"></div>
                                                            </div>
                                                            <div className="w-11/12 text-left">
                                                                <div className="text-lg">
                                                                    <p className="text-zinc-950 flex-1">
                                                                        {place.PlaceName}
                                                                    </p>
                                                                    <p className="text-zinc-950">
                                                                        {place.Activity}
                                                                    </p>
                                                                </div>
                                                                <p className="text-lg text-gray-500">
                                                                    {place.PlaceDescription}
                                                                </p>
                                                            </div>

                                                        </div>

                                                    ))
                                                    }

                                                    <button
                                                        className="group flex items-center justify-start w-11 h-11 bg-orange-500 cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-none active:translate-x-1 active:translate-y-1"
                                                        onClick={() => handleViewDetail(index)}
                                                        style={{ position: 'absolute', right: -33 }}
                                                    >
                                                        <div
                                                            className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3"
                                                        >
                                                            <svg className="w-4 h-4" viewBox="0 0 512 512" fill="white">
                                                                <path
                                                                    d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
                                                                ></path>
                                                            </svg>
                                                        </div>
                                                        <div
                                                            className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                                                        >
                                                            See more
                                                        </div>
                                                    </button>
                                                </div>

                                            </div>

                                        )}
                                    </article>
                                ))}
                                <button onClick={savePlan} className="border hover:scale-95 duration-300 relative group cursor-pointer text-sky-50  overflow-hidden h-16 w-64 rounded-md bg-sky-200 p-2 flex justify-center items-center font-extrabold">

                                    <div className="absolute right-32 -top-4  group-hover:top-1 group-hover:right-2 z-10 w-40 h-40 rounded-full group-hover:scale-150 duration-500 bg-sky-900"></div>
                                    <div className="absolute right-2 -top-4  group-hover:top-1 group-hover:right-2 z-10 w-32 h-32 rounded-full group-hover:scale-150  duration-500 bg-sky-800"></div>
                                    <div className="absolute -right-12 top-4 group-hover:top-1 group-hover:right-2 z-10 w-24 h-24 rounded-full group-hover:scale-150  duration-500 bg-sky-700"></div>
                                    <div className="absolute right-20 -top-4 group-hover:top-1 group-hover:right-2 z-10 w-16 h-16 rounded-full group-hover:scale-150  duration-500 bg-sky-600"></div>
                                    <p className="z-10">SAVE</p>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col ml-5 w-[38%] max-md:ml-0 max-md:w-full mr-10">
                        <motion.div
                            initial={{ opacity: 1, scale: 0.8 }} // Set initial animation properties
                            animate={controls} // Use the animation properties from the state
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex flex-col self-stretch px-6 pt-5 pb-8 m-auto w-full bg-white rounded-3xl shadow leading-[124.5%] max-md:px-5 max-md:mt-5">
                                <img
                                    loading="lazy"
                                    src={
                                        selectedDayImage
                                            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1500&maxheight=2000&photoreference=${selectedDayImage}&key=${import.meta.env.VITE_KEY_GOOGLE}`
                                            : 'https://hspicturesstudio.com/img/no_image.png' // Replace with the path to your default image
                                    }
                                    className="self-center object-cover rounded"
                                    alt={selectedDayImage ? 'Place Image' : 'Image Not Found'}
                                    onError={() => setSelectedDayImage(null)} // Handle image loading errors
                                />
                                <div className="mt-7 text-lg font-medium tracking-wide text-zinc-950">
                                    Trip To {Dataload && Dataload.TripData[0].PlaceArea}
                                </div>
                                <div className="flex gap-5 justify-between mt-4 text-base text-slate-500">
                                    <div className="flex flex-col">
                                        <div className="font-medium tracking-normal">
                                            {Dataload && Dataload.TripData[0].DayDetail}-{Dataload && Dataload.TripData[Dataload.TripData.length - 1].DayDetail}
                                        </div>

                                        <div className="flex gap-4 justify-between mt-7 tracking-tight whitespace-nowrap">
                                            <div className="grow">{(selectedDayPeople / 1000).toFixed(2)}K people has been</div>
                                        </div>
                                        <div className="flex items-center gap-1">{renderStarRating(selectedDayRate)}</div>
                                    </div>
                                </div>
                                {selectedcomment && selectedcomment.length > 0 ? (
                                    <div className="relative flex flex-col gap-4 mt-20">
                                        {selectedcomment.slice(0, 3).map((comment, commentIndex) => (
                                            <div key={commentIndex} className="flex gap-4">
                                                <img
                                                    src={comment.profile_photo_url}
                                                    className="relative rounded-lg -mb-4 bg-white border h-20 w-20"
                                                    alt={`Commentor ${commentIndex + 1}`}
                                                    loading="lazy"
                                                />
                                                <div className="flex flex-col">
                                                    <div className="flex flex-row justify-between items-center mb-2">
                                                        <p className="text-xl font-semibold truncate overflow-hidden">
                                                            {comment.author_name}
                                                        </p>
                                                    </div>
                                                    <p className="text-gray-400 text-sm mb-2">
                                                        {new Date(comment.time * 1000).toLocaleString()},{' '}
                                                        {comment.relative_time_description}
                                                    </p>
                                                    <p className="text-gray-500">{comment.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 mt-4 text-center">No comments available.</p>
                                )}
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Card;