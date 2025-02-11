import React from "react";
import GenericPage from "../components/GenericPage";

const Category = () => {

  const categories = [
    { id: 1, name: "Luxury Apartment" },
    { id: 2, name: "Villa" },
  ];

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
