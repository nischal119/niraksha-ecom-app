import React from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/Auth.jsx";

const Home = () => {
  const [auth, setAuth] = useAuth();

  return (
    <Layout>
      Home
      <pre> {JSON.stringify(auth, null)}</pre>
    </Layout>
  );
};

export default Home;
