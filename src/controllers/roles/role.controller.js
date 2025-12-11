import pool from "../../config/db.js";

// ✔ Get all roles
export const getRoles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const countResult = await pool.query("SELECT COUNT(*) FROM admin.roluri");
    const total = parseInt(countResult.rows[0].count);

    const result = await pool.query(
      "SELECT * FROM admin.roluri ORDER BY id_rol ASC LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    res.json({
      success: true,
      data: result.rows,
      meta: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({
      success: false,
      message: "Eroare la citirea rolurilor",
      error: error.message
    });
  }
};

// ✔ Get role by ID
export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM roluri WHERE id_rol = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Rolul nu a fost găsit"
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Error fetching role:", error);
    res.status(500).json({
      success: false,
      message: "Eroare la citirea rolului",
      error: error.message
    });
  }
};

// ✔ Create new role
export const createRole = async (req, res) => {
  try {
    const { nume_rol, descriere, activ } = req.body;

    const result = await pool.query(
      "INSERT INTO roluri (nume_rol, descriere, activ) VALUES ($1, $2, $3) RETURNING *",
      [nume_rol, descriere, activ]
    );

    res.json({
      success: true,
      message: "Rol creat cu succes",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({
      success: false,
      message: "Eroare la crearea rolului",
      error: error.message
    });
  }
};

// ✔ Update role
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { nume_rol, descriere, activ } = req.body;

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (nume_rol !== undefined) {
      updates.push(`nume_rol = $${paramCount++}`);
      values.push(nume_rol);
    }
    if (descriere !== undefined) {
      updates.push(`descriere = $${paramCount++}`);
      values.push(descriere);
    }
    if (activ !== undefined) {
      updates.push(`activ = $${paramCount++}`);
      values.push(activ);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Niciun câmp de actualizat"
      });
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE admin.roluri SET ${updates.join(", ")} WHERE id_rol = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Rolul nu a fost găsit"
      });
    }

    res.json({
      success: true,
      message: "Rol actualizat cu succes",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({
      success: false,
      message: "Eroare la actualizarea rolului",
      error: error.message
    });
  }
};

// ✔ Delete role
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM roluri WHERE id_rol = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Rolul nu a fost găsit"
      });
    }

    res.json({
      success: true,
      message: "Rol șters cu succes"
    });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({
      success: false,
      message: "Eroare la ștergerea rolului",
      error: error.message
    });
  }
};
