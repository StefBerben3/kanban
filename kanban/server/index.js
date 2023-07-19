const express= require('express')
const app = express()
const mysql = require('mysql')

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

app.listen(3001,()=>{
    console.log("server  is listening  on port 3001");
});