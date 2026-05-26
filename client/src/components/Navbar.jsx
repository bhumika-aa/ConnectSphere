import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {

  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const { logout } = useAuth();

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

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
        `http://localhost:5000/api/users/search/users?query=${query}`
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
    <nav className="sticky top-0 z-50 bg-white border-b border-pink-100 shadow-sm px-8 py-4">

      <div className="max-w-6xl mx-auto flex justify-between items-center">

        <Link
          to="/"
          className="text-3xl font-bold text-pink-600"
        >
          ConnectSphere
        </Link>

        <div className="relative w-72">

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
            className="w-full px-5 py-3 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          {/* SEARCH RESULTS */}
          {showResults &&
            searchResults.length > 0 && (

              <div className="absolute top-16 left-0 w-full bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden z-50">

                {searchResults.map((user) => (

                  <div
                    key={user._id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-pink-50 transition cursor-pointer"
                    onClick={() => {

                      navigate(`/profile/${user._id}`);

                      setShowResults(false);

                      setSearch("");
                    }}
                  >

                    {/* AVATAR */}
                    <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">

                      {user.username
                        ?.charAt(0)
                        .toUpperCase()}

                    </div>

                    {/* USERNAME */}
                    <div>

                      <h3 className="font-semibold text-gray-800">
                        {user.username}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {user.bio || "No bio yet"}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            )}

        </div>
        <div className="flex items-center gap-6 text-gray-700 font-medium">

          <Link
            to="/"
            className="hover:text-pink-500 transition"
          >
            Home
          </Link>

          {!user ? (
            <>
              <Link
                to="/login"
                className="hover:text-pink-500 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-pink-500 text-white px-5 py-2 rounded-full hover:bg-pink-600 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="hover:text-pink-500 transition"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="bg-pink-500 text-white px-5 py-2 rounded-full hover:bg-pink-600 transition"
              >
                Logout
              </button>

            </>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;