// import React, { useState, useEffect } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import axios from 'axios';

// import supabase from '../services/supabaseClient'

// const PropertyDetail = ({ property }) => {
//   const conditionOptions = ['No smoking', 'No visitor after 10pm', 'Not more than two', 'blabla bla', 'blabla bla'];
//   const facilityOptions = ['Pool', 'Gym', 'Parking', 'Garden'];
//   const [formData, setFormData] = useState({
//     name: '',
//     category: '',
//     owner: '',
//     owner_phone: '',
//     created_by: null,
//     price: null,
//     quarter: '',
//     description: '',
//     facilities: ['Garden'],
//     conditions: ['No smoking'],
//     type: '',
//     location: '',
//     longitude: null,
//     latitude: null,
//     bedrooms: 1,
//     bathrooms: 1,
//     kitchen: 1,
//     dimension: '',
//     available_from: null,
//     created_at: '',
//     updated_at: null,
//     total_units: null,
//     available_units: null,
//     expiry_date: null,
//     image: null,
//     video: null,
//     images: null,
//     status: '',
//     clicks: 0
//   });

//   useEffect(() => {
//     if (property) {
//       setFormData({ ...property });
//     }
//   }, [property]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'owner_phone') {
//       const sanitizedValue = value.replace(/[^0-9]/g, '');
//       setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
//     } else if (name === 'kitchen') {
//       setFormData((prev) => ({ ...prev, [name]: value === 'true' ? 1 : 0 }));
//     } else if (name === 'conditions' || name === 'facilities') {
//       const selectedValues = Array.from(e.target.selectedOptions).map(option => option.value);
//       setFormData((prev) => ({ ...prev, [name]: selectedValues }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: files[0] }));
//   };

//   const compressImage = async (imageFile) => {
//     const options = {
//       maxSizeMB: 1,
//       maxWidthOrHeight: 1920,
//       useWebWorker: true
//     };
    
//     try {
//       const compressedFile = await imageCompression(imageFile, options);
//       return compressedFile;
//     } catch (error) {
//       console.error('Error compressing image:', error);
//       return imageFile;
//     }
//   };

//   const uploadFileToSupabase = async (file, path, isVideo = false) => {
//     try {

//       let processedFile = file;
//       if (!isVideo) {
//         processedFile = await compressImage(file);
//       } else {
//         processedFile = file;
//       }

//       const fileExt = file.name.split('.').pop();
//       const fileName = `${Math.random()}.${fileExt}`;
//       const filePath = `${path}/${fileName}`;

//       const { data, error } = await supabase.storage
//         .from('property-files')
//         .upload(filePath, processedFile);

//       if (error) throw error;

//       // Get public URL
//       const { data: { publicUrl } } = supabase.storage
//         .from('property-files')
//         .getPublicUrl(filePath);

//       return publicUrl;
//     } catch (error) {
//       console.error(`Error uploading file:`, error);
//       return null;
//     }
//   };


//   const validateFormData = (data) => {
//     if (!data.price || isNaN(data.price)) {
//       throw new Error('Price must be a valid number');
//     }
//     if (!data.total_units || isNaN(data.total_units)) {
//       throw new Error('Total units must be a valid number');
//     }
//     if (!data.available_units || isNaN(data.available_units)) {
//       throw new Error('Available units must be a valid number');
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       validateFormData(formData);
//       let thumbnailUrl = null;
//       let imageUrls = [];
//       let videoUrl = null;
  
//       if (formData.image) {
//         thumbnailUrl = await uploadFileToSupabase(formData.image, 'thumbnails');
//       }
  
//       if (formData.images && formData.images.length > 0) {
//         for (const image of formData.images) {
//           const imageUrl = await uploadFileToSupabase(image, 'images');
//           if (imageUrl) {
//             imageUrls.push(imageUrl);
//           }
//         }
//       }
  
