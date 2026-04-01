const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');

const server = express();

// make sure u add this line when you are using Express to do form (POST)
server.use(express.urlencoded({ extended: true }));

// express.json() is a middleware
server.use(express.json());

// Set EJS as the view engine for rendering dynamic HTML pages
server.set("view engine", "ejs"); 

// if running locally, “http://localhost:8000/index.html” 
// should load the home page of your application
server.use('/', express.static('public'));

// Specify the path to the environment variablef file 'config.env'
dotenv.config({ path: './config.env' });

// Allow session storage while server is running
server.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

// Routing
server.use('/account', require('./routes/accounts-routes'));
server.use('/movie', require('./routes/movies-routes'));
server.use('/review', require('./routes/reviews-routes'));
server.use('/report', require('./routes/reports-routes'));
server.use('/booking', require('./routes/bookings-routes'));

// async function to connect to DB
async function connectDB() {
  try {
    // connecting to Database with our config.env file and DB is constant in config.env
    await mongoose.connect(process.env.DB);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

function startServer() {
  const hostname = "localhost"; // Define server hostname
  const port = 8000;// Define port number
 
  // Start the server and listen on the specified hostname and port
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}


// call connectDB first and when connection is ready we start the web server
connectDB().then(startServer);


