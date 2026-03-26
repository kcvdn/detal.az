const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET = "secret123";

/* ================= REGISTER ================= */
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1,$2) RETURNING *",
      [email, hashed]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).send("Register error");
  }
});

/* ================= LOGIN ================= */
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0)
      return res.status(400).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.rows[0].password);

    if (!valid)
      return res.status(400).json({ error: "Wrong password" });

    const token = jwt.sign({ id: user.rows[0].id }, SECRET);

    res.json({ token });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).send("Login error");
  }
});

/* ================= TEST ================= */
app.get("/", (req, res) => {
  res.send("API WORKING");
});

/* ================= START ================= */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});