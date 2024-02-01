import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/product/get-products"
      );
      if (data?.success) {
        setProducts(data?.products);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error loading products");
    }
  };
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout title={"Best Quality products"}>
      <div className="row m-lg-3 p-lg-3">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <div className="text-center d-flex flex-wrap">
            {products?.map((item) => (
              <Link
                key={item._id}
                to={`/dashboard/admin/product/${item.slug}`}
                className="product-link"
              >
                <div className="card m-3 p-3 ">
                  <div className="card" style={{ width: "18rem" }}>
                    <img
                      className="card-img-top"
                      src={`http://localhost:8080/api/v1/product/product-photo/${item?._id}`}
                      alt="Card image cap"
                      style={{
                        minHeight: "300px",
                        maxHeight: "300px",
                        padding: "10px",
                        maxWidth: "100%",
                        minWidth: "250px",
                        objectFit: "contain",
                      }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">
                        {item?.name.substring(0, 20)}...
                      </h5>
                      <p className="card-text">
                        {item?.description.substring(0, 30)}...
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
