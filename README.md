# slammed

This is a web-Slambook made with a node.js backend supported by a mysql database along with handlebars templating engine.

## Features:
1. Authentication that allows users to register and login on to the site.
2. Search bar that allows the user to search for other users by their name and 
3. Search has a filter by department, and hostel name.
4. Profile page of other users facilitating adding and deleting comments about the user.
5. The format of comments is in the form of a few questions.
6. Users can add friends by sending out requests to others or accepting requests from others.
7. User can see up to +3 connections of a profile (similar to LinkedIn).

## Steps to use:
1. Clone the repo
2. Install Dependencies : <table> npm i --save </table>
3. Ensure you have mysql on your server
4. Set up your .env file to link with mysql:

    MY_SQL_HOST =
  
    MY_SQL_USER = 
  
    MY_SQL_PASS =
    
    email = 
    
    passw = 
    
5. Start the server : npm start
6. Server Starts on localhost:3000
