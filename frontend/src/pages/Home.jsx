import BookCard from "../components/BookCard";  
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Home.css";

function Home() {
  return (
    <>
      <Navbar />

      <section className="hero">
        <h1>Library Management System</h1>
        <p>
          Welcome to our digital library. Manage books, students,
          issue and return books easily.
        </p>

        <button>Get Started</button>
      </section>

      <section className="facts">
        <div className="card">
          <h2>5000+</h2>
          <p>Books</p>
        </div>

        <div className="card">
          <h2>1000+</h2>
          <p>Students</p>
        </div>

        <div className="card">
          <h2>300+</h2>
          <p>Issued Books</p>
        </div>

        <div className="card">
          <h2>24/7</h2>
          <p>Library Support</p>
        </div>
      </section>
      <section className="features">

  <h2>Our Features</h2>

  <div className="feature-container">

    <div className="feature-card">
      <h3>📚 Book Management</h3>
      <p>Add, Update and Delete books easily.</p>
    </div>

    <div className="feature-card">
      <h3>👨‍🎓 Student Records</h3>
      <p>Manage student information efficiently.</p>
    </div>

    <div className="feature-card">
      <h3>📖 Issue Books</h3>
      <p>Issue books to students with one click.</p>
    </div>

    <div className="feature-card">
      <h3>🔄 Return Books</h3>
      <p>Track returned books automatically.</p>
    </div>

    <div className="feature-card">
      <h3>🔍 Search Books</h3>
      <p>Find any book instantly.</p>
    </div>

    <div className="feature-card">
      <h3>📊 Reports</h3>
      <p>Generate library reports anytime.</p>
    </div>

  </div>

</section>
<section className="latest-books">

  <h2>Latest Books</h2>

  <div className="book-container">

    <div className="book-card">
      <img src="https://covers.openlibrary.org/b/isbn/9780140328721-M.jpg" alt="Book"/>
      <h3>Matilda</h3>
      <p>Roald Dahl</p>
      <button>Available</button>
    </div>

    <div className="book-card">
      <img src="https://covers.openlibrary.org/b/isbn/9780439554930-M.jpg" alt="Book"/>
      <h3>Harry Potter</h3>
      <p>J.K. Rowling</p>
      <button>Available</button>
    </div>

    <div className="book-card">
      <img src="https://covers.openlibrary.org/b/isbn/9780061120084-M.jpg" alt="Book"/>
      <h3>To Kill a Mockingbird</h3>
      <p>Harper Lee</p>
      <button>Available</button>
    </div>

  </div>

</section>

      <Footer />
    </>
  );
}

export default Home;