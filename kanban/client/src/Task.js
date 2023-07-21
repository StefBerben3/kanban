import React from "react";
import { Draggable } from "react-beautiful-dnd";

const Task = ({ task, index, openModal }) => {
  return (
    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-4 rounded shadow cursor-pointer flex items-center justify-between"
          onClick={() => openModal(task)}>
          <div>
            {task.title} - Priority: {task.priority}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
