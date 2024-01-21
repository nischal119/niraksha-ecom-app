import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { Select } from "antd";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const handelCreate = async (
  e,
  name,
  price,
  description,
  quantity,
  category,
  shipping,
  photo
) => {
  e.preventDefault();
  try {
    const categoryName = category.name;
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("category", categoryName);
    formData.append("shipping", shipping);
    formData.append("photo", photo);
    console.log(shipping);
    const { data } = await axios.post(
      "http://localhost:8080/api/v1/product/create-product",
      formData
    );
    if (data?.success) {
      toast.success(`Product ${name} created`);
      navigate("/dashboard/admin/products");
    } else {
      toast.error("Error creating product");
    }
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message);
  }
};
// const navigate = useNavigate();
const CreateProduct = () => {
  const [categories, setCategories] = useState([]);
  const [photo, setPhoto] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [shipping, setShipping] = useState("");

  //get all category
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
            <h1>Create Products</h1>
            <div className="mb-3">
              <Select
                bordered={false}
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
              >
                {categories?.map((item) => (
                  <Option key={item._id} value={item._id}>
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
              {photo && (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(photo)}
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
                bordered={false}
                placeholder="Select Shipping"
                size="large"
                className="form-select "
                onChange={(value) => setShipping(value)}
                options={[{ value: "Yes" }, { value: "No" }]}
              ></Select>
            </div>
            <div className="mb-3 text-center ">
              <button
                className="btn btn-primary w-75 "
                onClick={(e) =>
                  handelCreate(
                    e,
                    name,
                    price,
                    description,
                    quantity,
                    category,
                    shipping,
                    photo
                  )
                }
              >
                {" "}
                Create Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
