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
  host     : 'dbgroup13.mysql.database.azure.com',
  database : 'project',
  user     : 'abdullah42@dbgroup13',
  password : 'dbGroup13',
});

connection.connect(function(err) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }
    // console.log('Connected as id ' + connection.threadId); ('444','Dispirin','dissolvable','20','2020-07-06T19:00:00.000Z','2024-03-31T19:00:00.000Z')
    console.log(`Database Connected`)
    //for (let i = 550; i < 570; i++){
    //connection.query(`INSERT INTO items (Item_key, Name, Description, Price, Mfg_date, Exp_date) VALUES ('666','Somogel','paste for internal pain',250,NOW(),STR_TO_DATE('29/03/2024','%d/%m/%Y')); `, 
    //connection.query(`INSERT INTO storage (Storagekey, S_itemkey, Quantity, Storage_type, Min_amount) VALUES ('6','666',350,'Paste for internal pain',150); `, 
    //connection.query(`Select * from storage;`,
    //connection.query(`Select S_Itemkey,Quantity,Min_amount FROM storage Where storage.Quantity<storage.Min_amount;`,
    connection.query(`Select * from storage;`,
    //connection.query(`Select Distinct(Item_key) from items;`,
    function (err, result) {
      if(err)
        console.log(`Error executing the query - ${err}`)
      else
        console.log("Result: ",result)})
    //}    
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
  res.sendFile(path.join(__dirname+"/templates/Restocker.html"));
})

app.use(express.static(__dirname +'/templates'));






// View Items
app.post("/view_item", function(req, res){
  // query = 'INSERT INTO customers (Name, Username, Password, Address, Contact) VALUES(?,?,?,?,?)';
  console.log("comingg here")
connection.query(`Select S_Itemkey,Quantity,Min_amount FROM storage Where storage.Quantity<storage.Min_amount;`, function(err, data){
      if(err){
        res.send("Error encountered while updating");
        return console.error(err.message);
      }


      var str = '<table><tr>';
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
          // console.log("inside table2");
          // }
        }
        str += '</tr>';
      }
      str +='</table>';
      res.send(str)

      console.log("All Items printed successfully ");
    });
});


///// Place Order ////////

app.post('/place_ord', (req,res)=>{

  console.log("pohnch gaya2")
  connection.query(`Update storage Set Quantity = Quantity + ${req.body.quantity}  Where S_Itemkey = ${req.body.itemID};`, function(err, data){
  //connection.query(`If Exists (Select S_Itemkey From storage where S_Itemkey = ${req.body.itemID}) Update storage Set Quantity = Quantity + ${req.body.quantity}  Where S_Itemkey = ${req.body.itemID} If Exists (Select * From storage Where S_Itemkey = ${req.body.itemID});`, function(err, data){
    if(err){
      res.send("<h2> Error occured - Invalid Input </h2>");
      return console.error(err.message);
    }
    console.log(data)
    res.send("<h2> Item Ordered Successfully! <br> Go back to previous page to perform other functions <h2>");
    console.log("Item Ordered Successfully!");
  });
// });
});

let port = 3030
app.listen(port, () => 
{
  console.log(`Example app listening on port ${port}`)
})
