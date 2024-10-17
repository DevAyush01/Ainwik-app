import React, { useEffect, useState } from 'react'
import moment from 'moment-timezone'; // Import moment-timezone

const API_BASE_URL = 'https://ainwik-app-4.onrender.com/api'
const isCloudEnvironment = true


function Attendance() {
    const [studentName, setStudentName] = useState('')
    const [message,setMessage] = useState('')
    const [attendanceRecords, setAttendanceRecords] = useState([])
    const [isConnectedToWifi, setIsConnectedToWifi] = useState(false)

    const formatDateTime = (timeString) => {
        console.log('Formatting time:', timeString);
        if (!timeString || typeof timeString !== 'string') return 'N/A'; // Handle empty or invalid inputs

        const parsedTime = moment(timeString);
        if (parsedTime.isValid()) {
            return parsedTime.format('YYYY-MM-DD, hh:mm A');
        }

        console.log('Unable to parse time:', timeString);
        return 'Invalid Time';
    }

    const checkWifiConnection = async()=>{
      if (isCloudEnvironment) {
        setIsConnectedToWifi(true)
        return
      }

          try {
      const response = await fetch(`${API_BASE_URL}/check-wifi`)
      const data = await response.json()
      console.log('WiFi connection status:', data)
      setIsConnectedToWifi(data.isConnected)
      if (!data.isConnected) {
        setMessage(`Not connected to AinwikConnect. Available networks: ${data.allConnections.map(conn => conn.ssid).join(', ')}`)
      } else {
        setMessage('Connected to AinwikConnect')
      }
    } catch (error) {
      console.error('Error checking WiFi connection:', error)
      setIsConnectedToWifi(false)
      setMessage('Failed to check WiFi connection')
    }

    }

    const handlePunchIn = async()=>{
        if (!studentName) {
            setMessage('Please enter a student name.');
            return;
        }

          if (!isConnectedToWifi && !isCloudEnvironment) {
      setMessage('You must be connected to the AinwikConnect WiFi to punch in.')
      return
    }



        try {
            
            const response = await fetch (`${API_BASE_URL}/punchin`, {
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
            const formattedTime = formatDateTime(data.punchIn);
            setMessage(`${studentName} Punched in at ${formattedTime}`);
            // const formattedTime = formatDateTime(data.punchIn, 'Asia/Kolkata')
            // setMessage(`${studentName} Punched in at ${formattedTime}`);

            fetchAttendanceRecords();

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

        if (!isConnectedToWifi && !isCloudEnvironment) {
          setMessage('You must be connected to the AinwikConnect WiFi to punch out.')
          return
        }

        try {
            const response = await fetch (`${API_BASE_URL}/punchout`, {
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

            const formattedPunchOut = formatDateTime(data.punchOut);
            setMessage(`${studentName} Punched out at ${formattedPunchOut}. Total time: ${data.totalTime}`);

            // const formattedPunchOut = formatDateTime(data.punchOut, 'Asia/Kolkata')
            //   setMessage(`${studentName} Punched out at ${formattedPunchOut}. Total time: ${data.totalTime}`)

              fetchAttendanceRecords();
              
        } catch (error) {
            setMessage('Failed to punch out. Please try again.')
        }
    }

    const fetchAttendanceRecords = async () => {
      
          try {
            const response = await fetch(`${API_BASE_URL}/attendance`)
            if (!response.ok) {
              throw new Error('Failed to fetch attendance records')
            }
            const data = await response.json()
            console.log('Fetched attendance records:', data)
            setAttendanceRecords(data)
          } catch (error) {
            console.error('Error fetching attendance records:', error)
            setMessage('Failed to fetch attendance records. Please try again.')
          }
        }
    
      useEffect(() => {
          fetchAttendanceRecords()
          checkWifiConnection()
          const intervalId = setInterval(checkWifiConnection,10000)
          return ()=>clearInterval(intervalId)
      }, [])


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
          onClick={handlePunchIn} disabled={!isConnectedToWifi && !isCloudEnvironment}>Punch In</button>

    <button style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor:'#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            width: '15%'
          }} 
          onClick={handlePunchOut} disabled={!isConnectedToWifi && !isCloudEnvironment}>punch Out</button>


<div>{message && (
        <p style={{ marginTop: '20px', color: '#333' }}>{message}</p>
      )}</div>

{!isConnectedToWifi && !isCloudEnvironment && (
        <p className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded">
          You are not connected to the AinwikConnect WiFi. Attendance registration is disabled.
        </p>
      )}


<div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Attendance Records</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Student Name</th>
                <th className="border border-gray-300 p-2">Punch In Time</th>
                <th className="border border-gray-300 p-2">Punch Out Time</th>
                <th className="border border-gray-300 p-2">Total Time</th>
              </tr>
            </thead>
            <tbody>
            {attendanceRecords.map((record, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{record.studentName}</td>
                    <td className="border border-gray-300 p-2">{formatDateTime(record.punchIn)}</td>
                    <td className="border border-gray-300 p-2">{formatDateTime(record.punchOut)}</td>
                    <td className="border border-gray-300 p-2">{record.totalTime || 'N/A'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default Attendance