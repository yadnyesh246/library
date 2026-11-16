import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../css/Sidebar.css";

const defaultProfileImage = "https://i.pinimg.com/236x/5a/bd/98/5abd985735a8fd4adcb0e795de6a1005.jpg?nii=t";

const getProfileImageKey = (role) => {
  if (role === "student") {
    return `profileImage_student_${localStorage.getItem("studentId") || "guest"}`;
  }

  return `profileImage_admin_${localStorage.getItem("username") || "admin"}`;
};

function Sidebar({
  name = "Admin",
  role = "admin"
}) {
  const navigate = useNavigate();
  const isStudent = role === "student";
  const profileImageKey = getProfileImageKey(role);
  const [profileImage, setProfileImage] = useState(
    () => localStorage.getItem(profileImageKey) || localStorage.getItem("profileImage") || defaultProfileImage
  );

  useEffect(() => {
    const syncProfileImage = () => {
      setProfileImage(localStorage.getItem(profileImageKey) || defaultProfileImage);
    };

    window.addEventListener("profileImageChanged", syncProfileImage);
    return () => window.removeEventListener("profileImageChanged", syncProfileImage);
  }, [profileImageKey]);

  useEffect(() => {
    if (!isStudent && !localStorage.getItem("profileRole")) {
      localStorage.setItem("profileRole", "admin");
    }
  }, [isStudent]);

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxSize = 512;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);

        const compressedImage = canvas.toDataURL("image/jpeg", 0.82);
        localStorage.setItem(profileImageKey, compressedImage);
        setProfileImage(compressedImage);
        window.dispatchEvent(new Event("profileImageChanged"));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleLogout = (event) => {
    event.preventDefault();
    ["profileRole", "studentId", "username", "notificationExpiresAt", "dismissedNotificationIds"]
      .forEach((key) => localStorage.removeItem(key));
    navigate("/login", { replace: true });
  };

  return (
    <div className={`sidebar ${isStudent ? "student-sidebar" : ""}`}>

      <h2 className="brand-title">
        <span>LIBRARY</span>
        <span>MANAGEMENT</span>
        <span>SYSTEM</span>
      </h2>

      <ul>

        <li>
          <NavLink
            className={({ isActive }) => isActive ? "active" : ""}
            to={
              isStudent
                ? "/student-dashboard#dashboard"
                : "/admin-dashboard"
            }
          >
            Dashboard
          </NavLink>
        </li>

        {/* Admin Links */}
        {!isStudent && (
          <>
            <li>
              <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/books">
                Manage Books
              </NavLink>
            </li>

            <li>
              <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/students">
                Students
              </NavLink>
            </li>
            <li>
              <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/pending-students">
                Pending Students
              </NavLink>
            </li>
            <li>
              <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/issuebook">
                Issue Book
              </NavLink>
            </li>
            <li>
              <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/fines">
                Fine Management
              </NavLink>
            </li>
            <li>
              <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/rejected-students">
                Rejected Students
              </NavLink>
            </li>
           
          </>
        )}

        {/* Student Links */}
        {isStudent && (
          <>
            <li>
              <NavLink
                className={({ isActive }) => isActive ? "active" : ""}
                to="/student-dashboard#my-books"
              >
                My Books
              </NavLink>
            </li>
          </>
        )}

        <li>
          <NavLink className="logout-link" to="/login" onClick={handleLogout}>
            Logout
          </NavLink>
        </li>
        
      </ul>

      <hr />

      <div className="admin-profile">

        <label className="profile-image-picker" title="Choose profile picture">
          <img src={profileImage} alt={role} />
          <span aria-hidden="true">+</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
          />
        </label>

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