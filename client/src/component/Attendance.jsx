import React, { useState } from 'react'
import moment from 'moment-timezone'; // Import moment-timezone


function Attendance() {
    const [studentName, setStudentName] = useState('')
    const [message,setMessage] = useState('')
    const [attendanceRecords, setAttendanceRecords] = useState([])

    const formatDateTime = (timeString) => {
        console.log('Formatting time:', timeString)
    
    // Parse the time string
    const parsedTime = moment(timeString)
    
    // If parsing is valid, format the time
    if (parsedTime.isValid()) {
      const formattedTime = parsedTime.format('YYYY-MM-DD , hh:mm A')
      console.log('Formatted time:', formattedTime)
      return formattedTime
    }
    
    // If parsing fails, return the original string
    console.log('Unable to parse time:', timeString)
    return timeString
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

    const fetchAttendanceRecords = async () => {
        try {
          const response = await fetch(`https://ainwik-app-4.onrender.com/api/attendance/${studentName}`)
          if (!response.ok) {
            throw new Error('Failed to fetch attendance records')
          }
          const data = await response.json()
          setAttendanceRecords(data)
        } catch (error) {
          console.error('Error fetching attendance records:', error)
        }
      }
    
      useEffect(() => {
        if (studentName) {
          fetchAttendanceRecords()
        }
      }, [studentName])


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


<div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Attendance Records</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Student Name</th>
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Punch In Time</th>
                <th className="border border-gray-300 p-2">Punch Out Time</th>
                <th className="border border-gray-300 p-2">Total Time</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record, index) => {
                const punchInDateTime = moment(record.punchIn)
                const punchOutDateTime = record.punchOut ? moment(record.punchOut) : null
                return (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{record.studentName}</td>
                    <td className="border border-gray-300 p-2">{punchInDateTime.format('YYYY-MM-DD')}</td>
                    <td className="border border-gray-300 p-2">{punchInDateTime.format('HH:mm:ss')}</td>
                    <td className="border border-gray-300 p-2">
                      {punchOutDateTime ? punchOutDateTime.format('HH:mm:ss') : 'N/A'}
                    </td>
                    <td className="border border-gray-300 p-2">{record.totalTime || 'N/A'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default Attendance