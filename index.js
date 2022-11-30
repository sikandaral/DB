import express, { query } from "express";
// var express = require('express');
import bodyParser from "body-parser";
// var bodyParser = require('body-parser');
import cors from "cors";
// var cors = require('cors');
// import dotenv from 'dotenv'
import mysql from "mysql";
import path from "path";
// var path = require('path');
import { fileURLToPath } from "url";
// var url = require('url');
// var fileURLToPath = require( 'fileURLToPath');

// count = 0
////////////// Creating Connection with MySQL ////////////////

var connection = mysql.createConnection({
  host: "dbgroup13.mysql.database.azure.com",
  database: "project",
  user: "abdullah42@dbgroup13",
  password: "dbGroup13",
});

connection.connect(function (err) {
  if (err) {
    console.error("Error connecting: " + err.stack);
    return;
  }
  // console.log('Connected as id ' + connection.threadId);
  console.log(`Database Connected`);
  connection.query(`SHOW DATABASES`, function (err, result) {
    if (err) console.log(`Error executing the query - ${err}`);
    else console.log("Result: ", result);
  });
});

////////////////////////////////////////

// var m = require('meta')

var __filename = fileURLToPath(import.meta.url);

var __dirname = path.dirname(__filename);

const app = express();
// var db =require('../database');

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  //console.log(__dirname)
  res.sendFile(path.join(__dirname + "/templates/home.html"));
});

app.use(express.static(__dirname + "/templates"));

// Customer Sign up
app.post("/cust_signup", (req, res) => {
  // query = 'INSERT INTO customers (Name, Username, Password, Address, Contact) VALUES(?,?,?,?,?)';
  // connection.serialize(()=>{
  console.log("pohnch gaya");
  // count +=1
  connection.query(
    `INSERT INTO customers (Custkey, Name, Username, Password, Address, Contact) VALUES("${req.body.username}", "${req.body.name}", "${req.body.username}", "${req.body.password}", "${req.body.address}", ${req.body.contact});`,
    function (err) {
      if (err) {
        res.send("Error occured - form entries are incorrect");
        return console.error(err.message);
      }
      res.send(
        "<h2> Customer signed up successfully! <br> Go back to previous page and log in. <h2>"
      );
      console.log("Customer signed up successfully");
    }
  );
  // });
});

// Customer Log In
var cust_key;
app.post("/cust_login", (req, res) => {
  // query = 'INSERT INTO customers (Name, Username, Password, Address, Contact) VALUES(?,?,?,?,?)';
  connection.query(
    `Select * FROM customers WHERE ((Username = "${req.body.username}") and (Password =  "${req.body.password}"));`,
    function (err, rows) {
      if (err) {
        res.send("Error encountered while logging in");
        return console.error(err.message);
      }
      if (rows.length < 1) {
        console.log(rows);
        res.send("Credentials not found");
      } else {
        cust_key = req.body.username;
        console.log(rows);

        //res.send("Customers logged in successfully");
        console.log("Customers logged in successfully");
      }
      res.sendFile(path.join(__dirname + "/templates/custHome.html"));
    }
  );
});

// Employee Log In
app.post("/emp_login", function (req, res) {
  console.log("yahaan agaya");
  connection.query(
    `Select * FROM employees WHERE ((Username = "${req.body.username}") and (Password =  "${req.body.password}") and (Designation =  "${req.body.designation}"));`,
    function (err, rows) {
      if (err) {
        console.log(err.mess);
        res.send("Error encountered while updating");
        return console.error(err.message);
      }
      if (rows.length < 1) {
        console.log(rows);
        res.send("Credentials not found");
      } else {
        console.log(rows);

        var str =
          "<style> body {background-color: linen; margin: 70px 350px ;} h1 {color: maroon; font-size: 50px;}";
        str +=
          "button {padding: 10px 50px; font-size: 40px; border: 1px solid #4D4AE8; border-radius: 1rem; box-sizing: border-box;} </style>";

        str +=
          "<h1> Employee successfully logged in!</h1> <br> <h2> Click the button below to continue:</h2><br><br>";
        str += '<a href= "/templates/home.html" ><button> Click </button></a>';

        // res.send(str);

        res.sendFile(path.join(__dirname + "/templates/Manager.html"));

        console.log("Employee logged in successfully!");
      }
    }
  );
});

