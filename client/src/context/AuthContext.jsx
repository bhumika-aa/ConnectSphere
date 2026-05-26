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

      setUser(
        JSON.parse(storedUser)
      );

      setToken(storedToken);
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
      }}
    >

      {children}

    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);