import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {

  const [user, setUser] =
    useState(null);

  const [token, setToken] =
    useState(null);

  // LOAD USER FROM LOCAL STORAGE
  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    const storedToken =
      localStorage.getItem("token");

    if (
      storedUser &&
      storedToken
    ) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(storedToken);

      // Fetch the latest user info from the server to keep it synced
      const fetchLatestUser = async () => {
        try {
          const response = await fetch(
            `https://connectsphere-api.onrender.com/api/users/${parsedUser._id || parsedUser.id}`
          );
          if (response.ok) {
            const latestData = await response.json();
            const updatedUser = {
              ...parsedUser,
              username: latestData.username,
              profilePicture: latestData.profilePicture,
              bio: latestData.bio,
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
          }
        } catch (error) {
          console.error("Failed to sync user profile on startup:", error);
        }
      };

      fetchLatestUser();
    }

  }, []);

  // LOGIN
  const login = (
    userData,
    userToken
  ) => {

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "token",
      userToken
    );

    setUser(userData);

    setToken(userToken);
  };

  // LOGOUT
  const logout = () => {

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "token"
    );

    setUser(null);

    setToken(null);
  };

  return (

    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        setUser
      }}
    >

      {children}

    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);