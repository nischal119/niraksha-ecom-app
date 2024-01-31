import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="footer mt-5">
      <h4 className="text-center">All right reserved &copy; Nischal Dhungel</h4>
      <p className="text-center mt-3">
        <Link to="/about">About</Link>
        <Link to="/contact">Contct</Link>
        <Link to="/policy">Policies</Link>
      </p>
    </div>
  );
};

export default Footer;
