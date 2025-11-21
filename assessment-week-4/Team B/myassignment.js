const express = require('express');
const app = express();
app.use(express.json());

// Storage database
let books = [
  { id: 1, title: "Zero to One", author: "Peter Thiel" },
  { id: 2, title: "The Alchemist", author: "Paulo Coelho" }
];

// -----------------------------
// 1. GET /books  (all books)
// -----------------------------
app.get('/books', (req, res) => {
  res.json(books);
});

// -----------------------------
// 2. GET /books/:id  (single book)
// -----------------------------
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.json(book);
});

// -----------------------------
// 3. POST /books  (create)
// -----------------------------
app.post('/books', (req, res) => {
  const { title, author } = req.body;

  // Basic validation
  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }

  const newBook = {
    id: books.length + 1,
    title,
    author
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

// -----------------------------
// 4. PUT /books/:id  (update)
// -----------------------------
app.put('/books/:id', (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const { title, author } = req.body;

  if (title !== undefined && title.trim() === "") {
    return res.status(400).json({ message: "Title cannot be empty" });
  }

  if (title) book.title = title;
  if (author) book.author = author;

  res.json(book);
});

// -----------------------------
// 5. DELETE /books/:id
// -----------------------------
app.delete('/books/:id', (req, res) => {
  const id = req.params.id;
  const exists = books.some(b => b.id == id);

  if (!exists) {
    return res.status(404).json({ message: "Book not found" });
  }

  books = books.filter(b => b.id != id);
  res.json({ message: "Book deleted successfully" });
});

// -----------------------------
// EXTRA: /books/search?author=John
// -----------------------------
app.get('/books/search', (req, res) => {
  const { author } = req.query;

  if (!author) {
    return res.status(400).json({ message: "Author query is required" });
  }

  const results = books.filter(b =>
    b.author.toLowerCase().includes(author.toLowerCase())
  );

  res.json(results);
});

// -----------------------------
app.listen(3000, () => {
  console.log("Book API running on port 3000");
});
