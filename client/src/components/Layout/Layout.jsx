import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Toaster, ToastBar } from "react-hot-toast";
import { Helmet } from "react-helmet";
import "react-toastify/dist/ReactToastify.css";
const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />

        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title} </title>
      </Helmet>
      <Header />
      <main style={{ minHeight: "85vh" }}>
        <Toaster>
          {(t) => (
            <ToastBar
              toast={t}
              style={{
                ...t.style,
                animation: t.visible
                  ? "custom-enter 0.5s ease"
                  : "custom-exit 0.5s ease",
              }}
            />
          )}
        </Toaster>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
