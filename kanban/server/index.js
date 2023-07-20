const express = require('express');
const app = express();
const mysql = require('mysql')
const cors = require('cors');

const db =  mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "kanban"
});

app.use(express.json());
app.use(cors());

app.get("/cards",(req,res)=>{
    const query =  "select  *  from  kanban_cards Where deleted = 0";
    db.query(query,(err,data)=>{
    if(err) return res.json(err)
    return res.json(data)
    })
})

app.post('/cards', (req, res) => {
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
  });


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

      } 
    });
  });

app.listen(3001,()=>{
    console.log("server  is listening  on port 3001");
});