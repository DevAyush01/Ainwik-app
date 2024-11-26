import React, { useState, useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewCourse() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://ainwik-app-4.onrender.com/api/courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        console.log('Fetched courses:', data);
        setCourses(data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Error fetching courses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleUpdateClick = (courseId)=>{
      navigate(`/update-course/${courseId}`)
  }


  if (isLoading) {
    return <div className="text-center text-xl">Loading courses...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-8">Courses</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {courses.map(course => (
          <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={course.image} alt={course.heading} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{course.heading}</h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <button
                onClick={() => handleUpdateClick(course._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
}
