import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from '../services/supabaseClient'

import CardComponent from "../components/CardComponent";
import ActionButton from "../components/ActionButton";

const PropertyPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "",
    type: "",
    location: "",
    page: 1,
    max_number: 10
  });

  useEffect(() => {
    async function fetchOptions() {
      const cachedProperties = localStorage.getItem("properties");
      const cachedCategories = localStorage.getItem("categories");
      const cachedTypes = localStorage.getItem("types");
      const cacheTime = localStorage.getItem("cacheTime");
  
      if (cachedProperties && cachedCategories && cachedTypes && cacheTime) {
        const timeDifference = (Date.now() - parseInt(cacheTime, 10)) / 1000;
        if (timeDifference < 600) {
          setProperties(JSON.parse(cachedProperties));
          setFilteredProperties(JSON.parse(cachedProperties));
          setCategories(JSON.parse(cachedCategories));
          setTypes(JSON.parse(cachedTypes));
          return;
        }
      }
  
      const { data, error } = await supabase.from("property").select("*");
      const [{ data: catData }, { data: typeData }] = await Promise.all([
        supabase.from("categories").select("id, name"),
        supabase.from("types").select("id, name"),
      ]);
  
      if (error) {
        console.error("Error fetching properties:", error);
        return;
      }
  
      setProperties(data || []);
      setFilteredProperties(data || []);
      setCategories(catData || []);
      setTypes(typeData || []);
  
      localStorage.setItem("properties", JSON.stringify(data));
      localStorage.setItem("categories", JSON.stringify(catData));
      localStorage.setItem("types", JSON.stringify(typeData));
      localStorage.setItem("cacheTime", Date.now().toString());
    }
  
    fetchOptions();
  }, []);
  

  async function fetchFilteredProperties() {
    const { startDate, endDate, category, type, location, page, max_number } = filters;
    
    let { data, error } = await supabase.rpc("get_all_props", {
      page,
      max_number,
      category: category !== 0 ? category : null,
      type: type !== 0 ? type : null,
      start_date: startDate || null,
      end_date: endDate || null,
      location: location || null,
    });

    if (error) {
      console.error("Error fetching filtered properties:", error);
      return;
    }

    setFilteredProperties(data || []);
    console.log(filters)
  }
  const numPages = Math.ceil(properties.length / filters.max_number);
  const pageNumbers = Array.from({ length: numPages }, (_, index) => index + 1);

  return (
    <div className="container my-2">
      <h3 className="">Properties</h3>

      <div className="row mb-4 g-2">
        <CardComponent title="Total Properties" value={ properties.length } />
        <CardComponent title="Total Properties with views" value={ properties.filter(property => property.clicks > 0).length } />
        <CardComponent title="Sold Properties" value={ properties.reduce((total, property) => total + property.clicks, 0) } />
      </div>

      <ActionButton
        title="Add New Property"
        onClick={() => navigate("/dashboard/properties/detail")}
      />

      <div className="card p-3 mb-4">
        <div className="row">
          <div className="col-md-2">
            <label className="form-label">Start Date</label>
            <input type="datetime-local" className="form-control" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
          </div>
          <div className="col-md-2">
            <label className="form-label">End Date</label>
            <input type="datetime-local" className="form-control" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
          </div>
          <div className="col-md-2">
            <label className="form-label">Category</label>
            <select 
              className="form-select" value={filters.category} 
              onChange={(e) => { 
                const selectedCategory = e.target.value ? Number(e.target.value) : "";
                setFilters({ ...filters, category: selectedCategory });
              }} >
            {categories.map((category, index) => (
                <option key={index} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">Type</label>
            <select 
              className="form-select" value={filters.type} 
              onChange={(e) => {
                const selectedType = e.target.value ? Number(e.target.value) : "";
                setFilters({ ...filters, type: selectedType });
              }} >
            {types.map((type, index) => (
                <option key={index} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} 
              placeholder="Enter location"
            />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-success w-100" onClick={fetchFilteredProperties} >
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
                <th>SN</th>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Location</th>
                <th>Price</th>
                <th>Owner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            { filteredProperties.map((property, index) => (
              <tr key={index}>
                <td>{ index + 1 }</td>
                <td>{ property.name }</td>
                <td>{ property.category }</td>
                <td>{ property.type }</td>
                <td>{ property.location }</td>
                <td>{property.price}</td>
                <td>
                  <span>{ property.owner_phone}</span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => navigate("/dashboard/properties/detail", { 
                      state: { property } 
                    })}
                  >
                    <i className="bi bi-pencil"></i> Edit
                  </button>
                  <button className="btn btn-sm btn-danger" type="button" data-bs-toggle="modal" data-bs-target="#deleteModal">
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>

     {properties.length > filters.max_number && (
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            <li className="page-item disabled">
              <a className="page-link" disabled={filters.page == 1}
              href="#"
              onClick={async (e) => {
                e.preventDefault();
                if (filters.page > 1) {
                  const newPage = filters.page - 1;
                  setFilters(prev => ({ ...prev, page: newPage }));
                  await fetchFilteredProperties();
                }}}
              >Previous</a>
            </li>
            { 
              pageNumbers.map((page) => (
                <li className="page-item" key={page}>
                  <a className="page-link" href="#"
                  onClick={async (e) => {
                    e.preventDefault();
                    setFilters(prev => ({ ...prev, page: page }));
                    await fetchFilteredProperties();
                  }}
                  >{page}</a></li>
              ))
            }
            <li className="page-item">
              <a className="page-link" href="#" disabled={filters.page == numPages}
              onClick={async (e) => {
                e.preventDefault();
                if (filters.page > 1) {
                  const newPage = filters.page + 1;
                  setFilters(prev => ({ ...prev, page: newPage }));
                  await fetchFilteredProperties();
                }}}
              >Next</a>
            </li>
          </ul>
        </nav>
      )}

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
