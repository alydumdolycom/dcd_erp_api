import pool from "../../config/db.js";

const TABLE = "salarizare.salariati"; // adjust schema/table if needed

export const EmployeesModel = {
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
      id: "S.id",
      nume: "S.nume",
      prenume: "S.prenume",
      data_angajarii: "S.data_angajarii",
      salar_baza: "S.salar_baza",
      salar_net: "S.salar_net",
      departament: "NSD.nume_departament",
      functie: "NSF.nume_functie"
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
          OR S.prenume ILIKE $${values.length}
          OR S.cnp ILIKE $${values.length}
          OR S.email ILIKE $${values.length}
        )
      `);
    }

    // =========================
    // FILTERS
    // =========================
    if (filters.id_departament) {
      values.push(filters.id_departament);
      whereClauses.push(`S.id_departament = $${values.length}`);
    }

    if (filters.id_functie) {
      values.push(filters.id_functie);
      whereClauses.push(`S.id_functie = $${values.length}`);
    }

    if (filters.sector) {
      values.push(filters.sector);
      whereClauses.push(`S.sector = $${values.length}`);
    }

    if (filters.cnp) {
      values.push(filters.cnp);
      whereClauses.push(`S.cnp = $${values.length}`);
    }

    if (filters.activ !== undefined) {
      values.push(filters.activ);
      whereClauses.push(`S.activ = $${values.length}`);
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
        NSD.nume_departament,
        NSF.nume_functie
      FROM salarizare.salariati S
      JOIN admin.nom_salarii_departamente NSD
        ON S.id_departament = NSD.id
      JOIN admin.nom_salarii_functii NSF
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
      FROM salarizare.salariati S
      JOIN admin.nom_salarii_departamente NSD
        ON S.id_departament = NSD.id
      JOIN admin.nom_salarii_functii NSF
        ON NSF.id = S.id_functie
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
      INSERT INTO ${TABLE}  (
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
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NULL, NULL, NULL, NULL, $13, $14,
      NULL, NULL, FALSE, FALSE, FALSE, FALSE, NULL, NULL, NULL, NULL, NULL,
      NULL, NULL, NULL, NULL, NULL, $15, NULL, NULL)
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
        data.data.salar_baza,
        data.salar_net,
        data.spor_vechime,
        data.data.vechime,
        data.pensionar,
        data.scutit_impozit,
        data.intrerupere,
        data.are_garantie,
        data.garantie_plafon,
        data.data.garantie_luna,
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
        data.data.sector,
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
      UPDATE ${TABLE}
      SET ${fields.join(", ")}
      WHERE id = $${idx}
      RETURNING *;
    `;
    const result = await pool.query(query, values);
    return result.rows[0];
  },
  async findById(id) {
    const query = `SELECT * FROM ${TABLE} WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};