//       if (formData.video) {
//         videoUrl = await uploadFileToSupabase(formData.video, 'videos', true);
//       }
  
//       const propertyData = {
//         ...formData,
//         image: thumbnailUrl,
//         images: imageUrls,
//         video: videoUrl,

//         price: parseFloat(formData.price),
//         total_units: parseInt(formData.total_units),
//         available_units: parseInt(formData.available_units),
//         bedrooms: parseInt(formData.bedrooms),
//         bathrooms: parseInt(formData.bathrooms),
//         kitchen: formData.kitchen ? 1 : 0,
//         clicks: parseInt(formData.clicks || 0)
//       };
  
//       delete propertyData.imageFile;
//       delete propertyData.videoFile;
  
//       const { error } = await supabase
//       .from('property')
//       .upsert([propertyData], {
//         onConflict: 'id'
//       });
//       if (error) {
//         toast.error('Error inserting data into Supabase')
//         console.error('Error inserting data into Supabase:', error.message);
//       } else {
//         toast.success('Property data saved successfully.');
//       }
//     } catch (error) {
//       console.error('Error saving property:', error.message);
//       toast.error('Error saving property')
//     }
//     };

//   return (
//     <div className="container my-3">
//       <ToastContainer />
//       <h3>{property ? 'Edit Property' : 'Add New Property'}</h3>
//       <form className='pb-4' onSubmit={handleSubmit}>
//         <div className="row">
//           <div className="col-md-6 mb-3">
//             <label className="form-label">Name<span className='require-symbol'>*</span></label>
//             <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Description</label>
//             <textarea type="text" className="form-control" name="description" value={formData.description} onChange={handleChange} />
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Category<span className='require-symbol'>*</span></label>
//             <select className="form-select pe-4" name="category" value={formData.category} onChange={handleChange} required>
//               <option value="">Select Category</option>
//               <option value="Residential">Residential</option>
//               <option value="Commercial">Commercial</option>
//               <option value="Industrial">Industrial</option>
//               <option value="Land">Land</option>
//             </select>
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Created By</label>
//             <input type="number" className="form-control" name="created_by" placeholder='e.g: Rentam' value={formData.created_by} onChange={handleChange} disabled/>
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Owner<span className='require-symbol'>*</span></label>
//             <input type="text" className="form-control" name="owner" value={formData.owner} onChange={handleChange} required/>
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Owner Phone<span className='require-symbol'>*</span></label>
//             <input type="tel" maxLength="9" inputMode="numeric" className="form-control" name="owner_phone" value={formData.owner_phone} onChange={handleChange} required/>
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Price<span className='require-symbol'>*</span></label>
//             <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} required/>
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Dimension</label>
//             <input type="text" className="form-control" placeholder="e.g: 5 x 4 m" name="dimension" value={formData.dimension} onChange={handleChange} />
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Total Units<span className='require-symbol'>*</span></label>
//             <input type="number" className="form-control" name="total_units" value={formData.total_units} onChange={handleChange} required/>
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Available Units<span className='require-symbol'>*</span></label>
//             <input type="number" className="form-control" name="available_units" value={property ? formData.available_units : formData.total_units} onChange={handleChange} />
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Location<span className='require-symbol'>*</span></label>
//             <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} required/>
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Street</label>
//             <input type="text" className="form-control" name="quarter" value={formData.quarter} onChange={handleChange} />
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Conditions</label>
//             <select
//               className="form-control"
//               name="conditions"
//               value={formData.conditions}
//               onChange={handleChange}
//               multiple
//             >
//               {conditionOptions.map((condition, index) => (
//                 <option key={index} value={condition}>{condition}</option>
//               ))}
//             </select>
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Facilities</label>
//             <select
//               className="form-control"
//               name="facilities"
//               value={formData.facilities}
//               onChange={handleChange}
//               multiple
//             >
//               {facilityOptions.map((facility, index) => (
//                 <option key={index} value={facility}>{facility}</option>
//               ))}
//             </select>
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Longitude</label>
//             <input type="text" className="form-control" placeholder='e.g: 9.243536' name="longitude" value={formData.longitude} onChange={handleChange} disabled/>
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Latitude</label>
//             <input type="text" className="form-control" placeholder='e.g: 4.159302' name="latitude" value={formData.latitude} onChange={handleChange} disabled/>
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Bedrooms<span className='require-symbol'>*</span></label>
//             <input type="number" className="form-control" name="bedrooms" value={formData.bedrooms} onChange={handleChange} />
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Bathrooms/Toilet<span className='require-symbol'>*</span></label>
//             <input type="number" className="form-control" name="bathrooms" value={formData.bathrooms} onChange={handleChange} />
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Kitchen<span className='require-symbol'>*</span></label>
//             <select
//               className="form-select"
//               name="kitchen"
//               value={formData.kitchen === 1 ? 'true' : 'false'}
//               onChange={handleChange}
//             >
//               <option value="true">True</option>
//               <option value="false">False</option>
//             </select>
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Type</label>
//             <select className="form-select" name="type" value={formData.type} onChange={handleChange}>
//               <option value="available">Plank</option>
//               <option value="sold">Block</option>
//               <option value="pending">Kios</option>
//             </select>
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Available From<span className='require-symbol'>*</span></label>
//             <input type="datetime-local" className="form-control" name="available_from" value={formData.available_from} onChange={handleChange} required/>
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Expiry Date<span className='require-symbol'>*</span></label>
//             <input type="datetime-local" className="form-control" name="expiry_date" value={formData.expiry_date} onChange={handleChange} required/>
//           </div>


