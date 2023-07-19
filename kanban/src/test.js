import React, { useState } from 'react';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Task 1', column: 'To Do' },
    { id: 2, title: 'Task 2', column: 'In Progress' },
    { id: 3, title: 'Task 3', column: 'Done' },

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

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-1">
          <h2 className="text-xl font-bold mb-4">To Do</h2>
          <div className="bg-gray-100 p-4 rounded shadow space-y-4" onDrop={(e) => handleDrop(e, 'To Do')} onDragOver={(e) => e.preventDefault()}>
            {tasks
              .filter((task) => task.column === 'To Do')
              .map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded shadow cursor-pointer"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id.toString())}
                >
                  {task.title}
                </div>
              ))}
          </div>
        </div>

        <div className="col-span-1">
          <h2 className="text-xl font-bold mb-4">In Progress</h2>
          <div className="bg-gray-100 p-4 rounded shadow space-y-4" onDrop={(e) => handleDrop(e, 'In Progress')} onDragOver={(e) => e.preventDefault()}>
            {tasks
              .filter((task) => task.column === 'In Progress')
              .map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded shadow cursor-pointer"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id.toString())}
                >
                  {task.title}
                </div>
              ))}
          </div>
        </div>

        <div className="col-span-1">
          <h2 className="text-xl font-bold mb-4">Done</h2>
          <div className="bg-gray-100 p-4 rounded shadow space-y-4" onDrop={(e) => handleDrop(e, 'Done')} onDragOver={(e) => e.preventDefault()}>
            {tasks
              .filter((task) => task.column === 'Done')
              .map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded shadow cursor-pointer"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id.toString())}
                >
                  {task.title}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
