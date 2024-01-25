import React from "react";
import Layout from "./components/Layout/Layout";
import { useSearch } from "./context/Search";
import { CiSearch } from "react-icons/ci";
import { FaCartPlus } from "react-icons/fa";
const Search = () => {
  const [values, setValues] = useSearch();
  return (
    <Layout>
      <div className="container">
        <div className="text-center">
          <h1>Search Results</h1>
          <h6>
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length}`}
          </h6>
          <div className="d-flex flex-wrap mt-5">
            {" "}
            {values?.results?.map((item) => (
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
        </div>
      </div>
    </Layout>
  );
};

export default Search;
