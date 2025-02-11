import React from "react";
import GenericPage from "../components/GenericPage";

const TypePage = () => {

  const types = [
    { id: 1, name: "Luxury Apartment" },
    { id: 2, name: "Villa" },
  ];

  return (
    <GenericPage
      title="Type"
      addModalId="addCategoryModal"
      updateModalId="updateCategoryModal"
      deleteModalId="deleteCategoryModal"
      items={types}
    />
  );
};

export default TypePage;
