import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Generates a PDF file from an HTML template using Puppeteer and saves it as a temporary file.
 */
async function generateActAditionalPDF() {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    const htmlPath = path.join('act_aditional_template.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('print');

    // Generate a unique temporary file path
    const tempDir = os.tmpdir();
    const tempFileName = `Act_Aditional_Generat_${Date.now()}.pdf`;
    const outputPath = path.join(tempDir, tempFileName);

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
      }
    });

    console.log(`PDF-ul temporar "${outputPath}" a fost generat cu succes!`);
    // Optionally, return the path for further use
    return outputPath;

  } catch (error) {
    console.error('A apărut o eroare la generarea PDF-ului:', error.message);
  } finally {
    if (browser) {
      await browser.close();
      console.log('Browserul a fost închis.');
    }
  }
}

generateActAditionalPDF();
