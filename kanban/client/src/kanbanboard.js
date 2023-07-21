import React, { useEffect, useState } from "react";
import "./style/modal.css";
import axios from "axios";
import { DragDropContext } from "react-beautiful-dnd";
import Modal from "./modal";
import Column from "./Column";

const KanbanBoard = () => {
  const [tasks, setCards] = useState([]);
  const [ws, setWebSocket] = useState(null);
  const [editingCard, setEditCard] = useState(null);
  const [editedTitle, setEditTitle] = useState("");
  const [editedDescription, setEditDescription] = useState("");
  const [editedPriority, setEditPriority] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");

    socket.onopen = () => {
      console.log("WebSocket connection opened");
      setWebSocket(socket);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      setWebSocket(null);
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    const response = await axios.get("http://localhost:3001/cards");
    setCards(response.data);
  };

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

    sendWebSocketMessage({ type: "NEW_CARD", card: newCard });

    const response = await axios.post("http://localhost:3001/cards", newCard);
    setCards([...tasks, response.data]);
  };

  const sendWebSocketMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.log("WebSocket connection is not open.");
    }
  };

  const handleWebSocketMessage = (message) => {
    if (message.type === "NEW_CARD") {
      setCards((prevCards) => [...prevCards, message.card]);
    } else if (message.type === "DELETE_CARD") {
      setCards((prevCards) =>
        prevCards.filter((card) => card.id !== message.cardId)
      );
    }
  };

  const deleteCard = async (cardId) => {
    try {
      await axios.patch(`http://localhost:3001/cards/${cardId}`, {
        deleted: 1,
      });

      sendWebSocketMessage({ type: "DELETE_CARD", cardId });
      setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
    } catch (error) {
      console.error(error);
    }
  };

  const updateCardInDatabase = async (cardId, updatedCard) => {
    try {
      await axios.put(`http://localhost:3001/cards/${cardId}`, updatedCard);
    } catch (error) {
      console.error(error);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const updatedTasks = reorder(
      tasks,
      result.source.index,
      result.destination.index
    );

    const draggedCard = updatedTasks[result.destination.index];
    draggedCard.column_name = result.destination.droppableId;
    setCards(updatedTasks);

    await updateCardInDatabase(draggedCard.id, draggedCard);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-3 gap-4">
          {["To Do", "In Progress", "Done"].map((column) => (
            <Column
              key={column}
              column={column}
              tasks={tasks}
              createCard={createCard}
              openModal={openModal}
            />
          ))}
        </div>

        {selectedCard && (
          <Modal
            editingCard={editingCard}
            editedTitle={editedTitle}
            editedDescription={editedDescription}
            editedPriority={editedPriority}
            selectedCard={selectedCard}
            setEditTitle={setEditTitle}
            setEditDescription={setEditDescription}
            setEditPriority={setEditPriority}
            updateCard={updateCard}
            setEditCard={setEditCard}
            editCard={editCard}
            deleteCard={deleteCard}
            closeModal={closeModal}
          />
        )}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
