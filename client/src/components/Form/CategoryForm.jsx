import React from "react";

const CategoryForm = ({ handelSubmit, value, setValue }) => {
  return (
    <div>
      <form onSubmit={handelSubmit}>
        <div className="form-group d-flex">
          <input
            type="text"
            className="form-control"
            placeholder="Enter new category name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
