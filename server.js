// server.js
const express = require("express");
const axios = require("axios");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

// Connect to MySQL Database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Feli0211",
  database: "book_app"
});

db.connect(err => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

const createTableSQL = `
  CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    thumbnail TEXT,
    session_id VARCHAR(255) NOT NULL,
    UNIQUE KEY unique_book_session (book_id, session_id)
  )`;

db.query(createTableSQL, (err) => {
  if (err) throw err;
  console.log("Favorites table checked/created");
});

// Route to search for books using Google Books API
app.get("/api/books/search", async (req, res) => {
  const query = req.query.q;
  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
    res.json(response.data.items);
  } catch (error) {
    console.error("Error fetching data from Google Books API", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to save a favorite book
app.post("/api/favorites", (req, res) => {
  const { bookId, title, author, thumbnail, sessionId } = req.body;
  const sql = "INSERT INTO favorites (book_id, title, author, thumbnail, session_id) VALUES (?, ?, ?, ?, ?)";
  
  db.query(sql, [bookId, title, author, thumbnail, sessionId], (err, result) => {
    if (err) {
      console.error("Error saving favorite book", err);
      res.status(500).json({ message: "Database error" });
    } else {
      res.status(200).json({ message: "Favorite saved successfully" });
    }
  });
});

// Route to get favorite books
app.get("/api/favorites", (req, res) => {
  const sessionId = req.query.sessionId;
  const sql = "SELECT * FROM favorites WHERE session_id = ?";
  
  db.query(sql, [sessionId], (err, results) => {
    if (err) {
      console.error("Error retrieving favorites", err);
      res.status(500).json({ message: "Database error" });
    } else {
      res.json(results);
    }
  });
});

// Add this new route for deleting favorites
app.delete("/api/favorites/:bookId", (req, res) => {
  const { bookId } = req.params;
  const { sessionId } = req.query;
  
  const sql = "DELETE FROM favorites WHERE book_id = ? AND session_id = ?";
  
  db.query(sql, [bookId, sessionId], (err, result) => {
    if (err) {
      console.error("Error deleting favorite book", err);
      res.status(500).json({ message: "Database error" });
    } else {
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Favorite not found" });
      } else {
        res.status(200).json({ message: "Favorite deleted successfully" });
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
