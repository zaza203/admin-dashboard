import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

import { handleFileUpload, fetchLatLng } from '../services/utils';
import supabase from '../services/supabaseClient'

const PropertyDetail = () => {
  const location = useLocation();
  const propertyToEdit = location.state?.property;
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    owner: '',
    owner_phone: '',
    created_by: localStorage.getItem('admin'),
    price: '',
    quarter: '',
    description: '',
    facilities: [],
    conditions: [],
    type: '',
    location: '',
    longitude: '',
    latitude: '',
    bedrooms: 1,
    bathrooms: 1,
    kitchen: 1,
    dimension: '',
    available_from: '',
    total_units: '',
    available_units: '',
    expiry_date: '',
    thumbnail: '',
    video: '',
    images: [],
  });

  const clearFormData = () => {
    setFormData({
      name: '',
      category: categories.length > 0 ? categories[0].id : '',
      owner: '',
      owner_phone: '',
      created_by: localStorage.getItem('admin'),
      price: '',
      quarter: '',
      description: '',
      facilities: [],
      conditions: [],
      type: '',
      location: '',
      longitude: '',
      latitude: '',
      bedrooms: 1,
      bathrooms: 1,
      kitchen: 1,
      dimension: '',
      available_from: '',
      total_units: '',
      available_units: '',
      expiry_date: '',
      thumbnail: '',
      video: '',
      images: [],
    });
  };

  useEffect(() => {
    if (propertyToEdit) {
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };

      setFormData({
        ...propertyToEdit,
        available_from: formatDate(propertyToEdit.available_from),
        expiry_date: formatDate(propertyToEdit.expiry_date),
        thumbnail: propertyToEdit.thumbnail || '',
        video: propertyToEdit.video || '',
        images: propertyToEdit.images || [],
        price: propertyToEdit.price?.toString() || '',
        total_units: propertyToEdit.total_units?.toString() || '',
        available_units: propertyToEdit.available_units?.toString() || '',
        bedrooms: propertyToEdit.bedrooms || 1,
        bathrooms: propertyToEdit.bathrooms || 1,
        kitchen: propertyToEdit.kitchen || 1,
      });
    }
  }, [propertyToEdit]);

  const validateFormData = (data) => {
    if (!data.price || isNaN(data.price)) {
      throw new Error('Price must be a valid number');
    }
    if (!data.total_units || isNaN(data.total_units)) {
      throw new Error('Total units must be a valid number');
    }
    if (!data.available_units || isNaN(data.available_units)) {
      throw new Error('Available units must be a valid number');
    }
    return true;
  };
    
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [conditions, setConditions] = useState([]);

  useEffect(() => {
    async function fetchOptions() {
      const [{ data: catData }, { data: typeData }, { data: facData }, { data: condData }] = await Promise.all([
        supabase.from("categories").select("id, name"),
        supabase.from("types").select("id, name"),
        supabase.from("facilities").select("id, name"),
        supabase.from("conditions").select("id, name"),
      ]);
      setCategories(catData || []);
      setTypes(typeData || []);
      setFacilities(facData || []);
      setConditions(condData || []);
      if (catData && catData.length > 0) {
        setFormData(prev => ({
          ...prev,
          category: catData[0].id,
          type: typeData?.[0]?.id || ''
        }));
      }
    }
    fetchOptions();

  }, []);

  useEffect(() => {
    if (formData.total_units) {
      setFormData((prev) => ({ ...prev, available_units: prev.total_units }));
    }
  }, [formData.total_units]);

  useEffect(() => {
    if (formData.location) {
      fetchLatLng(formData.location).then(({ lat, lng }) => {
        setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
      });
    }
  }, [formData.location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'owner_phone') {
      const sanitizedValue = value.replace(/[^0-9]/g, '');
      // const sanitizedValue = value.replace(/\D/g, '').slice(0, 9);
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    } else if (name === 'kitchen') {
      setFormData((prev) => ({ ...prev, [name]: value === 'true' ? 1 : 0 }));
    } else if (name === 'conditions' || name === 'facilities') {
      const selectedValues = Array.from(e.target.selectedOptions).map(option => option.value);
      setFormData((prev) => ({ ...prev, [name]: selectedValues }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    
    if (name === 'images') {
      setFormData((prev) => ({ ...prev, [name]: Array.from(files) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    setLoading(true)
    
    try {
      validateFormData(formData);
      let thumbnailUrl = '';
      let imageUrls = [];
      let videoUrl = '';
  
      if (formData.thumbnail) {
        thumbnailUrl = await handleFileUpload(formData.thumbnail, 'thumbnails');
      }
  
      if (formData.images && formData.images.length > 0) {
        for (const image of formData.images) {
          const imageUrl = await handleFileUpload(image, 'images');
          if (imageUrl) {
            imageUrls.push(imageUrl);
          }
        }
      }
  
      if (formData.video) {
        videoUrl = await handleFileUpload(formData.video, 'videos', true);
      }
  
      const propertyData = {
        ...formData,
        thumbnail: thumbnailUrl,
        images: imageUrls,
        video: videoUrl,
      };
  
      const { error } = await supabase
      .from('property')
      .upsert([propertyData], {
        onConflict: 'id'
      });
      if (error) {
        toast.error('Error inserting data into Supabase')
        console.error('Error inserting data into Supabase:', error.message);
      } else {
        toast.success('Property data saved successfully.');
        clearFormData();
      }
    } catch (error) {
      console.error('Error saving property:', error.message);
      toast.error('Error saving property')
    } finally {
      setLoading(false)
    }
  };


  return (
    <div className="container my-3">
      <ToastContainer />
      <h3>Add New Property</h3>
      <form className='pb-4' onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Name<span className='require-symbol'>*</span></label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Description</label>
            <textarea type="text" className="form-control" name="description" value={formData.description} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Category<span className='require-symbol'>*</span></label>
            <select className="form-select pe-4" name="category" value={formData.category} onChange={handleChange} required>
            {categories.map((category, index) => (
                <option key={index} value={category.id}>{category.name}</option>
              ))}
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
            <input type="tel" maxLength="9" inputMode="numeric" value={formData.owner_phone} className="form-control" name="owner_phone" onChange={handleChange} required/>
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
            <input type="number" className="form-control" name="available_units" value={formData.available_units} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Location<span className='require-symbol'>*</span></label>
            <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} required/>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Quarter</label>
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
              {conditions.map((condition, index) => (
                <option key={index} value={condition.id}>{condition.name}</option>
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
              {facilities.map((facility, index) => (
                <option key={index} value={facility.id}>{facility.name}</option>
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
              {types.map((type, index) => (
                <option key={index} value={type.id}>{type.name}</option>
              ))}
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
            {propertyToEdit ? (
              <input type="text" disabled className="form-control" name="thumbnail" value={formData.thumbnail} required/>
          ) : (
              <input type="file" accept='image/*' className="form-control" name="thumbnail" onChange={handleFileChange} required/>
          )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Images</label>
            {propertyToEdit ? (
              <select
                className="form-control"
                name="images"
                disabled
                multiple
              >
                {formData.images.map((image, index) => (
                  <option key={index} value={image}>{image}</option>
                ))}
              </select>
            ) : (
            <input type="file" accept='image/*' className="form-control" name="images" onChange={handleFileChange} multiple/>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Video</label>
            {propertyToEdit ? (
            <input type="text" disabled className="form-control" name="video" value={formData.video} />
          ) : (
            <input type="file" accept='video/*' className="form-control" name="video" onChange={handleFileChange} />
          )}
          </div>
          {propertyToEdit && (
            <>

              <div className="col-md-6 mb-3">
                <label className="form-label">Clicks</label>
                <input type="numeric" disabled className="form-control" name="clicks" value={propertyToEdit.clicks} onChange={handleChange}/>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Created at</label>
                <input type="text" disabled className="form-control" name="created_at" value={propertyToEdit.created_at}/>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Updated at</label>
                <input type="text" disabled className="form-control" name="expiry_date" value={propertyToEdit.updated_at}/>
              </div>
          </>
          )}

          <div className="col-12">
            <button type="submit" className="btn btn-primary" disabled={loading || propertyToEdit}>{loading ? 'Uploading...' : 'Save'}</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertyDetail;
