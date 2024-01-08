import axios from "axios";
import { useState, useEffect, useContext, createContext } from "react";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: null,
  });

  //default axios

  axios.defaults.headers.common["Authorization"] = auth?.token;

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);

      setAuth({
        ...auth,
        user: parseData.user,
        token: parseData.token,
      });
    }

    // eslint-disable-next-line
  }, []);

  // console.log({ auth });
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

//CUSTOM HOOKS

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
