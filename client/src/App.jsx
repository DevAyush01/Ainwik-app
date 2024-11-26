import React, { useEffect, useState } from 'react'
import Navbar from './component/Navbar'
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Main from './main/Main';
import Login from './component/Login';
import AinwikLogin from './component/AinwikLogin';
import Payment from './component/Payment';
import Attendance from './component/Attendance';
import AdminRegister from './component/AdminRegister';
import AdminLogin from './component/AdminLogin';
import Dashboard from './component/Dashboard';
import AdminPanel from './admin/AdminPanel';
import NewCourse from './NewCourse';
import UpdatedCourse from './UpdatedCourse';
function App() {
  
  return (
    <div>
      
      <BrowserRouter>
      <Navbar/>
      <Routes>
             {/* <Route path="/Adminsignup" element={<AdminRegister />} />
                <Route path="/Adminlogin" element={<AdminLogin/>} />
                <Route path="/dashboard" element={<Dashboard />} /> */}
          {/* <Route path="/Login" element={<Login/>}></Route>
          <Route path="/AinwikStudent" element={<AinwikLogin/>}></Route> */}
          <Route path="/" element={<NewCourse />} />
          <Route path="/update-course/:courseId" element={<UpdatedCourse />} />
          
      </Routes>
      
      </BrowserRouter>
    </div>
  )
}

export default App
