import React, { useRef } from "react";
import ActionButton from "../components/ActionButton";
import pluralize from "pluralize";

const GenericPage = ({ title, addModalId, updateModalId, deleteModalId, items }) => {
  const hiddenButtonRef = useRef(null);

  const addItem = () => {
    if (hiddenButtonRef.current) {
      hiddenButtonRef.current.click();
    }
  };

  return (
    <div className="container">
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
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2" data-bs-toggle="modal" data-bs-target={`#${updateModalId}`}>
                    <i className="bi bi-pencil"></i> Edit
                  </button>
                  <button className="btn btn-sm btn-danger" type="button" data-bs-toggle="modal" data-bs-target={`#${deleteModalId}`}>
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
              <button type="button" className="btn btn-danger">Delete</button>
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
              <input className="form-control" type="text" placeholder={`Enter ${title}`} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="button" className="btn btn-primary">Add</button>
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
              <input className="form-control" type="text" placeholder={`Enter ${title}`} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="button" className="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericPage;
