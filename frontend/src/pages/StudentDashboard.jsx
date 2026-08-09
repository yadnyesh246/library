import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../css/StudentDashboard.css";

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentDashboard();
  }, []);

  const fetchStudentDashboard = async () => {
    try {
      const studentId = localStorage.getItem("studentId");
      const username = localStorage.getItem("username");

      const response = await fetch(
        `http://localhost/library-management/backend/api/getStudentDashboard.php?studentId=${studentId}`
      );

      const data = await response.json();

      if (data.status === "success") {
        setStudent({
          ...data.student,
          username: username || "N/A",
        });

        setIssuedBooks(data.issuedBooks || []);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("Student Dashboard Error:", error);
      alert("Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="student-loading">Loading Dashboard...</div>;
  }
   const totalBooks = issuedBooks.length;

const issuedCount = issuedBooks.filter(
  (book) => book.status === "Issued"
).length;

const returnedCount = issuedBooks.filter(
  (book) => book.status === "Returned"
).length;

const nextReturnBook = issuedBooks
  .filter((book) => book.status === "Issued" && book.returnDate)
  .sort(
    (a, b) =>
      new Date(a.returnDate) - new Date(b.returnDate)
  )[0];
  return (
    <>
      <Sidebar
        name={student.name}
        role="student"
      />

      <div className="student-main-content">
        <Header
          name={student.name}
          role="student"
        />
         
         <div className="student-stats">

  <div className="student-stat-card">
    <h2>{totalBooks}</h2>
    <p>Total Books</p>
  </div>

  <div className="student-stat-card">
    <h2>{issuedCount}</h2>
    <p>Currently Issued</p>
  </div>

  <div className="student-stat-card">
    <h2>{returnedCount}</h2>
    <p>Returned Books</p>
  </div>

  <div className="student-stat-card">
    <h2>
      {nextReturnBook
        ? nextReturnBook.returnDate
        : "No Date"}
    </h2>
    <p>Next Return Date</p>
  </div>

</div>
        {/* Welcome */}
        <div className="student-welcome">
          <h1>
            Welcome {student?.name || "Student"} 👋
          </h1>

          <p>Here is your library account information.</p>
        </div>

        {/* Profile */}
        <div className="student-profile">
          <h2>My Profile</h2>

          <div className="profile-row">
            <span className="profile-label">Name</span>
            <span className="profile-value">
              {student?.name || "N/A"}
            </span>
          </div>

          <div className="profile-row">
            <span className="profile-label">Email</span>
            <span className="profile-value">
              {student?.email || "N/A"}
            </span>
          </div>

          <div className="profile-row">
            <span className="profile-label">Username</span>
            <span className="profile-value">
              {student?.username || "N/A"}
            </span>
          </div>

          <div className="profile-row">
            <span className="profile-label">Course</span>
            <span className="profile-value">
              {student?.course || "N/A"}
            </span>
          </div>

          <div className="profile-row">
            <span className="profile-label">Year</span>
            <span className="profile-value">
              {student?.year || "N/A"}
            </span>
          </div>
        </div>

        {/* Issued Books */}
        <div className="student-books">
          <h2>My Issued Books</h2>

          <div className="student-table-container">
            <table>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Issue Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {issuedBooks.length > 0 ? (
                  issuedBooks.map((book) => (
                    <tr key={book._id}>
                      <td>{book.bookTitle}</td>

                      <td>{book.issueDate}</td>

                      <td>{book.returnDate}</td>

                      <td>
                        {book.status === "Issued" ? (
                          <span className="student-status-issued">
                            Issued
                          </span>
                        ) : (
                          <span className="student-status-returned">
                            Returned
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="student-no-books"
                    >
                      No Issued Books Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;