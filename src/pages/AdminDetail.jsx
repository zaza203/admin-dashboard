import React, { useState, useEffect } from 'react';

const AdminDetail = ({ property, onSave }) => {
  const conditionOptions = ['No smoking', 'No visitor after 10pm', 'Not more than two', 'blabla bla', 'blabla bla'];
  const facilityOptions = ['Pool', 'Gym', 'Parking', 'Garden'];
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    owner: '',
    owner_phone: '',
    created_by: '',
    price: '',
    quarter: '',
    description: '',
    facilities: ['Garden'],
    conditions: ['No smoking'],
    type: '',
    location: '',
    longitude: '',
    latitude: '',
    bedrooms: 1,
    bathrooms: 1,
    kitchen: 1,
    dimension: '',
    available_from: '',
    created_at: '',
    update_on: '',
    total_units: '',
    available_units: '',
    expiry_date: '',
    image: null,
    video: null,
    images: null,
    status: '',
    clicks: ''
  });

  useEffect(() => {
    if (property) {
      setFormData({ ...property });
    }
  }, [property]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'owner_phone') {
      const sanitizedValue = value.replace(/[^0-9]/g, '');
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    } else if (name === 'kitchen') {
      setFormData((prev) => ({ ...prev, [name]: value === 'true' ? 1 : 0 }));
    } else if (name === 'conditions' || name === 'facilities') {
      const selectedValues = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      
      setFormData((prev) => ({ ...prev, [name]: selectedValues }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="container my-3">
      <h3>{property ? 'Edit Property' : 'Add New Property'}</h3>
      <form className='pb-4' onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Name<span className='require-symbol'>*</span></label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Description</label>
            <textarea type="text" className="form-control" name="name" value={formData.description} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Category<span className='require-symbol'>*</span></label>
            <select className="form-select pe-4" name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Land">Land</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Created By</label>
            <input type="number" className="form-control" name="created_by" placeholder='e.g: Rentam' value={formData.created_by} onChange={handleChange} disabled/>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Owner<span className='require-symbol'>*</span></label>
            <input type="text" className="form-control" name="owner" value={formData.owner} onChange={handleChange} required/>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Owner Phone<span className='require-symbol'>*</span></label>
            <input type="tel" maxLength="9" inputMode="numeric" className="form-control" name="owner_phone" value={formData.owner_phone} onChange={handleChange} required/>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Price<span className='require-symbol'>*</span></label>
            <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} required/>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Dimension</label>
            <input type="text" className="form-control" placeholder="e.g: 5 x 4 m" name="dimension" value={formData.dimension} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Total Units<span className='require-symbol'>*</span></label>
            <input type="number" className="form-control" name="total_units" value={formData.total_units} onChange={handleChange} required/>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Available Units<span className='require-symbol'>*</span></label>
            <input type="number" className="form-control" name="available_units" value={property ? formData.available_units : formData.total_units} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Location<span className='require-symbol'>*</span></label>
            <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} required/>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Street</label>
            <input type="text" className="form-control" name="quarter" value={formData.quarter} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Conditions</label>
            <select
              className="form-control"
              name="conditions"
              value={formData.conditions}
              onChange={handleChange}
              multiple
            >
              {conditionOptions.map((condition, index) => (
                <option key={index} value={condition}>{condition}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Facilities</label>
            <select
              className="form-control"
              name="facilities"
              value={formData.facilities}
              onChange={handleChange}
              multiple
            >
              {facilityOptions.map((facility, index) => (
                <option key={index} value={facility}>{facility}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Longitude</label>
            <input type="text" className="form-control" placeholder='e.g: 9.243536' name="longitude" value={formData.longitude} onChange={handleChange} disabled/>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Latitude</label>
            <input type="text" className="form-control" placeholder='e.g: 4.159302' name="latitude" value={formData.latitude} onChange={handleChange} disabled/>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Bedrooms<span className='require-symbol'>*</span></label>
            <input type="number" className="form-control" name="bedrooms" value={formData.bedrooms} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Bathrooms/Toilet<span className='require-symbol'>*</span></label>
            <input type="number" className="form-control" name="bathrooms" value={formData.bathrooms} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Kitchen<span className='require-symbol'>*</span></label>
            <select
              className="form-select"
              name="kitchen"
              value={formData.kitchen === 1 ? 'true' : 'false'}
              onChange={handleChange}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Type</label>
            <select className="form-select" name="type" value={formData.type} onChange={handleChange}>
              <option value="available">Plank</option>
              <option value="sold">Block</option>
              <option value="pending">Kios</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Available From<span className='require-symbol'>*</span></label>
            <input type="datetime-local" className="form-control" name="available_from" value={formData.available_from} onChange={handleChange} required/>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Expiry Date<span className='require-symbol'>*</span></label>
            <input type="datetime-local" className="form-control" name="expiry_date" value={formData.expiry_date} onChange={handleChange} required/>
          </div>


          <div className="col-md-6 mb-3">
            <label className="form-label">Thumbnail Image<span className='require-symbol'>*</span></label>
            <input type="file" className="form-control" name="image" onChange={handleFileChange} required/>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Images</label>
            <input type="file" className="form-control" name="images" onChange={handleFileChange} multiple/>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Video</label>
            <input type="file" className="form-control" name="video" onChange={handleFileChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Status</label>
            <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Views</label>
            <input type="number" className="form-control" name="clicks" value={formData.clicks} onChange={handleChange} disabled/>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Create at</label>
            <input type="datetime-local" className="form-control" name="created_at" value={formData.created_at} onChange={handleChange} disabled />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Updated on</label>
            <input type="datetime-local" className="form-control" name="update_on" value={formData.update_on} onChange={handleChange} disabled />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminDetail;
