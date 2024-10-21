import React, { useEffect, useState } from 'react';  
import moment from 'moment-timezone';  
  
const API_BASE_URL = 'https://ainwik-app-4.onrender.com/api';
// const API_BASE_URL = 'http://localhost:4455/api'; 
const ALLOWED_LOCATION = { latitude: 28.4731, longitude: 77.5150 };
  
function Attendance() {  
  const [studentName, setStudentName] = useState('');  
  const [message, setMessage] = useState('');  
  const [attendanceRecords, setAttendanceRecords] = useState([]);  
  const [location, setLocation] = useState(null);
  
  const formatDateTime = (timeString) => {  
   // Check for valid input first
   if (!timeString || typeof timeString !== 'string' || timeString === 'N/A') {
    return 'N/A'; // Return early if the input is invalid
}

// Log the input to check format if needed
// console.log('Received timeString:', timeString); 

// Attempt to parse the date
const parsedTime = moment(timeString, moment.ISO_8601);

if (parsedTime.isValid()) {
    return parsedTime.format('YYYY-MM-DD, hh:mm a');
}

// console.warn('Invalid date format:', timeString); // Log warning for invalid format
return 'Invalid Time';
  };  

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position.coords),
          (error) => reject(error)
        );
      }
    });
  };
  
  // const defineStatus = (punchInTime)=>{
  //   const punchIn = moment(punchInTime);
  //   const startTime = moment(punchIn).set({hour : 13 ,minute : 20 , second : 0});
  //   const lateTime = moment(punchIn).set({hour : 13 , minute : 25 , second : 0})

  //   if(punchIn.isBefore(lateTime)){
  //     return 'Present'
  //   }else{
  //     return 'Half Day'
  //   }

  // }


  const handlePunchIn = async () => {  
   if (!studentName) {  
    setMessage('Please enter a student name.');  
    return;  
   }  
  
   try {  
    const coords = await getLocation();
    console.log('Current coordinates:', coords);
    setLocation(coords);

    const response = await fetch(`${API_BASE_URL}/punchin`, {  
      method: 'POST',  
      headers: {  
       'Content-Type': 'application/json',  
      },  
      body: JSON.stringify({
         studentName, 
         latitude: coords.latitude, 
         longitude: coords.longitude 
        }),  
    });  
  
    if (!response.ok) {  
      const errorResponse = await response.json();  
      console.error('Error details:', errorResponse);  
      throw new Error('failed to punch in');  
    }  
  
    const data = await response.json();  
    const formattedTime = formatDateTime(data.punchIn);  
    setMessage(`${studentName} Punched in at ${formattedTime}`);  
    fetchAttendanceRecords();  
   } catch (error) {  
    setMessage('Failed to punch in. Please try again.');  
    console.error('Error saving attendance:', error);  
   }  
  };  
  
  const handlePunchOut = async () => {  
   if (!studentName) {  
    setMessage('Please enter a student name.');  
    return;  
   }  
  
   try {  
    const coords = await getLocation();
      setLocation(coords);


    const response = await fetch(`${API_BASE_URL}/punchout`, {  
      method: 'POST',  
      headers: {  
       'Content-Type': 'application/json',  
      },  
      body: JSON.stringify({
        studentName, 
          latitude: coords.latitude, 
          longitude: coords.longitude 
         }),  
    });  
  
    if (!response.ok) {  
      const errorResponse = await response.json();  
      console.error('Error details:', errorResponse);  
      throw new Error(errorResponse.message || 'Failed to punch out');  
    }  
  
    const data = await response.json();  
  
    console.log('Punch Out Data:', data);  
    if (!data.punchOut) {  
      throw new Error('Invalid punch out time received');  
    }  
  
    const formattedPunchOut = formatDateTime(data.punchOut);  
    setMessage(`${studentName} Punched out at ${formattedPunchOut}. Total time: ${data.totalTime}`);  
  
    fetchAttendanceRecords();  
   } catch (error) {  
    setMessage('Failed to punch out. Please try again.');  
   }  
  };  
  
  const fetchAttendanceRecords = async () => {  
   try {  
    const response = await fetch(`${API_BASE_URL}/attendance`);  
    if (!response.ok) {  
      throw new Error('Failed to fetch attendance records');  
    }  
    const data = await response.json();  
    console.log('Fetched attendance records:', data);  
    setAttendanceRecords(data);  
   } catch (error) {  
    console.error('Error fetching attendance records:', error);  
    setMessage('Failed to fetch attendance records. Please try again.');  
   }  
  };  
  
  useEffect(() => {  
   fetchAttendanceRecords();  
  }, []);  
  
  return (  
   <div>  
    <div>  
      <input  
       type="text"  
       name=""  
       id=""  
       value={studentName}  
       onChange={(e) => setStudentName(e.target.value)}  
      />  
    </div>  
  
    <button  
      style={{  
       padding: '10px 20px',  
       fontSize: '16px',  
       backgroundColor: 'blue',  
       color: 'white',  
       border: 'none',  
       borderRadius: '5px',  
       width: '15%',  
      }}  
      onClick={handlePunchIn}  
    >  
      Punch In  
    </button>  
  
    <button  
      style={{  
       padding: '10px 20px',  
       fontSize: '16px',  
       backgroundColor: '#f44336',  
       color: 'white',  
       border: 'none',  
       borderRadius: '5px',  
       width: '15%',  
      }}  
      onClick={handlePunchOut}  
    >  
      punch Out  
    </button>  
  
    <div>  
      {message && (  
       <p style={{ marginTop: '20px', color: '#333' }}>{message}</p>  
      )}  
    </div>  

    {location && (
        <p className="mb-4">
          Current Location: Latitude {location.latitude.toFixed(4)}, Longitude {location.longitude.toFixed(4)}
        </p>
      )}

      <p className="mb-4">
        Allowed Location: Latitude {ALLOWED_LOCATION.latitude.toFixed(4)}, Longitude {ALLOWED_LOCATION.longitude.toFixed(4)}
      </p>


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
                <th className="border border-gray-300 p-2">Status</th>
              </tr>
            </thead>
            <tbody>
            {attendanceRecords.map((record, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{record.studentName}</td>
                    <td className="border border-gray-300 p-2">{formatDateTime(record.punchIn)}</td>
                    <td className="border border-gray-300 p-2">{formatDateTime(record.punchOut)}</td>
                    <td className="border border-gray-300 p-2">{record.totalTime || 'N/A'}</td>
                    <td className="border border-gray-300 p-2">{record.status || 'N/A'}</td> 
                    
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