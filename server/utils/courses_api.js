const Course = require("../config/User");
const express = require('express');
const app = express();
const upload = require('../multerConfig')
// app.use('/uploads', express.static('.././uploads'));


app.post('/add_course', upload.single('image'), async (req,res)=>{
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const { courseHeading , courseDescription } = req.body;

    if (!courseHeading) {
        return res.status(400).send('Course heading is required.');
      }
    
      if (!courseDescription) {
        return res.status(400).send('Course description is required.');
      }

    const newCourse = new Course({
        heading: courseHeading,
       description: courseDescription,
       image: req.file.path
    });

    newCourse.save()
    .then(() => res.status(201).json({
        message: 'Course uploaded successfully',
        courseId: newCourse._id,
        heading: newCourse.heading,
        description: newCourse.description,
        image: newCourse.image
      }))
        .catch(err => {
            console.log(err);
            res.status(500).send('Error occurred while saving the image');
        });
  })

  app.get('/courses/:id', async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) {
        return res.status(404).send('Course not found');
      }


      res.json(course);

    } catch (err) {
      res.status(500).send('Error retrieving course');
    }
  });


  app.put('/update_course/:id', upload.single('image'), async (req, res) => {
    try {
        const { courseHeading, courseDescription } = req.body;
        const updateData = {
            heading: courseHeading,
            description: courseDescription
        };

        if (req.file) {
            updateData.image = req.file.path;
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            return res.status(404).send('Course not found');
        }

        res.json({
            message: 'Course updated successfully',
            course: updatedCourse
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating course');
    }
});

app.delete('/delete_course/:id', async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        
        if (!deletedCourse) {
            return res.status(404).send('Course not found');
        }

        res.json({
            message: 'Course deleted successfully',
            courseId: deletedCourse._id
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting course');
    }
});
app.get('/courses', async (req, res) => {
    try {
      const courses = await Course.find();
      res.json(courses);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving courses');
    } 
  });


module.exports = app