# book-notes-database

Required Dependencies: Express.js, Ejs, Node.js, PostgreSQL(pgAdmin 4 used), axios, nodemon. 

First install node from web.
Then install the dependencies as npm i package_name or npm install package_name.
Eg: npm i express, npm i ejs, npm i pg, etc. (In terminal)

For database used pgAdmin 4:
Create an postgres table schema as:

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

After creating table there are two files index.js and server.js.
In index.js in the created postgres client assign your own database info.

The server.js is an api intergration to GET endpoints with api and uses Axios to send http request and handle responses.
