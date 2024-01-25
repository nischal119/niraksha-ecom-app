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
    <Layout>
      <h1>Product Details</h1>
      <div className="row container mt-2">
        <div className="col-md-6">
          <img
            className="card-img-top"
            src={`http://localhost:8080/api/v1/product/product-photo/${product?._id}`}
            alt="Card image cap"
          />
        </div>
        <div className="col-md-6 text-center">
          <h1>Product Details</h1>
          <h4>Name:{product?.name}</h4>
          <h4>Decription:{product?.description}</h4>
          <h4>Price:{product?.price}</h4>
          <h4>Quantity:{product?.quantity}</h4>
          <h4>Category:{product?.category?.name}</h4>
          <h4>Shipping:{product?.shipping}</h4>
          <button className="btn btn-primary w-100">
            Add to Cart <FaCartPlus />
          </button>
        </div>
      </div>
      {relatedProducts.length > 0 && (
        <div className="row mt-5">
          <h1 className="text-center">Similar Products</h1>
          <div className="d-flex flex-wrap">
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
