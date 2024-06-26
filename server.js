const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors middleware

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://shobhitpra4:Mumbai@cluster0.ewkmpql.mongodb.net/gameverse');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors()); // Add CORS middleware to all routes

// Configure CORS (adjust origins as needed)
const corsOptions = {
  origin: ['http://localhost:3000'], // Replace with your React app's origin
  credentials: true, // Allow cookies for authenticated requests (if applicable)
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(cors(corsOptions)); // Apply CORS configuration with options

// Routes
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = new User({ name, email, password });

    await newUser.save();
    try {
      const user = await User.findOne({ email, password });
      if (user) {
        // Login successful, send user data as JSON
        res.json({ message: 'register successful', user });
      } else {
        // Login failed, send error message as JSON
        res.status(401).json({ error: 'Invalid username or password' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Example login route handler (assuming you have a 'User' model)

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (user) {
      // Login successful, send user data as JSON
      res.json({ message: 'Login successful', user });
    } else {
      // Login failed, send error message as JSON
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
