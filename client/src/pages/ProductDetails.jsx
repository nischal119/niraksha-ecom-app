import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaCartPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const getProducts = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/single-product/${params.slug}`
      );
      setProduct(data?.product);
      getRelatedProducts(data.product._id, data.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.slug) getProducts();
  }, [params.slug]);

  //get similar products
  const getRelatedProducts = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/similar-products/${pid}/${cid}`
      );
      console.log(data?.products);
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout
      title={"Product Details"}
      className="d-flex justify-content-center align-items-center"
    >
      <div className="row container mt-2 product-details d-flex justify-content-center align-items-center ">
        <div className="col-md-3"></div>
        <div className="col-md-3  ">
          <img
            className="card-img-top mb-5"
            src={`http://localhost:8080/api/v1/product/product-photo/${product?._id}`}
            alt="Card image cap"
          />
        </div>
        <div className="col-md-6 text-center product-details-info">
          <h1>Product Details</h1>
          <hr />
          <h2>{product?.name}</h2>
          <h6>Decription:</h6>
          <p> {product?.description}</p>
          <h6>
            Price :
            {product?.price?.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </h6>
          <h6>Quantity:{product?.quantity}</h6>
          <h6>Category:{product?.category?.name}</h6>
          <h6>Shipping:{product?.shipping}</h6>
          <button className="btn btn-primary w-100">
            Add to Cart <FaCartPlus />
          </button>
        </div>
      </div>
      {relatedProducts.length > 0 && (
        <div className="row mt-5  ">
          <h1 className="text-center">Similar Products</h1>
          <div className="d-flex flex-wrap justify-content-center align-items-center">
            {" "}
            {relatedProducts?.map((item) => (
              <div className="card m-3 p-3 " key={item._id}>
                <div className="card" style={{ width: "18rem" }}>
                  <img
                    className="card-img-top"
                    src={`http://localhost:8080/api/v1/product/product-photo/${item?._id}`}
                    alt="Card image cap"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item?.name}</h5>

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
      )}
    </Layout>
  );
};

export default ProductDetails;
