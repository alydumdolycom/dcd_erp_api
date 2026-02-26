import { PayslipService } from "./payslip.service.js";
import ExcelJS from "exceljs";
import puppeteer from "puppeteer";

export const PayslipController = {
    async getAll(req, res, next) {
        try {
            const data = await PayslipService.getAll();  
            res.status(200).json({ 
                success: true,
                data: data
            });
        } catch (error) {
            next({
                status: 500,
                success: false,
                error: error.message || "Eroare server"
            });
        }   
    },

    async findBy(req, res, next) {
        try {
            const { luna, anul, id_firma } = req.query; 
            const data = await PayslipService.findBy(luna, anul, id_firma);  
            res.status(200).json({ 
                success: true,
                data: data
            });
        } catch (error) {
            next({
                status: 500,
                success: false,
                error: error.message || "Eroare server"
            });
        }
    },

    async export(req, res, next) {
        try {
            const { luna, anul, id_firma } = req.query;

            const rows = await PayslipService.excelReports(luna, anul, id_firma);

            // Group by department
            const grouped = {};
            rows.forEach(row => {
                if (!grouped[row.nume_departament]) {
                    grouped[row.nume_departament] = [];
                }
                grouped[row.nume_departament].push(row);
            });

            const months = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];

            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet(`Raport Plati ${months[luna - 1]} ${anul}`);

            sheet.columns = [
                { key: 'sector',  width: 35 },
                { key: 'nume',    width: 35 },
                { key: 'tarifar', width: 12 },
                { key: 'brut',    width: 12 },
                { key: 'net',     width: 12 },
                { key: 'nr',      width: 8  },
            ];

            // Row 1 - title
            sheet.addRow([`Salarii nete luna ${months[luna - 1]} ${anul}`]);
            sheet.mergeCells('A1:F1');
            const titleCell = sheet.getCell('A1');
            titleCell.font = { bold: true, size: 13 };
            titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
            sheet.getRow(1).height = 25;

            // Row 2, 3 - empty
            sheet.addRow([]);
            sheet.addRow([]);

            // Row 4 - column headers
            const headerRow = sheet.addRow(['Sector', 'Salariat', 'Tarifar', 'Brut', 'Net', 'Nr']);
            headerRow.eachCell(cell => {
                cell.font = { bold: true };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };
                cell.alignment = { horizontal: 'center' };
                cell.border = { bottom: { style: 'thin' } };
            });

            // Grand total accumulators
            let grandTotalTarifar = 0, grandTotalBrut = 0, grandTotalNet = 0, grandTotalNr = 0;

            // Data grouped by department
            Object.entries(grouped).forEach(([department, employees]) => {
                let totalTarifar = 0, totalBrut = 0, totalNet = 0, totalNr = 0;

                employees.forEach(emp => {
                    sheet.addRow([
                        department,
                        `${emp.nume} ${emp.prenume}`,
                        Number(emp.tarifar) || 0,
                        Number(emp.brut)    || 0,
                        Number(emp.net)     || 0,
                        1
                    ]);
                    totalTarifar += Number(emp.tarifar) || 0;
                    totalBrut    += Number(emp.brut)    || 0;
                    totalNet     += Number(emp.net)     || 0;
                    totalNr      += 1;
                });

                // Total row per department
                const totalRow = sheet.addRow([
                    `${department}     TOTAL`, '', totalTarifar, totalBrut, totalNet, totalNr
                ]);
                totalRow.eachCell(cell => {
                    cell.font = { bold: true };
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };
                });

                // Accumulate grand total
                grandTotalTarifar += totalTarifar;
                grandTotalBrut    += totalBrut;
                grandTotalNet     += totalNet;
                grandTotalNr      += totalNr;
            });

            // TOTAL GENERAL row
            const grandTotalRow = sheet.addRow([
                'TOTAL GENERAL', '', grandTotalTarifar, grandTotalBrut, grandTotalNet, grandTotalNr
            ]);
            grandTotalRow.eachCell(cell => {
                cell.font = { bold: true, size: 12 };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };
            });

            const buffer = await workbook.xlsx.writeBuffer();

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="Raport_${months[luna - 1]}_${anul}.xlsx"`);
            res.setHeader('Content-Length', buffer.length);
            res.send(buffer);

        } catch (error) {
            next({ status: 500, success: false, error: error.message || "Eroare server" });
        }
    },

    async groupByDept(rows) {
        const groups = {};
        const order  = [];
        for (const row of rows) {
            const dept = row.nume_departament;
            if (!groups[dept]) { groups[dept] = []; order.push(dept); }
            groups[dept].push(row);
        }
        return { groups, order };
    },

    async getByPayrollType(req, res, next) {
        try  {
            const { luna, anul, id_firma } = req.query; 
            const data = await PayslipService.getPayrollPaymentsTypes(luna, anul, id_firma);  
            res.status(200).json({ 
                success: true,
                data: data
            });
        } catch(error) {
            next({
                status: 500,
                success: false,                
                error: error.message || "Eroare server"
            });
        }
    },

    async exportPdfByPayrollType(req, res, next) {

         let browser;
        try {
            browser = await puppeteer.launch({
                headless: "new",
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
                executablePath: process.env.CHROMIUM_PATH || undefined,
                ignoreHTTPSErrors: true
            });
            const page = await browser.newPage();
            const data = await PayslipService.getPayrollPaymentByType(req.query.luna, req.query.anul, req.query.id_firma, req.query.id_mod_plata);
            // Group data by department
            const grouped = {};
            data.forEach(row => {
                const dept = row.nume_departament || 'N/A';
                if (!grouped[dept]) {
                    grouped[dept] = [];
                }
                grouped[dept].push(row);
            });

            // Build table rows grouped by department
            let tableRows = '';
            Object.entries(grouped).forEach(([dept, employees]) => {
                
                employees.forEach(row => {
                    tableRows += `
                        <tr>
                            <td>${row.id || ''}</td>
                            <td>${row.nume +' '+ row.prenume}</td>
                            <td>${row.suma || 0}</td>
                        </tr>
                    `;
                });
                tableRows += `<tr style="background-color: #E8E8E8;"><td colspan="3" style="font-weight: bold;">${dept}</td></tr>`;
            });
            const modPlata = await PayslipService.getModPlataName(req.query.id_mod_plata);

            const months = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
            const luna = months[Number(req.query.luna) - 1] || 'Luna necunoscuta';
            const anul = req.query.anul || 'An necunoscut';
            // Generate HTML with data table
            const document = `
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            font-size: 11px;
                            color: #222;
                            margin: 20px;
                        }
                        .header-lines {
                            font-size: 14px;
                            font-weight: bold;
                            margin-bottom: 20px;
                        }
                        .header-lines div {
                            margin-bottom: 5px;
                        }
                        .title {
                            text-align: center;
                            font-size: 16px;
                            font-weight: bold;
                            margin: 20px 0;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                        }
                        th {
                            background-color: #D3D3D3;
                            border: 1px solid #000;
                            padding: 8px;
                            text-align: left;
                            font-weight: bold;
                        }
                        td {
                            border: 1px solid #000;
                            padding: 8px;
                            text-align: left;
                        }
                        tr:nth-child(even) {
                            background-color: #f9f9f9;
                        }
                    </style>
                </head>
                <body>
                    <div class="header-lines">
                        <div>SC DOLYCOM DISTRIBUTIE SRL BOTOSANI</div>
                        <div>Str. Varnav, Nr. 29E, Botosani</div>
                        <div>CUI RO 32264626, J23/1234/2010</div>
                    </div>
                    <div class="title">Raport Plati ${luna}/${anul} - ${modPlata}</div>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nume si prenume</th>
                                <th>Suma</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </body>
                </html>
            `;

            await page.setContent(document, { waitUntil: 'networkidle0' });

            const pdfBuffer = await page.pdf({
                format: "A4",
                printBackground: true
            });

            await browser.close();

            // Output PDF in browser (inline, not as download)
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="document.pdf"',
                'Content-Length': pdfBuffer.length
            });
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getPayrollByCard(req, res, next) {

        const { luna, anul, id_firma } = req.query;
        const data = await PayslipService.getPayrollByCard(luna, anul, id_firma);  
        let browser;
        try {
            browser = await puppeteer.launch({
                headless: "new",
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
                executablePath: process.env.CHROMIUM_PATH || undefined,
                ignoreHTTPSErrors: true
            });
            const page = await browser.newPage();

            // Group data by department
            const grouped = {};
            data.forEach(row => {
                const dept = row.nume_departament || 'N/A';
                if (!grouped[dept]) {
                    grouped[dept] = [];
                }
                grouped[dept].push(row);
            });

            // Build table rows grouped by department
            let tableRows = '';
            Object.entries(grouped).forEach(([dept, employees]) => {
                
                employees.forEach(row => {
                    tableRows += `
                        <tr>
                            <td>${row.id || ''}</td>
                            <td>${row.nume +' '+ row.prenume}</td>
                            <td>${row.suma || 0}</td>
                        </tr>
                    `;
                });
                tableRows += `<tr style="background-color: #E8E8E8;"><td colspan="3" style="font-weight: bold;">${dept}</td></tr>`;
            });

            const months = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
            const luna = months[Number(req.query.luna) - 1] || 'Luna necunoscuta';
            const anul = req.query.anul || 'An necunoscut';
            // Generate HTML with data table
            const document = `
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            font-size: 11px;
                            color: #222;
                            margin: 20px;
                        }
                        .header-lines {
                            font-size: 14px;
                            font-weight: bold;
                            margin-bottom: 20px;
                        }
                        .header-lines div {
                            margin-bottom: 5px;
                        }
                        .title {
                            text-align: center;
                            font-size: 16px;
                            font-weight: bold;
                            margin: 20px 0;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                        }
                        th {
                            background-color: #D3D3D3;
                            border: 1px solid #000;
                            padding: 8px;
                            text-align: left;
                            font-weight: bold;
                        }
                        td {
                            border: 1px solid #000;
                            padding: 8px;
                            text-align: left;
                        }
                        tr:nth-child(even) {
                            background-color: #f9f9f9;
                        }
                    </style>
                </head>
                <body>
                    <div class="header-lines">
                        <div>SC DOLYCOM DISTRIBUTIE SRL BOTOSANI</div>
                        <div>Str. Varnav, Nr. 29E, Botosani</div>
                        <div>CUI RO 32264626, J23/1234/2010</div>
                    </div>
                    <div class="title">Lista lichidari card luna ${luna} an ${anul}</div>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nume si prenume</th>
                                <th>Suma</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </body>
                </html>
            `;

            await page.setContent(document, { waitUntil: 'networkidle0' });

            const pdfBuffer = await page.pdf({
                format: "A4",
                printBackground: true
            });

            await browser.close();

            // Output PDF in browser (inline, not as download)
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="document.pdf"',
                'Content-Length': pdfBuffer.length
            });
            res.send(pdfBuffer);
        } catch (error) {
            next({
                status: 500,
                success: false,                
                error: error.message || "Eroare server"
            });
        }
    }
};  