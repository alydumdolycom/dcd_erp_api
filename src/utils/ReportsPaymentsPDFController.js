import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ReportsPaymentsPDFController = {
  async generate(data) {
    let browser;
    try {
      console.log(data)
      let htmlTemplate = `<div>test</div>`; // Placeholder, replace with actual template loading
    
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
        'Content-Disposition': `inline; filename=borderou-02-2026.pdf`,
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