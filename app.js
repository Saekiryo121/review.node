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
  const sql = "SELECT * FROM personas";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    const personas = result;
    res.render("index", {
      personas: personas
    });
  });
});


app.post("/add-review", (req, res) => {
  const newReview = {
    name: req.body.name,
    email: req.body.email,
    kana_name: req.body.kana_name,
    gender: req.body.gender,
    phone: req.body.phone,
    workplace: req.body.workplace,
    household: req.body.household,
  };

  const sql = "INSERT INTO personas SET ?";
  con.query(sql, newReview, function (err, result) {
    if (err) throw err;
    console.log("New review added:", newReview);
    res.redirect("/");
  });
});


app.listen(port, () => console.log(`App listening on port ${port}`));
