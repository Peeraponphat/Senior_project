import React from 'react';
import Nav from './Nav';
import Home from '../assets/img/Home.png';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CookieConsent from 'react-cookie-consent';
function Homelogin() {
  const clientId = import.meta.env.VITE_CID;

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
      <Nav />
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

          <Link to="/begin">
            <button type="submit" className="relative  ml-24 text-xl text-red-400 uppercase whitespace-nowrap max-md:mt-10 max-md:ml-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 my-5">Get started</button>
          </Link>
        </div>
      </div>

      <CookieConsent
        location="bottom"
        buttonText="Accept"
        cookieName="myAwesomeCookieConsent"
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
        expires={365}
      >
        This website uses cookies to enhance the user experience.
      </CookieConsent>
      {/* <div className="container">
                        <div className="flex flex-col  font-bold bg-white ">
                       
                        <div className="flex overflow-hidden relative flex-col items-start px-9 pt-4 w-full min-h-[745px] max-md:px-5 max-md:max-w-full h-screen">
        <img src={Home} alt= "person" className="object-cover absolute inset-0 size-full max-md:hidden "></img>
     }  <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/84762be5f5d68360172a41d0250426334e2591a56a9c067fb66f967791f371bf?apiKey=3dbbd32ecd3449ce889288d1d5d738df&"
          className="object-cover absolute inset-0 size-full"
                        /> 
        
        <div class="relative mt-20 ml-24 text-xl text-red-400 uppercase  max-md:mt-20 max-md:ml-2.5 md:auto flex flex-col flex-1">
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
          Built Wicket longer admire do barton vanity itself do in it. Preferred
          to sportsmen it engrossed listening. Park gate sell they west hard for
          the.
        </div>
        
          <Link to = "/form">
  <button type="submit" class="relative  ml-24 text-xl text-red-400 uppercase whitespace-nowrap max-md:mt-10 max-md:ml-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 my-5">Getstarted</button>
        </Link>
      </div>
    </div>
    </div>
                        
  {/*  <div>
                            <h2>React Google Login</h2>
                            <br /><br />
                            {profile ? (
                                <div>
                                    <img src={profile.imageUrl} alt="user image" />
                                    <h3>User Logged in</h3>
                                    <p>Name: {profile.name}</p>
                                    <p>Email: {profile.email}</p>
                                    <br /><br />
                                    <GoogleLogout clientId ={clientId} buttonText=" Log out" onLogoutSuccess={logOut}/>
                                </div>
                            ) : (
                                <GoogleLogin
            clientId={clientId}
            buttonText="Sign in with Google"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
            isSignedIn={true}
            prompt="select_account"
          >
         </GoogleLogin>
                            )}
                            </div>   */}
    </>
  );
}
export default Homelogin;