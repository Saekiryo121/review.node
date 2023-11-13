const path = require("path");
const express = require("express");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

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
      personas: personas,
    });
  });
});

app.post("/add-review", (req, res) => {
  console.log("Received data:", req.body);

  const newReview = {
    name: req.body.name,
    age: req.body.age,
    rating: req.body.rating,
    review: req.body.review,
  };

  console.log("New review object:", newReview);

  if (
    !newReview.name ||
    !newReview.age ||
    !newReview.rating ||
    !newReview.review
  ) {
    console.error("Invalid form data. All fields are required.");
    res
      .status(400)
      .json({ error: "Invalid form data. All fields are required." });
    return;
  }

  const insertsql = "INSERT INTO personas SET ?";
  con.query(insertsql, newReview, function (err, result) {
    if (err) {
      console.error("Error adding new review:", err);
      res.status(500).json({ error: "Error adding new review" });
      return;
    }

    console.log("New review added:", newReview);
    res.status(200).json({ success: true });
  });
});

app.get("/get-review/:id", (req, res) => {
  const reviewId = req.params.id;
  const sql = "SELECT * FROM personas WHERE id = ?";
  con.query(sql, [reviewId], function (err, result) {
    if (err) {
      console.error("Error fetching review:", err);
      res.status(500).json({ error: "Error fetching review" });
      return;
    }

    if (result.length === 0) {
      res.status(404).json({ error: "Review not found" });
      return;
    }

    const review = result[0];
    res.status(200).json(review);
  });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
