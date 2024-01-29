import axios from "axios";
import { useState, useEffect, useContext, createContext } from "react";
const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(()=>{
    let existingCartItem = localStorage.getItem("cart");
    if(existingCartItem){
      setCart(JSON.parse(existingCartItem))
    }
})
     

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
