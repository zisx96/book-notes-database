# book-notes-database

Welcome to the Book Notes Database project! This project aims to provide a convenient way to store, manage, and access your book notes using a PostgreSQL database and a user-friendly web interface.


## Dependencies

To run this project, you will need the following dependencies:

- Express.js
- Ejs
- Node.js
- PostgreSQL (pgAdmin 4)
- Axios
- Nodemon
- Body-Parser


## Installation

1. **Install Node.js** and npm: Ensure you have Node.js and npm installed on your system. If not, 
download and install them from the official Node.js website.

2. **Install project dependencies**: After installing Node.js, navigate to your project directory in the terminal and run the following command to install dependencies: **npm install**. This command will install all required dependencies listed in the package.json file.

3. **Set up PostgreSQL database**: Use pgAdmin 4 or any other PostgreSQL client to create a database and the necessary table schema. Here's an example schema for storing book notes:

CREATE TABLE IF NOT EXISTS book_notes (
    id SERIAL PRIMARY KEY,
    book_title VARCHAR(255) NOT NULL,
    book_author VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    rating INTEGER NOT NULL,
    summary TEXT NOT NULL,
    notes TEXT NOT NULL,
    isbn TEXT
);

4. **Configure database connection**: In the index.js file, update the PostgreSQL client configuration with your own database connection information.


## Running the Project

After installing dependencies and configuring the database, you can start the server using Nodemon:

1. Open two terminals.
   
2. In the first terminal, run: **nodemon index.js**. This command starts the API server.

3. In the second terminal, run: **nodemon server.js**. This command starts the server for handling web requests.

Once both servers are running, you can access the web interface by navigating to localhost:3000 in your web browser.

Enjoy organizing and managing your book notes with ease using the Book Notes Database project!




