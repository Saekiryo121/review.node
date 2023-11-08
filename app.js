const path = require("path");
const express = require("express");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "RyoArata0213",
  database: "express_db",
});

app.get("/", (req, res) => {
  const sql = "select * from personas";

  app.post("/", (req, res) => {
    const sql = "INSERT INTO personas SET ?";
    con.query(sql, req.body, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.redirect("/");
    });
  });

  app.get("/create", (req, res) => {
    res.sendFile(path.join(__dirname, "html/form.html"));
  });

  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("index", {
      personas: result
    });
  });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