//           <div className="col-md-6 mb-3">
//             <label className="form-label">Thumbnail Image<span className='require-symbol'>*</span></label>
//             <input type="file" accept='image/*' className="form-control" name="image" onChange={handleFileChange} required/>
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Images</label>
//             <input type="file" accept='image/*' className="form-control" name="images" onChange={handleFileChange} multiple/>
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Video</label>
//             <input type="file" accept='video/*' className="form-control" name="video" onChange={handleFileChange} />
//           </div>

//           <div className="col-12">
//             <button type="submit" className="btn btn-primary">Save</button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default PropertyDetail;



import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { uploadFileToSupabase, fetchLatLng } from '../services/utils';
import supabase from '../services/supabaseClient'

const PropertyDetail = () => {
      const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        type: "",
        facilities: [],
        conditions: [],
        total_units: "",
        available_units: "",
        location: "",
        latitude: "",
        longitude: "",
        media: [],
      });

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
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
      };

      const handleFileUpload = async (file) => {
        if (!file) return;
        
        const fileHash = sha256(file.name + file.size + file.lastModified).toString();
        const { data, error } = await supabase
          .from("media_store")
          .select("url")
          .eq("hash", fileHash)
          .single();
      
        let fileUrl;
        if (data) {
          fileUrl = data.url;
        } else {
          fileUrl = await uploadFile(file, fileHash, supabase);
          await supabase.from("media_store").insert({ hash: fileHash, url: fileUrl });
        }
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        
        // try {
        //   validateFormData(formData);
        //   let thumbnailUrl = null;
        //   let imageUrls = [];
        //   let videoUrl = null;
      
        //   if (formData.image) {
        //     thumbnailUrl = await uploadFileToSupabase(formData.image, 'thumbnails');
        //   }
      
        //   if (formData.images && formData.images.length > 0) {
        //     for (const image of formData.images) {
        //       const imageUrl = await uploadFileToSupabase(image, 'images');
        //       if (imageUrl) {
        //         imageUrls.push(imageUrl);
        //       }
        //     }
        //   }
      
        //   if (formData.video) {
        //     videoUrl = await uploadFileToSupabase(formData.video, 'videos', true);
        //   }
      
        //   const propertyData = {
        //     ...formData,
        //     image: thumbnailUrl,
        //     images: imageUrls,
        //     video: videoUrl,
    
        //     price: parseFloat(formData.price),
        //     total_units: parseInt(formData.total_units),
        //     available_units: parseInt(formData.available_units),
        //     bedrooms: parseInt(formData.bedrooms),
        //     bathrooms: parseInt(formData.bathrooms),
        //     kitchen: formData.kitchen ? 1 : 0,
        //     clicks: parseInt(formData.clicks || 0)
        //   };
      
        //   delete propertyData.imageFile;
        //   delete propertyData.videoFile;
      
        //   const { error } = await supabase
        //   .from('property')
        //   .upsert([propertyData], {
        //     onConflict: 'id'
        //   });
        //   if (error) {
        //     toast.error('Error inserting data into Supabase')
        //     console.error('Error inserting data into Supabase:', error.message);
        //   } else {
        //     toast.success('Property data saved successfully.');
        //   }
        // } catch (error) {
        //   console.error('Error saving property:', error.message);
        //   toast.error('Error saving property')
        // }
        };


  return (
    <div className="container my-3">
      <ToastContainer />
      <h3>Add New Property</h3>
      <form className='pb-4' onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Name<span className='require-symbol'>*</span></label>
            <input type="text" className="form-control" name="name" onChange={handleChange} required />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Description</label>
            <textarea type="text" className="form-control" name="description" onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Category<span className='require-symbol'>*</span></label>
            <select className="form-select pe-4" name="category" onChange={handleChange} required>
            {categories.map((category, index) => (
                <option key={index} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Created By</label>
            <input type="number" className="form-control" name="created_by" placeholder='e.g: Rentam' onChange={handleChange} disabled/>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Owner<span className='require-symbol'>*</span></label>
            <input type="text" className="form-control" name="owner" onChange={handleChange} required/>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Owner Phone<span className='require-symbol'>*</span></label>
            <input type="tel" maxLength="9" inputMode="numeric" className="form-control" name="owner_phone" onChange={handleChange} required/>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Price<span className='require-symbol'>*</span></label>
            <input type="number" className="form-control" name="price" onChange={handleChange} required/>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Dimension</label>
            <input type="text" className="form-control" placeholder="e.g: 5 x 4 m" name="dimension" onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Total Units<span className='require-symbol'>*</span></label>
            <input type="number" className="form-control" name="total_units" onChange={handleChange} required/>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Available Units<span className='require-symbol'>*</span></label>
            <input type="number" className="form-control" name="available_units" value={formData.total_units} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Location<span className='require-symbol'>*</span></label>
            <input type="text" className="form-control" name="location" onChange={handleChange} required/>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Street</label>
            <input type="text" className="form-control" name="quarter" onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Conditions</label>
            <select
              className="form-control"
              name="conditions"
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
            <input type="number" className="form-control" name="bedrooms" onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Bathrooms/Toilet<span className='require-symbol'>*</span></label>
            <input type="number" className="form-control" name="bathrooms" onChange={handleChange} />
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
            <select className="form-select" name="type" onChange={handleChange}>
              {types.map((type, index) => (
                <option key={index} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Available From<span className='require-symbol'>*</span></label>
            <input type="datetime-local" className="form-control" name="available_from" onChange={handleChange} required/>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Expiry Date<span className='require-symbol'>*</span></label>
            <input type="datetime-local" className="form-control" name="expiry_date" onChange={handleChange} required/>
          </div>


          <div className="col-md-6 mb-3">
            <label className="form-label">Thumbnail Image<span className='require-symbol'>*</span></label>
            <input type="file" accept='image/*' className="form-control" name="image" onChange={handleFileChange} required/>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Images</label>
            <input type="file" accept='image/*' className="form-control" name="images" onChange={handleFileChange} multiple/>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Video</label>
            <input type="file" accept='video/*' className="form-control" name="video" onChange={handleFileChange} />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertyDetail;
