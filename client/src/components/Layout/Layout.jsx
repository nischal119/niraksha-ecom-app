import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Toaster, ToastBar } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
const Layout = (props) => {
  return (
    <div>
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
        {props.children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
