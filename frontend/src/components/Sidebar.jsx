import { Link } from "react-router-dom";
import "../css/Sidebar.css";

function Sidebar({
  name = "Admin",
  role = "admin"
}) {
  const isStudent = role === "student";

  return (
    <div className="sidebar">

      <h2>📚 Library</h2>

      <ul>

        <li>
          <Link
            to={
              isStudent
                ? "/student-dashboard"
                : "/admin-dashboard"
            }
          >
            Dashboard
          </Link>
        </li>

        {/* Admin Links */}
        {!isStudent && (
          <>
            <li>
              <Link to="/books">
                Manage Books
              </Link>
            </li>

            <li>
              <Link to="/students">
                Students
              </Link>
            </li>
            <li>
              <Link to="/pending-students">
                Pending Students
              </Link>
            </li>
            <li>
              <Link to="/issuebook">
                Issue Book
              </Link>
            </li>
            <li>
              <Link to="/fines">
                Fine Management
              </Link>
            </li>
            <li>
              <Link to="/rejected-students">
                Rejected Students
              </Link>
            </li>
           
          </>
        )}

        {/* Student Links */}
        {isStudent && (
          <>
            <li>
              <Link to="/student-dashboard">
                My Books
              </Link>
            </li>
          </>
        )}

        <li>
          <Link to="/login">
            Logout
          </Link>
        </li>
        
      </ul>

      <hr />

      <div className="admin-profile">

        <img
          src={
            isStudent
              ? "https://i.pravatar.cc/100?img=12"
              : "https://i.pravatar.cc/100?img=1"
          }
          alt={role}
        />

        <h3>
          {isStudent ? name : "Admin"}
        </h3>

        <p>
          {isStudent
            ? "Student"
            : "Library Manager"}
        </p>

      </div>

    </div>
  );
}

export default Sidebar;