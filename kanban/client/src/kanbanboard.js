import React, { useState } from 'react';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([
    // { id: 1, title: 'Task 1', description: 'Description 1', priority: 1, column: 'To Do' },
    // { id: 2, title: 'Task 2', description: 'Description 2', priority: 2, column: 'In Progress' },
    // { id: 3, title: 'Task 3', description: 'Description 3', priority: 3, column: 'Done' },
  ]);

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

  const handleCreateCard = (column) => {
    const priority = prompt('Enter Priority (1-5):');
    if (priority === null) return;
    const title = prompt('Enter Title:');
    if (title === null) return;
    const description = prompt('Enter Description:');
    if (description === null) return;

    const newCard = {
      id: Date.now(),
      title,
      description,
      priority: parseInt(priority),
      column,
    };

    setTasks([...tasks, newCard]);
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
                .filter((task) => task.column === column)
                .map((task) => (
                  <div
                    key={task.id}
                    className="bg-white p-4 rounded shadow cursor-pointer flex items-center justify-between"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id.toString())}
                  >
                    <div>
                      {task.title} - Priority: {task.priority}
                    </div>
                    <button onClick={() => handleDeleteCard(task.id)} className="text-red-500">
                      <i className="fas fa-trash"></i>
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
    </div>
  );
};

export default KanbanBoard;
