import React from "react";
import GenericPage from "../components/GenericPage";

const FacilityPage = () => {

  const facilities = [
    { id: 1, name: "Luxury Apartment" },
    { id: 2, name: "Villa" },
  ];

  return (
    <GenericPage
      title="Facility"
      addModalId="addCategoryModal"
      updateModalId="updateCategoryModal"
      deleteModalId="deleteCategoryModal"
      items={facilities}
    />
  );
};

export default FacilityPage;
