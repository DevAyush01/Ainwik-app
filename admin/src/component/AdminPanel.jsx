import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE_URL = 'https://ainwik-app-4.onrender.com/api'
// const API_BASE_URL = 'http://localhost:4455/api';  


export default function AdminPanel() {
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate(); // for redirection


  useEffect(() => {
    fetchAttendanceRecords()
  }, [])

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/attendance`)
      if (!response.ok) {
        throw new Error('Failed to fetch attendance records')
      }
      const data = await response.json()
      setAttendanceRecords(data)
      setError(null)
    } catch (error) {
      console.error('Error fetching attendance records:', error)
      setError('Failed to fetch attendance records. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateAttendanceStatus = async (id, newStatus) => {
    try {

      const token = localStorage.getItem('adminToken');
      console.log('Token:', token); // Log the token for debugging

      const response = await fetch(`${API_BASE_URL}/attendance/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('adminToken'), // Assuming you store the admin token in localStorage
        },
        body: JSON.stringify({ status: newStatus }),
      })
 
      const updatedRecord = await response.json(); // Log the response for debugging
      console.log('Update Response:', updatedRecord); 

      if (!response.ok) {
        throw new Error('Failed to update attendance status')
      }

      
      setAttendanceRecords(prevRecords =>
        prevRecords.map(record =>
          record.id === updatedRecord.id ? { ...record, status: updatedRecord.status } : record
        )
      )

      toast.success(`Attendance status for ${updatedRecord.studentName} has been updated to ${updatedRecord.status}.`)
    } catch (error) {
      console.error('Error updating attendance status:', error)
      toast.error("Failed to update attendance status. Please try again.")
    }
  }

  const deleteAttendanceRecord = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete attendance record');
      }

      const deletedRecord = await response.json();
      setAttendanceRecords(prevRecords => prevRecords.filter(record => record.id !== id));
      toast.success(`Attendance record for ${deletedRecord.deletedRecord.studentName} has been deleted.`);
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      toast.error("Failed to delete attendance record. Please try again.");
    }
  }

  const formatDateTime = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken'); // Clear the token
    navigate('/login'); // Redirect to the login page
  };

  if (loading) {
    return <div className="text-center p-4">Loading attendance records...</div>
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <button onClick={handleLogout} className="mb-4 bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button>
      <h1 className="text-2xl font-bold mb-4 bg-yellow-100 text-center">Attendance Admin Panel</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Student Name</th>
              <th className="py-2 px-4 border-b text-left">Punch In</th>
              <th className="py-2 px-4 border-b text-left">Punch Out</th>
              <th className="py-2 px-4 border-b text-left">Total Time</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Action</th>
              <th className="py-2 px-4 border-b text-left">Delete</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{record.studentName}</td>
                <td className="py-2 px-4 border-b">{formatDateTime(record.punchIn)}</td>
                <td className="py-2 px-4 border-b">{formatDateTime(record.punchOut)}</td>
                <td className="py-2 px-4 border-b">{record.totalTime}</td>
                <td className="py-2 px-4 border-b">{record.status}</td>
                <td className="py-2 px-4 border-b">
                  <select
                    className="border rounded px-2 py-1"
                    value={record.status}
                    onChange={(e) => updateAttendanceStatus(record.id, e.target.value)}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Half Day">Half Day</option>
                  </select>
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => deleteAttendanceRecord(record.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Toaster />
      </div>
      
    </div>
  )
}