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
    const q =  "select  *  from  kanban_cards"
    db.query(q,(err,data)=>{
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
        console.error('Error inserting card into the database:', err);
        res.status(500).json({ error: 'Error inserting card into the database' });
      } else {
        newCard.id = result.insertId;
        console.log('Card inserted into the database');
        res.status(201).json(newCard);
      }
    });
  });

app.listen(3001,()=>{
    console.log("server  is listening  on port 3001");
});