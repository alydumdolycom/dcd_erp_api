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

  // async all({
  //   id_firma,
  //   search = "",
  //   filters = {},
  //   sortBy = "id",
  //   sortOrder = "DESC"
  // }) {
  //   // =========================
  //   // ALLOWED SORT COLUMNS (SECURITY)
  //   // =========================
  //   const allowedSort = {
  //     id: "S.id",
  //     id_firma: "S.id_firma",
  //     nume: "S.nume",
  //     prenume: "S.prenume",
  //     data_angajarii: "S.data_angajarii"
  //   };

  //   const sortColumn = allowedSort[sortBy] || "S.id";
  //   const sortDir = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

  //   let whereClauses = [];
  //   let values = [];

  //   // =========================
  //   // SEARCH
  //   // =========================
  //   if (search) {
  //     values.push(`%${search}%`);
  //     whereClauses.push(`
  //       (
  //         S.nume ILIKE $${values.length}
  //         OR S.prenume ILIKE $${values.length}
  //         OR S.cnp ILIKE $${values.length}
  //       )
  //     `);
  //   }

  //   // =========================
  //   // FILTERS
  //   // =========================
  //   if (id_firma) {
  //     values.push(id_firma);
  //     whereClauses.push(`S.id_firma = $${values.length}`);
  //   }

  //   if (filters.id_departament) {
  //     values.push(filters.id_departament);
  //     whereClauses.push(`S.id_departament = $${values.length}`);
  //   }

  //   if (filters.id_functie) {
  //     values.push(filters.id_functie);
  //     whereClauses.push(`S.id_functie = $${values.length}`);
  //   }

  //   if (filters.activ !== undefined) {
  //     values.push(filters.activ);
  //     whereClauses.push(`S.activ = $${values.length}`);
  //   }

  //   const whereSQL = whereClauses.length
  //     ? `WHERE ${whereClauses.join(" AND ")}`
  //     : "";

  //   // =========================
  //   // DATA QUERY
  //   // =========================
  //   const query = `
  //     SELECT
  //       S.id,
  //       S.id_firma,
  //       S.nume,
  //       S.prenume,
  //       S.cnp,
  //       TO_CHAR(S.data_angajarii, 'DD-MM-YYYY') AS data_angajarii,
  //       S.salar_net,
  //       S.salar_baza,
  //       S.sector,
  //       S.data_incetarii,
  //       S.data_determinata,

  //       NSD.id AS id_departament,
  //       NSD.nume_departament,
  //       NSF.nume_functie

  //     FROM ${this.TABLE} S
  //     LEFT JOIN nomenclatoare.nom_salarii_departamente NSD
  //       ON S.id_departament = NSD.id
  //     JOIN nomenclatoare.nom_salarii_functii NSF
  //       ON S.id_functie = NSF.id
  //     ${whereSQL}
  //     ORDER BY ${sortColumn} ${sortDir};
  //   `;

  //   const { rows } = await pool.query(query, values);
  //   return rows;
  // },
  async all({
    id_firma,
    search = "",
    filters = {},
    sortBy = "id",
    sortOrder = "DESC",
    data_angajarii
  }) {


    // =========================
    // ALLOWED SORT COLUMNS (SECURITY)
    // =========================
    const allowedSort = {
      id: "S.id",
      id_firma: "S.id_firma",
      nume: "S.nume",
      prenume: "S.prenume",
      data_angajarii: "S.data_angajarii",
      cnp: "S.cnp"
    };

    const sortColumn = allowedSort[sortBy] || "S.id";
    const sortDir = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    let whereClauses = [];
    let values = [];

    // =========================
    // GLOBAL SEARCH
    // =========================
    if (search) {
      values.push(`%${search}%`);
      whereClauses.push(`
      (
        S.nume ILIKE $${values.length}
        OR S.prenume ILIKE $${values.length}
        OR S.cnp ILIKE $${values.length}
      )
      `);
    }

    // =========================
    // FILTERS
    // =========================
    if (id_firma !== undefined) {
      values.push(id_firma);
      whereClauses.push(`S.id_firma = $${values.length}`);
    }

    if (data_angajarii !== undefined) {
      values.push(data_angajarii);
      whereClauses.push(`S.data_angajarii = $${values.length}`);
    }

    if (filters.id_departament) {
      values.push(filters.id_departament);
      whereClauses.push(`S.id_departament = $${values.length}`);
    }

    if (filters.id_functie) {
      values.push(filters.id_functie);
      whereClauses.push(`S.id_functie = $${values.length}`);
    }

    if (filters.luna_angajarii) {
      values.push(filters.luna_angajarii);
      // Extract month from data_angajarii (format: MM-DD-YYYY)
      whereClauses.push(`TO_CHAR(S.data_angajarii, 'MM') = $${values.length}`);
    }

    if (filters.anul_angajarii) {
      values.push(filters.anul_angajarii);
      // Extract year from data_angajarii (format: MM-DD-YYYY)
      whereClauses.push(`TO_CHAR(S.data_angajarii, 'YYYY') = $${values.length}`);
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
    const query = `
      SELECT
      S.id,
      S.id_firma,
      S.nume,
      S.prenume,
      S.cnp,
      TO_CHAR(S.data_angajarii, 'DD-MM-YYYY') AS data_angajarii,
      S.salar_net,
      S.salar_baza,
      S.sector,
      S.data_incetarii,
      S.data_determinata,
      NSD.id AS id_departament,
      NSD.nume_departament,
      NSF.nume_functie
      FROM ${this.TABLE} S
      LEFT JOIN nomenclatoare.nom_salarii_departamente NSD
      ON S.id_departament = NSD.id
      JOIN nomenclatoare.nom_salarii_functii NSF
      ON S.id_functie = NSF.id
      ${whereSQL}
      ORDER BY ${sortColumn} ${sortDir};
    `;

    const { rows } = await pool.query(query, values);
    return rows;
  },

  async create(data) {
    try {
      await pool.query("BEGIN");
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
        RETURNING id;
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
        const employeeId = result.rows[0].id;
        const paymentMethods = [
          employeeId,
          data.id_modplata,
          data.id_modplata === 1 ? null : data.cont_bancar,
          data.activ
        ];
        const paymentQuery = `   
          INSERT INTO salarizare.salariati_modplata(
            id_salariat, id_modplata, cont_bancar, activ)
            VALUES ($1, $2, $3, $4);
        `;

        await pool.query(paymentQuery, paymentMethods);
    } catch (error) {
      // 🔥 If ANY query fails → rollback EVERYTHING
      await pool.query("ROLLBACK");

      console.error("TRANSACTION FAILED:", {
        message: error.message,
        code: error.code,
        detail: error.detail
      });

      throw error;

    } finally {
      await pool.query("COMMIT");
    }   
  },
  
  async update(id, employeeData) {
    const fields = [];
    const values = [];
    let idx = 1;
    for (const key in employeeData) {
      fields.push(`${key} = $${idx}`);
      values.push(employeeData[key]);
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
    const employees = `
      SELECT
        S.*,
        NSD.nume_departament,
        NSF.nume_functie,
        NJ.judet as nume_judet,
        U.nume_complet AS ultimul_editor
      FROM ${this.TABLE} AS S
      JOIN nomenclatoare.nom_salarii_departamente AS NSD
        ON S.id_departament = NSD.id
      JOIN nomenclatoare.nom_salarii_functii AS NSF
        ON S.id_functie = NSF.id
      JOIN nomenclatoare.nom_judete AS NJ
        ON S.judet::integer = NJ.id
      LEFT JOIN admin.resource_edit_logs AS REL
        ON REL.id_resursa = S.id AND REL.resursa = 'salarizare.salariati'
      LEFT JOIN admin.utilizatori AS U
        ON U.id_utilizator = REL.id_utilizator
      WHERE S.id = $1
      LIMIT 1;
    `;
    const values = [id];
    const { rows } = await pool.query(employees, values);
    const paymentMethodsQuery = `
      SELECT 
        salarizare.salariati_modplata.cont_bancar,
        salarizare.salariati_modplata.id_modplata,
        salarizare.salariati_modplata.activ,
        nomenclatoare.nom_salarii_modplata.mod_plata
      FROM salarizare.salariati_modplata
      LEFT JOIN nomenclatoare.nom_salarii_modplata
      ON nomenclatoare.nom_salarii_modplata.id = salarizare.salariati_modplata.id_modplata
      WHERE salarizare.salariati_modplata.id_salariat = $1;
    `;
    const paymentMethodsValues = [id];
    const paymentMethodsResult = await pool.query(paymentMethodsQuery, paymentMethodsValues);
    if (rows[0]) {
      rows[0].payment_methods = paymentMethodsResult.rows;
    }
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

  async modEditEmployee(employeeData) {
    const {id_utilizator, resursa, id_resursa, ip} = employeeData;
    if(employeeData.mod == 'edit') {
      const query = `
        INSERT INTO admin.resource_edit_logs(
            id_utilizator, resursa, id_resursa, ip)
          VALUES ($1, $2, $3, $4) RETURNING *;
      `;
      const values = [id_utilizator, resursa, id_resursa, ip];
      await pool.query(query, values);
    } 

    if(employeeData.mod == 'cancel') {
        const query = `
          DELETE FROM admin.resource_edit_logs
          WHERE id_utilizator = $1 AND resursa = $2 AND id_resursa = $3;
      `;
      const values = [id_utilizator, resursa, id_resursa];
      await pool.query(query, values);
    }
    return { success: true };
  },

  // filter employees by multiple optional criteria by month and year of hiring
  async getEmployeesByFilters({
            id_firma,
            id_departament,
            id_functie, 
            activ,
            anul_angajarii,
            luna_angajarii  
  }) {
    let whereClauses = [];
    let values = [];
    let idx = 1;
    if (id_firma !== undefined) {
      values.push(id_firma);
      whereClauses.push(`S.id_firma = $${idx}`);
      idx++;
    }

    if (id_departament !== undefined) {
      values.push(id_departament);
      whereClauses.push(`S.id_departament = $${idx}`);
      idx++;
    }

    if (id_functie !== undefined) {
      values.push(id_functie);
      whereClauses.push(`S.id_functie = $${idx}`);
      idx++;
    }

    if (anul_angajarii !== undefined) {
      values.push(anul_angajarii);
      whereClauses.push(`TO_CHAR(S.data_angajarii, 'YYYY') = $${idx}`);
      idx++;
    }

    if (luna_angajarii !== undefined) {
      values.push(luna_angajarii);
      whereClauses.push(`TO_CHAR(S.data_angajarii, 'MM') = $${idx}`);
      idx++;
    }

    if (activ !== undefined) {
      values.push(activ);
      whereClauses.push(`S.activ = $${idx}`);
      idx++;
    }
    const whereSQL = whereClauses.length
      ? `WHERE ${whereClauses.join(" AND ")}`
      : ""; 
    const query = `
      SELECT
        S.id,
        S.id_firma,
        S.nume,
        S.prenume,
        S.cnp,
        TO_CHAR(S.data_angajarii, 'DD-MM-YYYY') AS data_angajarii,
        S.salar_net,
        S.salar_baza,
        S.sector,
        S.data_incetarii, 
        S.data_determinata,
        NSD.id AS id_departament,
        NSD.nume_departament,
        NSF.nume_functie
      FROM ${this.TABLE} S
      LEFT JOIN nomenclatoare.nom_salarii_departamente NSD
        ON S.id_departament = NSD.id
      JOIN nomenclatoare.nom_salarii_functii NSF
        ON S.id_functie = NSF.id
      ${whereSQL}
      ORDER BY S.id DESC;
    `;
    const { rows } = await pool.query(query, values);
    return rows;
  },

  async countEmployees(data, id_firma) {
    let whereClauses = [];
    let values = [];
    let idx = 1;
    if(data.data_angajarii) {
      values.push(data.data_angajarii);
      whereClauses.push(`S.data_angajarii = $${idx}`);
      idx++;
    }
    
    if(data.sex) {
      values.push(data.sex);
      whereClauses.push(`S.sex = $${idx}`);
      idx++;
    }
    if(data.activ !== undefined) {
      values.push(data.activ);
      whereClauses.push(`S.activ = $${idx}`);
      idx++;
    }
    values.push(id_firma);

    const query = `
      SELECT COUNT(*) AS total FROM salarizare.salariati S
      WHERE S.id_firma = $${idx}
      ${whereClauses.length ? ' AND ' + whereClauses.join(' AND ') : ''}
            `;
    const { rows } = await pool.query(query, values);
    return  rows[0].total;
  }
};
