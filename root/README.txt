Provide step-by-step instructions on:
a. How to set up your application based on the submitted file(s).

Step 1: setup node project: 
- npm init
- npm i express ejs nodemon mongoose dotenv bcrypt express-session
- create new MongoDB compass database, import "movies-data.json" under "data" folder
- There should be 3 Schemas (movies, accounts, reviews)

b. How to run your application.
- run "nodemon server.js" to start the server.

c. If there are any username/password details, include them in this file.
- Create new "user" account through "/account/register"
- Manually change role to "admin" to get administrative permissions

FEATURES:
- GUESTS (No Account):
    - Browse available movies
    - View Movie details
    - View Movie reviews 
    - Create "user" role accounts

- USER:
    - Browse available movies
    - View Movie details
    - View Movie reviews 
    - Update personal account (name, email, password)
    - Label movie as "watched" / "have not watched"
    - Give movie reviews / ratings
    - Remove previous reviews / ratings
    - Browse personal watch list
    - Remove movies from personal watch list

- ADMIN:
    - Manually change role from "user" to "admin" in MongoDB Accounts Schema
    - Possible features:
        - Add new movies to "movies" Schema
        - Update / Delete existing movies
        - Delete rude reviews from other users

