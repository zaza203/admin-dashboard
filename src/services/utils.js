import supabase from '../services/supabaseClient'
import sha256 from "crypto-js/sha256";
import imageCompression from "browser-image-compression";

  export const handleFileUpload = async (file, path, isVideo = false) => {
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
      fileUrl = await uploadFileToSupabase(file, path, isVideo);
      await supabase.from("media_store").insert({ hash: fileHash, url: fileUrl });
    }
    return fileUrl;
  };

  const uploadFileToSupabase = async (file, path, isVideo = false) => {
    try {

      let processedFile = file;
      if (!isVideo) {
        processedFile = await compressImage(file);
      } else {
        processedFile = file;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('property-files')
        .upload(filePath, processedFile);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('property-files')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error(`Error uploading file:`, error);
      return null;
    }
  };

  const compressImage = async (imageFile) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };
    
    try {
      const compressedFile = await imageCompression(imageFile, options);
      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      return imageFile;
    }
  };
  

export const fetchLatLng = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await response.json();
    if (data.length > 0) {
      return { lat: data[0].lat, lng: data[0].lon };
    }
    return { lat: "4.159302", lng: "9.243536" };
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return { lat: "4.159302", lng: "9.243536" };
  }
};
