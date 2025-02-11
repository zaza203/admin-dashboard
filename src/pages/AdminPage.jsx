import React from "react";
import { useNavigate } from "react-router-dom";
import CardComponent from "../components/CardComponent";
import ActionButton from "../components/ActionButton";

const AdminPage = () => {
  const navigate = useNavigate();
  return (
    <div className="container my-3">
      <h3 className="">Admin</h3>

      <div className="row mb-4">
        <CardComponent title="Total Admins" value="120" />
        <CardComponent title="Active Admins" value="85" />
        <CardComponent title="New Admins" value="35" />
      </div>

      <ActionButton
        title="Add New Admin"
        onClick={() => navigate("/dashboard/admins/detail")}
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
          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-success w-100">
              <i className="bi bi-funnel"></i> Filter
            </button>
          </div>
        </div>
      </div>

      <div className="card p-3">
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
                  onClick={() => navigate("/properties/detail")}
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

      <div
        class="modal fade"
        id="deleteModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="deleteModalLabel">
                Delete Property
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
                Are you sure you want to delete this property? This action cannot be undone.
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" class="btn btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
