import React, { useEffect, useState } from "react";
import "./style/modal.css";
import axios from "axios";

const KanbanBoard = () => {
  const [tasks, setCards] = useState([]);

  useEffect(() => {
    fetchCards();
  });

  const fetchCards = async () => {
    const response = await axios.get("http://localhost:3001/cards");
    setCards(response.data);
  };

  const [editingCard, setEditCard] = useState(null);
  const [editedTitle, setEditTitle] = useState("");
  const [editedDescription, setEditDescription] = useState("");
  const [editedPriority, setEditPriority] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null);

  const openModal = (card) => {
    setSelectedCard(card);
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  const editCard = (card) => {
    setEditCard(card);
    setEditTitle(card.title);
    setEditDescription(card.description);
    setEditPriority(card.priority);
  };

  const updateCard = () => {
    const updatedCard = {
      ...editingCard,
      title: editedTitle,
      description: editedDescription,
      priority: editedPriority,
    };

    const updatedTasks = tasks.map((task) =>
      task.id === editingCard.id ? updatedCard : task
    );

    setCards(updatedTasks);
    setEditCard(null);
    updateCardInDatabase(updatedCard);
  };

  const dropCards = (e, targetColumn) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    const updatedTasks = tasks.map((task) =>
      task.id.toString() === taskId ? { ...task, column: targetColumn } : task
    );
    setCards(updatedTasks);
  };

  const startDrag = (e, taskId) => {
    e.dataTransfer.setData("text/plain", taskId);
  };

  const createCard = async (column) => {
    const priority = prompt("Enter Priority (1-5):");
    if (priority === null) return;
    const title = prompt("Enter Title:");
    if (title === null) return;
    const description = prompt("Enter Description:");
    if (description === null) return;

    const newCard = {
      title,
      description,
      priority: parseInt(priority),
      column_name: column,
    };
    const response = await axios.post("http://localhost:3001/cards", newCard);
    setCards([...tasks, response.data]);
  };

  const deleteCard = async (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, deleted: 1 } : task
    );
    setCards(updatedTasks);
    await axios.patch(`http://localhost:3001/cards/${taskId}`, { deleted: 1 });
  };

  const updateCardInDatabase = async (updatedCard) => {
    await axios.put(
      `http://localhost:3001/cards/${updatedCard.id}`,
      updatedCard
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-3 gap-4">
        {["To Do", "In Progress", "Done"].map((column) => (
          <div key={column}>
            <h2 className="text-xl font-bold mb-4">{column}</h2>
            <div
              className="bg-gray-100 p-4 rounded shadow space-y-4"
              onDrop={(e) => dropCards(e, column)}
              onDragOver={(e) => e.preventDefault()}
            >
              {tasks
                .filter((task) => task.column_name === column)
                .map((task) => (
                  <div
                    key={task.id}
                    className="bg-white p-4 rounded shadow cursor-pointer flex items-center justify-between"
                    draggable
                    onDragStart={(e) => startDrag(e, task.id.toString())}
                    onClick={() => openModal(task)}
                  >
                    <div>
                      {task.title} - Priority: {task.priority}
                    </div>
                    <button
                      onClick={() => deleteCard(task.id)}
                      className="text-red-500"
                    ></button>
                  </div>
                ))}
            </div>
            <button
              onClick={() => createCard(column)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            >
              Create New Card
            </button>
          </div>
        ))}
      </div>

      {selectedCard && (
        <div className="modal-overlay">
          <div className="modal">
            {editingCard ? (
              <div>
                <h2>Edit Card</h2>
                <label htmlFor="title">Title:</label>{" "}
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <label htmlFor="description">Description:</label>
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <label htmlFor="priority">Priority:</label>
                <input
                  type="number"
                  value={editedPriority}
                  onChange={(e) => setEditPriority(parseInt(e.target.value))}
                />
                <button onClick={updateCard}>Update</button>
                <button onClick={() => setEditCard(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <h2>Task: {selectedCard.title}</h2>
                <p>Priority: {selectedCard.priority}</p>
                <p>Description: {selectedCard.description}</p>
                <button onClick={() => editCard(selectedCard)}>Edit</button>
                <button onClick={() => deleteCard(selectedCard.id)}>
                  Delete
                </button>
                <button onClick={closeModal}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
