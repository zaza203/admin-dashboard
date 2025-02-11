import React from "react";
import { useNavigate } from "react-router-dom";
import CardComponent from "../components/CardComponent";
import ActionButton from "../components/ActionButton";

const PropertyPage = () => {
  const navigate = useNavigate();
  return (
    <div className="container my-2">
      <h3 className="">Properties</h3>

      <div className="row mb-4 g-2">
        <CardComponent title="Total Properties" value="120" />
        <CardComponent title="Active Listings" value="85" />
        <CardComponent title="Sold Properties" value="35" />
      </div>

      <ActionButton
        title="Add New Property"
        onClick={() => navigate("/dashboard/properties/detail")}
      />

      <div className="card p-3 mb-4">
        <div className="row">
          <div className="col-md-2">
            <label className="form-label">Start Date</label>
            <input type="date" className="form-control" />
          </div>
          <div className="col-md-2">
            <label className="form-label">End Date</label>
            <input type="date" className="form-control" />
          </div>
          <div className="col-md-2">
            <label className="form-label">Category</label>
            <select className="form-select">
              <option>All</option>
              <option>Apartment</option>
              <option>House</option>
              <option>Commercial</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">Type</label>
            <select className="form-select">
              <option>All</option>
              <option>Rent</option>
              <option>Sale</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter location"
            />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-success w-100">
              <i className="bi bi-funnel"></i> Filter
            </button>
          </div>
        </div>
      </div>

      <div className="card p-3">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Location</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Luxury Apartment</td>
                <td>Apartment</td>
                <td>Rent</td>
                <td>New York</td>
                <td>$2,000/month</td>
                <td>
                  <span className="badge bg-success">Active</span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => navigate("/dashboard/properties/detail")}
                  >
                    <i className="bi bi-pencil"></i> Edit
                  </button>
                  <button className="btn btn-sm btn-danger" type="button" data-bs-toggle="modal" data-bs-target="#deleteModal">
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
      </div>

      <div
        className="modal fade"
        id="deleteModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="deleteModalLabel">
                Delete Property
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
                Are you sure you want to delete this property? This action cannot be undone.
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;
