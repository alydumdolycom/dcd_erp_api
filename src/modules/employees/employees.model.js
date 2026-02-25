import pool from "../../config/db.js";

/*
  Employees Model
*/
export const EmployeesModel = {
  TABLE: "salarizare.salariati",

  /* Find employee by CNP */
  async findByCnp(cnp) {
    const { rows } = await pool.query(
      `SELECT id FROM ${this.TABLE} WHERE cnp = $1 LIMIT 1`,
      [cnp]
    );
    return rows[0] || null;
  },

  /* Get all employees with filtering, sorting, and searching */
  async all({
    id_firma,
    search = "",
    filters = {},
    sortBy = "id",
    sortOrder = "ASC",
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

    const sortColumn = allowedSort[sortBy] || "S.nume";
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

  /* Create new employee with payment method */
  async create(data) {
    try {
      await pool.query("BEGIN");
        // Convert date fields to YYYY-MM-DD format if they exist
        if (data.data_angajarii) {
          data.data_angajarii = new Date(data.data_angajarii).toISOString().slice(0, 10);
        }
        if (data.data_contract) {
          data.data_contract = new Date(data.data_contract).toISOString().slice(0, 10);
        }

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
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 
          TO_DATE($12, 'YYYY-MM-DD'), 
          $13, $14, $15, TO_DATE($16, 'YYYY-MM-DD'), $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35,
          $36, $37, $38, $39, $40
        )
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

        return await pool.query(paymentQuery, paymentMethods);
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
  
  /* Update employee data */
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

  /* Find employee by ID */
  async find(id) {
    const { rows } = await pool.query(
      `SELECT * FROM ${this.TABLE} WHERE id = $1 LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },
  
  /* Get detailed employee info by ID */
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

  /* Get companies associated with an employee */
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
  
  /* Log employee data edit or cancel edit */
  async modEditEmployee(employeeData) {
    const {id_utilizator, resursa, id_resursa, ip} = employeeData;
    // verifica daca exista deja un log pentru acest utilizator si resursa
    if(employeeData.mod == 'edit') {
      const query = `
       INSERT INTO admin.resource_edit_logs(
        id_utilizator, resursa, id_resursa, editat_la, ip)
        VALUES ($1, $2, $3, NOW(), $4);
      `;
      const values = [id_utilizator, resursa, id_resursa, ip];
      await pool.query(query, values);
    } 

    // verifica daca exista deja
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

  /* Get employees by various filters */
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

  async getEmployeeFeatures({
    search = "",
    sortBy = "id",
    id_firma
  }) {

      let whereClauses = ["S.id_firma = $1"];
      let values = [id_firma];
      let idx = 2;

      if (search) {
        whereClauses.push(`(
          S.nume ILIKE $${idx} OR
          S.prenume ILIKE $${idx} OR
          S.cnp ILIKE $${idx}
        )`);
        values.push(`%${search}%`);
        idx++;
      }

      const query = `
        SELECT
          S.id
        FROM ${this.TABLE} S
        WHERE ${whereClauses.join(" AND ")}
        ORDER BY S.${sortBy} ASC;
      `;
    const result = await pool.query(query, values);
    
    return result.rows[0];
  },

  async getEmployeesList(id_firma) {
    const query = `
        SELECT 
        SP.id,
        S.id AS id_salariat,
        S.nume, 
        S.prenume, 
        S.salar_net,
        S.salar_baza,
        S.are_garantie,
        S.id_departament,
        NSD.nume_departament,
        SP.avans_cass,
        SP.avans_firma,
        SP.asigurari,
        SP.garantii,
        SP.premii_net
      FROM salarizare.salariati S
      JOIN salarizare.state_plata SP ON SP.id_salariat = S.id
      JOIN nomenclatoare.nom_salarii_departamente NSD ON S.id_departament = NSD.id
      WHERE S.id_firma = $1
      AND S.data_incetarii IS NULL
      ORDER BY S.nume ASC;
    `;
    const values = [id_firma];
    const { rows } = await pool.query(query, values);
    return rows;
  },

  async delete(id) {
    const query = `
      DELETE FROM ${this.TABLE}
      WHERE id = $1
      RETURNING *;
    `;
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getNomenclatoareData() {
    const query = `SELECT * FROM nomenclatoare.nom_taxe_cote;`;

    const {rows} = await pool.query(query);
    return rows
  },

  async deducere(flag, suma, persoaneIntretinere = 0, data) {
    
    // Convert data to YYYY-MM-DD format if it's a valid date
      // dateString = "25-12-2023"
    const parts = data.split('-');
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    const formatedDate = `${year}-${month}-${day}`;
    
    if(flag === "brut") {
      const query = `
        SELECT salarizare.fn_brut_to_net($1::INTEGER, $2::SMALLINT, $3::DATE) as deducere;
      `;
      // Convert data to YYYY-MM-DD format if it's a valid date
    
      const values = [suma, persoaneIntretinere, formatedDate];
      const {rows} = await pool.query(query, values);
      return rows[0].deducere;    
    }

    if(flag === "net"){
       const query = `
        SELECT salarizare.fn_net_to_brut($1::INTEGER, $2::SMALLINT, $3::DATE) as deducere;
      `;
      // Convert data to YYYY-MM-DD format if it's a valid date
    
      const values = [suma, persoaneIntretinere, formatedDate];
      const {rows} = await pool.query(query, values);
      return rows[0].deducere;    
    }
  },

  async getPayRol(month, year) {
    const checkQuery = `
        SELECT * FROM salarizare.state_plata_header
        WHERE luna = $1 AND anul = $2 AND inchis = false
        ORDER BY id ASC ;
      `;
      const { rows } = await pool.query(checkQuery, [month, year]);
      return rows[0] || null;
  },

  async getEmployeePaymentMethods(id_salariat) {
    
    const query = `SELECT SMP.id, NSMP.mod_plata, SMP.cont_bancar FROM nomenclatoare.nom_salarii_modplata AS NSMP
        LEFT JOIN salarizare.salariati_modplata SMP ON SMP.id_modplata = NSMP.id
        LEFT JOIN salarizare.salariati AS S ON S.id = NSMP.id
        WHERE SMP.id_salariat = $1
        ORDER BY NSMP.id ASC;
	  `;
    const values = [id_salariat];

    const { rows } = await pool.query(query, values);
    return rows;
  },

  async updateEmployeesList(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const key in data) {
      if (data[key] !== undefined && data[key] !== null) {
        fields.push(`${key} = $${idx}`);
        values.push(data[key]);
        idx++;
      }
    }

    if (fields.length === 0) {
      return null;
    }
    console.log("Updating employee list with data:", data);
    values.push(id);
    const query = `
      UPDATE salarizare.state_plata
      SET ${fields.join(", ")}
      WHERE id = $${idx}
      RETURNING *;
    `;
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getCompanyName(id_firma) {
    const query = `
      SELECT nume FROM admin.firme
      WHERE id = $1
      LIMIT 1;
    `;
    const values = [id_firma];
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  },

  async getEmployeeDocuments(id_salariat) {
    const query = `
      SELECT 
	  	  TO_CHAR(AA.data_incepere, 'DD-MM-YYYY') AS data_incepere, AA.salariu_vechi, AA.salariu_nou, TO_CHAR(AA.data_act, 'DD-MM-YYYY') AS data_act, AA.numar_act
	    FROM salarizare.salariati AS S
        INNER JOIN salarizare.acte_aditionale AA ON S.id = AA.id_salariat
      WHERE S.id = $1
        ORDER BY AA.data_incepere ASC;
    `;
    const values = [id_salariat];
    const { rows } = await pool.query(query, values);
    return rows;
  },
  
  async getEmployeeHolidays(id_salariat) {
    const query = `
      SELECT 
        SP.luna, SP.anul, SP.zile_lucrate, 
        (SP.cm_zile_angajator+SP.cm_zile_cass) AS zile_calculate, 
        SP.co_zile, SP.venit_net, 
        (SP.brut_firma+SP.suma_medical_cass) AS suma
      FROM salarizare.salariati AS S
      INNER JOIN salarizare.state_plata SP ON S.id = SP.id_salariat
      WHERE S.id = $1
      ORDER BY SP.luna ASC;
    `;
    const values = [id_salariat];
    const { rows } = await pool.query(query, values);
    return rows;
  },

  async getDepartments(id_firma) {
    const query = `
      SELECT id, nume_departament, observatii
      FROM nomenclatoare.nom_salarii_departamente
      WHERE id_firma = $1
      ORDER BY id ASC;
    `;
    const values = [id_firma];
    const { rows } = await pool.query(query, values);
    return rows;
  }
};