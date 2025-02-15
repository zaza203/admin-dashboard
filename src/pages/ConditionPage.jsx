import React, { useState, useEffect } from "react";

import supabase from "../services/supabaseClient";
import GenericPage from "../components/GenericPage";

const ConditionPage = () => {
  const [conditions, setConditions] = useState([])

  useEffect(() => {
    async function fetchCondtions() {
      const cachedConditions = localStorage.getItem("conditions");
      const cacheTime = localStorage.getItem("cacheTime");

      if (cachedConditions && cacheTime) {
        const timeDifference = (Date.now() - parseInt(cacheTime, 10)) / 1000;
        if (timeDifference < 600) {
          setConditions(JSON.parse(cachedConditions));
          return;
        }
      }

      const { data, error } = await supabase.from("conditions").select("id, name");

      if (error) {
        console.error("Error fetching conditions:", error);
        return;
      }

      setConditions(data || []);

      localStorage.setItem("conditions", JSON.stringify(data));
      localStorage.setItem("cacheTime", Date.now().toString());
    }

    fetchCondtions();
  }, []);

  return (
    <GenericPage
      title="Condition"
      addModalId="addConditionModal"
      updateModalId="updateConditionModal"
      deleteModalId="deleteConditionModal"
      items={conditions}
    />
  );
};

export default ConditionPage;
