import React, { useEffect, useState } from "react";

import supabase from '../services/supabaseClient'
import GenericPage from "../components/GenericPage";

const TypePage = () => {
  const [types, setTypes] = useState([])

    useEffect(() => {
      async function fetchTypes() {
        const cachedTypes = localStorage.getItem("types");
        const cacheTime = localStorage.getItem("cacheTime");
    
        if (cachedTypes && cacheTime) {
          const timeDifference = (Date.now() - parseInt(cacheTime, 10)) / 1000;
          if (timeDifference < 600) {
            setTypes(JSON.parse(cachedTypes));
            return;
          }
        }
    
        const { data, error } = await supabase.from("types").select("id, name");
    
        if (error) {
          console.error("Error fetching types:", error);
          return;
        }
    
        setTypes(data || []);
    
        localStorage.setItem("types", JSON.stringify(data));
        localStorage.setItem("cacheTime", Date.now().toString());
      }
    
      fetchTypes();
    }, []);

  return (
    <GenericPage
      title="Type"
      addModalId="addTypeModal"
      updateModalId="updateTypeModal"
      deleteModalId="deleteTypeModal"
      items={types}
    />
  );
};

export default TypePage;
