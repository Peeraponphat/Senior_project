import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ShowDetailUser() {
    axios.defaults.withCredentials = true;
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });
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
                setUser(response.data)
    
            } catch (error) {
                navigate('/error-page');
                console.error("Error fetching data:", error);
            }
        };
    
        // Call the fetchData function when the component mounts
        fetchData(1);
    }, []);
    

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = e => {
        e.preventDefault();
        const userId = user._id; // Get the user ID
        const requestData = {
            userId: userId,
            formData: formData
        };

        axios.post(`http://${import.meta.env.VITE_IP}:3001/updateUser`, requestData)
            .then(response => {
                console.log('User updated successfully');
                setUser(response.data);
                setEditMode(false);
            })
            .catch(err => console.log(err));
    };
    


    const handleEditClick = () => {
        setEditMode(true);
        setFormData({
            name: user.name,
            email: user.email,
        });
    };

    const handleCancelClick = () => {
        setEditMode(false);
        // Reset formData to original user data
        setFormData({
            name: user.name,
            email: user.email,
        });
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="flex justify-center items-center h-full">
            <div className="border-b-2 block md:flex">
                <div className="w-full md:w-2/5 p-4 sm:p-6 lg:p-8 bg-white shadow-md">
                    <div className="flex justify-between">
                        <span className="text-xl font-semibold block">Your Profile</span>
                        {!editMode && <button onClick={handleEditClick} className="-mt-2 text-md font-bold text-white bg-gray-700 rounded-full px-5 py-2 hover:bg-gray-800">Edit</button>}
                    </div>
                    <span className="text-gray-600">This information is secret so be careful</span>
                </div>
                <div className="w-full md:w-3/5 p-8 bg-white lg:ml-4 shadow-md">
                    <div className="rounded  shadow p-6">
                        <div className="pb-6">

                            <label htmlFor="name" className="font-semibold text-gray-700 block pb-1">Name</label>
                            {editMode ? (
                                <input
                                    id="username"
                                    className="border-1 rounded-r px-4 py-2 w-full"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            ) : (
                                <div className="flex">
                                    <span>{user.name}</span>
                                </div>
                            )}
                        </div>
                        <div className="pb-4">
                            <label htmlFor="about" className="font-semibold text-gray-700 block pb-1">Email</label>
                            {editMode ? (
                                <input
                                    id="email"
                                    className="border-1 rounded-r px-4 py-2 w-full"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            ) : (
                                <div className="flex">
                                    <span>{user.email}</span>
                                </div>
                            )}
                            <span className="text-gray-600 pt-4 block opacity-70">ID: {user._id}</span>
                            <span className="text-gray-600 pt-4 block opacity-70">Personal login information of your account</span>
                        </div>
                        {editMode && (
                            <div>
                                <button type="submit" onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Save</button>
                                <button type="button" onClick={handleCancelClick} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowDetailUser;
