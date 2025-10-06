const pool = require("../../config/db");


async function getAllProjects(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, name, description, created_by, created_at FROM projects ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching projects:", err.message);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
}

async function getProject(req, res) {
  try {
    const { id } = req.params;

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
}

async function createProject(req, res) {
  try {
    const { name, description, created_by } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Project name is required" });
    }

    const sql = `WITH new_project AS (
        INSERT INTO projects (name, description, created_by)
        VALUES ($1, $2, $3)
        RETURNING id, name, description, created_by, created_at
      ),
      owner_row AS (
        INSERT INTO project_users (project_id, user_id, role)
        SELECT id, created_by, 'owner' FROM new_project
        RETURNING project_id, user_id, role, created_at
      )
      SELECT
        p.id, p.name, p.description, p.created_by, p.created_at,
        o.user_id AS owner_user_id, o.role AS owner_role, o.created_at AS owner_added_at
      FROM new_project p
      JOIN owner_row o ON o.project_id = p.id;
      `;

    const { rows } = await pool.query(sql, [name, description || null, created_by]);
    const project = rows[0]; // atomic result including owner info


    res.status(201).json({
      message: "Project created successfully",
      project: project,
    });
  } catch (err) {
    console.error("Error creating project:", err.message);
    res.status(500).json({ error: "Failed to create project" });
  }
}

async function deleteProject(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM projects WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Error deleting project:", err.message);
    res.status(500).json({ error: "Failed to delete project" });
  }
}

async function editProject(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

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
}

async function getProjectUsers(req, res) {
  try {
    const { id: project_id } = req.params;
    const result = await pool.query(
      "SELECT pu.user_id, u.name, u.email, pu.role FROM project_users pu JOIN users u ON pu.user_id = u.id WHERE pu.project_id = $1",
      [project_id]
    );  

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching project users:", err.message);
    res.status(500).json({ error: "Failed to fetch project users" });
  }
}

async function addUserToProject(req, res) {
  try {
    const { id: project_id } = req.params;
    const { user_id, role } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
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
}

async function removeUserFromProject(req, res) {
  try {
    const { id: project_id, userId: user_id } = req.params;

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
}


module.exports = {
  getAllProjects,
  getProject,
  createProject,
  deleteProject,
  editProject,
  getProjectUsers,
  addUserToProject,
  removeUserFromProject,
};
