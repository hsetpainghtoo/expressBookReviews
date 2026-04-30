const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop (curl -X GET http://localhost:5000/)
// Task 10: Using async-await with Promise
public_users.get("/", async function (req, res) {
  try {
    const bookList = await new Promise((resolve, reject) => {
      resolve(books);
    });
    res.status(200).json(bookList);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
// Task 11: Using async-await with Promise
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await new Promise((resolve, reject) => {
      const foundBook = books[isbn];
      if (foundBook) {
        resolve(foundBook);
      } else {
        reject(new Error("Book not found"));
      }
    });
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Get book details based on author
// Task 12: Using async-await with Promise
public_users.get("/author/:author", async function (req, res) {
  try {
    const author = req.params.author.toLowerCase();
    const booksByAuthor = await new Promise((resolve, reject) => {
      const filteredBooks = Object.values(books).filter(
        (book) => book.author.toLowerCase() === author,
      );
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error("No books found by this author"));
      }
    });
    res.status(200).json(booksByAuthor);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Get all books based on title
// Task 13: Using async-await with Promise
public_users.get("/title/:title", async function (req, res) {
  try {
    const title = req.params.title;
    const booksByTitle = await new Promise((resolve, reject) => {
      const filteredBooks = Object.values(books).filter(
        (book) => book.title === title,
      );
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error("No books found with this title"));
      }
    });
    res.status(200).json(booksByTitle);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.send(JSON.stringify(book.reviews));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
