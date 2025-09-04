const pool = require("../../config/db");

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, description, created_by, created_at FROM projects ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching projects:", err.message);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

// Get a single project by ID
exports.getProject = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    const result = await pool.query(
      "SELECT id, name, description, created_by, created_at FROM projects WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching project:", err.message);
    res.status(500).json({ error: "Failed to fetch project" });
  }
};

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { name, description, created_by } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Project name is required" });
    }

    const result = await pool.query(
      "INSERT INTO projects (name, description, created_by) VALUES ($1, $2, $3) RETURNING id, name, description, created_by, created_at",
      [name, description || null, created_by || null]
    );

    res.status(201).json({
      message: "Project created successfully",
      project: result.rows[0],
    });
  } catch (err) {
    console.error("Error creating project:", err.message);
    res.status(500).json({ error: "Failed to create project" });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    const result = await pool.query("DELETE FROM projects WHERE id = $1 RETURNING id", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Error deleting project:", err.message);
    res.status(500).json({ error: "Failed to delete project" });
  }
};

// Edit a project
exports.editProject = async (req, res) => {
  try {
    const { id, name, description } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    const result = await pool.query(
      "UPDATE projects SET name = COALESCE($2, name), description = COALESCE($3, description) WHERE id = $1 RETURNING id, name, description, created_by, created_at",
      [id, name, description]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({
      message: "Project updated successfully",
      project: result.rows[0],
    });
  } catch (err) {
    console.error("Error editing project:", err.message);
    res.status(500).json({ error: "Failed to edit project" });
  }
};

// Add a user to a project
exports.addUserToProject = async (req, res) => {
  try {
    const { project_id, user_id, role } = req.body;

    if (!project_id || !user_id) {
      return res.status(400).json({ error: "Project ID and User ID are required" });
    }

    const result = await pool.query(
      "INSERT INTO project_users (project_id, user_id, role) VALUES ($1, $2, $3) RETURNING id, project_id, user_id, role",
      [project_id, user_id, role || "Member"]
    );

    res.status(201).json({
      message: "User added to project successfully",
      membership: result.rows[0],
    });
  } catch (err) {
    console.error("Error adding user to project:", err.message);
    res.status(500).json({ error: "Failed to add user to project" });
  }
};

// Remove a user from a project
exports.removeUserFromProject = async (req, res) => {
  try {
    const { project_id, user_id } = req.body;

    if (!project_id || !user_id) {
      return res.status(400).json({ error: "Project ID and User ID are required" });
    }

    const result = await pool.query(
      "DELETE FROM project_users WHERE project_id = $1 AND user_id = $2 RETURNING id",
      [project_id, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found in project" });
    }

    res.json({ message: "User removed from project successfully" });
  } catch (err) {
    console.error("Error removing user from project:", err.message);
    res.status(500).json({ error: "Failed to remove user from project" });
  }
};
