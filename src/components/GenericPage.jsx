import React, { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';

import supabase from '../services/supabaseClient'
import ActionButton from "../components/ActionButton";
import pluralize from "pluralize";

const GenericPage = ({ title, addModalId, updateModalId, deleteModalId, items }) => {
  const [selectedItem, setSelectedItem] = useState('')
  const [updatedName, setUpdatedName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [currentItems, setCurrentItems] = useState(items)
  const [isSaving, setIsSaving] = useState(false)
  const hiddenButtonRef = useRef(null);

  const addItem = () => {
    if (hiddenButtonRef.current) {
      hiddenButtonRef.current.click();
    }
  };

  const hideModal = (modalId) => {
    const closeButton = document.querySelector(`#${modalId} [data-bs-dismiss="modal"]`);
    closeButton?.click();
  };

  useEffect(() => {
    setCurrentItems(items);
  }, [items]);

  const insertItems = async () => {
    setIsSaving(true)
    if (newItemName.trim() === "") {
      setIsSaving(false)
      toast.warning("Please enter the name")
      return;
    }
    const tableName = pluralize(title.toLowerCase());
    const { data, error } = await supabase.from(tableName).insert([{ name: newItemName }]).select('*');
    if (!error) {
      setCurrentItems((prev) => [...prev, ...data]);
      setNewItemName("");
      toast.success("Successfully uploaded")
      hideModal(addModalId)
    } else {toast.error("Failed to uploaded")}
    setIsSaving(false)
  };

  const updateItem = async () => {
    setIsSaving(true)
    if (!selectedItem || updatedName.trim() === "") {
      toast.warning("Please fill the name")
      setIsSaving(false)
      return;
    }
    const tableName = pluralize(title.toLowerCase());
    const { error } = await supabase
      .from(tableName)
      .update({ name: updatedName })
      .eq("id", selectedItem.id);
    if (!error) {
      setCurrentItems((prev) => prev.map((item) => (item.id === selectedItem.id ? { ...item, name: updatedName } : item)));
      toast.success("Successfully updated")
      hideModal(updateModalId)
    } else {toast.error("Failed to update")}
    setIsSaving(false)
  };

  const deleteItem = async () => {
    setIsSaving(true)
   if (!selectedItem) {
    setIsSaving(false)
    return
   }
    const tableName = pluralize(title.toLowerCase());
    const [{ data: insertData, error }, { data: deleteData, error2 }] = await Promise.all([
      supabase.from('deleted_ft2c').insert([{ name: selectedItem.name, key:  title}]),
      supabase.from(tableName).delete().eq("id", selectedItem.id)
    ]);
    if (!error && !error2) {
      setCurrentItems((prev) => prev.filter((item) => item.id !== selectedItem.id));
      toast.success("Successfully deleted")
      hideModal(deleteModalId)
    } else {toast.error("Failed to delete")}
    setIsSaving(false)
  }

  return (
    <div className="container">
      <ToastContainer />
      <h3>{pluralize(title)}</h3>

      <button className="d-none" ref={hiddenButtonRef} data-bs-toggle="modal" data-bs-target={`#${addModalId}`}>
        Hidden Button
      </button>

      <ActionButton title={`Add New ${title}`} onClick={addItem} />

      <div className="card p-3">
        <table className="table table-striped">
          <thead>
            <tr>
              <th style={{ width: "10%" }}>ID</th>
              <th style={{ width: "70%" }}>Name</th>
              <th style={{ width: "20%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => {setSelectedItem(item); setUpdatedName(item.name);}} data-bs-toggle="modal" data-bs-target={`#${updateModalId}`}>
                    <i className="bi bi-pencil"></i> Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => setSelectedItem(item)} type="button" data-bs-toggle="modal" data-bs-target={`#${deleteModalId}`}>
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="modal fade" id={deleteModalId} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Delete {title}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">Are you sure you want to delete this {title}? This action cannot be undone.</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button type="button" className="btn btn-danger" onClick={deleteItem} disabled={isSaving}>{ isSaving ? "Delete..." : "Delete"}</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id={addModalId} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Add {title}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <input className="form-control" type="text" placeholder={`Enter ${title}`} value={newItemName} onChange={(e) => setNewItemName(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={insertItems} disabled={isSaving}>{ isSaving ? "Adding..." : "Add"}</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id={updateModalId} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Update {title}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <input className="form-control" type="text" placeholder={`Enter ${title}`} value={updatedName} onChange={(e) => setUpdatedName(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={updateItem} disabled={isSaving}>{ isSaving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericPage;
