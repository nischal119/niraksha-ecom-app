import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/Auth.jsx";
const Login = () => {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  //form submit
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/v1/auth/login", {
        email,
        password,
      });

      if (res.data.success) {
        setAuth({
          ...auth,
          user: res?.data?.user,
          token: res?.data?.token,
        });
        toast.success(`Namastey ${localStorage.getItem("name")}`);
        localStorage.setItem("auth", JSON.stringify(res?.data));

        navigate(location.state || "/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // console.log(process.env.REACT_APP_API);
  return (
    <Layout title={"Login"}>
      <div className="register">
        <h1>Login</h1>

        <form onSubmit={handelSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email <span className="red-star">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password <span className="red-star">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword1"
              required
            />
            <p
              className="mt-2"
              onClick={() => navigate("/forgot-password")}
              style={{
                textDecoration: "underline",
                color: "blue",
                cursor: "pointer",
                fontSize: "18px",
                marginLeft: "47%",
              }}
            >
              Forgot Password?
            </p>
          </div>

          <button type="submit" className="btn submit-button">
            Submit
          </button>
        </form>
        <p
          onClick={() => navigate("/register")}
          className="mt-5 "
          style={{
            textDecoration: "underline",
            color: "blue",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          Don't have an account?
        </p>
      </div>
    </Layout>
  );
};

export default Login;
