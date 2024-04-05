import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from 'react-redux';
import './index.css'
import Home from './component/home.jsx';
import Form from './component/form.jsx';
import Card from './component/Card.jsx';
import Nav from './component/Nav.jsx';
import Show from './component/show.jsx';
import Display from './component/Display.jsx';
import Display2 from './component/Display2.jsx';
import Formlogin from './component/formlogin.jsx';
import Homelogin from './component/Homelogin.jsx';
import Register from './component/Register.jsx';
import Homemain from './component/Homemain.jsx';
import store from './store/store.js';
import ErrorPage from './component/ErrorPage.jsx';
import MyTrip from './component/myTrip.jsx';
import UserEdit from './component/useredit.jsx';
import ForgotPassword from './component/ForgotPassword.jsx';
import ResetPassword from './component/ResetPassword.jsx';
import VerifyEmailPage from './component/Verify.jsx';

const router = createBrowserRouter([
  {
    path: "/User",
    element: <UserEdit />
  },
  {
    path: "/myTrip",
    element: <MyTrip />
  },
  {
    path: "/begin",
    element: <Home />
  },
  {
    path: "/Form",
    element: <Form />
  },
  {
    path: "/Show",
    element: <Show />
  },
  {
    path: "/Card",
    element: <Card />
  },
  {
    path: "/Nav",
    element: <Nav />
  },
  {
    path: "/Display",
    element: <Display />
  },
  {
    path: "/Display2",
    element: <Display2 />
  },
  {
    path: "/formlogin",
    element: <Formlogin />
  },
  {
    path: "/Homelogin",
    element: <Homelogin />
  },
  {
    path: "/Register",
    element: <Register />
  },
  {
    path: "/error-page",
    element: <ErrorPage />
  },
  {
    path: "/",
    element: <Homemain />
  },
  {
    path: "/ForgotPassword",
    element: <ForgotPassword />
  },
  {
    path: "/ResetPassword/:id/:token",
    element: <ResetPassword />
  },
  {
    path: "/verify/:token",
    element: <VerifyEmailPage />
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  </Provider>,
)
