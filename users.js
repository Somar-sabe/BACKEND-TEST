// users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// MongoDB client (already defined in index.js)
const client = ...; // Add the MongoDB client from index.js

// MongoDB collection for users
const usersCollection = client.db('test').collection('users'); // Use the appropriate database and collection name

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate incoming data
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // Check if the email is already registered
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user data to the database
    const newUser = { name, email, password: hashedPassword };
    const result = await usersCollection.insertOne(newUser);

    res.status(201).json({ message: 'User registered successfully.', user: result.ops[0] });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate incoming data
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    // Check if the email exists in the database
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Compare the hashed password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // If the login is successful, you can implement JWT or other authentication mechanisms here

    res.status(200).json({ message: 'Login successful.', user });
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update User Profile
router.put('/profile', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate incoming data
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // Check if the email exists in the database
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Hash the new password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's data in the database
    const updatedUser = { name, email, password: hashedPassword };
    await usersCollection.updateOne({ email }, { $set: updatedUser });

    res.status(200).json({ message: 'Profile updated successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error during user profile update:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
