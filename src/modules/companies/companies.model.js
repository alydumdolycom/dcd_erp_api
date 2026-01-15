import pool from "../../config/db.js";

export const CompaniesModel = {
  // This is a placeholder for the Companies data model
  // In a real application, this would interact with a database
  TABLE: 'admin.firme',
  async find(nume) {
    const query = `
      SELECT nume
      FROM ${this.TABLE} F
      WHERE F.nume = $1
    `;
    const result = await pool.query(query, [nume]);
    return result.rows[0];
  },
  
  async findByCif(cif) {
    const query = `
      SELECT *
      FROM ${this.TABLE} C
      WHERE cif = $1
    `;
    const result = await pool.query(query, [cif]);
    return result.rows[0];
  },
  async all({
    search = "",
    filters = {},
    sortBy = "id",
    sortOrder = "DESC"
  }) {

    // =========================
    // ALLOWED SORT COLUMNS (SECURITY)
    // =========================
    const allowedSort = {
      id: "F.id",
      nume: "F.nume",
      cif: "F.cif",
      an_start: "F.an_start",
      an_sfarsit: "F.an_sfarsit"
    };

    const sortColumn = allowedSort[sortBy] || "F.id";
    const sortDir = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    let whereClauses = [];
    let values = [];

    // =========================
    // SEARCH
    // =========================
    if (search) {
      values.push(`%${search}%`);
      whereClauses.push(`
        (
          F.nume ILIKE $${values.length}
          OR F.cif ILIKE $${values.length}
        )
      `);
    }

    // =========================
    // FILTERS
    // =========================
    if (filters.nume) {
      values.push(filters.nume);
      whereClauses.push(`F.nume = $${values.length}`);
    }

    if (filters.cif) {
      values.push(filters.cif);
      whereClauses.push(`F.cif = $${values.length}`);
    }

    if (filters.implicit) {
      values.push(filters.implicit);
      whereClauses.push(`F.implicit = $${values.length}`);
    }

    const whereSQL = whereClauses.length
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";

    // =========================
    // DATA QUERY (NO PAGINATION)
    // =========================
    const dataQuery = `
      SELECT
        F.id,
        F.nume,
        F.cif,
        F.implicit,
        F.an_start,
        F.an_sfarsit
      FROM admin.firme F
      ${whereSQL}
      ORDER BY ${sortColumn} ${sortDir}
    `;

    const result = await pool.query(dataQuery, values);

    return {
      data: result.rows
    };
  },

  async findById(id) {
    const query = `
      SELECT *
      FROM admin.firme
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async create(data) {
    console.log(data)
    const query = `
      INSERT INTO admin.firme (
        nume,
        cif,
        implicit,
        an_start
      ) VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [
      data.nume,
      data.cif,
      data.implicit,
      data.an_start
    ];
    console.log(values)
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async update(id, firmeData) {
    // Build dynamic SET clause for PATCH (partial update)
    const allowedFields = ["nume", "cif", "implicit", "an_start", "an_sfarsit"];
    const setClauses = [];
    const values = [id];
    let idx = 2;

    for (const field of allowedFields) {
      if (firmeData[field] !== undefined) {
      setClauses.push(`${field} = $${idx}`);
      values.push(firmeData[field]);
      idx++;
      }
    }

    if (setClauses.length === 0) {
      throw new Error("No valid fields provided for update.");
    }

    const query = `
      UPDATE admin.firme
      SET ${setClauses.join(", ")}
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const query = `DELETE FROM ${this.TABLE} WHERE id = $1;`;
    await pool.query(query, [id]);
  }
};