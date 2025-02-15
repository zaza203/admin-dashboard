import React, { useEffect, useState } from "react";

import supabase from '../services/supabaseClient'
import GenericPage from "../components/GenericPage";

const Category = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    async function fetchCategories() {
      const cachedCategories = localStorage.getItem("categories");
      const cacheTime = localStorage.getItem("cacheTime");
  
      if (cachedCategories && cacheTime) {
        const timeDifference = (Date.now() - parseInt(cacheTime, 10)) / 1000;
        if (timeDifference < 600) {
          setCategories(JSON.parse(cachedCategories));
          return;
        }
      }
  
      const { data, error } = await supabase.from("categories").select("id, name");
  
      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }
  
      setCategories(data || []);
  
      localStorage.setItem("categories", JSON.stringify(data));
      localStorage.setItem("cacheTime", Date.now().toString());
    }
  
    fetchCategories();
  }, []);

  return (
    <GenericPage
      title="Category"
      addModalId="addCategoryModal"
      updateModalId="updateCategoryModal"
      deleteModalId="deleteCategoryModal"
      items={categories}
    />
  );
};

export default Category;
