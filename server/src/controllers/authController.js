const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
const db = require("../db/db");

function q(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

const publicUser = (row) => {
  if (!row) return null;
  const { password_hash, ...rest } = row;
  return rest;
};

async function signup(req, res) {
  try {
    const { email, password, role, first_name, last_name } = req.body;
    if (!email || !password || !role || !first_name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const exists = await q("SELECT id FROM users WHERE email=?", [email]);

    if (exists.length)
      return res.status(409).json({ error: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);
    const id = uuid();

    await q(
      "INSERT INTO users (id,email,password_hash,role,first_name,last_name,status) VALUES (?,?,?,?,?,?,?)",
      [id, email, hash, role, first_name, last_name || null, "active"]
    );
    const rows = await q("SELECT * FROM users WHERE id=?", [id]);
    res.status(201).json({ user: publicUser(rows[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email & password required" });
    const rows = await q("SELECT * FROM users WHERE email=?", [email]);
    if (!rows.length)
      return res.status(401).json({ error: "Invalid credentials" });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) 
        return res.status(401).json({ error: "Invalid credentials" });
    res.json({ user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function me(req, res) {
  try {
    const userId = req.header("x-user-id");
    if (!userId) return res.status(401).json({ error: "Missing user id" });
    const rows = await q("SELECT * FROM users WHERE id=?", [userId]);
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    res.json({ user: publicUser(rows[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function requireRole(req, res) {
  try {
    const userId = req.header("x-user-id");
    if (!userId) 
        return res.status(401).json({ error: "Missing user id" });
    const rows = await q("SELECT * FROM users WHERE id=?", [userId]);
    if (!rows.length) 
        return res.status(404).json({ error: "User not found" });
    const user = rows[0];

    if (user.role !== req.params.role)
      return res.status(403).json({ error: "Forbidden" });

    res.json({ ok: true, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = { signup, login, me, requireRole };
