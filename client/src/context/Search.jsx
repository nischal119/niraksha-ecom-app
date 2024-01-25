import axios from "axios";
import { useState, useEffect, useContext, createContext } from "react";
const SearchContext = createContext();

const SearchProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    keyword: "",
    results: [],
  });

  //default axios

  // console.log({ auth });
  return (
    <SearchContext.Provider value={[auth, setAuth]}>
      {children}
    </SearchContext.Provider>
  );
};

//CUSTOM HOOKS

const useSearch = () => useContext(SearchContext);

export { SearchProvider, useSearch };
