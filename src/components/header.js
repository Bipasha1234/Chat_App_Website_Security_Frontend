import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";

function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  const handleHome = () => navigate("/");
  const handleLogIn = () => navigate("/login-customer");

  return (
    <header className="bg-white shadow sticky top-0 z-50  font-open-sans">
      <div className="container mx-auto flex justify-between items-center px-4 py-2 md:py-3">
        {/* Logo */}
    <div className="flex items-center cursor-pointer" onClick={handleHome}>
  <span className="text-blue-600 font-semibold mr-2">MessageI</span>
  <img src={logo} alt="Chattix Logo" className="h-12 w-auto" />
</div>


        {/* Login Button */}
        <button
          onClick={handleLogIn}
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded shadow hidden md:block"
        >
          Login
        </button>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-blue-700 hover:text-blue-900 focus:outline-none"
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-label="Toggle menu"
        >
          {/* You can add a hamburger icon here if you want */}
          <svg
            className="h-8 w-8"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            {isNavOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Mobile Login Button */}
        {isNavOpen && (
          <div className="md:hidden absolute right-4 top-16 bg-white rounded shadow p-2">
            <button
              onClick={() => {
                setIsNavOpen(false);
                handleLogIn();
              }}
              className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg shadow w-full"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
