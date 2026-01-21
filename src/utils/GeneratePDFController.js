import path from "path";
import puppeteer from "puppeteer";
export const GeneratePDFController = {
   async generate(req, res) {
        
        try {

            const browser = await puppeteer.launch({
                headless: "new",
                args: ["--no-sandbox", "--disable-setuid-sandbox"]
            });

            const page = await browser.newPage();

            // Generate a simple HTML table
            const document = `
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            font-size: 12px;
                            color: #222;
                        }
                        .header-lines {
                            position: absolute;
                            top: 30px;
                            left: 40px;
                            font-size: 14px;
                            font-weight: bold;
                        }
                        .section {
                            margin-top: 70px;
                        }
                        .info {
                            text-align: left;
                            margin-bottom: 20px;
                            font-size: 12px;
                            display: block;
                        }

                        .section-title {
                            margin-top: 150px;
                            text-align: center;
                            font-size: 18px;
                        }

                        .section-date {
                            margin-top: 80px;
                            text-align: right;
                            font-size: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header-lines">
                        <div>SC DOLYCOM DISTRIBUTIE SRL BOTOSANI</div>
                        <div>Str. Varnav, Nr. 29E, Botosani</div>
                        <div>CUI RO 32264626, J23/1234/2010</div>
                    </div>
                    <div style="max-width: 700px; margin: 0 auto; font-family: Arial, sans-serif; font-size: 12px; color: #222;">
                        <div class="section-date">
                            <span>Nr. <span style="text-decoration: underline;">6130/08.09.2025</span></span>
                        </div>
                        <h2 class="section-title">ACT ADIȚIONAL</h2>
                        <div style="text-align: center; font-size: 16px; margin-bottom: 10px;">
                            de modificare a contractului individual de muncă
                        </div>
                        <div class="section">
                            Subsemnatul, <span style="display: inline-block; min-width: 120px; border-bottom: 1px solid #000;">&nbsp;</span>, Manager General al <span style="display: inline-block; min-width: 120px; border-bottom: 1px solid #000;">&nbsp;</span> DISTRIBUTIE SRL, 
                            prezenta, decid conform art.41 alin.(3) lit.e din Codul Muncii modificarea salariului 
                            lunar brut al d-lui/d-nei <span style="display: inline-block; min-width: 120px; border-bottom: 1px solid #000;">&nbsp;</span>, 
                            CNP <span style="display: inline-block; min-width: 120px; border-bottom: 1px solid #000;">&nbsp;</span>, 
                            angajat al societății noastre, de la <span style="display: inline-block; min-width: 60px; border-bottom: 1px solid #000;">&nbsp;</span> lei la <span style="display: inline-block; min-width: 60px; border-bottom: 1px solid #000;">&nbsp;</span> lei 
                            începând cu data de <b>01/09/2025</b>.
                        </div>
                        <div class="section" style="margin-bottom: 10px;">
                            Salariul lunar brut în valoare de: <span style="display: inline-block; min-width: 80px; border-bottom: 1px solid #000;">&nbsp;</span> lei este format din:
                            <ul style="margin: 5px 0 5px 30px; padding: 0;">
                                <li>salariul de bază brut de <span style="display: inline-block; min-width: 60px; border-bottom: 1px solid #000;">&nbsp;</span> lei;</li>
                                <li>spor de vechime în valoare de <span style="display: inline-block; min-width: 60px; border-bottom: 1px solid #000;">&nbsp;</span> lei;</li>
                                <li>spor de repaus săptămânal în valoare de <span style="display: inline-block; min-width: 60px; border-bottom: 1px solid #000;">&nbsp;</span> lei;</li>
                            </ul>
                        </div>
                        <div class="section" style="margin-bottom: 10px;">
                            <p>Salariul se plătește în bani sau prin virament într-un cont bancar, după caz, iar data la care se plătește salariul este de 22 ale lunii următoare. Modificările survenite vor fi adăugate și la contractul colectiv de muncă prin act adițional.
                            </br>Prezentul act adițional s-a întocmit în 3 exemplare originale, două exemplare pentru angajator și unul pentru salariat.</p>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 40px;">
                            <div>
                                <b>Angajator,</b><br>
                                <span style="display: inline-block; min-width: 120px; border-bottom: 1px solid #000; margin-top: 40px;">&nbsp;</span>
                            </div>
                            <div>
                                <b>Salariat,</b><br>
                                <span style="display: inline-block; min-width: 120px; border-bottom: 1px solid #000; margin-top: 40px;">&nbsp;</span>
                            </div>
                        </div>
                    </div>
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
    }
};