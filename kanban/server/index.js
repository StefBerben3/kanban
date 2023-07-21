const express = require('express');
const app = express();
const mysql = require('mysql')
const cors = require('cors');
const WebSocket = require("ws");

const db =  mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "kanban"
});

app.use(express.json());
app.use(cors());

// app.listen(3001,()=>{
//     console.log("server  is listening  on port 3001");
// });

app.get("/cards",(req,res)=>{
    const query =  "select  *  from  kanban_cards Where deleted = 0";
    db.query(query,(err,data)=>{
    if(err) return res.json(err)
    return res.json(data)
    })
})


  app.put('/cards/:id', (req, res) => {
    const cardId = req.params.id;
    const { title, description, priority } = req.body;
  
    const updateCardQuery = `UPDATE kanban_cards SET title = ?, description = ?, priority = ? WHERE id = ?`;
  
    db.query(updateCardQuery, [title, description, priority, cardId], (err, result) => {
      if (err) {
        console.error(err);
      } 
    });
  });

  app.patch('/cards/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE kanban_cards SET deleted = 1 WHERE id = ?', id, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        const message = { type: 'DELETE_CARD', cardId: id };
        broadcastMessage(message);
        return res.status(200).json({ success: true });
      }
    });
  });

const server = app.listen(3001, () => {
  console.log("WebSocket-server gestart op poort 3001");
});
const wss = new WebSocket.Server({ server });

const clients = new Set();
wss.on("connection", (ws) => {
  clients.add(ws);
  console.log("Nieuwe client verbonden");

  ws.on("close", () => {
    clients.delete(ws);
    console.log("Client verbinding gesloten");
  });
});

const broadcastMessage = (message) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

app.post("/cards", (req, res) => {
  const { title, description, priority, column_name } = req.body;

  const newCard = {
    title,
    description,
    priority,
    column_name,
  };

  db.query('INSERT INTO kanban_cards SET ?', newCard, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      newCard.id = result.insertId;
    }
  });

  broadcastMessage({ type: "NEW_CARD", card: newCard });

  res.status(201).json(newCard);
});
