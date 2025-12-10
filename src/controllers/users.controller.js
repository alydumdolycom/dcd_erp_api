const express = require("express");
const app = express();
const pool = require("./db");

app.use(express.json());
// Lista de utilizatori, cu sistem de paginare
app.get("/utilizatori", async (req, res) => {
    try {
        let { page = 1, limit = 10, search = "", sortField = "id", sortBy = "desc" } = req.query;

        // Normalize values
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const searchQuery = `%${search}%`;

        // Allowed sortable columns
        const allowedSortFields = ["id", "name", "email", "created_at"];
        if (!allowedSortFields.includes(sortField)) {
            sortField = "id"; // default
        }

        // Allowed sort directions
        sortBy = sortBy.toLowerCase() === "asc" ? "asc" : "desc";

        const result = await pool.query(`
            SELECT id, name, email, active, created_at
            FROM utilizatori
            WHERE deleted_at IS NULL
              AND (
                    CAST(id AS TEXT) ILIKE $3
                    OR name ILIKE $3
                    OR email ILIKE $3
                  )
            ORDER BY ${sortField} ${sortBy}
            LIMIT $1 OFFSET $2
        `, [limit, offset, searchQuery]);

        const countResult = await pool.query(`
            SELECT COUNT(*)
            FROM utilizatori
            WHERE deleted_at IS NULL
              AND (
                    CAST(id AS TEXT) ILIKE $1
                    OR name ILIKE $1
                    OR email ILIKE $1
                  )
        `, [searchQuery]);

        res.json({
            page,
            limit,
            total: parseInt(countResult.rows[0].count),
            search,
            sortField,
            sortBy,
            data: result.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/utilizatori", async (req, res) => {
    try {
        const { name, person_to_contact, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email and password are required." });
        }

        // Insert in PostgreSQL
        const result = await pool.query(
            `INSERT INTO utilizatori 
                (name, person_to_contact, email, password, active, created_at, updated_at)
             VALUES 
                ($1, $2, $3, $4, false, NOW(), NOW())
             RETURNING id, name, email, active`,
            [name, person_to_contact, email, password]
        );

        const user = result.rows[0];

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                active: user.active
            }
        });
        MediaList.send(to , messaj)
    } catch (err) {
        console.error(err);

        // Handle duplicate email
        if (err.code === "23505") {
            return res.status(409).json({ error: "Email already exists." });
        }

        res.status(500).json({ error: "Server error" });
    }
});

app.patch("/utilizatori/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, person_to_contact, email, password, active } = req.body;

        // Validate
        if (!name && !person_to_contact && !email && !password && active === undefined) {
            return res.status(400).json({ error: "Nothing to update" });
        }

        // Build dynamic update query
        const fields = [];
        const values = [];
        let index = 1;

        if (name) {
            fields.push(`name = $${index++}`);
            values.push(name);
        }

        if (person_to_contact) {
            fields.push(`person_to_contact = $${index++}`);
            values.push(person_to_contact);
        }

        if (email) {
            fields.push(`email = $${index++}`);
            values.push(email);
        }

        if (password) {
            fields.push(`password = $${index++}`);
            values.push(password);
        }

        if (active !== undefined) {
            fields.push(`active = $${index++}`);
            values.push(active);
        }

        // Always update updated_at
        fields.push(`updated_at = NOW()`);

        // Add the ID for the WHERE clause
        values.push(userId);

        const sql = `
            UPDATE utilizatori
            SET ${fields.join(", ")}
            WHERE id = $${index}
            RETURNING id, name, email, active, updated_at
        `;

        const result = await pool.query(sql, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            message: "User updated successfully",
            user: result.rows[0]
        });

    } catch (err) {
        console.error(err);

        if (err.code === "23505") {
            return res.status(409).json({ error: "Email already exists." });
        }

        res.status(500).json({ error: "Server error" });
    }
});

app.patch("/utilizatori/:id/restore", async (req, res) => {
    try {
        const userId = req.params.id;

        const result = await pool.query(`
            UPDATE utilizatori
            SET deleted_at = NULL, updated_at = NOW()
            WHERE id = $1 AND deleted_at IS NOT NULL
            RETURNING id, name, email, deleted_at
        `, [userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found or not deleted." });
        }

        res.json({
            message: "User restored successfully",
            user: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.delete("/utilizatori/:id/soft", async (req, res) => {
    try {
        const userId = req.params.id;

        const result = await pool.query(`
            UPDATE utilizatori
            SET deleted_at = NOW(), updated_at = NOW()
            WHERE id = $1 AND deleted_at IS NULL
            RETURNING id, name, email, deleted_at
        `, [userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found or already deleted." });
        }

        res.json({
            message: "User soft-deleted successfully",
            user: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
