import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

import { EmployeesService } from "./employees.service.js";
import { fileURLToPath } from "url";
/*
  Controller for managing employees.
*/
export const EmployeesController = {
  
  /* Retrieve all employees with optional search, sorting, and filtering */
  async getAll(req, res, next) {
      try {
        const {
          search = "",
          sortBy = req.query?.defaultSortBy || "id",
          id_firma,
          sortOrder =  req.query?.sortOrder || "asc",
          data_angajarii,
          // filters
          id_departament,
          id_functie,
          luna_angajarii,
          anul_angajarii,
          sex,
          activ
        } = req.query;

        const departments = await EmployeesService.getDepartments(id_firma);
        const result = await EmployeesService.getAll({
          search,
          sortBy,
          id_firma,
          sortOrder,
          data_angajarii,
          filters: {
            id_departament,
            id_functie,
            luna_angajarii,
            anul_angajarii,
            sex,
            activ
          }
        });

        res.status(200).json({
          success: true,
          data: result.data,
          departments: departments
        });
      } catch (err) {
        next({
          status: 500,
          message: "A aparut o eroare la incarcarea listei de salariati",
          details: err.message
        });
      }
  },

  /* Retrieve a single employee by ID */
  async getById(req, res, next) {
    try {
      const employee = await EmployeesService.findById(req.params.id);
      if (!employee) { 
        return res.status(404).json({ message: "Salariatul nu a fost gasit" });
      }
      res.json(employee);
    } catch (err) {
      next(err);
    }
  },
  
  /* Create a new employee */
  async create(req, res, next) {
    
    if (!req.body.cnp) {
      return res.status(400).json({
        success: false,
        message: "CNP-ul este obligatoriu"
      });
    }

    if (req.body.cnp.length !== 13 || req.body.cnp.length > 13) {
      return res.status(400).json({
        success: false,
        message: "CNP-ul trebuie să aibă exact 13 caractere"
      });
    }

    if (!req.body.cnp || !/^\d{13}$/.test(req.body.cnp)) {
      return res.status(400).json({
        success: false,
        message: "CNP-ul trebuie să conțină numai cifre"
      });
    }
    
    if(!req.body.nume){
      return  res.status(400).json({
        success: false,
        message: "Numele este obligatoriu"
      });
    }

    if(req.body.nume){
      if (
        req.body.nume.trim() === "" ||
        req.body.nume.includes(" ") ||
        /\d/.test(req.body.nume)
      ) {
        return res.status(400).json({
          success: false,
          message: "Numele este obligatoriu si nu trebuie sa contina cifre"
        });
      }
    }

    if(req.body.prenume){
      if (
        req.body.prenume.trim() === "" ||
        req.body.prenume.includes(" ") ||
        /\d/.test(req.body.prenume)
      ) {
        return res.status(400).json({
          success: false,
          message: "Prenumele este obligatoriu si nu trebuie sa contina cifre"
        });
      }
    }

    if(!req.body.prenume){
      return res.status(400).json({
        success: false,
        message: "Prenumele este obligatoriu"
      });
    }
    if (req.body.data_angajarii && req.body.data_incetarii && req.body.data_angajarii > req.body.data_incetarii) {
      return res.status(400).json({
        success: false,
        message: "Data incetarii trebuie sa fie dupa data angajarii"
      });
    }

    if(req.body.id_departament === "" || req.body.id_departament === null || req.body.id_departament === undefined ) {
      return res.status(400).json({
        success: false,
        message: "Departamentul este obligatoriu"
      });
    }
    if (req.body.salar_net && isNaN(Number(req.body.salar_net))) {
      return res.status(400).json({
        success: false,
        message: "Trebuie sa fie un numar"
      });
    }

    if (req.body.salar_baza && isNaN(Number(req.body.salar_baza))) {
      return res.status(400).json({
        success: false,
        message: "Trebuie sa fie un numar"
      });
    }


    if(req.body.numar_ci === "" || req.body.numar_ci === null || req.body.numar_ci === undefined ) {
      return res.status(400).json({
        success: false,
        message: "Numarul CI este obligatoriu"
      });
    }

    if (req.body.serie_ci === "" || req.body.serie_ci === null || req.body.serie_ci === undefined ) {
      return res.status(400).json({
        success: false,
        message: "Seria CI este obligatorie"
      });
    }

    if (req.body.cnp) {
      const existing = await EmployeesService.findByCnp(req.body.cnp);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "CNP deja exista"
        });
      }
    }

    if(req.body.sex === "" || req.body.sex === null || req.body.sex === undefined) {
      return res.status(400).json({
        success: false,
        message: "Sexul este obligatoriu"
      });
    }

    if(req.body.prod_tesa === "" || req.body.prod_tesa === null || req.body.prod_tesa === undefined) {
      return res.status(400).json({
        success: false,
        message: "prod_tesa este obligatoriu"
      });
    }
    if(req.body.id_modplata == 2 && (!req.body.cont_bancar || req.body.cont_bancar.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "Contul bancar este obligatoriu"
      });
    }
    try {
      const data = await EmployeesService.create(req.body);
      if(data.success === false) {
        return res.status(400).json({
          success: false,
          errors: data.errors
        });
      }
      res.status(201).json({
        success: true,
        message: "Informatiile au fost salvate",
      });
    } catch (err) {
      next({
        status: 500,
        message: "A aparut o eroare la salvarea informatiilor",
        details: err.message
      });
    }
  },
  /* Update an existing employee */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = await EmployeesService.update(id, req.body);
      
      return res.status(200).json({
        success: true,
        data: data
      });
    } catch (err) {
      next({
        status: 500,  
        message: "Eroare la server",
        details: err.message
      });
    }
  },

  /* Delete an employee by ID */
  async delete(req, res, next) {
    const { id } = req.params;
    const deleted = await EmployeesService.delete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Nu a fost gasit"
      });
    }
    next({  
      status: 200,
      message: "Informatiile au fost sterse"
    });
  },
  
  /* Get the company information of the logged-in employee */
  async employeeCompany(req, res, next) {
    try {
      const data = await EmployeesService.getEmployeeCompany(req.user.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async modEditEmployee(req, res, next) {
    try { 
      const employeeData = req.body;
      req.body.id_utilizator = req.user.id;
      const updatedEmployee = await EmployeesService.modEditEmployee(employeeData);
      res.status(200).json({
        success: true,
        message: "Informatiile au fost actualizate",
        data: updatedEmployee
      });
    } catch (err) {
      next({
        status: 500,
        message: "A aparut o eroare la actualizarea informatiilor",
        details: err.message
      });
    }
  },

    /* Retrieve all employees features */
  async getEmployeeFeatures(req, res, next) {
      try {
        const {
          search = "",
          sortBy = req.query?.defaultSortBy || "id",
          id_firma,
          sortOrder =  req.query?.sortOrder || "asc",
          data_angajarii,
          // filters
          id_departament,
          id_functie,
          luna_angajarii,
          anul_angajarii,
          sex,
          activ
        } = req.query;

        const result = await EmployeesService.getEmployeeFeatures({
          search,
          sortBy,
          id_firma,
          sortOrder,
          data_angajarii,
          filters: {
            id_departament,
            id_functie,
            luna_angajarii,
            anul_angajarii,
            sex,
            activ
          }
        });

        res.status(200).json({
          success: true,
          data: result.data
        });
      } catch (err) {
        next({
          status: 500,
          message: "A aparut o eroare la incarcarea listei de salariati",
          details: err.message
        });
      }
  },

  async getEmployeesList(req, res, next) {
    try {
      const { id_firma } = req.query; 
      const result = await EmployeesService.getEmployeesList(id_firma);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      next({
        status: 500,
        message: "A aparut o eroare la incarcarea listei de salariati",
        details: err.message
      });
    }
  },

  async updateEmployeesList(req, res, next) {
    try {
      const { id_firma } = req.query;
      const id = req.params.id;
      const result = await EmployeesService.updateEmployeesList(id, req.body);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      next({
        status: 500,
        message: "A aparut o eroare la incarcarea listei de salariati",
        details: err.message
      });
    }
  },

  async calculateBrutToNetSalary(req, res, next) {
    const { brut, persoaneIntretinere, data } = req.body;
    // datele din nomenclatoare.nom_taxe_cote
    // cota_cas (1), cota_cass (2), cota_impozit (3)
    // pasii pentru calcul:
    /*
      brut = salariul brut
      cota_cas = procent din nomenclatoare.nom_taxe_cote pentru id_taxa=1
      cota_cass = procent din nomenclatoare.nom_taxe_cote pentru id_taxa=2
      cota_impozit = procent din nomenclatoare.nom_taxe_cote pentru id_taxa=3
      */
    const [dayStr, monthStr, yearStr] = req.body.data.split("-");
    const month = parseInt(monthStr, 10); // 1
    const year = parseInt(yearStr, 10);   // 2026
    const checkDate = await EmployeesService.getPayRol(month,year);
    if(!checkDate) {
      return res.status(400).json({
        success: false,
        message: "Nu exista stat de plata pentru luna si anul selectat"
      });
    }
    // // 1. Get employee salary data
    const taxe = await EmployeesService.getNomenclatoareData();

    const cota_cas = taxe[0].procent;
    const cota_cass = taxe[1].procent;
    const cota_impozit = taxe[2].procent;
    const persoane = persoaneIntretinere ?? 0;

    const cas = Math.round((brut*cota_cas)/100);    // calcul fara zecimale
    const cass = Math.round((brut*cota_cass)/100);    // calcul fara zecimale
    const flag = "brut";
    const suma = brut;
    const result = await EmployeesService.deducere(flag, suma, persoane, data);
    const bazaImpozitare = brut - cas - cass - result;
    const impozit = Math.round((bazaImpozitare * cota_impozit)/100);
    // // const net = parseInt(brut-cas-cass-impozit);

    res.status(200).json({
      success: true,
      data: {
        net: result
      }
    });
  },

  async calculateNetToBrutSalary(req, res, next) {
    const { net, persoaneIntretinere = 0, data } = req.body;

    if (!net || isNaN(net) || net <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valoare net invalidă"
      });
    }

    // Parse data (format DD-MM-YYYY)
    const [dayStr, monthStr, yearStr] = data.split("-");
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    // Verifică existența statului de plată (luna și anul)
    const checkDate = await EmployeesService.getPayRol(month, year);
    if (!checkDate) {
      return res.status(400).json({
        success: false,
        message: "Nu există stat de plată pentru luna și anul selectat"
      });
    }
     const taxe = await EmployeesService.getNomenclatoareData();

    const cota_cas = taxe[0].procent;
    const cota_cass = taxe[1].procent;
    const cota_impozit = taxe[2].procent;

    const cas = Math.round((net*cota_cas)/100);    // calcul fara zecimale
    const cass = Math.round((net*cota_cass)/100);    // calcul fara zecimale
    const flag = "net";
    const persoane = persoaneIntretinere ?? 0;
    const suma = net;
    const result = await EmployeesService.deducere(flag, suma, persoane, data);

    res.status(200).json({
      success: true,
      data: {
        brut: result
      }
    });
  },

  async getEmployeePaymentMethods(req, res, next) { 
    try {
      const { id_salariat } = req.params; 
      const salariat = await EmployeesService.getEmployeePaymentMethods(id_salariat);
            browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu"
        ]
      });

      const page = await browser.newPage();

      await page.setContent(htmlTemplate, {
        waitUntil: "networkidle0"
      });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        displayHeaderFooter: false,
        margin: {
          top: "2mm",
          bottom: "2mm",
          left: "20mm",
          right: "20mm"
        }
      });

      await browser.close();

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=contract-demo.pdf",
        "Content-Length": pdfBuffer.length
      });

      return res.send(pdfBuffer);
    } catch (err) {
      next({
        status: 500,
        message: "A aparut o eroare la generarea contractului PDF",
        details: err.message
      });
    } 
  },

  async employeeFiles(req, res, next) {
    try { 
      const findEmployee = await EmployeesService.findById(req.query.id_salariat);
      if (!findEmployee) {
        return res.status(404).json({
          success: false,
          message: "Salariatul nu a fost gasit"
        });
      }
      const result = await EmployeesService.getEmployeeFiles(req.query.id_salariat);
      res.status(200).json({
          success: true,
          data: result
        });
    } catch(err) {
      next({
        status: 500,
        message: "A aparut o eroare la incarcarea fisierelor angajatului",
        details: err.message
      });
    }
  }, 

  async generateContractPDF(req, res, next) {
    let browser;
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const { id_salariat } = req.query;
      const salariat = await EmployeesService.getContractData(id_salariat);
      const firma  = await EmployeesService.getCompanyById(salariat.id_firma);
      
      if (!salariat) {
        return res.status(404).json({
          success: false,
          message: "Salariatul nu a fost gasit"
        });
      }
      // Read HTML template
      let htmlTemplate = 
          `<!DOCTYPE html>
              <html lang="ro">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Contract Individual de Munca</title>
                  <style>
                      @page {
                          size: A4;
                          margin: 25mm 20mm;
                      }

                      body {
                          font-family: 'Times New Roman', Times, serif;
                          font-size: 15px;
                          color: #000;
                          margin: 0;
                          padding: 0;
                      }

                      .header {
                          font-size: 15px;
                      }

                      .header .company {
                          font-weight: bold;
                      }

                      .title {
                          text-align: center;
                          font-size: 15px;
                          font-weight: bold;
                          margin: 20px 0 5px 0;
                          text-decoration: underline;
                      }

                      .subtitle {
                          text-align: center;
                          font-size: 13px;
                          margin-bottom: 25px;
                      }

                      .section {
                          margin-bottom: 14px;
                      }

                      .section-title {
                          font-weight: bold;
                          font-size: 14px;
                          margin-bottom: 5px;
                      }

                      .section-content {
                          text-align: justify;
                          font-size: 14px;
                      }

                      .indent {
                          margin-left: 15px;
                      }

                      .indent2 {
                          margin-left: 30px;
                      }

                      .subsection {
                          margin-left: 10px;
                          margin-bottom: 5px;
                      }

                      .list-item {
                          margin-left: 15px;
                          margin-bottom: 3px;
                      }

                      .bold-text {
                          font-weight: bold;
                      }

                      .signatures {
                          margin-top: 40px;
                          display: flex;
                          justify-content: space-between;
                      }

                      .signature-block {
                          width: 45%;
                      }

                      .signature-line {
                          border-top: 1px solid #000;
                          margin-top: 20px;
                          padding-top: 5px;
                      }

                      .page-break {
                          page-break-after: always;
                      }

                      .received-copy {
                          text-align: right;
                      }
                      .page {
                          page-break-after: always;
                      }

                      .page:last-child {
                          page-break-after: auto;
                      }

                      /* Prevent large empty gaps */
                      p, h1, h2, h3 {
                          page-break-inside: avoid;
                      }
                      /* Page numbers */
                      @page {
                          @bottom-center {
                              content: "- " counter(page) " -";
                              font-size: 9px;
                          }
                      }
                  </style>
              </head>
                  <body>
                      <!-- Page 1 -->
                      <div class="header">
                          <div class="company">${firma.nume}</div>
                          <div>CIF: ${firma.cif}</div>
                          <div>Nr. înreg.: ${firma.nr_inreg} din ${firma.data_inreg}</div>
                      </div>

                      <div class="title">CONTRACT INDIVIDUAL DE MUNCĂ</div>
                      <div class="subtitle">încheiat și înregistrat sub <strong>nr.1780/26.11.2025</strong> în registrul general de evidență a salariaților</div>

                      <div class="section">
                          <div class="section-title">A. Părțile contractului:</div>
                          <div class="section-content">
                              Angajator-Persoana juridică, cu sediul în ${firma.adresa} ${firma.nr} ${firma.oras}, înregistrată la Registrul Comerțului din ${firma.oras}, sub nr.${firma.cif}/${firma.data_inreg}, cod unic de înregistrare ${firma.cif}, telefon ${firma.telefon}, e-mail ${firma.email}, reprezentată legal prin Domnul <strong>${firma.prenume} ${firma.familie}</strong>, în calitate de administrator
                          </div>
                          <div class="bold-text" style="margin: 5px 0; text-align: center;">și</div>
                          <div class="section-content">
                              ${salariat.sex === 'M' ? 'Salariatul' : 'Salariata'}
                              ${salariat.sex === 'M' ? 'Domnul' : 'Doamna'}  
                              ${salariat.prenume} ${salariat.nume}, domiciliat(a) în
                              ${salariat.judet}, ${salariat.localitate}, strada ${salariat.strada}, nr. 
                              ${salariat.nr}, ${salariat.bloc != '' ? 'bloc ' + salariat.bloc : ''}, 
                              ${salariat.scara != '' ? 'scara ' + salariat.scara : ''}, 
                              ${salariat.etaj != '' ? 'etaj ' + salariat.etaj : ''},
                              ${salariat.ap != '' ? 'apartament ' + salariat.ap : ''},
                              ${salariat.email != '' ? 'e-mail ' + salariat.email : ''}, posesor/posesoare al/a cărții de identitate/pașaportului seria ${salariat.serie_ci} nr. ${salariat.numar_ci}, eliberată/eliberat de ${salariat.eliberat_de} la data de ${salariat.data_eliberarii}, CNP ${salariat.cnp}, autorizație de muncă/permis ședere în scop de muncă seria ${salariat.serie_autorizatie} nr. ${salariat.nr_autorizatie} din data ${salariat.data_autorizatie}, am încheiat prezentul contract individual de muncă în următoarele condiții asupra cărora am convenit:
                          </div>
                      </div>

                      <div class="section">
                          <div class="section-title">B. Obiectul contractului:</div>
                          <div class="section-content">
                              Angajare. Prestarea de către salariat a muncii corespunzătoare funcției/meseriei, pentru și sub autoritatea angajatorului, în condițiile convenite prin prezentul contract.
                          </div>
                      </div>

                      <div class="section">
                          <div class="section-title">C. Durata contractului:</div>
                          <div class="subsection">a) nedeterminată, salariatul/salariata urmând să înceapă activitatea la data de ${salariat.data_inceput}</div>
                          <div class="subsection">b) determinată, de …….zile/săptămâni/luni, începând cu data de …….-.-…….. și până la data de ……..-.-……., în conformitate cu art.83 lit. … din Legea nr.53/2003- Codul Muncii, republicată, cu modificările și completările ulterioare.</div>
                      </div>

                      <div class="section">
                          <div class="section-title">D. Perioada de probă:</div>
                          <div class="subsection">a) durata de 90 zile calendaristice, în cazul contractului individual de muncă pe perioadă nedeterminată;</div>
                          <div class="subsection">b) durata de ……zile calendaristice /lucrătoare, în cazul contractului individual de muncă pe perioadă determinată;</div>
                          <div class="subsection">c) condițiile perioadei de probă (dacă există) …-…………</div>
                      </div>

                      <div class="section">
                          <div class="section-title">E. Locul de muncă:</div>
                          <div class="subsection">1. Activitatea se desfășoară la Compartiment Producție din Punctul de lucru Roma al S.C. Companie-Com Distribuție S.R.L.</div>
                          <div class="subsection">2. În lipsa unui loc de muncă fix salariatul va desfășura activitatea astfel: ……(pe teren/la sediul clienților/arie geografică, grup de unități etc.).</div>
                          <div class="subsection">În acest caz salariatul va beneficia de:</div>
                          <div class="list-item">a) prestații suplimentare …… (în bani sau în natură);</div>
                          <div class="list-item">b) asigurarea/decontarea transportului de către angajator …… (după caz).</div>
                      </div>

                      <div class="section">
                          <div class="section-title">F. Felul muncii:</div>
                          <div class="subsection">Funcția/Ocupația: inginer industrie alimentară, cod 214514 conform Clasificării Ocupațiilor din România.</div>
                      </div>

                      <div class="section">
                          <div class="section-title">G. Durata timpului de muncă și repartizarea acestuia:</div>
                          <div class="subsection">1. O normă întreagă, durata timpului de lucru fiind de 8 ore/zi și /sau 40 ore/săptămână.</div>
                          <div class="list-item">a) Repartizarea programului de lucru se face după cum urmează 8 ore/zi (ore zi/ore noapte/inegal);</div>
                          <div class="list-item">b) Programul de lucru se poate modifica în condițiile regulamentului intern/contractului colectiv de muncă aplicabil.</div>
                      </div>

                      <div class="section">
                          <div class="section-title">H. Concediul:</div>
                          <div class="subsection">Durata concediului anual de odihnă este de 21 zile lucrătoare, în raport cu perioada lucrată.</div>
                          <div class="subsection">De asemenea, beneficiază de un concediu suplimentar, cu o durată de …-…..zile lucrătoare.</div>
                      </div>


                      <!-- Page 2 -->
                      <div class="section">
                          <div class="section-title"> I. Salariul.</div>
                      <div class="subsection">1. Salariul brut lunar este de  lei.</div>
                      <div class="subsection">2. Elemente constitutive ale salariului brut lunar sunt:</div>
                              <div class="subsection">a)   a1. salariul brut de bază  lunar  de   lei ;</div>
                                    <div class="subsection">a2. spor de vechime în valoare de   lei;</div>
                                    <div class="subsection">a.3. spor de repaos săptămânal în valoare de  lei;</div>
                                    <div class="subsection">a.4 25% spor de noapte în valoare de ...-... lei.</div>
                                <div class="subsection">b) indemnizaţii.........-.............;</div>
                                <div class="subsection">c) prestaţii suplimentare in bani .....-.....;</div>
                                <div class="subsection">d) modalitatea prestaţiilor suplimentare în natură .</div>
                                <div class="subsection">e) alte adaosuri ...........-............... </div>

                  -1-
                      <div class="subsection">3. Orele suplimentare prestate de salariații cu normă întreagă  în afara programului normal de lucru se compensează cu ore libere plătite în următoarele 90 de zile calendaristice după efectuarea acestora, conform contractului colectiv de muncă aplicabil sau  Legii nr. 53/2003-Codul Muncii, republicată, cu modificările și completările ulterioare. În cazul în care compensarea prin ore libere plătite nu este posibilă, orele suplimentare prestate în afara programului normal de lucru vor fi plătite cu un spor la salariu în cuantum de 75% din salariul de bază.  </div>

                      </div>

                      <div class="section">
                          <div class="section-title">J. Alte clauze:</div>
                          <div class="subsection">a) perioada de preaviz în cazul concedierii este de 20 zile lucrătoare;</div>
                          <div class="subsection">b) perioada de preaviz în cazul demisiei este de 20 zile lucrătoare;</div>
                          <div class="subsection">c) clauză de confidențialitate conform GDPR.</div>
                      </div>

                      <div class="section">
                          <div class="section-title">K. Atribuțiile postului:</div>
                          <div class="section-content">
                              Atribuțiile postului sunt prevăzute în fișa postului, anexă la contractul individual de muncă. Elementele privind fișa postului se referă, în principal, la: denumirea postului, locul de muncă, scopul postului, competențele postului, studii, vechime/experiență, aptitudinile și abilitățile angajatului, cunoștințe, relații organizatorice.
                          </div>
                      </div>

                      <div class="section">
                          <div class="section-title">L. Riscurile specific postului:</div>
                          <div class="section-content">
                              Riscurile de accidentare și îmbolnăvire profesională specifice postului sunt prevăzute în evaluările de risc ale locului de muncă.
                          </div>
                      </div>

                      <div class="section">
                          <div class="section-title">M. Criterii de evaluare a activității profesionale:</div>
                          <div class="subsection">a) Calitatea lucrărilor</div>
                          <div class="subsection">b) Randamentul în muncă</div>
                          <div class="subsection">c) Cunoștințe și aptitudini</div>
                          <div class="subsection">d) Adaptare profesională</div>
                          <div class="subsection">e) Disciplina</div>
                      </div>

                      <div class="section">
                          <div class="section-title">N. Procedura privind utilizarea semnăturii electronice:</div>
                          <div class="section-content">
                              Se realizează conform prevederilor actelor normative.
                          </div>
                      </div>

                      <div class="section">
                          <div class="section-title">O. Formarea profesională:</div>
                          <div class="section-content">
                              Formarea profesională se realizează prin contracte de calificare profesională.
                          </div>
                      </div>

                      <div class="section">
                          <div class="section-title">P. Condițiile de muncă:</div>
                          <div class="section-content">
                              Activitatea se desfășoară în condiții normale de muncă, în conformitate cu prevederile legale.
                          </div>
                      </div>

                      <div class="section">
                          <div class="section-title">Q. Drepturile și obligațiile părților privind securitatea și sănătatea în muncă:</div>
                          <div class="subsection">a) echipament individual de protecție: da</div>
                          <div class="subsection">b) echipament individual de lucru: da</div>
                          <div class="subsection">c) materiale igienico-sanitare: da</div>
                          <div class="subsection">d) alimentație de protecție: da</div>
                      </div>


                      <!-- Page 3 -->
                      <div class="section">
                          <div class="section-title">R. Drepturile și obligațiile generale ale părților:</div>
                          
                          <div class="bold-text" style="margin: 10px 0 5px 0;">1. Drepturi ale salariatului:</div>
                          <div class="list-item">a) dreptul la salarizare pentru munca depusă</div>
                          <div class="list-item">b) dreptul la repaus zilnic și săptămânal</div>
                          <div class="list-item">c) dreptul la concediu de odihnă anual</div>
                          <div class="list-item">d) dreptul la egalitate de șanse și de tratament</div>
                          <div class="list-item">e) dreptul la securitate și sănătate în muncă</div>
                          <div class="list-item">f) dreptul la formare profesională</div>

                          <div class="bold-text" style="margin: 10px 0 5px 0;">2. Obligații ale salariatului:</div>
                          <div class="list-item">a) obligația de a realiza norma de muncă</div>
                          <div class="list-item">b) obligația de a respecta disciplina muncii</div>
                          <div class="list-item">c) obligația de fidelitate față de angajator</div>
                          <div class="list-item">d) obligația de a respecta măsurile de securitate și sănătate</div>

                          <div class="bold-text" style="margin: 10px 0 5px 0;">3. Drepturi ale angajatorului:</div>
                          <div class="list-item">a) să stabilească atribuțiile de serviciu și norma de muncă</div>
                          <div class="list-item">b) să dea dispoziții cu caracter obligatoriu</div>
                          <div class="list-item">c) să exercite controlul asupra modului de îndeplinire</div>
                          <div class="list-item">d) să constate abaterile disciplinare și să aplice sancțiuni</div>

                          <div class="bold-text" style="margin: 10px 0 5px 0;">4. Obligații ale angajatorului:</div>
                          <div class="list-item">a) să înmâneze salariatului un exemplar din contract</div>
                          <div class="list-item">b) să opereze înregistrările prevăzute de lege în REVISAL</div>
                          <div class="list-item">c) să acorde salariatului toate drepturile ce decurg din contract</div>
                          <div class="list-item">d) să asigure condițiile corespunzătoare de muncă</div>
                      </div>

                      <div class="section">
                          <div class="section-title">S. Dispoziții finale:</div>
                          <div class="subsection">1. Contractul colectiv de muncă aplicabil a fost încheiat la nivel de S.C. Companie-Com Distribuție S.R.L și înregistrat sub nr.53/15.11.2024 la Inspectoratul Teritorial de Muncă al Județului Botoșani.</div>
                          <div class="subsection">2. Prezentul contract individual de muncă s-a încheiat în două exemplare, câte unul pentru fiecare parte.</div>
                      </div>

                      <div class="section">
                          <div class="section-title">T. Conflictele:</div>
                          <div class="section-content">
                              Conflictele în legătură cu încheierea, executarea, modificarea, suspendarea sau încetarea prezentului contract pot fi soluționate atât pe cale amiabilă cât și de către instanța judecătorească competentă, potrivit legii.
                          </div>
                          <div class="subsection" style="margin-top: 10px;">
                              Prezentul contract individual de muncă s-a încheiat în trei exemplare, două exemplare pentru angajator și un exemplar pentru salariat.
                          </div>
                      </div>

                      <div class="page-break"></div>

                      <!-- Page 4 - Signatures -->
                      <div class="signatures">
                          <div class="signature-block">
                              <div>Angajator,</div>
                              <div>S.C. Companie-Com Distribuție S.R.L. Botoșani</div>
                              <div style="margin-top: 10px;">Reprezentant legal,</div>
                              <div>D-l Administrator</div>
                              <div class="signature-line">Semnătură</div>
                          </div>
                          <div class="signature-block">
                              <div>Salariat,</div>
                              <div style="margin-top: 20px;">......................................................................</div>
                              <div class="signature-line">Semnătură ..................................</div>
                              <div style="margin-top: 20px;">Data ...................................</div>
                          </div>
                      </div>

                      <div class="received-copy">
                          <div>Am primit un exemplar,</div>
                          <div style="margin-top: 10px;">Nume si prenume ................................................................</div>
                          <div style="margin-top: 10px;">Semnătură ................................ Data ...........................</div>
                      </div>
                    </body>
          </html>`;

        browser = await puppeteer.launch({
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu"
          ]
        });

        const page = await browser.newPage();

        await page.setContent(htmlTemplate, {
          waitUntil: "networkidle0"
        });

        const pdfBuffer = await page.pdf({
          format: "A4",
          printBackground: true,
          displayHeaderFooter: false,
          margin: {
            top: "2mm",
            bottom: "2mm",
            left: "20mm",
            right: "20mm"
          }
        });

        await browser.close();
        res.set({
          "Content-Type": "application/pdf",
          "Content-Disposition": "inline; filename=contract-demo.pdf",
          "Content-Length": pdfBuffer.length
        });

        return res.send(pdfBuffer);
      } catch (error) {
        console.error("Error generating PDF:", error);
        if (browser) await browser.close();
        return next({
          status: 500,
          message: "A apărut o eroare la generarea contractului PDF",
          details: error.message
        });
      }
  }
};
