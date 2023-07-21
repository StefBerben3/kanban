import React from "react";
import "./style/modal.css";
const Modal = ({ editingCard, editedTitle, editedDescription, editedPriority, selectedCard, setEditTitle, setEditDescription, setEditPriority, updateCard, setEditCard, editCard, deleteCard, closeModal }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        {editingCard ? (
          <div>
            <h2>Edit Card</h2>
            <div className="form-group">
              <label htmlFor="title">Title:</label>{" "}
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                value={editedDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priority:</label>
              <input
                type="number"
                value={editedPriority}
                onChange={(e) => setEditPriority(parseInt(e.target.value))}
              />
            </div>
            <div className="button-group">
              <button onClick={updateCard}>Update</button>
              <button onClick={() => setEditCard(null)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            <h2>Task: {selectedCard.title}</h2>
            <p>Priority: {selectedCard.priority}</p>
            <p>Description: {selectedCard.description}</p>
            <div className="button-group">
              <button onClick={() => editCard(selectedCard)}>Edit</button>
              <button onClick={() => deleteCard(selectedCard.id)}>Delete</button>
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
