import React from "react";
import Layout from "../components/Layout/Layout";
import useCategory from "../hooks/useCategory";
import { Link } from "react-router-dom";

const Categories = () => {
  const categories = useCategory();
  return (
    <Layout title={"All Categories"}>
      <div className="container row">
        <div className="row">
          {categories?.map((item) => (
            <div className="col-md-6 mt-5 gx-3 gy-3 " key={item._id}>
              <button className="btn btn-primary ">
                <Link to={`/category/${item.slug}`} className="btn cat-btn">
                  {item.name}
                </Link>
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
