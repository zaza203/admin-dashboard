import React from 'react';

const PropertyPage = () => {
  return (
    <div className='container'>
      <h1 className="my-4">Properties</h1>
        
        {/* Top Cards */}
        <div className="row mb-4">
            <div className="col-md-4">
            <div className="card shadow-sm p-3">
                <h5>Total Properties</h5>
                <p className="fs-3 fw-bold">120</p>
            </div>
            </div>
            <div className="col-md-4">
            <div className="card shadow-sm p-3">
                <h5>Active Listings</h5>
                <p className="fs-3 fw-bold">85</p>
            </div>
            </div>
            <div className="col-md-4">
            <div className="card shadow-sm p-3">
                <h5>Sold Properties</h5>
                <p className="fs-3 fw-bold">35</p>
            </div>
            </div>
      </div>

      {/* Add Property Button */}
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary">
          <i className="bi bi-plus-circle"></i> Add New Property
        </button>
      </div>

       {/* Filters Section */}
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
            <input type="text" className="form-control" placeholder="Enter location" />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-success w-100">
              <i className="bi bi-funnel"></i> Filter
            </button>
          </div>
        </div>
      </div>

            {/* Properties Table */}
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
            {/* Example Property Row */}
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
                <button className="btn btn-sm btn-primary me-2">
                  <i className="bi bi-pencil"></i> Edit
                </button>
                <button className="btn btn-sm btn-danger">
                  <i className="bi bi-trash"></i> Delete
                </button>
              </td>
            </tr>
            {/* More rows can be added dynamically */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropertyPage;
