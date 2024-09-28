import React from 'react'
import './Login.css'

function Login() {
  return (
    <div className='logo'>
      <h1>Login </h1>
      <input type="text-1" placeholder='Enter your Name'  className='name'/>
      <input type="text-2" placeholder='Enter your password' className='password'/>
      <button className='btn1'>Login</button>
      <h2 className='sugg'> Not a member ? </h2>
    </div>
  )
}

export default Login
