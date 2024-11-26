import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function UpdatedCourse() {
  const { courseId } = useParams();  // Get course ID from URL
  const [courseHeading, setCourseHeading] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate(); // To navigate after updating

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`https://ainwik-app-4.onrender.com/api/courses/${courseId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course details');
        }
        const data = await response.json();
        setCourseHeading(data.heading);
        setCourseDescription(data.description);
        setImage(data.image);
      } catch (err) {
        setError('Error fetching course details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('courseHeading', courseHeading);
      formData.append('courseDescription', courseDescription);
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch(`https://ainwik-app-4.onrender.com/api/update_course/${courseId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update course');
      }

      const updatedData = await response.json();
      alert('Course updated successfully!');
      navigate('/'); // Redirect to the course list page
    } catch (err) {
      setError('Error updating course'); 
    }
  };

  if (isLoading) {
    return <div className="text-center text-xl">Loading course details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-8">Update Course</h1>

      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="courseHeading" className="block text-sm font-medium text-gray-700">Course Heading</label>
            <input
              type="text"
              id="courseHeading"
              value={courseHeading}
              onChange={(e) => setCourseHeading(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="courseDescription" className="block text-sm font-medium text-gray-700">Course Description</label>
            <textarea
              id="courseDescription"
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="courseImage" className="block text-sm font-medium text-gray-700">Course Image</label>
            <input
              type="file"
              id="courseImage"
              onChange={(e) => setImage(e.target.files[0])}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors mt-4"
          >
            Update Course
          </button>
        </form>
      </div>
    </div>
  );
}
