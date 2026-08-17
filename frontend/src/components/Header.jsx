import "../css/Header.css";

function Header({
  name = "Admin",
  role = "admin"
}) {
  return (
    <div className="header">
      
      <div className="header-left">
        <h1>Dashboard</h1>

        <p>
          Welcome Back, {name} 👋
        </p>
      </div>

      <div className="header-right">

        <input
          type="text"
          placeholder="Search..."
        />

        <span className="notification">
          🔔
        </span>

        <img
          src={
            role === "student"
              ? "https://i.pinimg.com/236x/5a/bd/98/5abd985735a8fd4adcb0e795de6a1005.jpg?nii=t"
              : "https://i.pinimg.com/236x/5a/bd/98/5abd985735a8fd4adcb0e795de6a1005.jpg?nii=t"
          }
          alt={role}
        />

      </div>

    </div>
  );
}

export default Header;