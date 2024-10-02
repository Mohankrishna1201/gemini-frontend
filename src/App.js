import React, { useEffect } from 'react'


import { Route, Routes } from 'react-router-dom'
import "./App.css"
import SignUp from './components/SignUp'
import Login from './components/Login'
import { useFirebase } from './context/firebase';

import NavbarComponent from './components/NavBarComponent'
import Hi from './components/Hi'

import QuizApp from './components/QuizApp'
import Dashboard from './components/Dashboard'
import FileUploadComponent from './components/FileUpload'
import { useLocation } from 'react-router-dom';
import Home from './components/Home'
export default function App() {
  const firebase = useFirebase()
  useEffect(() => {

    firebase.getUserToken()
  }, [])

  const getUser = async () => {
    console.log("Here")

    const result = await firebase.getUserDetails();
    console.log(result);
    localStorage.setItem("name", result?.name);
    localStorage.setItem("userID", result?.userID);
    localStorage.setItem("userToken", result?.userToken);
    localStorage.setItem("userEmail", result?.userEmail);
    localStorage.setItem("userImg", result?.userImg);
  }

  useEffect(() => {
    getUser();
  })


  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service Worker registration successful with scope: ', registration.scope);
      }).catch((err) => {
        console.log('Service Worker registration failed: ', err);
      });
  }
  const location = useLocation();

  // Define routes where Navbar should be hidden
  const hideNavbarRoutes = ['/'];

  return (
    <div className="app_wrapper">
      {/* Show Navbar if the current path is not in the hideNavbarRoutes array */}
      {!hideNavbarRoutes.includes(location.pathname) && <NavbarComponent />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/main" element={<QuizApp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/progress" element={<Dashboard />} />
        <Route path="/media" element={<FileUploadComponent />} />
      </Routes>
    </div>
  )
}
