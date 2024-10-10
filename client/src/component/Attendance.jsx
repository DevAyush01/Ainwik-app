import React, { useState } from 'react'

function Attendance() {
    const [studentName, setStudentName] = useState('')
    const [message,setMessage] = useState('')

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata', 
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    const handlePunchIn = async()=>{
        try {
            
            const response = await fetch ('https://ainwik-app-4.onrender.com/api/punchin', {
                method : "POST",
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({studentName})
            })
            if(!response.ok){
                throw new Error('failed to punch in')
            }

            const data = await response.json()
            // const punchInDate = new Date(data.punchIn)
            setMessage(`${studentName} Punched in at ${formatDateTime(data.punchIn)}`);

        } catch (error) {
            setMessage('Failed to punch in. Please try again.')
        }
    }

    const handlePunchOut = async ()=>{
        try {
            const response = await fetch ('https://ainwik-app-4.onrender.com/api/punchout', {
                method : "POST",
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({studentName})
            })
            if (!response.ok) {
                throw new Error('Failed to punch out')
              }

              const data = await response.json()
              setMessage(`${studentName} Punched out at ${formatDateTime(data.punchOut)}. Total time: ${data.totalTime}`)
              
        } catch (error) {
            setMessage('Failed to punch out. Please try again.')
        }
    }


  return (
    <div>

        <div>
            <input type="text" name="" id="" value={studentName} onChange={(e)=>setStudentName(e.target.value)}/>
        </div>
 
    <button style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor:'blue',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            width: '15%'
          }} 
          onClick={handlePunchIn}>Punch In</button>

    <button style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor:'#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            width: '15%'
          }} 
          onClick={handlePunchOut}>punch Out</button>


<div>{message && (
        <p style={{ marginTop: '20px', color: '#333' }}>{message}</p>
      )}</div>


    </div>
  )
}

export default Attendance