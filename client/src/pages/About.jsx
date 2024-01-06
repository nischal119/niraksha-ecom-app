import React from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/Auth";

const About = () => {
  const [auth, setAuth] = useAuth();
  console.log(auth);
  return (
    <Layout className="d-flex justify-center align-center text-center">
      <span
        className="text-center"
        style={{
          height: "50vh",
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        {" "}
        <h1 style={{ color: "#ffa012" }}>Comming Soon !</h1>
      </span>
    </Layout>
  );
};

export default About;
