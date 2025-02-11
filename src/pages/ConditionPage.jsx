import React from "react";
import GenericPage from "../components/GenericPage";

const ConditionPage = () => {

  const conditions = [
    { id: 1, name: "Luxury Apartment" },
    { id: 2, name: "Villa" },
  ];

  return (
    <GenericPage
      title="Condition"
      addModalId="addCategoryModal"
      updateModalId="updateCategoryModal"
      deleteModalId="deleteCategoryModal"
      items={conditions}
    />
  );
};

export default ConditionPage;
