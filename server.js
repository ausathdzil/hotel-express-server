const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config();

const PORT = 3000;

// Create a MySQL connection pool

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Create an Express application
const app = express();

app.use(cors());
app.use(express.json());

/******************************************************/
/********************* Employees **********************/
/******************************************************/

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
    const employee = await pool.query("SELECT * FROM employees WHERE id = ?", [
      req.params.id,
    ]);
    res.json(employee[0]);
  } catch (error) {
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
    const [result] = await pool.query("DELETE FROM employees WHERE id = ?", [
      id,
    ]);
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

/**************************************************/
/********************* ROOMS **********************/
/**************************************************/

app.get("/rooms", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM rooms");
    res.json(rows);
  } catch (error) {
    console.error("Error getting rooms:", error);
    res.status(500).json({ error: "Error getting rooms" });
  }
});

app.get("/rooms/:id", async (req, res) => {
  try {
    const room = await pool.query("SELECT * FROM rooms WHERE room_id = ?", [
      req.params.id,
    ]);
    res.json(room[0]);
  } catch (error) {
    console.error("Error getting room:", error);
    res.status(500).json({ error: "Error getting room" });
  }
});

app.put("/rooms/:id", async (req, res) => {
  const { number, type, capacity, price, status } = req.body;
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "UPDATE rooms SET number = ?, type = ?, capacity = ?, price = ?, status = ? WHERE room_id = ?",
      [number, type, capacity, price, status, id]
    );
    res.json({
      room_id: parseInt(id),
      number,
      type,
      capacity,
      price,
      status,
    });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/rooms", async (req, res) => {
  const { number, type, capacity, price, status } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO rooms (number, type, capacity, price, status) VALUES (?, ?, ?, ?, ?)",
      [number, type, capacity, price, status]
    );
    res.json({
      room_id: result.insertId,
      number,
      type,
      capacity,
      price,
      status,
    });
  } catch (error) {
    console.error("Error adding room:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/rooms/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM rooms WHERE room_id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: `Room with ID ${id} not found` });
    } else {
      res.json({ room_id: parseInt(id) });
    }
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: error.message });
  }
});

/******************************************************/
/********************* Customers **********************/
/******************************************************/

app.get("/customers", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM customers");
    res.json(rows);
  } catch (error) {
    console.error("Error getting customers:", error);
    res.status(500).json({ error: "Error getting customers" });
  }
});

app.get("/customers/:id", async (req, res) => {
  try {
    const customer = await pool.query("SELECT * FROM customers WHERE id = ?", [
      req.params.id,
    ]);
    res.json(customer[0]);
  } catch (error) {
    console.error("Error getting customer:", error);
    res.status(500).json({ error: "Error getting customer" });
  }
});

app.post("/customers", async (req, res) => {
  const { name, email, phone_number, address } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO customers (name, email, phone_number, address) VALUES (?, ?, ?, ?)",
      [name, email, phone_number, address]
    );
    res.json({
      id: result.insertId,
      name,
      email,
      phone_number,
      address,
    });
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).json({ error: error.message });
  }
});

app.put("/customers/:id", async (req, res) => {
  const { name, email, phone_number, address } = req.body;
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "UPDATE customers SET name = ?, email = ?, phone_number = ?, address = ? WHERE id = ?",
      [name, email, phone_number, address, id]
    );
    res.json({
      id: parseInt(id),
      name,
      email,
      phone_number,
      address,
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/customers/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM customers WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: `Customer with ID ${id} not found` });
    } else {
      res.json({ id: parseInt(id) });
    }
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: error.message });
  }
});

/******************************************************/
/********************* Payments **********************/
/******************************************************/

app.get("/payments", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM payments");
    res.json(rows);
  } catch (error) {
    console.error("Error getting payments:", error);
    res.status(500).json({ error: "Error getting payments" });
  }
});

app.get("/payments/:id", async (req, res) => {
  try {
    const payment = await pool.query("SELECT * FROM payments WHERE id = ?", [
      req.params.id,
    ]);
    res.json(payment[0]);
  } catch (error) {
    console.error("Error getting payment:", error);
    res.status(500).json({ error: "Error getting payment" });
  }
});

