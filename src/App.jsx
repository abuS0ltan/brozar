import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import './App.css'
import Navbar from './assets/components/Navbar/Navbar'
import { Router, Routes,Route } from 'react-router-dom';
import Home from './assets/components/Home/Home.jsx';
import Fotter from './assets/components/Fotter/Fotter.jsx';
import Register from './assets/components/Auth/Register.jsx';
import Login from './assets/components/Auth/Login.jsx';
import AllProjects from './assets/components/AllProjects/AllProjects.jsx';
import AllEvents from './assets/components/AllEvents/AllEvents.jsx';
import Project from './assets/components/Project/Project.jsx';
import Event from './assets/components/Event/event.jsx';
import OwnerProfile from './assets/components/OwnerProfile/OwnerProfile.jsx';
import ProtectedRoute from './assets/components/ProtectedRoute/ProtectedRoute.jsx';
import PublicRoute from './assets/components/PublicRoute/PublicRoute.jsx';
import UserProfile from './assets/components/UserProfile/UserProfile.jsx';
import ForgotPassword from './assets/components/Auth/ForgetPassword.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='app'>
      <Navbar/>

        <Routes>

          <Route path="/" element={<Home/>} />
          <Route path='/register' element={<PublicRoute><Register/></PublicRoute>}/>
          <Route path='/login' element={<PublicRoute><Login/></PublicRoute>}/>
          <Route path='/forgotpassword' element={<PublicRoute><ForgotPassword/></PublicRoute>}/>
          <Route path='/allprojects' element={<ProtectedRoute><AllProjects/></ProtectedRoute>}/>
          <Route path='/allevents' element={<ProtectedRoute><AllEvents/></ProtectedRoute>}/>
          <Route path='/project/:id' element={<ProtectedRoute><Project/></ProtectedRoute>}/>
          <Route path='/event/:id' element={<ProtectedRoute><Event/></ProtectedRoute>}/>
          <Route path='/owner/:id' element={<ProtectedRoute><OwnerProfile/></ProtectedRoute>}/>
          <Route path='/profile' element={<ProtectedRoute><UserProfile/></ProtectedRoute>}/>

          

        </Routes>
      <Fotter/>
    </div>
  )
}

export default App
