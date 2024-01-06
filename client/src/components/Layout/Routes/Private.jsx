import { useState, useEffect } from "react";
import { useAuth } from "../../../context/Auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../../Spinner";
import toast from "react-hot-toast";
export default function PriveteRoutes() {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/v1/auth/user-auth"
        );

        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        return <Spinner />;
      }
    };

    authCheck();
  }, [auth.token]);

  return ok ? <Outlet /> : <Spinner />;
}
