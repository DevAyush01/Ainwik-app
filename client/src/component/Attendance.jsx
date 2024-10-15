import React, { useState } from 'react'
import moment from 'moment-timezone'; // Import moment-timezone


function Attendance() {
    const [studentName, setStudentName] = useState('')
    const [message,setMessage] = useState('')

    const formatDateTime = (timeString) => {
        console.log('Formatting time:', timeString)
    
    // Parse the time string
    const parsedTime = moment(timeString)
    
    // If parsing is valid, format the time
    if (parsedTime.isValid()) {
      const formattedTime = parsedTime.format('hh:mm A')
      console.log('Formatted time:', formattedTime)
      return formattedTime
    }
    
    // If parsing fails, return the original string
    console.log('Unable to parse time:', timeString)
    return timeString
        // const date = new Date(isoString);
        // return date.toLocaleString('en-IN', {
        //     timeZone: userTimeZone, 
        //     year: 'numeric',
        //     month: '2-digit',
        //     day: '2-digit',
        //     hour: '2-digit',
        //     minute: '2-digit',
        //     hour12: true
        // });
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
                const errorResponse = await response.json();
                console.error('Error details:', errorResponse);
                throw new Error('failed to punch in')
            }


            const data = await response.json()
            const formattedTime = formatDateTime(data.punchIn, 'Asia/Kolkata')


           
            setMessage(`${studentName} Punched in at ${formattedTime}`);

        } catch (error) {
            setMessage('Failed to punch in. Please try again.')
            console.error('Error saving attendance:', error); 
        }
    }

    const handlePunchOut = async ()=>{
        if (!studentName) {
            setMessage('Please enter a student name.');
            return;
        }

        try {
            const response = await fetch ('https://ainwik-app-4.onrender.com/api/punchout', {
                method : "POST",
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({studentName})
            })
            if (!response.ok) {

                const errorResponse = await response.json();
                console.error('Error details:', errorResponse);
                throw new Error(errorResponse.message || 'Failed to punch out');   

            }

              const data = await response.json()

              console.log('Punch Out Data:', data);
              if (!data.punchOut) {
                throw new Error('Invalid punch out time received');
            }
            const formattedPunchOut = formatDateTime(data.punchOut, 'Asia/Kolkata')

            //   const punchOutDate = data.punchOut;
              setMessage(`${studentName} Punched out at ${formattedPunchOut}. Total time: ${data.totalTime}`)
              
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


     {/* <div>
        {studentName.map((record, index)=>{

        })}
     </div> */}

    </div>
  )
}

export default Attendance