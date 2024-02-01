import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FaOpencart } from "react-icons/fa";
import { useAuth } from "../../context/Auth.jsx";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput.jsx";
import useCategory from "../../hooks/useCategory.js";
import { useCart } from "../../context/Cart.jsx";
import { Badge } from "antd";
const Header = () => {
  const [auth, setAuth] = useAuth();
  const categories = useCategory();
  const [cart, setCart] = useCart();
  const handelLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: null,
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfull");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand " to="/">
            <FaOpencart style={{ fontSize: "30px", margin: "10px" }} />
            E-commerce
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <SearchInput />
              <li className="nav-item">
                <NavLink className="nav-link " to="/">
                  Home
                </NavLink>
              </li>

              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  // aria-expanded="false"
                  to={"/categories"}
                >
                  Categories
                </Link>

                <ul
                  className="dropdown-menu"
                  style={{
                    maxHeight: "150px",
                    overflowY: "scroll",
                  }}
                >
                  <li>
                    {/* <Link className="dropdown-item " to={"/categories"}>
                      All Categories
                    </Link> */}
                  </li>
                  {categories?.map((item) => (
                    <Link
                      key={item?._id}
                      className="dropdown-item "
                      to={`/category/${item.slug}`}
                    >
                      <li key={item?._id}>{item?.name}</li>
                    </Link>
                  ))}
                </ul>
              </li>

              {!auth.user ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link " to="/register">
                      Register
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link " to="/login">
                      Login
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item dropdown">
                    <NavLink
                      className="nav-link dropdown-toggle"
                      role="button"
                      data-bs-toggle="dropdown"
                      // aria-expanded="false"
                    >
                      {auth.user.name}
                    </NavLink>
                    <ul className="dropdown-menu">
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to={`/dashboard/${
                            auth?.user?.role === 1 ? "admin" : "user"
                          }`}
                        >
                          Dashboard
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          className=" dropdown-item "
                          onClick={handelLogout}
                          to={"/login"}
                        >
                          Log Out?
                        </NavLink>
                      </li>
                      {auth?.user?.role !== 1 && (
                        <li className="nav-item">
                          <NavLink
                            className=" dropdown-item "
                            to={"/become-seller"}
                          >
                            Become a Seller ?
                          </NavLink>
                        </li>
                      )}
                    </ul>
                  </li>
                </>
              )}

              <li className="nav-item">
                <Badge count={cart?.length} showZero>
                  <NavLink className="nav-link" to="/cart">
                    Cart
                  </NavLink>
                </Badge>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
