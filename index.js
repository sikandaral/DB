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
import bcrypt from "bcrypt";
// var url = require('url');
// var fileURLToPath = require( 'fileURLToPath');

// count = 0
////////////// Creating Connection with MySQL ////////////////

var connection = mysql.createConnection({
  host: "dbgroup13.mysql.database.azure.com",
  database: "project",
  user: "abdullah42@dbgroup13",
  password: "dbGroup13",
  multipleStatements: true,
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

/////////////// Customer Sign up //////////////////////////

app.post("/cust_signup", (req, res) => {
  // query = 'INSERT INTO customers (Name, Username, Password, Address, Contact) VALUES(?,?,?,?,?)';
  // connection.serialize(()=>{

  var password = req.body.password;
  var hash = bcrypt.hashSync(password, 10);
  var username = req.body.username;
  var name = req.body.name;
  var address = req.body.address;
  var contact = req.body.contact;

  // console.log("pohnch gaya", hash, password);
  connection.query(
    `INSERT INTO customers (Custkey, Name, Username, Password, Address, Contact) VALUES(?, ?, ?, ?, ?, ?);`,
    [username, name, username, hash, address, contact],
    function (err) {
      if (err) {
        res.send("Error occured - form entries are incorrect");
        return console.error(err.message);
      }
      res.send(
        "<h2> Customer signed up successfully! <br> Go back to previous page and log in. <h2>"
      );
      console.log("Customer signed up successfully", hash);
    }
  );
  /*
    connection.query(
      `INSERT INTO customers (Custkey, Name, Username, Password, Address, Contact) VALUES("${req.body.username}", "${req.body.name}", "${req.body.username}", "${hash}", "${req.body.address}", ${req.body.contact});`,
      function (err) {
        if (err) {
          res.send("Error occured - form entries are incorrect");
          return console.error(err.message);
        }
        res.send(
          "<h2> Customer signed up successfully! <br> Go back to previous page and log in. <h2>"
        );
        console.log("Customer signed up successfully", hash);
  
      });*/
});

/////////////////// Customer Log In /////////////////////////
var cust_key;
app.post("/cust_login", (req, res) => {
  // query = 'INSERT INTO customers (Name, Username, Password, Address, Contact) VALUES(?,?,?,?,?)';
  var password = req.body.password;
  var username = req.body.username;
  connection.query(
    `Select Password FROM customers WHERE ((Username = ?));`,
    [username],
    function (err, rows) {
      if (err) {
        res.send("Error encountered while logging in");
        return console.error(err.message);
      }
      if (rows.length < 1) {
        console.log(rows);
        res.send("Credentials not found");
      } else {
        // console.log("sdf", rows[0].Password);
        const isValid = bcrypt.compareSync(password, rows[0].Password);
        //res.send("Customers logged in successfully");
        // console.log("Password valid: ", isValid);
        if (isValid) {
          cust_key = req.body.username;
        } else {
          res.send("Incorrect Password");
        }
      }
      res.sendFile(path.join(__dirname + "/templates/custHome.html"));
    }
  );
});

//////////////////// Employee Log In ////////////////////////////////

var emp_key;
var emp_pass;
app.post("/emp_login", function (req, res) {
  console.log("yahaan agaya");
  var user = req.body.username;
  var pass = req.body.password;

  connection.query(
    `SELECT Password FROM Employees WHERE Username = ?;`,
    [user],
    function (err, rows) {
      //connection.query(`If Exists (Select S_Itemkey From storage where S_Itemkey = ${req.body.itemID}) Update storage Set Quantity = Quantity + ${req.body.quantity}  Where S_Itemkey = ${req.body.itemID} If Exists (Select * From storage Where S_Itemkey = ${req.body.itemID});`, function(err, data){
      if (err) {
        res.send("<h2> Error occured - Invalid Input </h2>");
        return console.error(err.message);
      }
      if (rows.length < 1) {
        res.send("Credentials not found");
      } else {
        var hash = bcrypt.hashSync(pass, 10);
        console.log(hash)
        var isValid = bcrypt.compareSync(pass, rows[0].Password);
        if (isValid) {
          connection.query(
            `Select Designation FROM employees WHERE (Username = ?);`,
            [user],
            function (err, rows) {
              if (err) {
                console.log(err.mess);
                // res.send("Error encountered while updating");
                return console.error(err.message);
              }
              if (rows.length < 1) {
                console.log(rows);
                res.send("Credentials not found");
                // return console.error(err.message);
              } else {
                console.log(rows);

                var str =
                  "<style> body {background-color: linen; margin: 70px 350px ;} h1 {color: maroon; font-size: 50px;}";
                str +=
                  "button {padding: 10px 50px; font-size: 40px; border: 1px solid #4D4AE8; border-radius: 1rem; box-sizing: border-box;} </style>";

                str +=
                  "<h1> Employee successfully logged in!</h1> <br> <h2> Click the button below to continue:</h2><br><br>";
                str +=
                  '<a href= "/templates/home.html" ><button> Click </button></a>';

                if (rows[0]["Designation"] == "manager") {
                  console.log("manager hai bhai");
                  res.sendFile(
                    path.join(__dirname + "/templates/Manager.html")
                  );
                }

                if (rows[0]["Designation"] == "restocker") {
                  res.sendFile(
                    path.join(__dirname + "/templates/Restocker.html")
                  );
                }

                if (rows[0]["Designation"] == "supplier") {
                  emp_key = req.body.username;
                  emp_pass = req.body.password;
                  console.log("just checking");
                  res.sendFile(
                    path.join(__dirname + "/templates/Supplier.html")
                  );
                }

                console.log("Employee logged in successfully!");
              }
            }
          );
        }else{
          res.send("Invalid password");
        }
      }
    }
  );
});

///////////////// View Employees //////////////////////
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

///// REMOVE EMPLOYEE ////////

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
    var username = req.body.username;
    var desig = req.body.designation;
    connection.query(
      `DELETE FROM employees WHERE (Username = ? and Designation = ?);`,
      [username, desig],
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

//////// ADD EMPLOYEE ///////////

app.post("/add_emp", (req, res) => {
  console.log("pohnch gaya");

  if (req.body.designation == "manager") {
    res.send(
      "<h2> Cannot add a manager! <br> Go back to previous page to perform other functions <h2>"
    );
  } else {
    var username = req.body.username;
    var name = req.body.name;
    var desig = req.body.designation;
    var pass = req.body.password;
    var hash = bcrypt.hashSync(pass, 10);
    connection.query(
      `INSERT INTO employees VALUES (?, ?, ?, ?, ?);`,
      [username, name, desig, username, hash],
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

///// EDIT EMP STATUS ///////////

app.post("/edit_emp", (req, res) => {
  var stat = req.body.status;
  var id = req.body.ID;
  connection.query(
    `Update employees Set status = ? where Empkey = ? ;`,
    [stat, id],
    function (err, data) {
      //connection.query(`If Exists (Select S_Itemkey From storage where S_Itemkey = ${req.body.itemID}) Update storage Set Quantity = Quantity + ${req.body.quantity}  Where S_Itemkey = ${req.body.itemID} If Exists (Select * From storage Where S_Itemkey = ${req.body.itemID});`, function(err, data){
      if (err) {
        res.send("<h2> Error occured - Invalid Input </h2>");
        return console.error(err.message);
      }
      console.log(data);
      if (data.changedRows == 0) {
        res.send(
          "<h2> Error occured - You've either entered an incorrect ID or the status is already what you chose </h2>"
        );
        return;
      }
      res.send(
        "<h2> Status changed Successfully! <br> Go back to previous page to perform other functions <h2>"
      );
      console.log(req.body);
      console.log("Status changed Successfully!");
    }
  );
});

//////////////////// CUSTOMER USE CASES /////////////////////
//search item:
app.post("/cust_search", function (req, res) {
  // query = 'INSERT INTO customers (Name, Username, Password, Address, Contact) VALUES(?,?,?,?,?)';
  var search_ = "%" + req.body.search + "%";
  connection.query(
    `Select * FROM items WHERE (Name LIKE ? OR Name = ?);`,
    [search_, search_],
    function (err, data) {
      if (err) {
        res.send("Error encountered while searching");
        return console.error(err.message);
      }

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

      console.log("All search items printed successfully ");

      // res.send(rows);
      // console.log("Items shown successfully" + cust_key);
    }
  );
});

//add item to cart:
app.post("/select_item", function (req, res) {
  var item_name = req.body.addtocart;
  var quantity = req.body.cartquantity;

  connection.query(
    `insert into cart (C_Custkey, C_Itemkey, Quantity) 
  Select ?, (select Item_key from items where Name = ? ), ? 
  where (select Quantity from storage where S_itemkey = (select Item_key from items where Name = ? )) - ? > 0 ;`,
    [cust_key, item_name, quantity, item_name, quantity],
    function (err, rows) {
      if (err) {
        res.send("Error encountered while adding to cart" + cust_key);
        console.log(req.body.addtocart + " " + req.body.cartquantity);
        return console.error(err.message);
      }
      if (rows.affectedRows == 0) {
        res.send("Invalid item name");
      } else {
        res.send(
          "Added " +
            req.body.cartquantity +
            " " +
            req.body.addtocart +
            " successfully"
        );
      }

      console.log("Added to cart " + cust_key);
    }
  );
});

//remove item from to cart:
app.post("/remove_item", function (req, res) {
  // query = 'INSERT INTO customers (Name, Username, Password, Address, Contact) VALUES(?,?,?,?,?)';
  var item_name = req.body.removefromcart;
  connection.query(
    `DELETE FROM cart WHERE (C_Custkey = ? AND C_Itemkey = (SELECT Item_key FROM items WHERE Name = ?) );`,
    [cust_key, item_name],
    function (err, rows) {
      if (err) {
        res.send("Error encountered while removing");
        return console.error(err.message);
      }
      if (rows.affectedRows == 0) {
        res.send(req.body.removefromcart + " is not present in cart");
      } else {
        res.send(req.body.removefromcart + " removed successfully");
      }

      console.log(rows["changedRows"]);
    }
  );
});

app.post("/view_cart", function (req, res) {
  // query = 'INSERT INTO customers (Name, Username, Password, Address, Contact) VALUES(?,?,?,?,?)';

  connection.query(
    `Select * FROM cart WHERE (C_Custkey = ?);`,
    [cust_key],
    function (err, data) {
      if (err) {
        res.send("Error encountered while searching");
        return console.error(err.message);
      }

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

      //res.send(data);
      console.log("Cart shown successfully" + cust_key);
    }
  );
});

app.post("/view_orders", function (req, res) {
  // query = 'INSERT INTO customers (Name, Username, Password, Address, Contact) VALUES(?,?,?,?,?)';
  connection.query(
    `SELECT * 
  FROM project.order as o
  INNER JOIN ordersupp as os
  ON os.Orderkey = o.O_Orderkey AND os.OS_Custkey = ?;`,
    [cust_key],
    function (err, data) {
      if (err) {
        res.send("Error encountered while searching");
        return console.error(err.message);
      }

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

      // res.send(data);
      console.log("Orders shown successfully" + cust_key);
    }
  );
});

///// Place Order  //////
app.post("/cust_place_order", function (req, res) {
  // query = 'INSERT INTO customers (Name, Username, Password, Address, Contact) VALUES(?,?,?,?,?)';
  connection.query(
    `INSERT INTO ordersupp(Orderkey, OS_Custkey, Date, Status)
  SELECT coalesce((SELECT Max(Orderkey) FROM ordersupp), 0) + 1, ?, NOW(), "placed";
  SELECT 1 FROM cart WHERE C_Custkey = ?;`,
    [cust_key, cust_key],
    function (err, rows) {
      if (err) {
        console.log("test 1");
        res.send("error encountered while placing order");
        return console.error(err.message);
      }

      //res.send(rows);
      console.log("Order started successfully");
      if (rows[1].length == 0) {
        connection.query(
          `DELETE FROM ordersupp WHERE Orderkey = (SELECT MAX(Orderkey) FROM ordersupp);`,
          function (err, rows) {
            if (err) {
              res.send("error encountered while placing order");
              return console.error(err.message);
            }
            res.send(
              "No items in cart! Select items into cart to place order."
            );
            return;
          }
        );
      }

      for (let i = 0; i < rows[1].length; i++) {
        connection.query(
          `INSERT INTO project.order(O_Orderkey, O_Itemkey, Quantity, Status) 
      SELECT (SELECT Max(Orderkey) FROM ordersupp), 
             (SELECT C_Itemkey FROM cart WHERE(C_Custkey = ?) LIMIT 1),
             (SELECT Quantity FROM cart WHERE(C_Custkey = ?) LIMIT 1),
             "Placed";`,
          [cust_key, cust_key],
          function (err, rows) {
            if (err) {
              res.send("error encountered while placing order");
              return console.error(err.message);
            }
          }
        );
        connection.query(
          `UPDATE project.storage
                      SET Quantity = Quantity - (SELECT Quantity FROM cart WHERE(C_Custkey = ?) LIMIT 1)
                      WHERE S_itemkey = (SELECT C_Itemkey FROM cart WHERE(C_Custkey = ?) LIMIT 1);`,
          [cust_key, cust_key],
          function (err, rows) {
            if (err) {
              res.send("error encountered while placing order");
              return console.error(err.message);
            }
          }
        );
        connection.query(
          `DELETE FROM cart where C_Custkey = ? LIMIT 1;`,
          [cust_key],
          function (err, rows) {
            if (err) {
              res.send("error encountered while placing order");
              return console.error(err.message);
            }
          }
        );
      }
      res.send("Order placed!");
    }
  );
});

//////// Cancel Order ////////

app.post("/cancel_order", function (req, res) {
  // query = 'INSERT INTO customers (Name, Username, Password, Address, Contact) VALUES(?,?,?,?,?)';
  var orderkey = req.body.cancelorder;
  connection.query(
    `UPDATE project.order
                    SET Status = "Cancelled"
                    WHERE(O_Orderkey = (SELECT Orderkey from ordersupp WHERE(OS_Custkey = ? AND Orderkey = ?  AND (Status != "Completed" OR Status != "Delivering"))));`,
    [cust_key, orderkey],
    function (err, rows) {
      if (err) {
        res.send("Error encountered while searching");
        return console.error(err.message);
      }

      //res.send(rows);
      console.log("half done cancelling " + cust_key);
    }
  );
  connection.query(
    `UPDATE project.ordersupp 
                    SET Status = "Cancelled"
                    WHERE (OS_Custkey = ? AND Orderkey = ?  AND (Status != "Completed" OR Status != "Delivering"));`,
    [cust_key, orderkey],
    function (err, rows) {
      if (err) {
        res.send("Error encountered while searching");
        return console.error(err.message);
      }

      res.send("Order " + req.body.cancelorder + "has been cancelled");
      console.log("order cancelled succesfully " + cust_key);
    }
  );
});

let port = 3030;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

////////////////  RESTOCKER FUNCTIONS //////////////////////

////// View Notifications ////////////

app.post("/restock_view_notif", function (req, res) {
  // query = 'INSERT INTO customers (Name, Username, Password, Address, Contact) VALUES(?,?,?,?,?)';
  console.log("comingg here");
  //document.write("My message");
  //connection.query(`Select S_Itemkey,Quantity,Min_amount FROM storage Where Quantity<Min_amount;`, function(err, data){
  connection.query(
    `Select S_Itemkey,Quantity,Min_amount FROM storage Where Quantity<Min_amount;`,
    function (err, data) {
      if (err) {
        res.send("Error encountered while updating");
        return console.error(err.message);
      }
      if (!console.log(res)) {
        res.send(
          "No Notifications to show. All items are above their quantity threshold."
        );
        return;
      }
      var str = "<table><tr>";
      str += "ITEMS LESS THAN THRESHOLD QUANTITY:";
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
    }
  );
});

///////////// View Items //////////
app.post("/restock_view_item", function (req, res) {
  // query = 'INSERT INTO customers (Name, Username, Password, Address, Contact) VALUES(?,?,?,?,?)';
  console.log("comingg here");
  connection.query(
    `Select S_Itemkey,Quantity,Min_amount FROM storage Order by Quantity DESC;`,
    function (err, data) {
      if (err) {
        res.send("Error encountered while updating");
        return console.error(err.message);
      }

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
    }
  );
});

///// Place Order ////////

app.post("/place_ord", (req, res) => {
  console.log("pohnch gaya2");
  var quantity = req.body.quantity;
  var itemid = req.body.itemID;
  connection.query(
    `Update storage Set Quantity = Quantity + ?  Where S_Itemkey = ?;`,
    [quantity, itemid],
    function (err, data) {
      //connection.query(`If Exists (Select S_Itemkey From storage where S_Itemkey = ${req.body.itemID}) Update storage Set Quantity = Quantity + ${req.body.quantity}  Where S_Itemkey = ${req.body.itemID} If Exists (Select * From storage Where S_Itemkey = ${req.body.itemID});`, function(err, data){
      if (err) {
        res.send("<h2> Error occured - Invalid Input </h2>");
        return console.error(err.message);
      }
      console.log(data);
      if (data.changedRows == 0) {
        res.send(
          "<h2> Error occured - Invalid Input, Item ID doesn't exist </h2>"
        );
        return;
      }
      res.send(
        "<h2> Item Ordered Successfully! <br> Go back to previous page to perform other functions <h2>"
      );
      console.log("Item Ordered Successfully!");
    }
  );
  // });
});

////////////////// SUPPLIER/DISTRIBUTOR ////////////////

///// View Pending orders /////////
app.post("/supp_view_orders", function (req, res) {
  console.log("viewingg orders!!");
  connection.query(
    `Select Orderkey, OS_Custkey, Date, Status, Name, Address, Contact
                      FROM ordersupp, customers
                      Where ((customers.Custkey = ordersupp.OS_Custkey) and (ordersupp.OS_Empkey = "${emp_key}") and (ordersupp.Status = 1));`,
    function (err, data) {
      if (err) {
        console.log("its getting errors");
        res.send("Error encountered while updating");
        return console.error(err.message);
      }

      var str = `<h1> All PENDING ORDERS for "${emp_key}" </h2><br>`;
      str += "<table><tr>";
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

          str +=
            "<td><label><p> | " +
            data[i][row] +
            "&emsp;&emsp;" +
            "</p></label></td>";
        }
        str += "</tr>";
      }
      str += "</table>";
      res.send(str);

      console.log("All Orders printed successfully ");
    }
  );
});

////// View Order History //////////
app.post("/supp_view_order_hist", function (req, res) {
  console.log("viewingg orders history!!");
  connection.query(
    `Select Orderkey, OS_Custkey, Date, Status, Name, Address, Contact
                      FROM ordersupp, customers
                      Where ((customers.Custkey = ordersupp.OS_Custkey) and (ordersupp.OS_Empkey = "${emp_key}"));`,
    function (err, data) {
      if (err) {
        console.log("its getting errors");
        res.send("Error encountered while updating");
        return console.error(err.message);
      }

      var str = `<h1> ORDERS HISTORY for "${emp_key}" </h2><br>`;
      str += "<table><tr>";
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

          str +=
            "<td><label><p> | " +
            data[i][row] +
            "&emsp;&emsp;" +
            "</p></label></td>";
        }
        str += "</tr>";
      }
      str += "</table>";
      res.send(str);

      console.log("All Orders printed successfully ");
    }
  );
});

////// Inactivate pending Order //////

app.post("/order_supplied", (req, res) => {
  console.log("its here");
  if (req.body.Password != emp_pass) {
    res.send(
      "<h2> Wrong password entered! <br> Go back to previous page to perform other functions <h2>"
    );
  }
  if (req.body.retype_order_key != req.body.Order_key) {
    console.log("reached");
    res.send(
      "<h2> Order key donot match! <br> Go back to previous page to perform other functions <h2>"
    );
  } else {
    connection.query(
      `UPDATE ordersupp
      SET Status = 1
      WHERE OS_Empkey = "${emp_key}";`,
      function (err, data) {
        if (err) {
          res.send("Error occured - entries are incorrect");
          return console.error(err.message);
        } else {
          res.send(
            "<h2> Action completed! <br> Go back to previous page to do other functions <h2>"
          );
          console.log("Sccessfully Supplied!");
        }
      }
    );
  }
  // });
});

///////////////////////////////////////////////////

////// Logout /////////////

app.post("/logout", (req, res) => {
  // query = 'INSERT INTO customers (Name, Username, Password, Address, Contact) VALUES(?,?,?,?,?)';
  connection.query(`Select * FROM customers;`, function (err) {
    if (err) {
      res.send("Error encountered while logging in");
      return console.error(err.message);
    }
    {
      cust_key = null;
      console.log("Logged out successfully");
    }
    res.sendFile(path.join(__dirname + "/templates/home.html"));
  });
});
