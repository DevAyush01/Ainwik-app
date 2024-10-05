import React, { useState } from 'react'

function NewCourse() {
  const[image,setImage] = useState(null)
  const [courseHeading,setCourseHeading] = useState('')
  const [courseDescription , setCourseDescription] = useState('')

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
        
    <form action="" onSubmit={handleSubmit}>
      <input type="file" name="image" id=""  onChange={(e)=>setImage(e.target.files[0])}/>
      <br />

      <input type="text" name="courseHeading" id="" value={courseHeading} onChange={(e)=>setCourseHeading(e.target.value)} />
      <input type="text" name="courseDescription" id=""  value={courseDescription} onChange={(e)=>setCourseDescription(e.target.value)} />
        
        <button type='submit' className='bg-slate-500'>Submit </button>
    </form>
      

</div>
  )
}

export default NewCourse