const express = require('express')
const app = express()
const Slider = require('../config/Slider');
const {upload} = require('../multerConfig');


app.post('/add_image',upload.single('image'), async(req,res)=>{
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const newSlider = new Slider({
        images : req.file.filename
    })

    newSlider.save()
    .then(() => res.status(201).json({
        message: 'Image uploaded successfully',
        imageId: newSlider._id,
        image: newSlider.image
      }))
        .catch(err => {
            console.log(err);
            res.status(500).send('Error occurred while saving the image');
        });

})

app.put('/update_image/:_id', upload.single('image'),async (req,res)=>{
     
    try {
        const SliderId = req.params._id;
        const slider = await Slider.findById(SliderId);

        if (!slider) {
            return res.status(404).json({ message: 'Image not found' });
        }

        if (req.file) {
            
            slider.images = req.file.path;
        } else {
            return res.status(400).json({ message: 'No new image provided' });
        }

        await slider.save();

        res.status(200).json({
            message: 'Image updated successfully',
            imageId: slider._id,
            image: slider.images
        });
    } catch (error) {
        console.error('Error updating image:', error);
        res.status(500).json({
            message: 'Error updating image',
            error
        });
    }

})

app.delete('/delete_image/:_id', async (req, res) => {
    try {
        const sliderId = req.params._id;
        const slider = await Slider.findById(sliderId);

        if (!slider) {
            return res.status(404).json({ message: 'Slider not found' });
        }

        await Slider.findByIdAndDelete(sliderId);

        res.status(200).json({
            message: 'Image deleted successfully',
            imageId: sliderId
        });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({
            message: 'Error deleting image',
            error: error.message
        });
    }
})

app.get('/get_images', async (req, res) => {
    try {
        const sliders = await Slider.find();
        
        if (!sliders || sliders.length === 0) {
            return res.status(404).json({ message: 'No images found' });
        }

        const images = sliders.map(slider => ({
            id: slider._id,
            image: slider.images
        }));

        res.status(200).json({
            message: 'Images retrieved successfully',
            images: images
        });
    } catch (error) {
        console.error('Error retrieving images:', error);
        res.status(500).json({
            message: 'Error retrieving images',
            error: error.message
        });
    }
});

module.exports = app