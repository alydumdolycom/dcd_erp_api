import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ContractPDFController = {
  async generate(req, res) {
    let browser;

    try {
      // Read HTML template
      let htmlTemplate = 
         fs.readFileSync(path.join(__dirname, "templates", "contract-template.html"), "utf-8");


      // ✅ Fake demo data (fixed)
      const data = {
        companyName: "DCD ERP Demo S.R.L.",
        cui: "RO12345678",
        registrationNumber: "J07/123/2026",
        contractNumber: "CTR-2026-0001",
        employeeName: "Popescu Ion",
        employeeAddress:
          "Mun. București, Str. Exemplu nr. 10, bl. A1, ap. 5",
        employeeId: "CI RX 123456",
        employeeCnp: "1980101123456",
        startDate: "01.02.2026",
        jobTitle: "Programator",
        jobCode: "251201",
        salary: "5500",
        vacationDays: "21",
        paymentDate: "15"
      };

      // Replace values in template
      htmlTemplate = htmlTemplate
        .replace(/Companie S\.R\.L\./g, data.companyName)
        .replace(/CUI: 1111/g, `CUI: ${data.cui}`)
        .replace(
          /Nr\. înreg\.: 8158 din 26\.11\.2025/g,
          `Nr. înreg.: ${data.registrationNumber}`
        )
        .replace(/nr\.1780\/26\.11\.2025/g, `nr.${data.contractNumber}`)
        .replace(/08\.12\.2025/g, data.startDate)
        .replace(/inginer industrie alimentară/g, data.jobTitle)
        .replace(/cod 214514/g, `cod ${data.jobCode}`)
        .replace(/21 zile lucrătoare/g, `${data.vacationDays} zile lucrătoare`)
        .replace(
          /22 ale lunii următoare/g,
          `${data.paymentDate} ale lunii următoare`
        );

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
      return res.status(500).json({ error: error.message });
    }
  }
};
