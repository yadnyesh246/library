import { useEffect, useState } from "react";
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

      if (!studentId) {
        alert("Student information not found");
        setLoading(false);
        return;
      }

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

  const calculateLateDays = (book) => {
    if (!book.returnDate) {
      return 0;
    }

    const dueDate = new Date(book.returnDate);
    const today = new Date();

    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (book.status === "Returned") {
      if (!book.actualReturnDate) {
        return 0;
      }

      const actualReturnDate = new Date(book.actualReturnDate);
      actualReturnDate.setHours(0, 0, 0, 0);

      const difference =
        actualReturnDate.getTime() - dueDate.getTime();

      const days = Math.ceil(
        difference / (1000 * 60 * 60 * 24)
      );

      return days > 0 ? days : 0;
    }

    const difference =
      today.getTime() - dueDate.getTime();

    const days = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    return days > 0 ? days : 0;
  };

  const calculateFine = (book) => {
    if (book.fine !== undefined && book.fine !== null) {
      return Number(book.fine);
    }

    const lateDays = calculateLateDays(book);

    return lateDays * 10;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="loading-container">
        <h2>Student information not found.</h2>
      </div>
    );
  }

  const totalBooks = issuedBooks.length;

  const issuedCount = issuedBooks.filter(
    (book) => book.status === "Issued"
  ).length;

  const returnedCount = issuedBooks.filter(
    (book) => book.status === "Returned"
  ).length;

 const totalFine = issuedBooks
  .filter((book) => book.fineStatus !== "Paid")
  .reduce(
    (total, book) => total + Number(book.fine || 0),
    0
  );
  const overdueBooks = issuedBooks.filter(
    (book) =>
      book.status === "Issued" &&
      calculateLateDays(book) > 0
  );

  return (
    <div className="student-main-content">

      <Header
        name={student.name}
        role="student"
      />

      <div className="student-welcome">
        <h1>
          Welcome {student.name || "Student"} 👋
        </h1>

        <p>
          Here is your library account information.
        </p>
      </div>

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
          <h2>₹{totalFine}</h2>
          <p>Total Fine</p>
        </div>

      </div>

      {overdueBooks.length > 0 && (
        <div className="student-overdue-alert">

          <h2>⚠️ Overdue Books</h2>

          {overdueBooks.map((book) => (
            <div
              className="overdue-book"
              key={book._id}
            >
              <p>
                <strong>{book.bookTitle}</strong>
              </p>

              <p>
                Late Days: {calculateLateDays(book)}
              </p>

              <p>
                Current Fine: ₹{calculateFine(book)}
              </p>
            </div>
          ))}

        </div>
      )}

      <div className="student-profile">

        <h2>My Profile</h2>

        <div className="profile-row">
          <span className="profile-label">
            Name
          </span>

          <span className="profile-value">
            {student.name || "N/A"}
          </span>
        </div>

        <div className="profile-row">
          <span className="profile-label">
            Email
          </span>

          <span className="profile-value">
            {student.email || "N/A"}
          </span>
        </div>

        <div className="profile-row">
          <span className="profile-label">
            Username
          </span>

          <span className="profile-value">
            {student.username || "N/A"}
          </span>
        </div>

        <div className="profile-row">
          <span className="profile-label">
            Course
          </span>

          <span className="profile-value">
            {student.course || "N/A"}
          </span>
        </div>

        <div className="profile-row">
          <span className="profile-label">
            Year
          </span>

          <span className="profile-value">
            {student.year || "N/A"}
          </span>
        </div>

      </div>

      <div className="student-books">

        <h2>My Books</h2>

        <div className="student-table-container">

          <table>

            <thead>

              <tr>
                <th>Book</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Returned Date</th>
                <th>Late Days</th>
                <th>Fine</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {issuedBooks.length > 0 ? (

                issuedBooks.map((book) => {

                  const lateDays =
                    calculateLateDays(book);

                  const fine =
                    calculateFine(book);

                  return (
                    <tr key={book._id}>

                      <td>
                        {book.bookTitle}
                      </td>

                      <td>
                        {book.issueDate || "-"}
                      </td>

                      <td>
                        {book.returnDate || "-"}
                      </td>

                      <td>
                        {book.actualReturnDate || "-"}
                      </td>

                      <td>
                        {lateDays}
                      </td>

                      <td>
                        ₹{fine}
                      </td>

                      <td>

                        {book.status === "Issued" ? (

                          lateDays > 0 ? (

                            <span className="student-status-overdue">
                              Overdue
                            </span>

                          ) : (

                            <span className="student-status-issued">
                              Issued
                            </span>

                          )

                        ) : (

                          <span className="student-status-returned">
                            Returned
                          </span>

                        )}

                      </td>

                    </tr>
                  );
                })

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="student-no-books"
                  >
                    No Books Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default StudentDashboard;