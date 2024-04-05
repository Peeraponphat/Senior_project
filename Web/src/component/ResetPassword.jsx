import { useState, useEffect } from "react";
import React from "react";
import OR from '../assets/img/or.png';
import axios from 'axios'
import { useNavigate, useParams } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState()
  const navigate = useNavigate()
  const { id, token } = useParams()

  axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://${import.meta.env.VITE_IP}:3001/resetpassword/${id}/${token}`, { password })
      .then(result => {
        if (result.data.Status === "Success") {
          navigate('/formlogin');

        } else if (result.data.Status === "Error with token") {
          alert('Error with token');
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <div className="flex flex-col justify-center  min-h-screen w-screen ">
        <div className="flex flex-col justify-center w-full bg-zinc-100 max-md:max-w-full">
          <div className="flex justify-center items-center px-12 py-11 w-full bg-cyan-200 max-md:px-5 max-md:max-w-full min-h-screen w-screen">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0 max-md:">
              <div className="flex flex-col w-2/5 max-md:ml-0 max-md:w-full">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b07118bbc6f82228edfbc24725c9d1e532e3a56f440cc5b2741aa56d41f71929?apiKey=3dbbd32ecd3449ce889288d1d5d738df&"
                  className="self-stretch my-auto w-full aspect-square max-md:mt-10 max-md:max-w-full"
                />
              </div>
              <div className="flex flex-col ml-5 w-3/5 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow px-14 py-12 w-full bg-white rounded-lg shadow-sm leading-[135.5%] max-md:px-5 max-md:mt-10 max-md:max-w-full">
                  <div className="mt-1 text-4xl font-black text-indigo-500 leading-[49px] max-md:max-w-full">

                    <span className="text-5xl text-indigo-500 leading-[62px]">
                      Reset Password{" "}
                    </span>
                  </div>
                  <form className="mt-5 max-w-sm mx-auto" onSubmit={handleSubmit}>
                    <div className="mb-5 w-full max-w-lg mx-auto text-left">
                      <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"><img
                        loading="lazy"
                        src={OR} alt="or"
                      /></label>
                      <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">New Password</label>
                      <input type="password" id="password" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 light:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Enter Password" required
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  )
};
export default ResetPassword