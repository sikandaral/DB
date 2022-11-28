import express, { query } from 'express'
// var express = require('express');
import bodyParser from 'body-parser'
// var bodyParser = require('body-parser');
import cors from 'cors'
// var cors = require('cors');
// import dotenv from 'dotenv'
import mysql from 'mysql'
import path from 'path';
// var path = require('path');
import {fileURLToPath} from 'url';
// var url = require('url');
// var fileURLToPath = require( 'fileURLToPath');

// count = 0
////////////// Creating Connection with MySQL ////////////////

var connection = mysql.createConnection({
    host     : 'localhost',
    database : 'project',
    user     : 'root',
    password : 'Ahmad_mukhtar07',
});


connection.connect(function(err) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }
    // console.log('Connected as id ' + connection.threadId);
    console.log(`Database Connected`)
    connection.query(`SHOW DATABASES`, 
    function (err, result) {
      if(err)
        console.log(`Error executing the query - ${err}`)
      else
        console.log("Result: ",result)})
});

////////////////////////////////////////

// var m = require('meta')

var __filename = fileURLToPath(import.meta.url);

var __dirname = path.dirname(__filename);

const app = express();
// var db =require('../database');


app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.get('/', (req, res) => {
  //console.log(__dirname)
  res.sendFile(path.join(__dirname+"/templates/home.html"));
})

app.use(express.static(__dirname +'/templates'));







// Customer Sign up
app.post('/cust_signup', (req,res)=>{
  // query = 'INSERT INTO customers (Name, Username, Password, Address, Contact) VALUES(?,?,?,?,?)';
  // connection.serialize(()=>{
    console.log("pohnch gaya")
    // count +=1
    connection.query(`INSERT INTO customers (Custkey, Name, Username, Password, Address, Contact) VALUES("${req.body.username}", "${req.body.name}", "${req.body.username}", "${req.body.password}", "${req.body.address}", ${req.body.contact});`, function(err){
      if(err){
        res.send("Error occured - form entries are incorrect");
        return console.error(err.message);
      }
      res.send("Customer signed up successfully");
      console.log("Customer signed up successfully");
    });
  // });
});


// Customer Log In
app.post('/cust_login', (req,res)=>{
  // query = 'INSERT INTO customers (Name, Username, Password, Address, Contact) VALUES(?,?,?,?,?)';
  console.log("yahaan agaya")
connection.query(`Select * FROM customers WHERE ((Username = "${req.body.username}") and (Password =  "${req.body.password}"));`, function(err, rows){
      if(err){
        res.send("Error encountered while updating");
        return console.error(err.message);
      }
      if(rows.length < 1){
        console.log(rows);
        res.send("Credentials not found");}
      else{
        console.log(rows);
        res.send("Customers logged in successfully");
        console.log("Customers logged in successfully");}
    });
});


// Employee Log In
app.post('/emp_login', function(req,res){

connection.query(`Select * FROM employees WHERE ((Username = "${req.body.username}") and (Password =  "${req.body.password}"));`, function(err, rows){
      if(err){
        res.send("Error encountered while updating");
        return console.error(err.message);
      }
      if(rows.length < 1){
        console.log(rows);
        res.send("Credentials not found");}
      else{
        console.log(rows);
        res.send("Employee logged in successfully");
        console.log("Employee logged in successfully");}
    });
});




// View Employees
app.post("/all_emp", function(req, res){
  console.log("comingg here")
connection.query(`Select Name, Designation FROM employees;`, function(err, data){
      if(err){
        res.send("Error encountered while updating");
        return console.error(err.message);
      }
      
      // var table = ""
      // for(var count = 0; count < rows.rows.length; count++){
      //   table += rows[count]
      // }
      
      // var str = "<p> Ayooo </p>"

      var str = '<table><tr>';
      console.log("inside table1");
      for (let i = 0; i < data.length; i++){
        str += "<style> body {background-color: linen; margin: 70px 350px ;} h1 {color: maroon; font-size: 50px;}"
        str += "p {color: MidnightBlue; font-size: 25px;} </style>";
        str +='<tr>';

        if (i == 0){
          for (var row in data[i]){
            str += '<td><label><h1> '+ row + '&emsp;&emsp;' + '<h1></label></td>';
          }
          str += "<tr></tr>";  
        }

        for (var row in data[i]){
          console.log("inside table1", data[i][row]);
  
          // for (var col in data[i][row]){
          str += '<td><label><p> | '+ data[i][row] + '&emsp;&emsp;' + '</p></label></td>';
          console.log("inside table2");
          // }
        }
        str += '</tr>';
      }
      str +='</table>';
      res.send(str)

      console.log("All Employees printed successfully ");
    });
});


// View Items
app.post("/all_items", function(req, res){
  // query = 'INSERT INTO customers (Name, Username, Password, Address, Contact) VALUES(?,?,?,?,?)';
  console.log("comingg here")
connection.query(`Select * FROM items;`, function(err, data){
      if(err){
        res.send("Error encountered while updating");
        return console.error(err.message);
      }





      /////////////////// PRINTING TABLE OF ITEMS ////////////////////////


      var str = '<table><tr>';
      console.log("inside table1");
      for (let i = 0; i < data.length; i++){
    
        str += "<style>  body {background-color: tan; margin: 70px ;} h1 {color: Indigo; font-size: 35px;}"
        str += "p {color: black; font-size: 17px;} </style>";
        str +='<tr>';

        if (i == 0){
          for (var row in data[i]){
            str += '<td><label><h1> '+ row + '&emsp;&emsp;' + '<h1></label></td>';
          }
          str += "<tr></tr>";  
        }

        for (var row in data[i]){
          console.log("inside table1", data[i][row]);
  
          // for (var col in data[i][row]){
          str += '<td><label><p> | '+ data[i][row] + '&emsp;&emsp;' + '</p></label></td>';
          console.log("inside table2");
          // }
        }
        str += '</tr>';
      }
      str +='</table>';
      res.send(str)

      console.log("All Items printed successfully ");
    });
});




let port = 3030
app.listen(port, () => 
{
  console.log(`Example app listening on port ${port}`)
})