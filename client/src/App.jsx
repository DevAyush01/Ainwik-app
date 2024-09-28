import React from 'react'
import Navbar from './component/Navbar'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from './main/Main';
import Login from './component/Login';
import AinwikLogin from './component/AinwikLogin';
function App() {
  return (
    <div>
      
      <BrowserRouter>
      <Navbar/>
      <Routes>
          <Route path='/Ainwik' element={<Main/>}></Route>
          <Route path="/Login" element={<Login/>}></Route>
          <Route path="/AinwikStudent" element={<AinwikLogin/>}></Route>
          
      </Routes>
      </BrowserRouter>
      
    </div>
  )
}

export default App
