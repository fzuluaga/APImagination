// src/SearchPage.js
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const sessionId = "uniqueSessionId123"; // Example session ID
  const navigate = useNavigate();

  const searchBooks = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/books/search?q=${query}`);
      const books = response.data;
      navigate("/results", { state: { books } });
    } catch (error) {
      console.error("Error searching for books", error);
    }
  };

  return (
    <div>
      <h1>Book Search</h1>
      <input
        type="text"
        placeholder="Search for books"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchBooks}>Search</button>
      <div className = "results-grid">
        {books.map((book) => (
          <div key={book.id}>
            <img
                            src={book.volumeInfo.imageLinks?.thumbnail}
                            alt={book.volumeInfo.title}
                            onClick={() => navigate(`/book/${book.id}`)} // Navigate on thumbnail click
                            style={{ cursor: 'pointer' }}
                        />
            <h3>{book.volumeInfo.title}</h3>
            <p>{book.volumeInfo.authors?.[0]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;
