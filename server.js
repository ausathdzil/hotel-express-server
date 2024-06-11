const express = require("express");
const mysql = require("mysql2/promise");

const PORT = 3000;
require('dotenv').config();

// Create a MySQL connection pool

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Create an Express application
const app = express();

app.use(express.json());

// GET all employees
app.get("/employees", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM employees");
    res.json(rows);
  } catch (error) {
    console.error("Error getting employees:", error);
    res.status(500).json({ error: "Error getting employees" });
  }
});

app.get("/employees/:id", async (req, res) => {
  try {
    const employee = await pool.query("SELECT * FROM employees WHERE id = ?", [req.params.id]);
    res.json(employee[0]);
  }
  catch (error) {
    console.error("Error getting employee:", error);
    res.status(500).json({ error: "Error getting employee" });
  }
});

app.post("/employees", async (req, res) => {
  const { name, email, phone_number, address, job_title, image_url } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO employees (name, email, phone_number, address, job_title, image_url) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, phone_number, address, job_title, image_url]
    );
    res.json({
      id: result.insertId,
      name,
      email,
      phone_number,
      address,
      job_title,
      image_url,
    });
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ error: error.message });
  }
});

app.put("/employees/:id", async (req, res) => {
  const { name, email, phone_number, address, job_title, image_url } = req.body;
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "UPDATE employees SET name = ?, email = ?, phone_number = ?, address = ?, job_title = ?, image_url = ? WHERE id = ?",
      [name, email, phone_number, address, job_title, image_url, id]
    );
    res.json({
      id: parseInt(id),
      name,
      email,
      phone_number,
      address,
      job_title,
      image_url,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/employees/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM employees WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: `Employee with ID ${id} not found` });
    } else {
      res.json({ id: parseInt(id) });
    }
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: error.message });
  }
});

// start the server

app.listen(3000, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
