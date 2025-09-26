const mysql = require("mysql2");

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS || "admin";

const schema = `CREATE DATABASE IF NOT EXISTS nomad_cabs;\nUSE nomad_cabs;\nCREATE TABLE IF NOT EXISTS users (\n  id CHAR(36) PRIMARY KEY,\n  email VARCHAR(255) NOT NULL UNIQUE,\n  phone_number VARCHAR(16) UNIQUE,\n  password_hash VARCHAR(255) NOT NULL,\n  first_name VARCHAR(100) NOT NULL,\n  last_name VARCHAR(100),\n  city VARCHAR(20),\n  state VARCHAR(20),\n  is_email_verified BOOLEAN DEFAULT FALSE,\n  is_phone_verified BOOLEAN DEFAULT FALSE,\n  role ENUM('rider','driver','admin') NOT NULL,\n  role_description VARCHAR(255),\n  status ENUM('active','suspended','deleted','pending_verification') DEFAULT 'pending_verification',\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP\n);`;

const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  multipleStatements: true,
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err.message);
    return;
  }
  console.log("MySQL connected");
  db.query(schema, (e) => {
    if (e) console.error("Schema init error:", e.message);
    else console.log("Database & users table ready");
  });
});

module.exports = db;
