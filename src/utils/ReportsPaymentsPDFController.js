import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ReportsPaymentsPDFController = {
  async generate(req, res) {
    let browser;
    try {
      const data = req.body; // { luna, anul, companyName, employees: [...] }

      let htmlTemplate = fs.readFileSync(
        path.join(__dirname, 'templates', 'reports-payments-template.html'),
        'utf-8'
      );

      // ── Step 1: replace scalar placeholders ──
      htmlTemplate = htmlTemplate
        .replace('{{COMPANY_NAME}}', data.companyName)
        .replace('{{CUI}}', data.cui)
        .replace('{{LUNA}}', data.luna)
        .replace('{{ANUL}}', data.anul);

      // ── Step 2: generate dynamic rows ──
      const tableRows = data.employees.map((emp, i) => `
        <tr>
          <td class="td-nr">${i + 1}</td>
          <td>${emp.nume} ${emp.prenume}</td>
          <td class="td-cnp">${emp.cnp}</td>
          <td class="td-iban">${emp.cont_bancar}</td>
          <td class="td-suma">${formatNumber(emp.suma_totala_co)}</td>
        </tr>
      `).join('');

      const total = data.employees.reduce(
        (sum, emp) => sum + parseFloat(emp.suma_totala_co), 0
      );

      htmlTemplate = htmlTemplate
        .replace('{{TABLE_ROWS}}', tableRows)
        .replace('{{TOTAL}}', formatNumber(total));

      // ── Step 3: Puppeteer render ──
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
      });

      const page = await browser.newPage();
      await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '2mm', bottom: '2mm', left: '20mm', right: '20mm' }
      });

      await browser.close();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename=borderou-${data.luna}-${data.anul}.pdf`,
        'Content-Length': pdfBuffer.length
      });

      return res.send(pdfBuffer);

    } catch (error) {
      console.error('Error generating PDF:', error);
      if (browser) await browser.close();
      return res.status(500).json({ error: error.message });
    }
  }
};

// ── Helper ──
function formatNumber(value) {
  return parseFloat(value).toLocaleString('ro-RO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}