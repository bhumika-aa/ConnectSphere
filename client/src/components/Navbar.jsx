import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {

  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {

    logout();

    navigate("/");
  };

  const searchUsers = async (query) => {

    try {

      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      const response = await fetch(
        `https://connectsphere-api.onrender.com/api/users/search/users?query=${query}`
      );

      const data = await response.json();

      setSearchResults(data);

    } catch (error) {

      console.log(error);
    }
  };

  const [search, setSearch] = useState("");

  const [searchResults, setSearchResults] =
    useState([]);

  const [showResults, setShowResults] =
    useState(false);

  useEffect(() => {

    const delaySearch = setTimeout(() => {

      searchUsers(search);

    }, 300);

    return () => clearTimeout(delaySearch);

  }, [search]);


  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-pink-100 shadow-sm px-4 md:px-8 py-3 md:py-4 animate-fadeIn">

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 md:gap-6">

        {/* LOGO & HAMBURGER FOR MOBILE */}
        <div className="flex justify-between items-center w-full md:w-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="text-2xl md:text-3xl font-bold text-pink-600 hover:opacity-90 transition duration-300"
          >
            ConnectSphere
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-pink-50 hover:text-pink-500 transition duration-300 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <svg
              className="w-6 h-6 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
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
        </div>

        {/* COLLAPSIBLE MENUS & NAV BLOCK */}
        <div
          className={`${
            isOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6 w-full md:w-auto transition-all duration-300`}
        >
          {/* SEARCH COMPONENT */}
          <div className="relative w-full md:w-72">

            <input
              type="text"
              placeholder="Search users..."
              value={search}

              onBlur={() => {
                setTimeout(() => {
                  setShowResults(false);
                }, 200);
              }}

              onChange={(e) => {

                setSearch(e.target.value);

                setShowResults(true);
              }}
              className="w-full px-5 py-2.5 md:py-3 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm md:text-base transition duration-300"
            />

            {/* SEARCH RESULTS */}
            {showResults &&
              searchResults.length > 0 && (

                <div className="absolute top-14 left-0 w-full bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden z-50 animate-slideDown">

                  {searchResults.map((user) => (

                    <div
                      key={user._id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-pink-50 transition cursor-pointer"
                      onMouseDown={(e) => {
                        // Prevent input from losing focus before click triggers
                        e.preventDefault();
                      }}
                      onClick={() => {
                        navigate(`/profile/${user._id}`);
                        setShowResults(false);
                        setSearch("");
                        setIsOpen(false);
                      }}
                    >

                      {/* AVATAR */}
                      <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold overflow-hidden shrink-0">

                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          user.username
                            ?.charAt(0)
                            .toUpperCase()
                        )}

                      </div>

                      {/* USERNAME */}
                      <div className="min-w-0 flex-1">

                        <h3 className="font-semibold text-gray-800 text-sm truncate">
                          {user.username}
                        </h3>

                        <p className="text-xs text-gray-500 truncate">
                          {user.bio || "No bio yet"}
                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              )}

          </div>

          {/* ACTION BUTTONS & LINKS */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5 md:gap-6 text-gray-700 font-medium text-sm md:text-base">

            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 md:p-0 rounded-2xl md:rounded-none hover:text-pink-500 hover:bg-pink-50 md:hover:bg-transparent transition duration-300"
            >
              Home
            </Link>

            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 md:p-0 rounded-2xl md:rounded-none hover:text-pink-500 hover:bg-pink-50 md:hover:bg-transparent transition duration-300"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="bg-pink-500 text-white px-5 py-2.5 rounded-2xl md:rounded-full text-center hover:bg-pink-600 transition shadow-sm duration-300"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 md:p-0 rounded-2xl md:rounded-none hover:text-pink-500 hover:bg-pink-50 md:hover:bg-transparent transition duration-300"
                >
                  Profile
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="bg-pink-500 text-white px-5 py-2.5 rounded-2xl md:rounded-full text-center hover:bg-pink-600 transition shadow-sm cursor-pointer duration-300"
                >
                  Logout
                </button>

              </>
            )}

          </div>
        </div>

      </div>

    </nav>
  );
}

export default Navbar;