import { ReportsPaymentsPDFController } from '../../utils/ReportsPaymentsPDFController.js';
import { HolidaysService } from './holidays.service.js';
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/* Controller for managing holidays */
export const HolidaysController = {

    /* Get all holidays with optional filters */
    async getAll(req, res, next) {
        const { id_firma, id_departament, nume, prenume, an, luna } = req.query;
        try {
            const rows = await HolidaysService.getAll({ id_firma, id_departament, nume, prenume, an, luna });
            res.status(200).json(rows);
        } catch (error) {
            next(error);
        }
    },

    /* Get holiday by ID */
    async getById(req, res, next) {
        try {
            const row = await HolidaysService.getById(req.params.id);
            if (!row) {
            return res.status(404).json({ message: 'Informatiile nu au fost gasite' });
            }
            res.status(200).json(row);
        } catch (error) {
            next(error);
        }
    },

    /* Create a new holiday */
    async create(req, res, next) {  
        try {
            const result = await HolidaysService.create(req.body);
            res.status(201).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }   
    },

    /* Update an existing holiday */
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const result = await HolidaysService.update(id, req.body);
            res.status(200).json({
                success: true,
                data: result
            });
        }
        catch (error) {
            next(error);
        }   

    },

    /* Delete a holiday */
    async delete(req, res, next) {  
        try {
            const { id } = req.params;
            await HolidaysService.delete(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },

    async reportCoPaymentHolidaySum(req, res, next) {
        try {
            const { id_firma, an, luna } = req.query;
            const result = await HolidaysService.reportCoPaymentHolidaySum(id_firma, an, luna);
            res.status(200).json({
               data: result
            });
        } catch (error) {
            next(error);
        }   
    },

    async reportByPaymentMethod(req, res, next) {
        const { id_firma, an, luna, id_modplata } = req.query;
        const numeFirma = await HolidaysService.getCompanyName(id_firma);
        const result = await HolidaysService.reportByPaymentMethod(id_firma, an, luna, id_modplata);
        let htmlTemplate = '';
        let totalSuma = 0;
        
        const monthNames = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
        let lunaName = monthNames[parseInt(luna) - 1] || luna;
        
            
        htmlTemplate +=`<!DOCTYPE html>
                <html lang="ro">
                <head>
                    <meta charset="UTF-8">
                    <style>
                        @page {
                            size: A4;
                            margin: 15mm;
                        }
                        
                        * {
                            margin: 0;
                            padding: 0;
                        }
                        
                        body {
                            font-family: Arial, sans-serif;
                            font-size: 10pt;
                            line-height: 1.4;
                            color: #000;
                            padding: 10mm;
                        }
                        
                        .document-header {
                            text-align: left;
                            margin-bottom: 20px;
                            padding-bottom: 15px;
                        }
                        
                        .document-header .company-name {
                            font-size: 16pt;
                            font-weight: bold;
                            color: #000;
                            margin-bottom: 5px;
                        }
                        
                        .document-header .company-details {
                            font-size: 9pt;
                            color: #666;
                            margin-bottom: 3px;
                        }
                        
                        .document-title {
                            text-align: center;
                            margin: 20px 0;
                        }
                        
                        .document-title h1 {
                            font-size: 18pt;
                            font-weight: bold;
                            text-transform: uppercase;
                            color: #2c3e50;
                            margin-bottom: 5px;
                        }
                        
                        .document-title .period {
                            font-size: 12pt;
                            color: #7f8c8d;
                            font-weight: bold;
                        }
                        
                        .document-info {
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 20px;
                            font-size: 9pt;
                            padding: 10px;
                            background-color: #ecf0f1;
                            border-radius: 5px;
                        }
                        
                        .info-item {
                            margin: 3px 0;
                        }
                        
                        .info-label {
                            font-weight: bold;
                            color: #34495e;
                        }
                        
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin: 15px 0;
                        }
                        
                        thead {
                            // background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                            color: #000;
                        }
                        
                        th {
                            padding: 12px 8px;
                            text-align: left;
                            font-weight: bold;
                            border: 1px solid #1a252f;
                            font-size: 10pt;
                        }
                        
                        td {
                            padding: 10px 8px;
                            border: 1px solid #ddd;
                            font-size: 9pt;
                        }
                        
                        // tbody tr:nth-child(even) {
                        //     background-color: #f8f9fa;
                        // }
                        
                        // tbody tr:hover {
                        //     background-color: #e9ecef;
                        // }

                        .text-left {
                            text-align: left;
                        }

                        .text-right {
                            text-align: right;
                        }
                        
                        .text-center {
                            text-align: center;
                        }
                        
                        .subtotal-row {
                            // background-color: #95a5a6 !important;
                            color: #000;
                            font-weight: bold;
                            font-size: 10pt;
                        }
                        
                        .subtotal-row td {
                            border: 2px solid #7f8c8d;
                            padding: 10px 8px;
                        }
                        
                        .total-row {
                            background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
                            color: white;
                            font-weight: bold;
                            font-size: 11pt;
                        }
                        
                        .total-row td {
                            border: 2px solid #1e8449;
                            padding: 12px 8px;
                        }

                        
                        .signatures {
                            display: flex;
                            justify-content: space-between;
                            margin-top: 40px;
                        }
                        
                        .signature-box {
                            width: 45%;
                            text-align: center;
                        }
                        
                        .signature-line {
                            margin: 30px 0 5px 0;
                            height: 40px;
                        }
                        
                        .signature-label {
                            font-size: 9pt;
                            color: #666;
                        }
                        
                        .page-number {
                            text-align: center;
                            font-size: 8pt;
                            color: #999;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="document-header">
                        <div class="company-name">${numeFirma}</div>
                    </div>
                    
                    <div class="document-title">
                        <h1>Borderou de Plată</h1>
                        <p class="period">${lunaName} ${an}</p>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th class="text-center" style="width: 40px;">Nr. Crt.</th>
                                <th class="text-center">Nume Prenume</th>
                                <th class="text-center" style="width: 110px;">CNP</th>
                                <th class="text-right" style="width: 90px;">IBAN</th>
                                <th class="text-right" style="width: 90px;">SUMA</th>
                            </tr>
                        </thead>
                        <tbody>`;

                        // ── Add table rows ──
                        for (let i = 0; i < result.length; i++) {
                            
                            totalSuma = result[i].suma_totala_co || 0;
                            
                            htmlTemplate += `
                                <tr style="border: 2px solid #000;">
                                    <td class="text-center">${i + 1}</td>
                                    <td>${result[i].nume || '-'} ${result[i].prenume || '-'}</td>
                                    <td class="text-center">${result[i].cnp || '-'}</td>
                                    <td class="text-right">${result[i].cont_bancar || '-'}</td>
                                    <td class="text-right">${result[i].suma_totala_co || '-'}</td>
                                </tr>
                                `;
                        }

                        htmlTemplate += `
                            <tr class="subtotal-row">
                                <td colspan="4" class="text-left">TOTAL:</td>
                                <td class="text-right">${totalSuma}</td>
                            </tr>

                        </tbody>
                    </table>
            
                    <div class="footer">
                        <div class="signatures">
                            <div class="signature-box">
                                <div class="signature-label">Administrator</div>
                                <div class="signature-label">Ruslan Balic</div>
                            </div>
                            <div class="signature-box">
                                <div class="signature-label">Listat ${new Intl.DateTimeFormat('en-GB').format(new Date())}</div>
                            </div>
                        </div>
                    </div>
                </body>
                </html>`;
        
        try {
            
            // ── Step 3: Puppeteer render ──
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
            });

            const page = await browser.newPage();
            await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });

            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true
            });

            await browser.close();

            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename=borderou-02-2026.pdf`,
                'Content-Length': pdfBuffer.length
            });

            return res.send(pdfBuffer);

        } catch (error) {
            console.error('Error generating PDF:', error);
            return res.status(500).json({ error: error.message });
        }
    }
};