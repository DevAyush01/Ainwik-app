import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';


function ProtectedRoute() {
    const token = localStorage.getItem('adminToken'); // Retrieve the token from local storage

    if (!token) {
        return <Navigate to="/login" />; // Redirect to login if not authenticated
    }
  return (
    <div>
            <Outlet/>
        
    </div>
  )
}

export default ProtectedRoute