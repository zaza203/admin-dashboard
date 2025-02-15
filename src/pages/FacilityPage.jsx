import React, { useEffect, useState } from "react";

import supabase from '../services/supabaseClient'
import GenericPage from "../components/GenericPage";

const FacilityPage = () => {
  const [facilities, setFacilities] = useState([])

  useEffect(() => {
    async function fetchFacilities() {
      const cachedFacilities = localStorage.getItem("facilities");
      const cacheTime = localStorage.getItem("cacheTime");

      if (cachedFacilities && cacheTime) {
        const timeDifference = (Date.now() - parseInt(cacheTime, 10)) / 1000;
        if (timeDifference < 600) {
          setFacilities(JSON.parse(cachedFacilities));
          return;
        }
      }

      const { data, error } = await supabase.from("facilities").select("id, name");

      if (error) {
        console.error("Error fetching facilities:", error);
        return;
      }

      setFacilities(data || []);

      localStorage.setItem(
        "facilities",
        JSON.stringify(data)
      );
      localStorage.setItem("cacheTime", Date.now().toString());
    }

    fetchFacilities();
  }, []);

  return (
    <GenericPage
      title="Facility"
      addModalId="addFacilityModal"
      updateModalId="updateFacilityModal"
      deleteModalId="deleteFacilityModal"
      items={facilities}
    />
  );
};

export default FacilityPage;
