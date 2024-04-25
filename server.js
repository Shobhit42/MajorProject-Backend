const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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

// Routes
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
  
    const newUser = new User({ name, email, password });
  
    newUser.save()
      .then(() => {
        res.status(200).json({ message: 'User registered successfully' });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Failed to register user' });
      });
  });
  

  app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    User.findOne({ email, password })
      .then((user) => {
        if (!user) {
          res.status(404).json({ error: 'User not found' });
        } else {
          res.status(200).json({ message: 'Login successful', user });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Failed to login' });
      });
  });
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
