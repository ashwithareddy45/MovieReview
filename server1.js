require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Required for handling file paths

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files (background images, CSS, etc.)
app.use(express.static(path.join(__dirname, 'public'))); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas ✅"))
.catch(err => console.error("MongoDB connection error ❌", err));

app.get('/', (req, res) => {
    res.send('Welcome to the Movie Review API!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));

const Review = require('./models/Review'); // Import the Review model

// Route to Create a New Review
app.post('/reviews', async (req, res) => {
    try {
        const { movieName, reviewer, rating, comment } = req.body;
        const newReview = new Review({ movieName, reviewer, rating, comment });
        await newReview.save();
        res.status(201).json({ message: "Review added successfully!", review: newReview });
    } catch (error) {
        res.status(500).json({ error: "Failed to add review" });
    }
});

// Route to Get All Reviews
app.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
});

// Route to Delete a Review
app.delete('/reviews/:id', async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Review deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete review" });
    }
});