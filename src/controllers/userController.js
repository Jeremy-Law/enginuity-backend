const pool = require("../../config/db");
const bcrypt = require("bcrypt");


async function getAllUsers(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, name, email, is_active, created_at FROM users ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

async function getUser(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT id, name, email, is_active, created_at FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).json({ error: "Failed to fetch user" });
  }
}

async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [
      normalizedEmail,
    ]);
    if (existing.rows.length > 0) {
      return res.status(400).json({
        error: `${normalizedEmail} is already associated with an account. Please contact your Enginuity admin if you need access.`,
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash, is_active) VALUES ($1, $2, $3, true) RETURNING id, name, email, is_active, created_at",
      [name, normalizedEmail, passwordHash]
    );

    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Error inserting user:", err.message);
    res.status(500).json({ error: "Failed to create user" });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const result = await pool.query(
      "UPDATE users SET name = COALESCE($2, name), email = COALESCE($3, email) WHERE id = $1 RETURNING id, name, email, is_active, created_at",
      [id, name, email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating user:", err.message);
    res.status(500).json({ error: "Failed to update user" });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).json({ error: "Failed to delete user" });
  }
}


async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      normalizedEmail,
    ]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    delete user.password_hash;

    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error during login" });
  }
}


async function activateUser(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE users SET is_active = true WHERE id = $1 RETURNING id, name, email, is_active, created_at",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User activated", user: result.rows[0] });
  } catch (err) {
    console.error("Activate error:", err.message);
    res.status(500).json({ error: "Failed to activate user" });
  }
}

async function deactivateUser(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE users SET is_active = false WHERE id = $1 RETURNING id, name, email, is_active, created_at",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deactivated", user: result.rows[0] });
  } catch (err) {
    console.error("Deactivate error:", err.message);
    res.status(500).json({ error: "Failed to deactivate user" });
  }
}


module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  activateUser,
  deactivateUser,
};
