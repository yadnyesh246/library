import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AddBook from "../components/AddBook";
import "../css/Books.css";

function Books() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editId, setEditId] = useState(null);
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(
        "http://localhost/library-management/backend/api/getBooks.php"
      );

      const data = await response.json();
      console.log(data);
      setBooks(data);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm("Are you sure you want to delete this book?");

    if (!confirmDelete) return;

    const response = await fetch(
      "http://localhost/library-management/backend/api/deleteBook.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      }
    );

    const result = await response.json();

    alert(result.message);

    fetchBooks();

  };
  return (
    <>
      <Sidebar />

      <div className="main-content">
        <Header />

        <div className="book-header">
          <h1>Manage Books</h1>
        </div>

        <AddBook onBookAdded={fetchBooks}
          title={title}
          setTitle={setTitle}
          author={author}
          setAuthor={setAuthor}
          category={category}
          setCategory={setCategory}
          quantity={quantity}
          setQuantity={setQuantity}
          editId={editId}
          setEditId={setEditId} />

        <div className="book-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {books.length > 0 ? (
                books.map((book) => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.category}</td>
                    <td>{book.quantity}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setEditId(book._id);
                          setTitle(book.title);
                          setAuthor(book.author);
                          setCategory(book.category);
                          setQuantity(book.quantity);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(book._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No Books Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Books;