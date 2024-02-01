import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CategoryForm from "../../components/Form/CategoryForm";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/Auth";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { Button, Modal } from "antd";
import { set } from "mongoose";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [auth] = useAuth();
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  //handel form

  const handelSubmit = async (e) => {
    e.preventDefault();
    let data;
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/category/create-category",
        { name }
      );
      data = response.data;
      if (data.success) {
        toast.success(`Category ${name} created`);
        getAllCategories();
      } else {
        console.log(data);
        toast.error("Error creating category");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/category/get-category"
      );

      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error loading categories");
    }
  };

  //? For modal=======================

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // update category

  const handelUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `http://localhost:8080/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }
      );
      if (data.success) {
        toast.success(`Category ${name} updated`);
        setSelected(null);
        setUpdatedName("");
        getAllCategories();
        handleCancel();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating category");
    }
  };

  // delete category

  const handelDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8080/api/v1/category/delete-category/${id}`
      );
      if (data.success) {
        console.log(name);
        toast.success(`Category ${name} deleted`);

        getAllCategories();
        handleCancel();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error deleting category");
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);
  return (
    <Layout title={"Create Categories"}>
      <div className="container-fluid m-lg-3 p-lg-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9 d-flex flex-column justify-content-center align-items-center">
            <h1>Manage Category</h1>
            <div className="p-3 w-50">
              <CategoryForm
                handelSubmit={handelSubmit}
                value={name}
                setValue={setName}
                style={{ width: "300px" }}
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
                        <button
                          className="btn btn-primary ms-2"
                          onClick={() => {
                            showModal();
                            setUpdatedName(item.name);
                            setSelected(item);
                          }}
                        >
                          <CiEdit />
                        </button>
                        <button
                          className="btn btn-danger ms-2"
                          onClick={() => {
                            handelDelete(item._id);
                          }}
                        >
                          <MdDeleteForever />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Modal
            title="Add details"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <CategoryForm
              value={updatedName}
              setValue={setUpdatedName}
              handelSubmit={handelUpdate}
            />
          </Modal>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
