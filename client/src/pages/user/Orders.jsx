import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/Routes/UserMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/Auth";
import { useNavigate } from "react-router-dom";
import moment from "moment";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [orderProducts, setOrderProducts] = useState([]);
  const [auth] = useAuth();
  const navigate = useNavigate();

  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/auth/orders"
      );
      setOrders(data.orders);
      // console.log(data.orders[0].products)
      setOrderProducts(data.orders[0].products);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, []);

  return (
    <Layout title={"Your Orders"}>
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            {orders?.length > 0 ? (
              <>
                <h2 className="text-center mt-3">All Orders</h2>

                {orders?.map((item, index) => (
                  <div className="border shadow" key={index}>
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Status</th>
                            <th scope="col">Buyer</th>
                            <th scope="col">Date</th>
                            <th scope="col">Payment</th>
                            <th scope="col">Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="align-items-center">
                            <td>{index + 1}</td>
                            <td>{item?.status}</td>
                            <td>{item?.buyer?.name}</td>
                            <td>{moment(item?.createdAt).fromNow()}</td>
                            <td>
                              {item?.payment.success ? "Success" : "Failed"}
                            </td>
                            <td>{item?.products?.length}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="container">
                      {orderProducts?.map((product) => (
                        <div
                          className="row m-3 p-3"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          key={product._id}
                        >
                          <div className="col-md-2 ">
                            <img
                              style={{
                                minHeight: "200px",
                                maxHeight: "200px",
                              }}
                              src={`http://localhost:8080/api/v1/product/product-photo/${product?._id}`}
                              alt="Card image cap"
                            />
                          </div>
                          <div className="col-md-8 text-center d-flex flex-column justify-content-center align-items-center">
                            <h5 className="card-title">{product?.name}</h5>
                            <p className="card-text">Rs.{product?.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="d-flex justiy-content-center align-items-center flex-column">
                <h2 className="text-center">No orders available</h2>
                <button
                  className="btn btn-primary mt-5"
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Order Now?
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