// View Employees
app.post("/all_emp", function (req, res) {
  console.log("comingg here");
  connection.query(
    `Select Name, Designation, Username FROM employees;`,
    function (err, data) {
      if (err) {
        res.send("Error encountered while updating");
        return console.error(err.message);
      }

      // var table = ""
      // for(var count = 0; count < rows.rows.length; count++){
      //   table += rows[count]
      // }

      // var str = "<p> Ayooo </p>"

      var str = "<table><tr>";
      for (let i = 0; i < data.length; i++) {
        str +=
          "<style> body {background-color: linen; margin: 70px 150px ;} h1 {color: maroon; font-size: 50px;}";
        str += "p {color: MidnightBlue; font-size: 25px;} </style>";
        str += "<tr>";

        if (i == 0) {
          for (var row in data[i]) {
            str +=
              "<td><label><h1> " + row + "&emsp;&emsp;" + "<h1></label></td>";
          }
          str += "<tr></tr>";
        }

        for (var row in data[i]) {
          console.log("inside table1", data[i][row]);

          // for (var col in data[i][row]){
          str +=
            "<td><label><p> | " +
            data[i][row] +
            "&emsp;&emsp;" +
            "</p></label></td>";
          // console.log("inside table2");
          // }
        }
        str += "</tr>";
      }
      str += "</table>";
      res.send(str);

      console.log("All Employees printed successfully ");
    }
  );
});

// View Items
app.post("/all_items", function (req, res) {
  // query = 'INSERT INTO customers (Name, Username, Password, Address, Contact) VALUES(?,?,?,?,?)';
  console.log("comingg here");
  connection.query(`Select * FROM items;`, function (err, data) {
    if (err) {
      res.send("Error encountered while updating");
      return console.error(err.message);
    }

    /////////////////// PRINTING TABLE OF ITEMS ////////////////////////

    var str = "<table><tr>";
    for (let i = 0; i < data.length; i++) {
      str +=
        "<style>  body {background-color: tan; margin: 70px ;} h1 {color: Indigo; font-size: 35px;}";
      str += "p {color: black; font-size: 17px;} </style>";
      str += "<tr>";

      if (i == 0) {
        for (var row in data[i]) {
          str +=
            "<td><label><h1> " + row + "&emsp;&emsp;" + "<h1></label></td>";
        }
        str += "<tr></tr>";
      }

      for (var row in data[i]) {
        console.log("inside table1", data[i][row]);

        // for (var col in data[i][row]){
        str +=
          "<td><label><p> | " +
          data[i][row] +
          "&emsp;&emsp;" +
          "</p></label></td>";
        // console.log("inside table2");
        // }
      }
      str += "</tr>";
    }
    str += "</table>";
    res.send(str);

    console.log("All Items printed successfully ");
  });
});

//////////////////// MANAGER FUNCTIONS //////////////////

///// REEMOVE EMPLOYEE ////////

app.post("/remove_emp", (req, res) => {
  // query = 'INSERT INTO customers (Name, Username, Password, Address, Contact) VALUES(?,?,?,?,?)';
  // connection.serialize(()=>{
  console.log("pohnch gaya");
  // count +=1

  if (req.body.designation == "manager") {
    // To see if a manager is not removed
    res.send(
      "<h2> Cannot remove a MANAGER! <br> Go back to previous page to perform other functions <h2>"
    );
  } else {
    connection.query(
      `DELETE FROM employees WHERE (Username = "${req.body.username}" and Designation = "${req.body.designation}");`,
      function (err, data) {
        if (err) {
          res.send("Error occured - form entries are incorrect");
          return console.error(err.message);
        }
        if (data.affectedRows == 0) {
          // To see if employee exists
          res.send(
            "<h2> Employee doesn't exist! <br> Go back to previous page to do other functions <h2>"
          );
        } else {
          res.send(
            "<h2> Employee removed successfully! <br> Go back to previous page to do other functions <h2>"
          );
          console.log("Employee removed successfully!");
        }
      }
    );
  }
  // });
});

