import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { CallAPI } from '../model';
import PlacesAutocomplete from 'react-places-autocomplete';
import Decore from '../assets/Decore.png';
import Des from '../assets/destination.png';
import Category from '../assets/category.png';
import Arrow from '../assets/arrow.png'
import { useNavigate } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import { BiUser } from 'react-icons/bi';
import ErrorPopup from './ErrorP';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, selectLoading } from '../store/loading';

function Form() {
    const dispatch = useDispatch();
    const navigator = useNavigate();
    const [address, setAddress] = useState("");
    const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [budget, setBudget] = useState(10000);
    const [numberOfPersons, setNumberOfPersons] = useState(1);
    const [error, setError] = useState(null);
    const [travelType, setTravelType] = useState("");
    const handleDateChange = (dates) => {
        const maxDateRange = 5; // Maximum allowed date range in days
        const startDate = dates[0];
        const endDate = dates[1];

        // Calculate the difference in days
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Check if the selected date range exceeds the maximum allowed range
        if (diffDays > maxDateRange) {
            // If exceeds, adjust the end date to be maxDateRange days ahead of the start date
            const adjustedEndDate = new Date(startDate.getTime() + (maxDateRange - 1) * 24 * 60 * 60 * 1000);
            setSelectedDates([startDate, adjustedEndDate]);
        } else {
            setSelectedDates(dates);
        }

        setShowCalendar(false); // Close the calendar after selecting dates
    };
    const isSmallScreen = window.innerWidth < 500;

    const handleChange = (newAddress) => {
        setAddress(newAddress);
    };

    const searchOptions = {
        types: ['(cities)'],
        language: 'en',
    };

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const updateBudgetValue = (value) => {
        setBudget(parseInt(value, 10));
    };

    const handleCloseError = () => {
        setError(null); // Clear the error state when closing the pop-up
    };

    const handleInputChange = (e) => {
        const value = parseInt(e.target.value, 10);

        // Ensure the value is within the range of 1 to 10
        setNumberOfPersons(Math.min(10, Math.max(1, value)));
    };
    const handleTravelTypeChange = (e) => {
        setTravelType(e.target.value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        try {
            const travelPlan = {
                Destination: address,
                TravelPeriod: `${selectedDates[0].toLocaleDateString()} - ${selectedDates[1].toLocaleDateString()}`,
                TravelType: travelType, // You may replace this with the appropriate state variable for TravelType
                Budget: budget.toString(),
                Travelers: numberOfPersons.toString(),
            };

            if (address.trim() !== "" && travelType.trim() !== "") {

                const result = await CallAPI.genChat(travelPlan);

                navigator('/Show', { state: result });
            } else {
                console.error('Request incorrect.');
            }
            throw new Error('Sorry, please try again');
        } catch (error) {
            setError(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <>
            <section className="flex flex-col px-7 pt-3 pb-12 w-full bg-white max-md:px-5 max-md:max-w-full z-0 ">
                <div className="flex flex-col py-12 pl-11 mx-7 mt-8 mb-11 rounded-3xl bg-LIGHTBLUE bg-opacity-80 max-md:pl-5 max-md:mr-2.5 max-md:mb-10 max-md:max-w-full shadow-xl">
                    <div className="self-start mt-4 ml-5 text-lg font-semibold text-center text-gray-500 max-md:ml-2.5 z-10">
                        Easy and Fast
                    </div>
                    <div className="self-start mt-10 text-5xl font-bold capitalize text-indigo-950 max-md:max-w-full max-md:text-4xl text-left z-10">
                        Create your next trip <br />
                        in easy steps
                    </div>


                    <div className="mt-6 mb-11 max-md:mb-10 max-md:max-w-full ">
                        <div className="flex gap-5 max-md:flex-col max-md:gap-0 max-md:">
                            <div className="flex flex-col w-[34%] max-md:ml-0 max-md:w-full">
                                <div className="flex flex-col grow mt-12 text-base text-gray-500 max-md:mt-10">
                                    <div className="flex gap-5 justify-between z-10">
                                        <img
                                            loading="lazy"
                                            src={Des} alt="Destination"
                                            className="self-start aspect-[0.98] w-[58px]"
                                        />
                                        <div className="flex flex-col flex-1">
                                            <div className="font-bold leading-[124.5%] text-left z-10">
                                                Choose Destination
                                            </div>
                                            <div className="mt-4 leading-5 text-left z-10">
                                                Choose your desired destination.{" "}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-5 justify-between items-start mt-20 max-md:mt-10 z-10">
                                        <img
                                            loading="lazy"
                                            src={Category} alt="Date and Category"
                                        />
                                        <div className="flex flex-col flex-1">
                                            <div className="font-bold whitespace-nowrap leading-[124.5%] text-left z-10">
                                                Date and Category
                                            </div>
                                            <div className="mt-3 leading-5 text-left z-10">
                                                Select the Startdate and Enddates for your trip and the type of trip.{" "}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-5 justify-between items-start mt-20 max-md:mt-10 z-10">
                                        <img
                                            loading="lazy"
                                            src={Arrow} alt="Budget and Person"
                                        />
                                        <div className="flex flex-col flex-1 mt-1">
                                            <div className="font-bold leading-[124.5%] text-left z-10">
                                                Budget and Person
                                            </div>
                                            <div className="mt-2.5 leading-5 text-left z-10">
                                                Specify the amount of money spent on the trip and the number of people.{" "}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 order-10">
                                <div className="Decore">
                                    <img src={Decore} alt="decore" />
                                </div>
                            </div>







                            {/*  <div className="bg-blue-600  w-full md:w-1/2 xl:w-2/3 h-screen">
                    <img src="https://images.pexels.com/photos/2205475/pexels-photo-2205475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1441&q=100" alt="" class="w-full h-full object-cover" />
                </div> */}

                            <div className="bg-white p-10 m-10 rounded-lg shadow-xl xl:w-2/3 px-6 lg:px-16 xl:px-12 flex items-center justify-center z-0">
                                <div className="w-full h-100">
                                    <h1 className="text-xl font-bold"></h1>
                                    <form className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-lg mx-auto text-left">
                                        <div className="mb-6">
                                            <div
                                                className="cursor-pointer overflow-visible transition-all duration-500 hover:translate-y-2 bg-neutral-50 rounded-lg shadow-xl  items-center  gap-2 p-2 before:w-full hover:before:top-0 before:duration-500 before:-top-1 before:h-1 before:bg-purple-200"
                                            >
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                                                    Destination
                                                </label>
                                                <PlacesAutocomplete
                                                    value={address}
                                                    onChange={handleChange}
                                                    searchOptions={searchOptions}
                                                >
                                                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                                        <div className="relative">
                                                            <input
                                                                {...getInputProps({
                                                                    placeholder: 'Search Cities...',
                                                                    className: 'appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500',
                                                                })}
                                                            />
                                                            <div className="absolute top-10 left-0 right-0 z-10">
                                                                {loading && <div className="text-gray-500">Loading...</div>}
                                                                {suggestions.map((suggestion, index) => {
                                                                    const className = suggestion.active
                                                                        ? 'suggestion-item--active bg-gray-100'
                                                                        : 'suggestion-item bg-white';

                                                                    return (
                                                                        <div
                                                                            key={index} // Provide a unique key for each suggestion
                                                                            {...getSuggestionItemProps(suggestion, {
                                                                                className,
                                                                            })}
                                                                        >
                                                                            <span className="block py-2 px-4 cursor-pointer">
                                                                                {suggestion.description}
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </PlacesAutocomplete>
                                                <p className="text-gray-600 text-xs italic">Where do you want to go?</p>
                                        </div> 
                                        </div>
                                        
                                        <div className="mb-6">
                                            <div
                                                className="cursor-pointer  transition-all duration-500 hover:translate-y-2 bg-neutral-50 rounded-lg shadow-xl  items-center  gap-2 p-2 before:w-full hover:before:top-0 before:duration-500 before:-top-1 before:h-1 before:bg-purple-200"
                                            >
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="selected-dates">
                                                    Travel Period<span className="text-red-500"> *(Limit 5 days)</span>
                                                </label>
                                                <input
                                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                    id="selected-dates"
                                                    type="button"
                                                    value={`${selectedDates[0]?.toLocaleDateString('en-GB')} - ${selectedDates[1]?.toLocaleDateString('en-GB')}`}

                                                    readOnly
                                                    onClick={toggleCalendar}
                                                />
                                            </div>
                                            {showCalendar && (
                                                    <div className={`relative ${isSmallScreen ? 'w-full' : 'w-auto'} md:max-w-md`}>
                                                        <div className={`absolute top-0 ${isSmallScreen ? 'left-[-120px]' : 'left-0'} mt-1 z-50`}>
                                                            <div className="w-full px-3 mb-6 md:mb-0">
                                                                <Calendar
                                                                    onChange={handleDateChange}
                                                                    selectRange
                                                                    value={selectedDates}
                                                                    locale="en-US"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>

                                        <div className="mb-6">
                                            <div
                                                className="cursor-pointer overflow-hidden  transition-all duration-500 hover:translate-y-2 bg-neutral-50 rounded-lg shadow-xl  items-center  gap-2 p-2 before:w-full hover:before:top-0 before:duration-500 before:-top-1 before:h-1 before:bg-purple-200"
                                            >
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="travel-type">
                                                    Travel Type
                                                </label>
                                                <select
                                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                    id="travel-type"
                                                    name="travelType"
                                                    value={travelType}
                                                    onChange={handleTravelTypeChange}
                                                >
                                                    <option value="">Select Travel Type</option>
                                                    <option value="Ecotourism">Ecotourism</option>
                                                    <option value="Adventure tourism">Adventure tourism</option>
                                                    <option value="Sports tourism">Sports tourism</option>
                                                    <option value="Tourism to see rural life">Tourism to see rural life</option>
                                                    <option value="Cultural and traditional tourism">Cultural and traditional tourism</option>
                                                    <option value="Educational and religious tourism">Educational and religious tourism</option>
                                                </select>
                                                <p className="text-gray-600 text-xs italic">What style of travel do you like?</p>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <div
                                               className="cursor-pointer overflow-hidden  transition-all duration-500 hover:translate-y-2 bg-neutral-50 rounded-lg shadow-xl  items-center  gap-2 p-2 before:w-full hover:before:top-0 before:duration-500 before:-top-1 before:h-1 before:bg-purple-200"
                                            >
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="numberOfPersons">
                                                    BUDGET
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        className="block w-full h-2 bg-gray-300 rounded-md overflow-hidden appearance-none focus:outline-none focus:ring focus:border-blue-300"
                                                        id="budget"
                                                        name="budget"
                                                        type="range"
                                                        min={10000}
                                                        max={100000}
                                                        step={10000}
                                                        value={budget}
                                                        onChange={(e) => updateBudgetValue(e.target.value)}
                                                    />
                                                </div>

                                                <div className="CountersNumericV4WProgress w-96 h-10 relative">
                                                    <div className="Title left-[24px] top-[15px] absolute text-zinc-500 text-sm font-normal leading-tight">{budget <= 49999 ? 'Essential Explorer' : budget <= 99999 ? 'Comfort Connoisseur' : 'Luxury Voyager'} :${budget}</div>
                                                </div>
                                            </div>
                                        </div>




                                        <div className="mb-6 md:col-span-1">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="numberOfPersons">
                                                Travelers
                                            </label>
                                            <div className="flex flex-wrap justify-start">
                                                {[...Array(4)].map((_, index) => (
                                                    <div
                                                        key={index + 1}
                                                        className={`flex items-center justify-center w-12 h-12 border border-gray-200 rounded-full cursor-pointer ${numberOfPersons === index + 1 ? 'bg-gray-200' : ''
                                                            } mb-2 mr-2`}
                                                        onClick={() => handleInputChange({ target: { value: index + 1 } })}
                                                    >
                                                        <span className="flex items-center">
                                                            <BiUser className="mr-2" />
                                                            {index + 1}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-6 md:col-span-1 flex items-end justify-end">
                                            <button
                                                className="bg-DEEPSKYBLUE hover:bg-blue-700 text-white font-bold py-2 px-14 mt-7 rounded focus:outline-none focus:shadow-outline mb-2 w-full md:w-auto sm:px-8 md:px-10 lg:px-12 xl:px-14 2xl:px-16"
                                                type="submit"
                                                onClick={handleSubmit}
                                            >
                                                Create Trip
                                            </button>
                                        </div>

                                    </form>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            {error && <ErrorPopup message={error} onClose={handleCloseError} />}
        </>
    )
}

export default Form
