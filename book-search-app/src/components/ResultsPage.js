// src/ResultsPage.js
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Retrieve search results from the state passed during navigation
    if (location.state && location.state.books) {
      setBooks(location.state.books.slice(0, 9)); // Limit to 6 results
    }
  }, [location.state]);

  return (
    <div>
      <h1>Search Results</h1>
      <div div style={{ display: "flex", flexWrap: "wrap" }}>
        {books.map((book) => (
          <div key={book.book_id} style={{ width: "30%", margin: "10px", textAlign: "center" }}>
            <img
              src={book.volumeInfo.imageLinks?.thumbnail}
              alt={book.volumeInfo.title}
              onClick={() => navigate(`/book/${book.id}`)}
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

export default ResultsPage;
