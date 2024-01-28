import axios from "axios";
import { useState, useEffect, useContext, createContext } from "react";
const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  //default axios

  // console.log({ auth });
  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

//CUSTOM HOOKS

const useCart = () => useContext(CartContext);

export { CartProvider, useCart };
