import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import { apiUrl } from "../services/api";
import "../css/Dashboard.css";

function AdminDashboard() {

  const [stats, setStats] = useState({
    totalBooks: 0,
    totalStudents: 0,
    issuedBooks: 0,
    returnedBooks: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [books, setBooks] = useState([]);
  const [returnedByBook, setReturnedByBook] = useState({});

  const fetchBooks = async () => {
    try {
      const response = await fetch(apiUrl("getBooks.php"));
      const data = await response.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Dashboard Books Error:", error);
    }
  };

  const fetchReturnedBooks = async () => {
    try {
      const response = await fetch(apiUrl("getIssuedBooks.php"));
      const data = await response.json();
      const returnedCounts = (Array.isArray(data) ? data : []).reduce((counts, issuedBook) => {
        if (String(issuedBook.status || "").toLowerCase() === "returned") {
          counts[issuedBook.bookId] = (counts[issuedBook.bookId] || 0) + 1;
        }

        return counts;
      }, {});

      setReturnedByBook(returnedCounts);
    } catch (error) {
      console.log("Returned Books Error:", error);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch(apiUrl("getBookRequests.php"));
      const data = await response.json();
      setPendingRequests(Array.isArray(data) ? data.length : 0);
    } catch (error) {
      console.log("Book Requests Error:", error);
    }
  };

  const fetchDashboardStats = async () => {

    try {

      const response = await fetch(
        apiUrl("getDashboardStats.php")
      );

      const data = await response.json();

      if (data.status === "success") {

        setStats({
          totalBooks: data.totalBooks,
          totalStudents: data.totalStudents,
          issuedBooks: data.issuedBooks,
          returnedBooks: data.returnedBooks
        });

        setRecentActivity(data.recentActivity);
      }

    } catch (error) {

      console.log("Dashboard Error:", error);

    }
  };

  useEffect(() => {
    localStorage.setItem("profileRole", "admin");
    fetchDashboardStats();
    fetchPendingRequests();
    fetchBooks();
    fetchReturnedBooks();
  }, []);

  const booksBySubject = books.reduce((groups, book) => {
    const subject = String(book.category || "Uncategorized").trim() || "Uncategorized";

    if (!groups[subject]) {
      groups[subject] = [];
    }

    groups[subject].push(book);
    return groups;
  }, {});

  return (
    <>
      <Sidebar />

      <div className="dashboard-content">

        <Header />

        {pendingRequests > 0 && (
          <Link className="book-request-notice" to="/book-requests">
            <span aria-hidden="true">✓</span>
            {pendingRequests} student book request(s) waiting for admin approval
          </Link>
        )}

        {/* Dashboard Cards */}

        <div className="cards">

          <div className="card total-books-card">
            <h2>{stats.totalBooks}</h2>
            <p>Total Subject Books</p>
          </div>

          <div className="card">
            <h2>{stats.totalStudents}</h2>
            <p>Total Students</p>
          </div>

          <div className="card">
            <h2>{stats.issuedBooks}</h2>
            <p>Issued Books</p>
          </div>

          <div className="card">
            <h2>{stats.returnedBooks}</h2>
            <p>Returned Books</p>
          </div>

        </div>

        <section className="subject-books-panel" aria-label="Subject category-wise books">
          <h2>Subject Category-wise Books</h2>
          <div className="subject-books">
            {Object.entries(booksBySubject).length > 0 ? (
              Object.entries(booksBySubject).sort(([first], [second]) => first.localeCompare(second)).map(
                ([subject, subjectBooks]) => (
                  <details className="subject-dropdown" key={subject}>
                    <summary>
                      <span>{subject}</span>
                      <strong>{subjectBooks.length} book(s)</strong>
                    </summary>
                    <div className="subject-book-list">
                      {subjectBooks.map((book) => (
                        <div className="subject-book" key={book._id}>
                          <div>
                            <strong>{book.title}</strong>
                            <span>{book.author}</span>
                          </div>
                          <small>
                            Total: {book.totalQuantity ?? book.quantity ?? 0} | Available: {book.available ?? book.quantity ?? 0} | Issued: {book.issued ?? 0} | Returned: {returnedByBook[book._id] ?? 0}
                          </small>
                        </div>
                      ))}
                    </div>
                  </details>
                )
              )
            ) : (
              <span className="subject-books-empty">No books found</span>
            )}
          </div>
        </section>


        {/* Recent Activity */}

        <div className="recent-activity">

          <h2>Recent Activity</h2>

          <table>

            <thead>

              <tr>
                <th>Student</th>
                <th>Book</th>
                <th>Status</th>
                <th>Date</th>
              </tr>

            </thead>

            <tbody>

              {recentActivity.length > 0 ? (

                recentActivity.map((activity, index) => (

                  <tr key={index}>

                    <td>
                      {activity.studentName}
                    </td>

                    <td>
                      {activity.bookTitle}
                    </td>

                    <td>
                      {activity.status}
                    </td>

                    <td>
                      {activity.date}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td colSpan="4">
                    No Recent Activity
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

export default AdminDashboard;