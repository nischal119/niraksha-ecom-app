import React from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/Cart";
import { useAuth } from "../context/Auth";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  const navigate = useNavigate();
  //total price

  const totalPrice = () => {
    try {
      let total = 0;
      cart.map((item) => {
        total += item.price;
      });
      return total.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      {auth?.token && (
        <div className="container">
          <>
            <div className="row ">
              <div className="col-md-12 d-flex flex-column justify-content-center align-items-center">
                <h1 className="text-center bg-light p-2">
                  {`Hello ${auth?.token && auth?.user?.name}`}
                </h1>
                <h4 className="text-center mt-1">
                  {cart?.length > 0
                    ? ` Total Products in Cart: ${cart?.length}  `
                    : "No Products in Cart"}
                </h4>
                {cart.length < 1 && (
                  <button
                    className="btn btn-primary w-50 mt-5"
                    onClick={() => navigate("/")}
                  >
                    Add now?
                  </button>
                )}
              </div>
            </div>
            <div className="row">
              <div
                className="col-md-9"
                style={{
                  maxHeight: "70vh",
                  overflowY: "scroll",
                }}
              >
                <div className="d-flex flex-wrap flex-column">
                  {" "}
                  {cart?.map((item) => (
                    <div className="row m-3 p-3 " key={item._id}>
                      <div className="col-md-4 ">
                        <img
                          // className="card-img-top"
                          style={{
                            minHeight: "200px",
                            maxHeight: "200px",
                          }}
                          src={`http://localhost:8080/api/v1/product/product-photo/${item?._id}`}
                          alt="Card image cap"
                        />
                      </div>
                      <div className="col-md-8 text-center">
                        <h5 className="card-title">{item?.name}</h5>

                        <p className="card-text">Rs.{item?.price}</p>
                        <button
                          className="btn btn-danger w-50"
                          onClick={() => {
                            const newCart = cart.filter(
                              (product) => product._id !== item._id
                            );
                            setCart(newCart);
                            localStorage.setItem(
                              "cart",
                              JSON.stringify(newCart)
                            );
                          }}
                        >
                          Remove from Cart ({item.length})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {cart.length > 0 && (
                <div className="col-md-3 text-center">
                  <h4>Cart Summarry</h4>
                  <p>Total | Checkout | Summary</p>
                  <hr />
                  <h4>Total :{totalPrice()}</h4>
                </div>
              )}
            </div>
          </>
        </div>
      )}
      {!auth?.token && (
        <div className="d-flex justify-content-center align-items-center flex-column">
          <h2 className="text-center mt-3">Sorry you are not logged in </h2>
          <button
            className="btn btn-primary w-50 mt-5"
            onClick={() => navigate("/login")}
          >
            Log in now ?
          </button>
        </div>
      )}
    </Layout>
  );
};

export default CartPage;
