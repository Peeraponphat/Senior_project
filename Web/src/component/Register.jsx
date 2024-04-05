import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
const ErrorPopup = ({ error, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
        <p className="text-red-600 mb-4">{error.message}</p>
        <button
          className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

function Register() {
  const [name, setName] = React.useState("");
  const [username, setUserName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [repeatpassword, setRepeatPassword] = React.useState("");
  const [error, setError] = React.useState(null);
  const [showError, setShowError] = React.useState(false);
  const navigate = useNavigate();
 
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== repeatpassword) {
      // ถ้าไม่ตรงกัน ให้แสดงข้อความแจ้งเตือนด้วย alert
      window.alert("Passwords do not match");
      return; // ไม่ส่งข้อมูลไปยังเซิร์ฟเวอร์
    }
    axios
      .post('http://'+import.meta.env.VITE_IP+':3001/register', {
        name,
        username,
        email,
        password,
        repeatpassword,
      })
      .then((result) => {
        navigate("/formlogin");
        window.alert("E-mail verification");
      })
      .catch((err) => {
        console.error(err);
        setError(err);
        setShowError(true);
      });
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <>
      <div className="flex flex-col justify-center bg-white min-h-screen w-screen relative">
        {showError && <ErrorPopup error={error} onClose={handleCloseError} />}
        <div className="flex flex-col justify-center bg-white min-h-screen w-screen ">
          <div className="flex flex-col justify-center w-full bg-zinc-100 max-md:max-w-full ">
            <div className="flex flex-col justify-center items-center px-12 py-11 w-full bg-cyan-200 max-md:px-5 max-md:max-w-full min-h-screen w-screen">

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
                      <span className="font-medium">Welcome to</span>
                      <br />
                      <span className="text-5xl text-indigo-500 leading-[62px]">
                        Create Account{" "}
                      </span>
                    </div>

                    <form className="max-w-sm mx-auto" onSubmit={handleSubmit} >
                      <div className="mb-5">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 light:text-black">Your name</label>
                        <input type="name" id="name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 light:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="" required
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 light:text-black">Username</label>
                        <input type="username" id="username" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 light:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="" required
                          onChange={(e) => setUserName(e.target.value)}
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 light:text-black">Your email</label>
                        <input type="email" id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 light:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="name@flowbite.com" required
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 light:text-black">Your password</label>
                        <input type="password" id="password" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 light:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="repeat-password" className="block mb-2 text-sm font-medium text-gray-900 light:text-black">Repeat password</label>
                        <input type="password" id="repeat-password" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 light:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required
                          onChange={(e) => setRepeatPassword(e.target.value)}
                        />
                      </div>
                      <div className="flex items-start mb-5">
                        <div className="flex items-center h-5">
                          <input id="terms" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                        </div>
                        <label htmlFor="terms" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a></label>
                      </div>
                      <div className="flex justify-end mb-5">
                        <div className="flex items-center h-5">
                          <div className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Have an account?</div>
                          <Link to="/formlogin" className="ms-2 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">Sign in</Link>
                        </div>
                      </div>

                      <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Register new account</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
};
export default Register