import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Navbar from './component/Navbar.jsx'
// import Course from './component/Course.jsx'
import NewCourse from './NewCourse.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Course/> */}
    <App />
    {/* <Navbar/> */}
    {/* <NewCourse/> */}
  </StrictMode>,
)
