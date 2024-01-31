import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/Cart";
import { useAuth } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import { set } from "mongoose";
import toast from "react-hot-toast";
import { Spin } from "antd";
const CartPage = () => {
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  const navigate = useNavigate();

  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
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

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/product/braintree/token"
      );

      setClientToken(data.response.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);

  //handel payment
  const handelPayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(
        "http://localhost:8080/api/v1/product/braintree/payment",
        {
          nonce,
          cart,
        }
      );
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Successfull");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <Layout>
      <div className="container">
        <>
          <div className="row ">
            <div className="col-md-12 d-flex flex-column justify-content-center align-items-center">
              <h1 className="text-center bg-light p-2">
                {auth?.user && `Hello ${auth?.token && auth?.user?.name}`}
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
                  <div
                    className="row m-3 p-3 d-flex justify-content-center align-items-center"
                    key={item._id}
                  >
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
                          localStorage.setItem("cart", JSON.stringify(newCart));
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
                <h5>Total :{totalPrice()}</h5>
                {auth?.user?.address ? (
                  <>
                    <div className="mb-3">
                      <h5>Shipping Address: {auth?.user?.address}</h5>

                      <button
                        className="btn btn-outline-warning"
                        onClick={() => {
                          navigate("/dashboard/user/profile");
                        }}
                      >
                        Update Address ?
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mb-3">
                    {auth?.user?.token ? (
                      <button
                        className="btn btn-outline-warning"
                        onClick={() => {
                          navigate("/dashboard/user/profile");
                        }}
                      >
                        Update Address ?
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-warning"
                        onClick={() =>
                          navigate("/login", {
                            state: "/cart",
                          })
                        }
                      >
                        Log in to Checkout
                      </button>
                    )}
                  </div>
                )}
                <div className="mt-5">
                  {!clientToken || !cart?.length ? (
                    ""
                  ) : (
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />
                  )}

                  <button
                    className="btn btn-warning w-100"
                    onClick={handelPayment}
                    disabled={!instance || !auth?.user?.address}
                  >
                    {loading ? <Spin /> : "Pay Now"}
                  </button>
                  {/* {console.log(instance)} */}
                </div>
              </div>
            )}
          </div>
        </>
      </div>
    </Layout>
  );
};

export default CartPage;
