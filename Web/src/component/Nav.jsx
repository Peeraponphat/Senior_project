import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
const IP = import.meta.env.VITE_IP;
const MinimalNavbar = () => {
  const navigate = useNavigate();
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [zIndex, setZIndex] = useState(10); // Initial z-index value for the navbar
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleLogout = async () => {
    try {
      await axios.post('http://'+IP+':3001/logout');
      // Clear token cookie on the client-side
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Redirect to the login page after successful logout
      navigate('/formlogin');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  const toggleProfileMenu = () => {
    setProfileMenuOpen(!isProfileMenuOpen);
    setZIndex(isProfileMenuOpen ? 10 : 20); // Adjust the z-index based on the menu state
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prevOpen) => !prevOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  axios.defaults.withCredentials = true;

  const [users, setUsers] = useState([]);
  useEffect(() => {
      const fetchData = async () => {
          try {
              // Retrieve the token from cookies
              const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

              // Make a GET request to the backend API with the token in the Authorization header
              const response = await axios.get('http://' + IP + ':3001/getUsers', {
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
      fetchData();
  }, []);
  const username = users ? users.username : null; // Check if users is not null before accessing username


  

  if (!users) {
    return null; // Render nothing until users data is fetched
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 765) {
        closeMobileMenu();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const slideDownStyles = {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '100%', // Set to a value that ensures the menu is below the header
    left: 0,
    backgroundColor: 'white',
    border: '1px solid #e5e7eb', // Use the desired border color
    zIndex: 100,
    maxHeight: isMobileMenuOpen ? '500px' : '0', // Set to a large enough value initially when it's open
    overflow: 'hidden',
    transition: 'max-height 0.3s ease-in-out', // Adjust the duration and easing function as needed
    width: '100%', // Make the menu take up the full width of the navbar
  };

  const desktopMenu = (
    <ul className="md:flex md:flex-row md:space-x-6 hidden lg:flex">
      <li>
        <Link to="/begin"
          onClick={closeMobileMenu}
          className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
        >
          Get Started
        </Link>
      </li>
      <li>
        <Link to="/myTrip"
          className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
          onClick={closeMobileMenu}
        >
          Your Trip
        </Link>
      </li>
    </ul>
  );

  const mobileMenu = (
    <div className={`flex-grow md:hidden ${isMobileMenuOpen ? 'slide-down' : 'hidden'}`} style={slideDownStyles}>
      <ul className="md:flex md:flex-row md:space-x-6">
        <li>
          <Link to="/begin"
            onClick={closeMobileMenu}
            className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500 block py-2 px-4"
          >
            Get Started
          </Link>
        </li>
        <li>
          <Link to="/myTrip"
            className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500 block py-2 px-4"
            onClick={closeMobileMenu}
          >
            Your Trip
          </Link>
        </li>
      </ul>
    </div>
  );

  // Function to generate initials from the user's name
  const generateInitials = (name) => {
    // Use optional chaining to safely access nested properties
    const initials = name?.split(' ').map(part => part.charAt(0)).join('');
    return initials ? initials.toUpperCase() : ''; // Convert to uppercase for consistency
  };

  return (
    <nav className={`bg-white border-b border-gray-200 dark:bg-gray-900 relative w-full z-${zIndex}`}>

      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-2">
        {/* Logo Section (Left) */}
        <div className={`flex items-center space-x-3 ${windowWidth < 700 ? 'hidden' : ''}`}>
          <Link to="/Homelogin" className="flex items-center space-x-3">
            
            <span
              className={`self-center text-3xl font-semibold whitespace-nowrap dark:text-white ${windowWidth < 450 ? 'hidden' : ''}`}
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Itchyfeet
            </span>
          </Link>
        </div>

        <div className="md:hidden">
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="text-gray-900 dark:text-white focus:outline-none"
          >
            {isMobileMenuOpen ? (
              /* Menu Open (Downward Arrow) */
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            ) : (
              /* Menu Closed (Burger) */
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            )}
          </button>
        </div>

        {/* Menu Section (Center) */}
        {desktopMenu}

        {/* Profile Section (Right) */}
        <div className="flex items-center justify-end">
          <h1 className="md:mr-4 text-2xl font-bold text-indigo-700 mr-4">{username}</h1>
          <div className="relative inline-block text-left">
            <button
              type="button"
              onClick={toggleProfileMenu}
              className="flex items-center text-sm bg-blue-500 rounded-full focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600"
            >
              <span className="sr-only">Open user menu</span>
              {/* Display user's initials dynamically */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-green-500">{generateInitials(username)}</div>

            </button>

            {isProfileMenuOpen && (
              <div className={`origin-top-right absolute right-0 mt-6 w-48 rounded-md shadow-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-30`} role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
                <div className="py-1 " role="none">
                  <Link to="/User"
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    role="menuitem"
                  >
                    Edit Profile
                  </Link>


                  <a
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    Logout
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {mobileMenu}
    </nav>
  );
};

export default MinimalNavbar;