///// ADD EMPLOYEE ////////

app.post("/add_emp", (req, res) => {
  console.log("pohnch gaya");

  if (req.body.designation == "manager") {
    res.send(
      "<h2> Cannot add a manager! <br> Go back to previous page to perform other functions <h2>"
    );
  } else {
    connection.query(
      `INSERT INTO employees VALUES ("${req.body.username}", "${req.body.name}", "${req.body.designation}", "${req.body.username}", "${req.body.password}");`,
      function (err, data) {
        if (err) {
          res.send("<h2> Error occured - Username already taken </h2>");
          return console.error(err.message);
        }
        res.send(
          "<h2> Employee added successfully! <br> Go back to previous page to perform other functions <h2>"
        );
        console.log("Employee added successfully!");
      }
    );
  }
  // });
});

///// CUSTOMER USE CASES /////
//search item:
app.post("/cust_search", function (req, res) {
  // query = 'INSERT INTO customers (Name, Username, Password, Address, Contact) VALUES(?,?,?,?,?)';
  connection.query(`Select * FROM items WHERE (Name LIKE "%${req.body.search}%" OR Name = "${req.body.search}");`, function (err, data) {
    if (err) {
      res.send("Error encountered while searching");
      return console.error(err.message);
    }

    var str = '<table><tr>';
    for (let i = 0; i < data.length; i++) {
      str += "<style> body {background-color: linen; margin: 70px 150px ;} h1 {color: maroon; font-size: 50px;}"
      str += "p {color: MidnightBlue; font-size: 25px;} </style>";
      str += '<tr>';

      if (i == 0) {
        for (var row in data[i]) {
          str += '<td><label><h1> ' + row + '&emsp;&emsp;' + '<h1></label></td>';
        }
        str += "<tr></tr>";
      }

      for (var row in data[i]) {
        console.log("inside table1", data[i][row]);

        // for (var col in data[i][row]){
        str += '<td><label><p> | ' + data[i][row] + '&emsp;&emsp;' + '</p></label></td>';
        // console.log("inside table2");
        // }
      }
      str += '</tr>';
    }
    str += '</table>';
    res.send(str)

    console.log("All search items printed successfully ");

    // res.send(rows);
    // console.log("Items shown successfully" + cust_key);
  });
});

//add item to cart:
app.post("/select_item", function (req, res) {
  connection.query(`insert into cart (C_Custkey, C_Itemkey, Quantity) 
  Select "${cust_key}", (select Item_key from items where Name = "${req.body.addtocart}" ), ${req.body.cartquantity} 
  where (select Quantity from storage where S_itemkey = (select Item_key from items where Name = "${req.body.addtocart}" )) - ${req.body.cartquantity} > 0 ;`, function (err, rows) {
    if (err) {
      res.send("Error encountered while adding to cart" + cust_key);
      console.log(req.body.addtocart + " " + req.body.cartquantity)
      return console.error(err.message);
    }
    if (rows.affectedRows == 0) {
      res.send("Invalid")
    } else {
      res.send("Added " + req.body.cartquantity + " " + req.body.addtocart + " successfully");
    }

    console.log("Added to cart " + cust_key);
  });
});

//remove item from to cart:
app.post("/remove_item", function (req, res) {
  // query = 'INSERT INTO customers (Name, Username, Password, Address, Contact) VALUES(?,?,?,?,?)';
  connection.query(`DELETE FROM cart WHERE (C_Custkey = "${cust_key}" AND C_Itemkey = (SELECT Item_key FROM items WHERE Name = "${req.body.removefromcart}") );`, function (err, rows) {
    if (err) {
      res.send("Error encountered while removing");
      return console.error(err.message);
    }
    if (rows.affectedRows == 0) {
      res.send(req.body.removefromcart + " is not present in cart")
    } else {
      res.send(req.body.removefromcart + " removed successfully");
    }


    console.log(rows["changedRows"]);
  });
});

let port = 3030;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
