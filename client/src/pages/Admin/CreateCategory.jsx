import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CategoryForm from "../../components/Form/CategoryForm";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/Auth";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [auth] = useAuth();
  //handel form

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/v1/category/create-category",
        { name }
      );
      if (data.success) {
        toast.success(`Category ${name} created`);
        getAllCategories();
      } else {
        toast.error("Error creating category");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error creating category");
    }
  };
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/category/get-category"
      );

      if (data.success) {
        setCategories(data.category);
        // getAllCategories();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error loading categories");
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);
  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <div className="p-3 w-50">
              <CategoryForm
                handelSubmit={handelSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((item) => (
                    <tr>
                      <td key={item._id}>{item.name}</td>
                      <td>
                        <button className="btn btn-primary">Edit</button>
                        <button className="btn btn-danger">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
