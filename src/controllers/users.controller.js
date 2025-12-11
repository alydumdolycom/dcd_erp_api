const express = require("express");
const app = express();
const pool = require("../config/db.js");
const { updateUser, deleteUser, find } = require("../services/users.service");

// Lista de utilizatori, cu sistem de paginare
export async function getUsers(page = 1, limit = 10, sortField = "id", sortBy = "desc") {
    try {

        // Normalize values
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const searchQuery = `%${search}%`;

        // Allowed sortable columns
        const allowedSortFields = ["id_utilizator", "nume_complet", "email", "creat_la"];
        if (!allowedSortFields.includes(sortField)) {
            sortField = "id"; // default
        }

        // Allowed sort directions
        sortBy = sortBy.toLowerCase() === "asc" ? "asc" : "desc";

        const result = await pool.query(`
            SELECT id_utilizator, nume_complet, email, activ, created_at
            FROM utilizatori
            WHERE sters_la IS NULL
              AND (
                    CAST(id_utilizator AS TEXT) ILIKE $3
                    OR nume_complet ILIKE $3
                    OR email ILIKE $3
                  )
            ORDER BY ${sortField} ${sortBy}
            LIMIT $1 OFFSET $2
        `, [limit, offset, searchQuery]);

        const countResult = await pool.query(`
            SELECT COUNT(*)
            FROM utilizatori
            WHERE sters_la IS NULL
              AND (
                    CAST(id_utilizator AS TEXT) ILIKE $1
                    OR nume_complet ILIKE $1
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
        
        const utilizator = await updateUser(userId, nume_complet, email, parola_hash, activ);
       
        if (!utilizator) {
           return res.status(404).json({ error: "Utilizatorul nu a fost gasit." });
        }
         res.json({ message: "Utilizatorul actualizat", user: utilizator });
   } catch (err) {
       console.error(err);
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

        const result = await find(userId);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found or already deleted." });
        }
        await deleteUser(userId);

        res.json({
            message: "Utilizator dezactivat",
            user: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Eroare Server 500"});
    }
});
