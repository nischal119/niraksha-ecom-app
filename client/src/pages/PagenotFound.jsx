import React from "react";
import Layout from "../components/Layout/Layout";
import { Link } from "react-router-dom";

const PagenotFound = () => {
  return (
    <Layout>
      <div className="pnf">
        <span>
          <h1 className="pnf-title">404 !</h1>
          <h2 className="pnf-heading">Oops! Page Not Found</h2>
          <Link to="/" btn className="pnf-btn mt-3">
            {" "}
            Go Home ?
          </Link>
        </span>
      </div>
    </Layout>
  );
};

export default PagenotFound;
