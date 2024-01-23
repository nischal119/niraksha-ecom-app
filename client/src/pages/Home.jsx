import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/Auth.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { CiSearch } from "react-icons/ci";
import { FaCartPlus } from "react-icons/fa";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices.js";
import { Spin } from "antd";
import { set } from "mongoose";
const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //get total count

  const getProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/products-list/${page}`
      );
      setLoading(false);
      setProducts(data?.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/category/get-category"
      );

      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error loading categories");
    }
  };

  useEffect(() => {
    if (!checked.length || !radio.length) getAllCategories();
  }, []);

  const handelFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((item) => item !== id);
    }
    setChecked(all);
  };

  const getFilter = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/v1/product/products-filter",
        { checked, radio }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (checked.length || radio.length) getFilter();
  }, [checked, radio]);

  const getTotalCount = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/products-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getTotalCount();
  }, []);

  const clearFilters = () => {
    setChecked([]);
    setRadio([]);
    getProducts(); // Reset products to the original list
  };

  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/products-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };
  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  return (
    <Layout title={"All products - Best offers"}>
      <div className="row mt-3">
        <div className="col-md-3">
          <h4 className="text-center ">Filter by category</h4>
          <div className="d-flex flex-column">
            {categories?.map((item) => (
              <Checkbox
                key={item._id}
                checked={checked.includes(item._id)}
                onChange={(e) => handelFilter(e.target.checked, item._id)}
              >
                {item.name}
              </Checkbox>
            ))}
          </div>
          <h4 className="text-center mt-4">Filter by Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group
              value={radio}
              onChange={(e) => setRadio(e.target.value)}
            >
              {Prices.map((item) => (
                <Radio key={item._id} value={item.array}>
                  {item.name}
                </Radio>
              ))}
            </Radio.Group>

            <button className="btn btn-danger" onClick={clearFilters}>
              Clear Filter
            </button>
          </div>
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {" "}
            {products?.map((item) => (
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
                    <button className="btn btn-success w-100 mb-3">
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
          <div className="m-2 p-3 ">
            {products && products.length < total && (
              <button
                className="btn btn-primary w-100 mb-3"
                onClick={(e) => {
                  e.preventDefault();
                  // setLoading(true);
                  setPage(page + 1);
                }}
              >
                {loading ? <Spin /> : "Load More"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