app.post("/payments", async (req, res) => {
  const { amount, date, method } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO payments (amount, date, method) VALUES (?, ?, ?, ?)",
      [amount, date, method]
    );
    res.json({
      id: result.insertId,
      amount,
      date,
      method,
    });
  } catch (error) {
    console.error("Error adding payment:", error);
    res.status(500).json({ error: error.message });
  }
});

app.put("/payments/:id", async (req, res) => {
  const { amount, date, method } = req.body;
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      "UPDATE payments SET amount = ?, date = ?, method = ? WHERE id = ?",
      [amount, date, method, id]
    );
    res.json({
      id: parseInt(id),
      amount,
      date,
      method,
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/payments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM payments WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: `Payment with ID ${id} not found` });
    } else {
      res.json({ id: parseInt(id) });
    }
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ error: error.message });
  }
});

/******************************************************/
/********************* Reservations **********************/
/******************************************************/

app.get("/reservations", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM reservations ORDER BY check_in DESC");
    res.json(rows);
  } catch (error) {
    console.error("Error getting reservations:", error);
    res.status(500).json({ error: "Error getting reservations" });
  }
});

app.get("/reservations/:id", async (req, res) => {
  try {
    const reservation = await pool.query(
      "SELECT * FROM reservations WHERE reservation_id = ?",
      [req.params.id]
    );
    res.json(reservation[0]);
  } catch (error) {
    console.error("Error getting reservation:", error);
    res.status(500).json({ error: "Error getting reservation" });
  }
});

app.post("/reservations", async (req, res) => {
  const { customer_id, room_id, check_in, check_out, status } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO reservations (customer_id, room_id, check_in, check_out, status) VALUES (?, ?, ?, ?, ?)",
      [customer_id, room_id, check_in, check_out, status]
    );
    res.json({
      id: result.insertId,
      customer_id,
      room_id,
      check_in,
      check_out,
      status,
    });
  } catch (error) {
    console.error("Error adding reservation:", error);
    res.status(500).json({ error: error.message });
  }
});

app.put("/reservations/:id", async (req, res) => {
  const { customer_id, room_id, check_in, check_out, status } = req.body;
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "UPDATE reservations SET customer_id = ?, room_id = ?, check_in = ?, check_out = ?, status = ? WHERE reservation_id = ?",
      [customer_id, room_id, check_in, check_out, status, id]
    );
    res.json({
      reservation_id: parseInt(id),
      customer_id,
      room_id,
      check_in,
      check_out,
      status,
    });
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/reservations/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM reservations WHERE reservation_id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: `Reservation with ID ${id} not found` });
    } else {
      res.json({ id: parseInt(id) });
    }
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ error: error.message });
  }
});

/******************************************************/
/******************************************************/
/********************* Miscellaneous   **********************/
/******************************************************/
/******************************************************/
app.get("/revenue", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT SUM(amount) as total FROM payments");
    res.json(parseInt(rows[0].total));
  } catch (error) {
    console.error("Error getting revenue:", error);
    res.status(500).json({ error: "Error getting revenue" });
  }
});

app.get("/datediff", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT DATEDIFF(check_out, NOW()) as days_remaining FROM reservations");
    res.json(rows.map(row => parseInt(row.days_remaining)));
  } catch (error) {
    console.error("Error getting datediff:", error);
    res.status(500).json({ error: "Error getting datediff" });
  }
});

app.get("/available_rooms", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) as available_rooms FROM rooms WHERE status = 'vacant'");
    res.json(parseInt(rows[0].available_rooms));
  } catch (error) {
    console.error("Error getting available rooms:", error);
    res.status(500).json({ error: "Error getting available rooms" });
  }
});

app.get("/occupied_rooms", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) as occupied_rooms FROM rooms WHERE status = 'reserved'");
    res.json(parseInt(rows[0].occupied_rooms));
  } catch (error) {
    console.error("Error getting occupied rooms:", error);
    res.status(500).json({ error: "Error getting occupied rooms" });
  }
});

app.get("/pending_payments", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) as pending_payments FROM reservations WHERE status = 'pending'");
    res.json(parseInt(rows[0].pending_payments));
  } catch (error) {
    console.error("Error getting pending payments:", error);
    res.status(500).json({ error: "Error getting pending payments" });
  }
});


// start the server

app.listen(3000, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
