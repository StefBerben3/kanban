import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import "./style/modal.css";
import axios from 'axios';

const element = <FontAwesomeIcon icon={faEnvelope} />
const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/cards');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };



  
  const [editingCard, setEditingCard] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedPriority, setEditedPriority] = useState(1);

  const [selectedCard, setSelectedCard] = useState(null);

  const handleOpenModal = (card) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setEditedTitle(card.title);
    setEditedDescription(card.description);
    setEditedPriority(card.priority);
  };

  const handleUpdateCard = () => {
    const updatedCard = {
      ...editingCard,
      title: editedTitle,
      description: editedDescription,
      priority: editedPriority,
    };

    const updatedTasks = tasks.map((task) =>
      task.id === editingCard.id ? updatedCard : task
    );

    setTasks(updatedTasks);
    setEditingCard(null);
  };
  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    const updatedTasks = tasks.map((task) =>
      task.id.toString() === taskId ? { ...task, column: targetColumn } : task
    );
    setTasks(updatedTasks);
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleCreateCard = async (column) => {
    const priority = prompt('Enter Priority (1-5):');
    if (priority === null) return;
    const title = prompt('Enter Title:');
    if (title === null) return;
    const description = prompt('Enter Description:');
    if (description === null) return;

    const newCard = {
      title,
      description,
      priority: parseInt(priority),
      column_name: column,
    };

    try {
      const response = await axios.post('http://localhost:3001/cards', newCard);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };

  const handleDeleteCard = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  return (
    <div className="container mx-auto py-8">
    <div className="grid grid-cols-3 gap-4">
      {['To Do', 'In Progress', 'Done'].map((column) => (
        <div key={column}>
          <h2 className="text-xl font-bold mb-4">{column}</h2>
          <div
            className="bg-gray-100 p-4 rounded shadow space-y-4"
            onDrop={(e) => handleDrop(e, column)}
            onDragOver={(e) => e.preventDefault()}
          >
            {tasks
              .filter((task) => task.column_name === column)
              .map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded shadow cursor-pointer flex items-center justify-between"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id.toString())}
                  onClick={() => handleOpenModal(task)}
                >
                  <div>
                    {task.title} - Priority: {task.priority}
                  </div>
                  <button onClick={() => handleDeleteCard(task.id)} className="text-red-500">
                    <i className="element"></i>
                  </button>
              </div>
            ))}
        </div>
        <button
          onClick={() => handleCreateCard(column)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          Create New Card
        </button>
          </div>
          
        ))}
        </div>
      
      {selectedCard && (
        <div className='modal-overlay'>
          <div className='modal'>
            {editingCard ? (
              <>
                <h2>Edit Card</h2>
                
                <label htmlFor="title">Title:</label>  <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <label htmlFor="description">Description:</label>
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                />
                <label htmlFor="priority">Priority:</label>
                <input
                  type="number"
                  value={editedPriority}
                  onChange={(e) => setEditedPriority(parseInt(e.target.value))}
                />
                <button onClick={handleUpdateCard}>Update</button>
                <button onClick={() => setEditingCard(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h2>Task: {selectedCard.title}</h2>
                <p>Priority: {selectedCard.priority}</p>
                <p>Description: {selectedCard.description}</p>
                <button onClick={() => handleEditCard(selectedCard)}>Edit</button>
                <button onClick={() => handleDeleteCard(selectedCard.id)}>Delete</button>
                <button onClick={handleCloseModal}>Close</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
