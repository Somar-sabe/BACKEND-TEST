// index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://somar_96:0934491127sS@cluster0.zh1ifjm.mongodb.net/?retryWrites=true&w=majority';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB client
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to the MongoDB database
client.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');

  // Start the server after the database connection is established
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello, this is the backend for the test project!');
});

// Import and use the 'users' routes from users.js
const usersRouter = require('./users');
app.use('/api', usersRouter);


// ...

