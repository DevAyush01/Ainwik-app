import React from 'react'
import AdminRegistration from './form/AdminRegistration'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from './form/AdminLogin';
import ProtectedRoute from './route/ProtectedRoute';
import AdminPanel from './component/AdminPanel';


function App() {
  return (
    <div>
           <BrowserRouter>
           <Routes>
            <Route path='/register' element={<AdminRegistration/>}></Route>
            <Route path='/login' element={<AdminLogin/>}></Route>

            <Route path='/' element={<ProtectedRoute/>}>
              <Route path='adminPanel' element={<AdminPanel/>}></Route>
              
               </Route>
            

           </Routes>
           
           </BrowserRouter>

    </div>
  )
}

export default App