import React from "react";
import Layout from "../components/Layout/Layout";
import useCategory from "../hooks/useCategory";
import { Link } from "react-router-dom";

const Categories = () => {
  const categories = useCategory();
  return (
    <Layout title={"All Categories"}>
      <div className="container">
        <div className="row">
          {categories?.map((item) =>  (
            <div className="col-md-6 mt-5 gx-3 ">
              <button className="btn btn-primary ">
                <Link to={`/category/${item.slug}`} className="btn btn-primary">{item.name}</Link>
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
