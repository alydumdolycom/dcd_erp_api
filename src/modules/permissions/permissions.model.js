import pool from "../../config/db"

export const PermissionsModel = {
    // Define and return the Permission model
    async all() {
        // Logic to get all permissions from the database
         return pool.query("SELECT * FROM permissions_table");
    },
    async findById(id) {
        // Logic to find a permission by ID from the database
        return pool.query("SELECT * FROM permissions_table WHERE id = $1", [id]);
    }, 
    async create(data) {
        // Logic to create a new permission in the database
        return pool.query("INSERT INTO permissions_table (name, description) VALUES ($1, $2) RETURNING *", [data.name, data.description]);
    },  
    async update(id, data) {
        // Logic to update a permission in the database
        return pool.query("UPDATE permissions_table SET name = $1, description = $2 WHERE id = $3 RETURNING *", [data.name, data.description, id]);
    }
}   