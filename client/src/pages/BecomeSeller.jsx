import React from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/Auth";
import toast from "react-hot-toast";

const BecomeSeller = () => {
  const [auth] = useAuth();

  const handelClick = () => {
    const { name, email } = auth.user;

    const emailEndpoint = "http://localhost:8080/api/v1/auth/send-email";

    const adminEmail = "dhungeln12@gmail.com";

    fetch(emailEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderName: name,
        senderEmail: email,
        adminEmail,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Email sent successfully!");
        } else {
          console.error("Failed to send email");
        }
      })
      .catch((error) => {
        toast.error("Error sending email");
        console.error("Error sending email:", error);
      });
  };

  return (
    <Layout title={"Become a seller"}>
      <div className="container">
        <h1 className="text-center">Please Contact admin to become a seller</h1>
        <button className="btn btn-primary" onClick={handelClick}>
          Contact Now?
        </button>
      </div>
    </Layout>
  );
};

export default BecomeSeller;
