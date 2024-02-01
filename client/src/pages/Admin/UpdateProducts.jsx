import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { Select } from "antd";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;

const UpdateProducts = () => {
  const [categories, setCategories] = useState([]);
  const [photo, setPhoto] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [shipping, setShipping] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  //get single product
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/single-product/${params.slug}`
      );
      if (data?.success) {
        setName(data?.product?.name);
        setDescription(data?.product?.description);
        setPrice(data?.product?.price);
        setQuantity(data?.product?.quantity);
        setCategory(data?.product?.category);
        setShipping(data?.product?.shipping);
        setId(data?.product?._id);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //get all category
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/category/get-category"
      );

      if (data?.success) {
        setCategories(data?.category);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error loading categories");
    }
  };
  const handelUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("quantity", quantity);
      formData.append("category", category._id);
      formData.append("shipping", shipping);
      photo && formData.append("photo", photo);

      const { data } = await axios.put(
        `http://localhost:8080/api/v1/product/update-product/${id}`,
        formData
      );
      if (data?.success) {
        toast.success(`Product ${name} updated`);
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };
  //delete

  const handelDelete = async (e) => {
    try {
      let answer = window.confirm("Are you sure you want to delete this item?");
      if (!answer) return;
      const { data } = await axios.delete(
        `http://localhost:8080/api/v1/product/delete-product/${id}`
      );
      toast.success(data?.message);

      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };
  useEffect(() => {
    getAllCategories();
  }, []);
  useEffect(() => {
    getSingleProduct();
  }, []);
  return (
    <Layout title={"Update products"}>
      <div className="container-fluid m-lg-3 p-lg-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Update Products</h1>
            <div className="mb-3">
              <Select
                variant="borderless"
                placeholder="Select a category"
                size="medium"
                showSearch
                className="form-select"
                onChange={(value) => {
                  const selectedCategory = categories.find(
                    (item) => item._id === value
                  );
                  setCategory(selectedCategory);
                }}
                value={category?.name}
              >
                {categories?.map((item, index) => (
                  <Option key={index} value={item._id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="mb-3">
              <label className="btn btn-outline-secondary col-md-12">
                {photo ? photo?.name : "Upload Photo"}
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => {
                    setPhoto(e.target.files[0]);
                  }}
                  hidden
                />
              </label>
            </div>
            <div className="mb-3">
              {photo ? (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={photo.name}
                    className="img-fluid"
                    style={{ height: "200px", objectFit: "contain" }}
                  />
                </div>
              ) : (
                <div className="text-center">
                  <img
                    src={`http://localhost:8080/api/v1/product/product-photo/${id}`}
                    alt={photo.name}
                    className="img-fluid"
                    style={{ height: "200px", objectFit: "contain" }}
                  />
                </div>
              )}
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <textarea
                type="text"
                className="form-control"
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="Enter product price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="Enter product quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <Select
                // bordered={false}
                variant="borderless"
                placeholder="Select Shipping"
                size="large"
                className="form-select "
                onChange={(value) => setShipping(value)}
                value={shipping}
              >
                <Option value="Yes">Yes</Option>
                <Option value="No">No</Option>
              </Select>
            </div>
            <div className="mb-3 text-center ">
              <button
                className="btn btn-primary w-75 "
                onClick={(e) => handelUpdate(e)}
              >
                {" "}
                Update Product
              </button>
              <button
                className="btn btn-danger w-75 mt-3 "
                onClick={(e) => handelDelete(e)}
              >
                {" "}
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProducts;
