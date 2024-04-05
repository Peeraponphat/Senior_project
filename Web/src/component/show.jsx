import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AppStyles from '../App.module.css';
import BarLoader from 'react-spinners/BarLoader'; // Import BarLoader
import Card from './Card';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Show() {
    const location = useLocation();
    const [loading, setLoading] = useState(true); // Initially set loading to true
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Retrieve the token from cookies
                const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

                // Make a GET request to the backend API with the token in the Authorization header
                const response = await axios.get('http://' + import.meta.env.VITE_IP + ':3001/getUsers', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Set the user data received from the response
                setUserData(response.data);
            } catch (error) {
                navigate('/error-page');
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false); // Set loading to false after API call completes
            }
        };

        // Call the fetchData function when the component mounts
        fetchData();
    }, []);

    const app1Class = `${AppStyles.app1} ${loading ? '' : AppStyles.spaceBetween}`;

    return (
        <div className={app1Class}>
            {loading ? (
                <BarLoader
                    className="w-full max-w-lg mx-auto"
                    color={'#32bd35'}
                    loading={loading}
                    height={4}
                    width={150}
                    speedMultiplier={1}
                />
            ) : (
                <>
                    <Card location={location} />
                </>
            )}
        </div>
    );
}

export default Show;
