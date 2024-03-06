import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";



const app = express();
const port = 4000;

const db  = new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"your_database",
    password:"your_password",
    port:5432,
});

db.connect();

let book_notes = [];

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));
app.use(bodyParser.json());

// function to get the isbn id for the book
async function getISBNFromTitle(title) {
    try {
        const response = await axios.get(`https://openlibrary.org/search.json?title=${title}`);
        const books = response.data.docs;
        if (books.length > 0 && books[0].isbn) {
            const isbn = books[0].isbn[1]; // Assuming the first result is the correct one
            return isbn;
        } else {
            return null; // No ISBN found
        }
    } catch (error) {
        console.error("Error retrieving ISBN from title:", error);
        throw error;
    }
};

// get all books

app.get("/books", async (req, res) => { 

    const result = await db.query("SELECT id,book_title,book_author,date,rating,summary,isbn FROM book_notes ORDER BY id ASC");
    book_notes = result.rows;
    res.json(book_notes);
});

// sort by book title
app.get("/books/sort/title", async (req, res) => {
    try {
        const result = await db.query("SELECT id, book_title, book_author, date, rating, summary, isbn FROM book_notes ORDER BY book_title ASC");
        const sortedBooks = result.rows;
        res.json(sortedBooks);
    } catch (error) {
        console.error('Error retrieving sorted books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// sort by latest book read
app.get("/books/sort/newest", async (req, res) => {
    try {
        const result = await db.query("SELECT id, book_title, book_author, date, rating, summary, isbn FROM book_notes ORDER BY date DESC");
        const sortedBooks = result.rows;
        res.json(sortedBooks);
    } catch (error) {
        console.error('Error retrieving sorted books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// sort by ratings
app.get("/books/sort/rating", async (req, res) => {
    try {
        const result = await db.query("SELECT id, book_title, book_author, date, rating, summary, isbn FROM book_notes ORDER BY rating DESC");
        const sortedBooks = result.rows;
        res.json(sortedBooks);
    } catch (error) {
        console.error('Error retrieving sorted books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// get specific book by id

app.get("/books/:id", async (req, res) => {
    
    try{
    const id = parseInt(req.params.id);
    // Query to select the post by id
    const result = await db.query("SELECT * FROM book_notes WHERE id = $1",[id]);
    const book = result.rows[0];
    res.json(book);
    } catch(error) {
        console.error('Error executing query', error);
        res.status(500).json({ message: 'Internal server error' });
    };
});

// Add an book

app.post("/books", async (req, res) => {
    const { book_title, book_author, rating, summary, notes } = req.body;
    const isbn = await getISBNFromTitle(book_title);

    try {
        // Convert the book title to lowercase and trim leading/trailing spaces
        const normalizedTitle = book_title.trim().toLowerCase();

        // Check for existing book titles (case-insensitive)
        const existingBook = await db.query("SELECT * FROM book_notes WHERE LOWER(TRIM(book_title)) = $1", [normalizedTitle]);

        if (existingBook.rows.length > 0) {
            // If the book title already exists, return an error response
            return res.status(400).json({ message: "Book title already exists" });
        }

        // Replace newline characters with <br> tags
        const formattedSummary = summary.replace(/\n/g, '<br>');

        // Insert the new book into the database
        await db.query("INSERT INTO book_notes (book_title, book_author, date, rating, summary, notes, isbn) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [book_title, book_author, new Date(), rating, formattedSummary, notes, isbn]);
    
        // Fetch the last inserted row (assuming there's an auto-incremented ID)
        const insertedData = await db.query("SELECT * FROM book_notes ORDER BY id DESC LIMIT 1");
        const book = insertedData.rows[0];

        // Send the fetched data as JSON in the response
        res.status(201).json(book);
    } catch (error) {
        console.error("Error creating new book:", error);
        res.status(500).json({ message: "Error creating new book" });
    }
});

// Update the book

app.patch("/books/:id", async (req, res) => {

    const bookId = parseInt(req.params.id);
    const { rating, summary, notes } = req.body;

    try {
       
        const result = await db.query("SELECT * FROM book_notes WHERE id = $1",[bookId]);
        const book = result.rows[0];
        
        if(!book) {
            return res.status(404).json({ message: "book not found" });
        }

        if (rating) book.rating = rating;
        if (summary) {
            const newSummary = summary.replace(/\n/g, '<br>');
            book.summary = newSummary;
        }
        if (notes) book.notes = notes;

        await db.query("UPDATE book_notes SET rating = $1, summary = $2, notes = $3 WHERE id = $4",
            [book.rating, book.summary, book.notes, bookId]);

        res.json(book);
    } catch (err) {
        console.error('Error updating book:', err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// delete a book

app.delete("/books/:id", async (req,res) => {

    const bookId = parseInt(req.params.id);

    try{
        const result = await db.query("SELECT * FROM book_notes WHERE id = $1",[bookId]);
        const book = result.rows[0];

        if(!book){
            return res.status(404).json({ message: "book not found" });
        }

        await db.query("DELETE FROM book_notes WHERE id = $1", [bookId]);

        res.json({ message: " book deleted"});
    } catch (error) {
        console.error('Error deleting post:', err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
});
  