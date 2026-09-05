#Movie Ticketing Website
Created using EJS, CSS for frontend and Node.js, Javascript for Backend (CRUD features)

Setting up the application:
This application uses MongoDB Atlas.
Ensure MongoDB Compass is installed.

Step 1 - Setting Up Database:
- create "config.env" file under root folder with the following configurations:
DB=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTERADDRESS/<DBNAME>?retryWrites=true&w=majority
SECRET=<SECRETSTRING>

1. Create a new database in Atlas
2. Select Node.js as the Driver and copy the USERNAME, PASSWORD and CLUSTERADDRESS to the "config.env" file
    - Ensure that username and password does not contain any special characters.
    - Replace <USERNAME> with your mongodb username and the <PASSWORD> to your actual password.
    - Replace the <CLUSTERADDRESS> with your own from the connection string.
    - Replace <DBNAME> as "IS113Project"
    - Replace <SECRETSTRING> with your desired SECRET string. (to improve Security)

Step 2 - Setup node project: 
- Right-click "server.js" and select "Open in Integrated Terminal"

Note: *ensure currently not running other applications*
Step 3 - Run the following commands in the terminal:
- run "npm init"
- run "npm i express ejs nodemon mongoose dotenv bcrypt express-session"

Step 4 - Running the application:
- run "nodemon server.js" to start the server.

Step 5 - Ensuring connectivity with MongoDB
- There should be 7 Schemas (movies, accounts, bookings, reviews, favourites, reports, votes)

Step 6 - Importing Data
- Select "movies" schema in MongoDB Compass App
- Import the "movies-data.json" found under "data" folder

You should see 10 movies generated under the "movies" Schema


Creating Accounts (User / Admin)
- Create new "user" account through "/account/register"
- Manually change account "role" in MongoDB Compass to "admin" to get administrative permissions (prevent normal users from becoming admin)

FEATURES + INDIVIDUAL CONTRIBUTIONS:
- GUESTS (No Account):
    CHIN JUN WEN
    - Browse available movies
    - Search available movies
    - View Movie details
    - View Movie reviews 
    - Create new accounts with "user" role (register)
    - Login with account created

    ENG YU JIA
    - Browse other user's profiles homepage (in reviews)

- USER:
    CHIN JUN WEN
    - View available movies
    - Search available movies
    - View Movie details
    
    ENG YU JIA
    - Personal profile homepage (display all reviews made)
    - Update personal account (name, email, bio, profile picture)
    - Update password (hashed)
    - Delete own account
    
    ENG YU JIA
    - Create report on other user's reviews (rude, spoilers etc.)

    CHIN JUN WEN
    - Add movie reviews (rating, watched/not watched, comments)
    - View Movie reviews 
    - Update previous movie reviews
    - Remove own previous reviews
    - View personal watchlist

    CHIN JUN WEN
    - Create bookings to watch movie (buy tickets)
    - View previous bookings
    - View available seating for selected timeslot (date, time)
    - Update previous bookings
    - Delete previous bookings (refund booking)

    BRYAN LIEVERANO
    - Create new favourite movie
    - View all favourited movies
    - Update ranking of favourited movies
    - Delete movie from favourites

    CHEW YU XUAN
    - Create new vote for movie (counter)
    - View current total upvotes / total downvotes
    - Update vote status (upvote / down vote)
    - Delete vote (no vote)


- ADMIN:
    - Manually change role from "user" to "admin" in MongoDB Accounts Schema to become admin
    - Admin can perform all user features
    - Admin can perform sensitive data configurations (e.g, delete existing users / reviews)

    ISAAC HIEW YI HE
    - Create new movie
    - View all current movies available
    - Update existing movie
    - Delete existing movie
    - Delete other user's movie reviews
    
    ISAAC HIEW YI HE
    - Demote account "admin" role to "user"
    - Promote account "user" role to "admin"
    - Delete "user" accounts

    ENG YU JIA
    - View all movie reviews reported 
    - Ignore / Delete reviews report made by other users
    - Filter reported based on "Pending" / "Deleted" / "Dismissed"
