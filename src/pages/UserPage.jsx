import React from "react";
import { useNavigate } from "react-router-dom";
import CardComponent from "../components/CardComponent";
import ActionButton from "../components/ActionButton";

const UserPage = () => {
  const navigate = useNavigate();
  return (
    <div className="container my-3">
      <h3 className="">Users</h3>

      <div className="row mb-4">
        <CardComponent title="Total Users" value="120" />
        <CardComponent title="New Users" value="85" />
        <CardComponent title="Active Users" value="35" />
      </div>

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
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Numnber</th>
              <th>Location</th>
              <th>Status</th>
              <th>Created</th>
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
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserPage;
