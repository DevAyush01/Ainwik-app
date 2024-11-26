import React from 'react'
import AdminRegistration from './form/AdminRegistration'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from './form/AdminLogin';
import ProtectedRoute from './route/ProtectedRoute';
import AdminPanel from './component/AdminPanel';
import VideoContentPage from './videoContent/VideoContentPage';
import 'bootstrap/dist/css/bootstrap.min.css';




function App() {
  return (
    <div className="bg-gray-800 p-4 min-h-screen">
           {/* <BrowserRouter>
           <Routes>
          
            <Route path='/register' element={<AdminRegistration/>}></Route>
            <Route path='/login' element={<AdminLogin/>}></Route>
            

            <Route path='/' element={<ProtectedRoute/>}>
              <Route path='/adminPanel' element={<AdminPanel/>}></Route>
               </Route>

           </Routes>
           
           </BrowserRouter> */}
           <VideoContentPage/>
          


    </div>
  )
}

export default App