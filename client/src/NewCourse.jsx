import React, { useEffect, useState } from 'react'
import Marquee from "react-fast-marquee";

function NewCourse() {
  const [courses,setCourses] = useState([])
  const[image,setImage] = useState(null)
  const [courseHeading,setCourseHeading] = useState('')
  const [courseDescription , setCourseDescription] = useState('')

  const fetchCourses = async () => {
    try {
      const response = await fetch('https://ainwik-app-4.onrender.com/api/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  useEffect(()=>{
    fetchCourses()
  },[])

  const handleSubmit = async(e)=>{
     e.preventDefault()

     const formData = new FormData();
     formData.append('courseHeading', courseHeading);
     formData.append('courseDescription', courseDescription);
     formData.append('image', image);

     try {
      const response = await fetch('https://ainwik-app-4.onrender.com/api/add_course', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);

    } catch (error) {
      console.error('Error uploading course:', error);
    }
  };
  return (
    <div className='w-full h-[100vh] border-l-rose-400 flex justify-center items-center'>
        
    {/* <form action="" onSubmit={handleSubmit}>
      <input type="file" name="image" id=""  onChange={(e)=>setImage(e.target.files[0])}/>
      <br />

      <input type="text" name="courseHeading" id="" value={courseHeading} onChange={(e)=>setCourseHeading(e.target.value)} />
      <input type="text" name="courseDescription" id=""  value={courseDescription} onChange={(e)=>setCourseDescription(e.target.value)} />
        
        <button type='submit' className='bg-slate-500'>Submit </button>
    </form> */}
      

      {/* <div className='course-list'>
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course._id} className="course-card border p-4 rounded shadow-md mb-4">
              <h2 className='text-xl font-bold'>{course.heading}</h2>
              <p>{course.description}</p>
              {course.image && <img src={course.image} alt={course.heading} className="mt-2" />}
            </div>
          ))
        ) : (
          <p>No courses available.</p>
        )}
      </div> */}
{/* 
      <Marquee>
      <div style={{ padding: '0 20px' }}>Item 1</div>
      <div style={{ padding: '0 20px' }}>Item 2</div>
      <div style={{ padding: '0 20px' }}>Item 3</div>
      <div style={{ padding: '0 20px' }}>Item 4</div>
      <div style={{ padding: '0 20px' }}>Item 5</div>
    </Marquee> */}
    
    <div style={{
           background: 'whitesmoke',
      padding: '20px 60px',
      overflow: 'hidden',
    }}>
      <Marquee
        speed={50}
        // pauseOnHover={true}
        direction="left"
        style={{ color: '#000', fontSize: '2.0em', fontWeight : 'bolder' }} // Text color and size
      >
        {courses.map((course) => (
          <div key={course._id} style={{ padding: '0 20px' }}>
            {course.heading}
          </div>
        ))}
      </Marquee>
    </div>
      

</div>
  )
}

export default NewCourse