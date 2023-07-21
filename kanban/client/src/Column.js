import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from "./Task";

const Column = ({ column, tasks, createCard, openModal }) => {
  return (
    <div key={column}>
      <h2 className="text-xl font-bold mb-4">{column}</h2>
      <Droppable droppableId={column} key={column}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            className="bg-gray-100 p-4 rounded shadow space-y-4"
            {...provided.droppableProps}>
            {tasks
              .filter((task) => task.column_name === column)
              .map((task, index) => (
                <Task key={task.id} task={task} index={index} openModal={openModal} />
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {column === "To Do" && (
        <button
          onClick={() => createCard(column)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600">Create New Card
        </button>
      )}
    </div>
  );
};

export default Column;
