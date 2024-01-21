import React from "react";

const CategoryForm = ({ handelSubmit, value, setValue }) => {
  return (
    <div>
      <form onSubmit={handelSubmit}>
        <div className="form-group d-flex">
          <input
            type="text"
            className="form-control ms-2"
            placeholder="Enter new category name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button type="submit" className="btn btn-primary ms-2">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
