import React, { useEffect, useState } from 'react'
import Navbar from './component/Navbar'
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Main from './main/Main';
import Login from './component/Login';
import AinwikLogin from './component/AinwikLogin';
import Payment from './component/Payment';
import Attendance from './component/Attendance';
function App() {
  
  return (
    <div>
      
      <BrowserRouter>
      <Navbar/>
      <Routes>
          <Route path="/Login" element={<Login/>}></Route>
          <Route path="/AinwikStudent" element={<AinwikLogin/>}></Route>
          
      </Routes>
      </BrowserRouter>
      <Attendance/>
      
    </div>
  )
}

export default App
