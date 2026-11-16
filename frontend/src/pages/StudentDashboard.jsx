import { useEffect, useState } from "react";
import Header from "../components/Header";
import BackButton from "../components/BackButton";
import { apiUrl } from "../services/api";
import "../css/StudentDashboard.css";

const defaultProfileImage = "https://i.pinimg.com/236x/5a/bd/98/5abd985735a8fd4adcb0e795de6a1005.jpg?nii=t";

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const getProfileImageKey = () =>
    `profileImage_student_${localStorage.getItem("studentId") || "guest"}`;
  const [profileImage, setProfileImage] = useState(
    () => localStorage.getItem(getProfileImageKey()) || defaultProfileImage
  );

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
        `${apiUrl("getStudentDashboard.php")}?studentId=${studentId}`
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

  useEffect(() => {
    const profileImageKey = getProfileImageKey();
    const syncProfileImage = () => {
      setProfileImage(localStorage.getItem(profileImageKey) || defaultProfileImage);
    };

    syncProfileImage();
    window.addEventListener("profileImageChanged", syncProfileImage);
    return () => window.removeEventListener("profileImageChanged", syncProfileImage);
  }, []);

  useEffect(() => {
    fetchStudentDashboard();
  }, []);

  useEffect(() => {
    const upcomingBooks = issuedBooks.filter((book) => {
      if (book.status !== "Issued" || !book.returnDate) return false;

      const dueDate = new Date(book.returnDate);
      const today = new Date();
      dueDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const daysUntilDue = Math.ceil(
        (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      return daysUntilDue >= 0 && daysUntilDue <= 3;
    });

    if (upcomingBooks.length > 0) {
      const firstBook = upcomingBooks[0];
      const dueDate = new Date(firstBook.returnDate);
      const today = new Date();
      dueDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const daysUntilDue = Math.ceil(
        (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      const dueText = daysUntilDue === 0 ? "today" : `in ${daysUntilDue} day(s)`;
      alert(`${upcomingBooks.length} book(s) due soon. ${firstBook.bookTitle} is due ${dueText}.`);
    }
  }, [issuedBooks]);

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem(getProfileImageKey(), reader.result);
      setProfileImage(reader.result);
      window.dispatchEvent(new Event("profileImageChanged"));
    };
    reader.readAsDataURL(file);
  };

  const removeProfileImage = () => {
    localStorage.removeItem(getProfileImageKey());
    setProfileImage(defaultProfileImage);
    window.dispatchEvent(new Event("profileImageChanged"));
  };

  // Calculate late days
  const calculateLateDays = (book) => {
    if (!book.returnDate) {
      return 0;
    }

    const dueDate = new Date(book.returnDate);
    const today = new Date();

    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // If book is returned
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

    // If book is still issued
    const difference =
      today.getTime() - dueDate.getTime();

    const days = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    return days > 0 ? days : 0;
  };

  const calculateFine = (book) => {
    if (book.status !== "Issued" && book.fineStatus === "Paid") {
      return 0;
    }

    return calculateLateDays(book) * 10;
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

  // Total books
  const totalBooks = issuedBooks.length;

  // Currently issued books
  const issuedCount = issuedBooks.filter(
    (book) => book.status === "Issued"
  ).length;

  // Returned books
  const returnedCount = issuedBooks.filter(
    (book) => book.status === "Returned"
  ).length;

  const totalFine = issuedBooks
    .filter((book) => book.fineStatus !== "Paid")
    .reduce((total, book) => total + calculateFine(book), 0);

  const dueSoonBooks = issuedBooks.filter((book) => {
    if (book.status !== "Issued" || !book.returnDate) return false;
    const dueDate = new Date(book.returnDate);
    const today = new Date();
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const daysUntilDue = Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilDue >= 0 && daysUntilDue <= 3;
  });

  return (
    <>
      <div className="student-main-content">

      <Header
        name={student.name}
        role="student"
        profile={student}
      />

      <BackButton />

      {/* Welcome Section */}

      <div className="student-welcome" id="dashboard">

        <h1>
          Welcome {student.name || "Student"} 👋
        </h1>

        <p>
          Here is your library account information.
        </p>

      </div>

      {/* Statistics Cards */}

      <div className="student-stats">

        <div className="student-stat-card">

          <h2>
            {totalBooks}
          </h2>

          <p>
            Total Books
          </p>

        </div>


        <div className="student-stat-card">

          <h2>
            {issuedCount}
          </h2>

          <p>
            Currently Issued
          </p>

        </div>


        <div className="student-stat-card">

          <h2>
            {returnedCount}
          </h2>

          <p>
            Returned Books
          </p>

        </div>

        <div className="student-stat-card">

          <h2>
            ₹{totalFine}
          </h2>

          <p>
            Total Fine
          </p>

        </div>


      </div>

      {dueSoonBooks.length > 0 && (
        <div className="student-due-soon-alert">
          <h2>Due Date Reminder</h2>
          <p>{dueSoonBooks.length} issued book(s) are due within the next 3 days.</p>
          {dueSoonBooks.map((book) => (
            <div className="due-soon-book" key={book._id}>
              <strong>{book.bookTitle}</strong>
              <span>Due: {book.returnDate}</span>
            </div>
          ))}
        </div>
      )}


      {/* Profile */}

      <div className="student-profile">

        <h2>
          My Profile
        </h2>

        <div className="student-profile-picture">
          <label className="student-profile-picker" title="Choose profile picture">
            <img src={profileImage} alt="Student profile" />
            <span aria-hidden="true">+</span>
            <input type="file" accept="image/*" onChange={handleProfileImageChange} />
          </label>
          <div>
            <strong>Profile picture</strong>
            <p>Tap the image to upload a new picture.</p>
            {localStorage.getItem(getProfileImageKey()) && (
              <button type="button" onClick={removeProfileImage}>Remove picture</button>
            )}
          </div>
        </div>


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


      {/* My Books */}

      <div className="student-books" id="my-books">

        <h2>
          My Books
        </h2>


        <div className="student-table-container">

          <table>

            <colgroup>
              <col className="student-book-column" />
              <col className="student-date-column" />
              <col className="student-date-column" />
              <col className="student-date-column" />
              <col className="student-status-column" />
              <col className="student-status-column" />
            </colgroup>

            <thead>

              <tr>

                <th>
                  Book
                </th>

                <th>
                  Issue Date
                </th>

                <th>
                  Return Date
                </th>

                <th>
                  Returned Date
                </th>

                <th>
                  Fine Status
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {issuedBooks.length > 0 ? (

                issuedBooks.map((book) => {

                  const lateDays =
                    calculateLateDays(book);
                  const fine = calculateFine(book);
                  const fineStatus = book.fineStatus === "Paid" && book.paidDate
                    ? "Paid"
                    : fine <= 0
                      ? "Not Fine"
                      : "Unpaid";

                  return (

                    <tr
                      key={book._id}
                    >

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

                        <span
                          className={
                            fineStatus === "Paid"
                              ? "student-fine-paid"
                              : fineStatus === "Unpaid"
                                ? "student-fine-unpaid"
                                : "student-fine-none"
                          }
                        >
                          {fineStatus}
                        </span>

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
                    colSpan="6"
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
    </>
  );
}

export default StudentDashboard;