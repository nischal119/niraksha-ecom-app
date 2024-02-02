import React from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/Auth";

const BecomeSeller = () => {
  const [auth] = useAuth();

  const handleClick = () => {
    const { name, email } = auth.user;
    const adminEmail = "dhungeln12@gmail.com";

    const subject = "Becoming a Seller Inquiry";
    const body = `Hi, I'm ${name} (${email}), and I'm interested in becoming a seller.`;

    const gmailComposeLink = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${encodeURIComponent(
      adminEmail
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(gmailComposeLink, "_blank");
  };

  return (
    <Layout title={"Become a seller"}>
      <div className="container d-flex justify-content-center align-items-center flex-column mt-5">
        <h1 className="text-center">Please Contact admin to become a seller</h1>
        <button className="btn btn-primary mt-5" onClick={handleClick}>
          Contact Now?
        </button>
      </div>
    </Layout>
  );
};

export default BecomeSeller;
