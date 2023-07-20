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

// app.get("/",(req, res)=>  {
//     // const sqlInsert =  "INSERT into kanban_cards (title,description,priority,column_name)  VALUES('test','test','1','test');"
//     // db.query(sqlInsert,(err,result)=>
//     // {
//     //     res.send("hello world!")
//     // })
//     console.log("hello  world");
// });

// app.get("/api", (req, res) => {
//     res.json({ "users": ["userone", "usertwo", "userthree"] });
//   });

app.use(express.json());
app.use(cors());

// app.post('/api/tasks', (req, res) => {
//   const { title, description, priority, column } = req.body;

//   const newTask = {
//     title,
//     description,
//     priority,
//     column,
//   };

//   db.query('INSERT INTO kanban_cards SET ?', newTask, (err, result) => {
//     if (err) {
//       console.error('Error inserting task into the database:', err);
//       res.status(500).json({ error: 'Error inserting task into the database' });
//     } else {
//       console.log('Task inserted into the database');
//       res.status(201).json({ message: 'Task inserted into the database' });
//     }
//   });
// });

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

// app.get('/cards', (req, res) => {
//     db.query("select  *  from  kanban_cards", (err, rows) => {
//       if (err) {
//         console.error('Error retrieving tasks from the database:', err);
//         res.status(500).json({ error: 'Error retrieving tasks from the database' });
//       } else {
//         // Sorteer de taken per kolom
//         const columns = ['To Do', 'In Progress', 'Done'];
//         const sortedTasks = columns.reduce((acc, col) => {
//           const tasksInColumn = rows.filter((task) => task.column === col);
//           return { ...acc, [col]: tasksInColumn };
//         }, {});

//         res.json(sortedTasks);
//       }
//     });
//   });


app.listen(3001,()=>{
    console.log("server  is listening  on port 3001");
});