import React from 'react';
import Nav from './Nav';
import Home from '../assets/img/Home.png';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {gapi} from "gapi-script";

function Homemain() {
  const clientId = import.meta.env.VITE_CID
  const [profile, setProfile] = useState([])
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: ''
      })
    }
    gapi.load("client:auth2", initClient)
  }, [])
  const onSuccess = (res) => {
    setProfile(res.profileObj)
    console.log('success', res)
  }
  const onFailure = (res) => {
    console.log('failes', res)
  }

  const logOut = () => {
    setProfile(null);
    window.location.href = "/formlogin";
  }
  return (
    <>
      <div className="grid lg:grid-cols-2 place-items-center pt-16 pb-8 md:pt-8 flex flex-col  font-bold bg-white h-screen">
        <div className="py-6 md:order-1 hidden md:block mt-5">
          <img
            src={Home}
            alt="Astronaut in the air"
            loading="eager"
            format="avif"
          />
        </div>
        <div>
          <div className="relative mt-20 ml-24 text-xl text-red-400 uppercase  max-md:mt-20 max-md:ml-2.5 md:auto flex flex-col flex-1">
            Best Destinations around the world
          </div>
          <div className="relative  mt-9 ml-24 max-md:ml-2.5 text-8xl tracking-tighter leading-[px] text-indigo-950 max-md:max-w-full max-md:text-6xl max-md:leading-89">
            Travel, enjoy
            <br />
            and live a new
            <br />
            and full life
          </div>
          <div className="relative md:auto mt-14 ml-24 max-md:ml-2.5 text-base font-medium leading-8 text-gray-500 w-auto max-md:mt-10 max-md:max-w-full">
            Experience the transformative power of travel through 'Travel, Enjoy, Live',
            a captivating memoir celebrating exploration, cultural immersion,
            and the joy of living life to the fullest.
          </div>

          <Link to="/formlogin">
            <button type="submit" className="relative  ml-24 text-xl text-red-400 uppercase whitespace-nowrap max-md:mt-10 max-md:ml-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 my-5">Get started</button>
          </Link>
        </div>
      </div>
    </>
  );
}
export default Homemain;