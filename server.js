import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app  = express();
const port = 3000;
const API_URL = "http://localhost:4000";


app.use(bodyParser.urlencoded( { extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());

app.get("/", async (req, res) => {

    try{

        const response = await axios.get(`${API_URL}/books`);
        const book_notes = response.data;
        res.render("index.ejs", { book_notes: book_notes });
    }   catch (error) {
        console.error("Error retrieving data from the database:", error);
        res.status(500).send("Internal Server Error");
    }

});

// server get sort on title
app.get("/title", async (req, res) => {

    try{

        const response = await axios.get(`${API_URL}/books/sort/title`);
        const book_notes = response.data;
        res.render("index.ejs", { book_notes: book_notes });
    }   catch (error) {
        console.error("Error retrieving data from the database:", error);
        res.status(500).send("Internal Server Error");
    }

});

// server get sort on latest book
app.get("/latest", async (req, res) => {

    try{

        const response = await axios.get(`${API_URL}/books/sort/newest`);
        const book_notes = response.data;
        res.render("index.ejs", { book_notes: book_notes });
    }   catch (error) {
        console.error("Error retrieving data from the database:", error);
        res.status(500).send("Internal Server Error");
    }

});

// server get sort on highest rating
app.get("/highest", async (req, res) => {

    try{

        const response = await axios.get(`${API_URL}/books/sort/rating`);
        const book_notes = response.data;
        res.render("index.ejs", { book_notes: book_notes });
    }   catch (error) {
        console.error("Error retrieving data from the database:", error);
        res.status(500).send("Internal Server Error");
    }

});

app.get("/views", (req,res) => {

    res.render("book.ejs");

});

app.get("/views/:id", async (req, res) => {

    try{

        const response = await axios.get(`${API_URL}/books/${req.params.id}`);
        console.log(response.data);
        res.render("book.ejs", { book: response.data });
    }   catch (error) {
        console.error("Error retrieving data from the database:", error);
        res.status(500).send("Internal Server Error");
    }

});

app.get("/new", (req, res) => {

    res.render("modify.ejs", { heading: "New Book", submit: "ADD Book"})

});


app.get("/edit/:id", async (req, res) => {
    try {
      const response = await axios.get(`${API_URL}/books/${req.params.id}`);
      console.log(response.data);
      res.render("modify.ejs", {
        heading: "Edit book",
        submit: "Update book",
        book: response.data,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching book" });
    }
});

// new book
app.post("/api/books", async (req, res) => {
    
    try{
        const response = await axios.post(`${API_URL}/books`, req.body);
        console.log(response.data);
        res.redirect("/")
    }   catch (error) {
        res.status(500).json({message: "error adding book or already exists"});
    }
});

// update book
app.post("/api/books/:id", async (req, res) => {

    try{
        const response = await axios.patch(`${API_URL}/books/${req.params.id}`,
        req.body);
        console.log(response.data);
        res.redirect("/");
    } catch(err) {
        res.status(500).json( { message: "Error updating"})
    }

});

// delete a book
app.get("/api/books/delete/:id", async (req,res) => {

    try{
        await axios.delete(`${API_URL}/books/${req.params.id}`);
        res.redirect("/");
    } catch(error) {
        res.status.apply(500).json({ message: "error deleting book"});
    }

});



app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
  });
  