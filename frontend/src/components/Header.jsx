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
              ? "https://i.pravatar.cc/100?img=12"
              : "https://i.pravatar.cc/100?img=1"
          }
          alt={role}
        />

      </div>

    </div>
  );
}

export default Header;