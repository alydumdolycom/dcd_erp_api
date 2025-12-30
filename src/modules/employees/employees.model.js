import pool from "../../config/db.js";

export const EmployeesModel = {
  TABLE: "salarizare.salariati",

  async findByCnp(cnp) {
    const { rows } = await pool.query(
      `SELECT id FROM ${this.TABLE} WHERE cnp = $1 LIMIT 1`,
      [cnp]
    );
    return rows[0] || null;
  },
  async all({
    page = 1,
    limit = 10,
    id_firma,
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
      id: "S.id",
      id_firma: "S.id_firma"
    };

    const sortColumn = allowedSort[sortBy] || "S.id";
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
          S.nume ILIKE $${values.length}
        )
      `);
    }

    // =========================
    // FILTERS
    // =========================
    if (id_firma) {
      values.push(id_firma);
      whereClauses.push(`S.id_firma = $${values.length}`);
    }

    if (filters.cif) {
      values.push(filters.cif);
      whereClauses.push(`S.cif = $${values.length}`);
    }

    if (filters.implicit) {
      values.push(filters.implicit);
      whereClauses.push(`S.implicit = $${values.length}`);
    }

    const whereSQL = whereClauses.length
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";

    // =========================
    // DATA QUERY
    // =========================
    const dataQuery = `
      SELECT
        S.id,
        S.nume,
        S.prenume,
        S.cnp,
        TO_CHAR(S.data_angajarii, 'DD-MM-YYYY') AS data_angajarii,
        S.salar_net,
        S.salar_baza,
        S.sector,
        S.data_incetarii,
        S.data_determinata,
        NSD.nume_departament,
        NSF.nume_functie
      FROM ${this.TABLE} S
      	JOIN admin.nom_salarii_departamente AS NSD
	  	    ON S.id_departament = NSD.id
        JOIN admin.nom_salarii_functii AS NSF
          ON NSF.id = S.id_functie
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
      FROM ${this.TABLE} S
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
  async create(data) {
    const query = `
      INSERT INTO ${this.TABLE}  (
        id_firma,
        nume,
        prenume,
        cnp,
        prod_tesa,
        sex,
        id_functie,
        id_tip_contract,
        id_ore_norma,
        id_departament,
        id_judet_cass,
        data_angajarii,
        data_incetarii,
        data_determinata,
        nr_contract,
        data_contract,
        salar_baza,
        salar_net,
        spor_vechime,
        vechime,
        pensionar,
        scutit_impozit,
        intrerupere,
        are_garantie,
        garantie_plafon,
        garantie_luna,
        telefon,
        email,
        localitate,
        judet,
        strada,
        nr,
        bloc,
        scara,
        etaj,
        ap,
        sector,
        cod_postal,
        pers_deducere,
        observatii
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
      $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35,
      $36, $37, $38, $39, $40)
      RETURNING *;
    `;
    const values = [
        data.id_firma,
        data.nume,
        data.prenume,
        data.cnp,
        data.prod_tesa,
        data.sex,
        data.id_functie,
        data.id_tip_contract,
        data.id_ore_norma,
        data.id_departament,
        data.id_judet_cass,
        data.data_angajarii,
        data.data_incetarii,
        data.data_determinata,
        data.nr_contract,
        data.data_contract,
        data.salar_baza,
        data.salar_net,
        data.spor_vechime,
        data.vechime,
        data.pensionar,
        data.scutit_impozit,
        data.intrerupere,
        data.are_garantie,
        data.garantie_plafon,
        data.garantie_luna,
        data.telefon,
        data.email,
        data.localitate,
        data.judet,
        data.strada,
        data.nr,
        data.bloc,
        data.scara,
        data.etaj,
        data.ap,
        data.sector,
        data.cod_postal,
        data.pers_deducere,
        data.observatii
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },
  
  async update(id, payload) {
    const fields = [];
    const values = [];
    let idx = 1;
    for (const key in payload) {
      fields.push(`${key} = $${idx}`);
      values.push(payload[key]);
      idx++;
    }
    values.push(id); // for WHERE clause

    const query = `
      UPDATE ${this.TABLE}
      SET ${fields.join(", ")}
      WHERE id = $${idx}
      RETURNING *;
    `;
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findById(id) {
    const query = `
      SELECT
        S.*,
        NSD.nume_departament,
        NSF.nume_functie,
        NJ.judet as nume_judet,
        U.nume_complet AS ultimul_editor
      FROM ${this.TABLE} AS S
      JOIN admin.nom_salarii_departamente AS NSD
        ON S.id_departament = NSD.id
      JOIN admin.nom_salarii_functii AS NSF
        ON S.id_functie = NSF.id
      JOIN admin.nom_judete AS NJ
        ON S.judet::integer = NJ.id
      LEFT JOIN admin.resource_edit_logs AS REL
        ON REL.id_resursa = S.id AND REL.resursa = 'salarizare'
      LEFT JOIN admin.utilizatori AS U
        ON U.id_utilizator = REL.id_utilizator
      WHERE S.id = $1
      LIMIT 1;
    `;
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  },

  async getEmployeeCompany(id) {
    const query = `
      SELECT F.id, F.nume FROM utilizatori AS U
      JOIN utilizatori_acces_firme as UAF 
        ON U.id_utilizator = UAF.id_utilizator
      JOIN firme AS F
        ON F.id = UAF.id_firma
      WHERE U.id_utilizator = $1
    `;
    const values = [id];
    return await pool.query(query, values);
  },
  
  async updateEmployeeMode(id, mode) {
    const query = `
      UPDATE salarizare.salariati
      SET
        mod_editare = $2
      WHERE id = $1
      RETURNING *;
    `;
    const values = [id, mode];
    return await pool.query(query, values);
  },
};
