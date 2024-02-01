import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { FaCartPlus } from "react-icons/fa";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const getProductsBycat = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/product-category/${params.slug}`
      );
      console.log(data);

      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
      toast.error("Error while fetching products");
    }
  };
  useEffect(() => {
    if (params?.slug) getProductsBycat();
  }, [params?.slug]);

  return (
    <Layout title={"Amazing Categories"}>
      <div className="container">
        <h4 className="text-center mt-5">Category-{category?.name}</h4>
        <h4 className="text-center">{products?.length} results found</h4>
        <div className="row">
          <div className="d-flex flex-wrap d-flex justify-content-center align-items-center">
            {" "}
            {products?.map((item) => (
              <div className="card  m-3 p-3 " key={item._id}>
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
                    <p className="card-text">Rs.{item?.price}</p>
                    <button
                      className="btn btn-success w-100 mb-3"
                      onClick={() => navigate(`/product/${item?.slug}`)}
                    >
                      <CiSearch />
                    </button>
                    <button className="btn btn-primary w-100">
                      <FaCartPlus />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
