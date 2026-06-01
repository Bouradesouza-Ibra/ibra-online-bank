import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      <nav className="home-navbar">
        <h2>Ibra Online Bank</h2>

        <div>
          <Link to="/register">
            <button>Register</button>
          </Link>

          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      </nav>

      <section className="home-hero">
        <div className="hero-text">
          <p className="badge">
            Secure Digital Banking
          </p>

          <h1>
            Bank smarter with modern online banking.
          </h1>

          <p>
            Manage your balance, deposit, withdraw,
            transfer money, and track transactions
            with a powerful banking dashboard.
          </p>

          <Link to="/register">
            <button className="hero-button">
              Open Account
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;