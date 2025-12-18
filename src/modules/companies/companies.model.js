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
  async findByCui(cui) {
    const query = `
      SELECT *
      FROM ${this.TABLE} C
      WHERE cui = $1
    `;
    const result = await pool.query(query, [cui]);
    return result.rows[0];
  },
  async all({
    page = 1,
    limit = 10,
    search = "",
    filters = {},
    sortBy = "id",
    sortOrder = "DESC"
  }) {
    page = Number(page);
    limit = Number(limit);
    const offset = (page - 1) * limit;

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
    // DATA QUERY
    // =========================
    const dataQuery = `
      SELECT
        F.id,
        F.nume,
        F.cif,
        F.implicit,
        F.an_start,
        F.an_sfarsit
      FROM ${this.TABLE} F
      ${whereSQL}
      ORDER BY ${sortColumn} ${sortDir}
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2};
    `;

    // =========================
    // COUNT QUERY
    // =========================
    const countQuery = `
      SELECT COUNT(*)
      FROM ${this.TABLE} F
      ${whereSQL};
    `;

    const dataValues = [...values, limit, offset];

    const [dataResult, countResult] = await Promise.all([
      pool.query(dataQuery, dataValues),
      pool.query(countQuery, values)
    ]);

    const total = Number(countResult.rows[0].count);

    return {
      data: dataResult.rows,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
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
    const query = `
      INSERT INTO admin.firme (
        nume,
        cif,
        implicit,
        an_start,
        an_sfarsit
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [
      data.nume,
      data.cif,
      data.implicit,
      data.an_start,
      data.an_sfarsit 
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },
  async update(id, firmeData) {
    const query = `
      UPDATE admin.firme
      SET nume = $2,
          cif = $3,
          implicit = $4,
          an_start = $5,
          an_sfarsit = $6
      WHERE id = $1
      RETURNING *;
    `;
    const values = [
      id,
      firmeData.nume,
      firmeData.cif,
      firmeData.implicit,
      firmeData.an_start,
      firmeData.an_sfarsit
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },
  async delete(id) {
    const query = `
      DELETE FROM ${this.TABLE}
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};