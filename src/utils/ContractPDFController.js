import puppeteer from "puppeteer";

export const ContractPDFController = {
  async generate(req, res) {
    let browser;

    try {
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

      const html = `<!DOCTYPE html>
                        <html lang="ro">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <style>
                                    body {
                                        font-family: Arial, sans-serif;
                                        max-width: 900px;
                                        margin: 0 auto;
                                        background-color: #f5f5f5;
                                    }
                                    .container {
                                        background-color: white;
                                    }
                                    .header {
                                        text-align: center;
                                        margin-bottom: 30px;
                                    }
                                    .company-info {
                                        font-weight: bold;
                                    }
                                    .title {
                                        text-align: center;
                                        font-size: 14pt;
                                        font-weight: bold;
                                        text-decoration: underline;
                                    }
                                    .section {
                                        margin: 10px 0;
                                    }
                                    .section-title {
                                        font-weight: bold;
                                        font-size: 14px;
    
                                        margin-bottom: 10px;
                                    }
                                    .subsection {
                                        margin-left: 30px;
                                        margin-bottom: 10px;
                                    }
                                    .list-item {
                                        margin-left: 20px;
                                        margin-bottom: 8px;
                                    }
                                    table {
                                        width: 100%;
                                        border-collapse: collapse;
                                        margin: 15px 0;
                                    }
                                    th, td {
                                        padding: 10px;
                                        text-align: left;
                                    }
                                    th {
                                        background-color: #f0f0f0;
                                        font-weight: bold;
                                    }
                                    .signature-section {
                                        display: flex;
                                        justify-content: space-between;
                                    }
                                    .signature-block {
                                        width: 40%;
                                    }
                                    .signature-line {
                                        border-top: 1px solid #333;
                                        padding-top: 5px;
                                    }
                                    .page-break {
                                        page-break-after: always;
                                    }
                                    .note {
                                        font-style: italic;
                                        color: #666;
                                    }
                                    .document-header {
                                        padding: 15px;
                                        margin-bottom: 20px;
                                        display: flex;
                                        align-items: center;
                                    }
                                    .document-date {
                                        font-size: 12px;
                                        font-weight: bold;
                                    }
                                    @page {
                                        size: A4;
                                        margin: 25mm 20mm 25mm 20mm;
                                    }

                                    .first-page-header {
                                        position: absolute;
                                        left: 20mm;
                                        font-size: 10pt;
                                        font-family: "Times New Roman", serif;
                                    }

                                    .subtitle {
                                        font-size: 12px;
                                        text-align: center;
                                    }

                                    @page {
                                        size: A4;
                                        margin: 25mm 20mm 25mm 20mm;
                                    }

                                    .first-page-header {
                                        position: absolute;
                                        left: 20mm;
                                        font-family: "Times New Roman", serif;
                                        font-size: 10pt;
                                    }
                                </style>
                            </head>
                            <body>

                                <div class="container">
                                    <h1 class="title">CONTRACT INDIVIDUAL DE MUNCĂ</h1>
                                    <p class="subtitle">încheiat şi înregistrat sub <strong>nr.1780/26.11.2025</strong> în registrul general de evidenţă a salariaţilor</p>

                                    <div class="section">
                                        <div class="section-title">A. Părţile contractului:</div>
                                        <div class="subsection">
                                            <p><strong>Angajator-Persoana juridică</strong> S.C. companie S.R.L., cu sediul în Mun. Botoşani, Str. Vârnav nr. 29 E, Jud. Botosani, înregistrată la Registrul Comerţului din Botoşani, sub nr.J2015000182070/13.05.2015, cod unic de înregistrare 34495770, telefon 0742 359 909, e-mail office@companiecom.ro, reprezentată legal prin Domnul Balîc Ruslan, în calitate de administrator</p>
                                            <p><strong>Salariatul/Salariata</strong> Domnul/Doamna, domiciliat(ă) în Mun.Botoșani, Str. George Enescu nr.3 sc. A, ap.4, Jud. Botoșani, e-mail …-…, posesor/posesoare al/a cărţii de identitate/paşaportului seria ZT nr. 656522, eliberată/eliberat de SPCLEP Botoșani la data de 24.06.2025, CNP 1850406070049</p>
                                        </div>
                                    </div>

                                    <div class="section">
                                        <div class="section-title">B. Obiectul contractului:</div>
                                        <div class="subsection">Angajare. Prestarea de către salariat a muncii corespunzătoare funcţiei/meseriei, pentru și sub autoritatea angajatorului, în condiţiile convenite prin prezentul contract.</div>
                                    </div>

                                    <div class="section">
                                        <div class="section-title">C. Durata contractului:</div>
                                        <div class="list-item">a) nedeterminată, salariatul/salariata urmând să înceapă activitatea la data de 08.12.2025</div>
                                        <div class="list-item">b) determinată, de .......-.......zile/săptămâni/luni, începând cu data de .....…-......... şi până la data de ..........-........</div>
                                    </div>

                                    <div class="section">
                                        <div class="section-title">D. Perioada de probă:</div>
                                        <div class="list-item">a) durata de 90 zile calendaristice, în cazul contractului individual de muncă pe perioadă nedeterminată</div>
                                        <div class="list-item">b) durata de …….zile calendaristice /lucrătoare, în cazul contractului individual de muncă pe perioadă determinată</div>
                                        <div class="list-item">c) condițiile perioadei de probă (dacă există) …-………….</div>
                                    </div>

                                    <div class="section">
                                        <div class="section-title">E. Locul de muncă:</div>
                                        <div class="list-item">1. Activitatea se desfăşoară la Compartiment Producție din Punctul de lucru Roma al S.C. Companie-Com Distribuţie S.R.L.</div>
                                        <div class="list-item">2. În lipsa unui loc de muncă fix salariatul va desfăşura activitatea în alte locuri organizate de angajator.</div>
                                    </div>

                                    <div class="section">
                                        <div class="section-title">F. Felul muncii:</div>
                                        <div class="subsection">Funcţia/Ocupația: inginer industrie alimentară, cod 214514 conform Clasificării Ocupaţiilor din România.</div>
                                    </div>

                                    <div class="section">
                                        <div class="section-title">G. Durata timpului de muncă și repartizarea acestuia:</div>
                                        <div class="list-item">1. O normă întreagă, durata timpului de lucru fiind de 8 ore/zi și 40 ore/săptămână</div>
                                        <div class="subsection list-item">a) Repartizarea programului de lucru se face după cum urmează: 8 ore/zi</div>
                                        <div class="subsection list-item">b) Programul de lucru se poate modifica în condiţiile regulamentului intern/contractului colectiv de muncă aplicabil</div>
                                    </div>

                                    <div class="section">
                                        <div class="section-title">H. Concediul:</div>
                                        <div class="subsection">
                                            <p>Durata concediului anual de odihnă este de 21 zile lucrătoare, în raport cu perioada lucrată.</p>
                                            <p>De asemenea, beneficiază de un concediu suplimentar, cu o durată de ….-…..zile lucrătoare.</p>
                                        </div>
                                    </div>

                                <div class="section">
                                    <div class="section-title">I. Salariul:</div>
                                    <div class="list-item">1. Salariul brut lunar este de _____ lei.</div>
                                    <div class="list-item">2. Elemente constitutive ale salariului brut lunar sunt:
                                        <div class="subsection">
                                            <p>a) Salarul brut de bază lunar de _____ lei</p>
                                            <p>b) Indemnizații .........-.............</p>
                                        </div>
                                    </div>
                                    <div class="list-item">5. Data la care se plătește salariul: 22 ale lunii următoare</div>
                                    <div class="list-item">6. Metoda de plată: salariul se plătește în bani sau prin virament într-un cont bancar</div>
                                </div>

                                <div class="section">
                                    <div class="section-title">J. Alte clauze:</div>
                                    <div class="list-item">a) perioada de preaviz în cazul concedierii este de 20 zile lucrătoare</div>
                                    <div class="list-item">b) perioada de preaviz în cazul demisiei este de 20 zile lucrătoare</div>
                                    <div class="list-item">d) Clauză de confidențialitate în domeniul protecției datelor cu caracter personal</div>
                                </div>

                                <div class="section">
                                    <div class="section-title">K. Atribuțiile postului:</div>
                                    <div class="subsection">Atribuţiile postului sunt prevăzute în fişa postului, anexă la contractul individual de muncă.</div>
                                </div>

                                <div class="section">
                                    <div class="section-title">L. Riscurile specific postului:</div>
                                    <div class="subsection">Riscurile de accidentare și îmbolnăvire profesională specifice postului sunt prevăzute în evaluarile de risc ale locului de muncă.</div>
                                </div>

                                <div class="section">
                                    <div class="section-title">M. Criterii de evaluare a activității profesionale:</div>
                                    <div class="list-item">a) Calitatea lucrărilor</div>
                                    <div class="list-item">b) Randamentul în muncă</div>
                                    <div class="list-item">c) Cunoștințe și aptitudini</div>
                                    <div class="list-item">d) Adaptare profesională</div>
                                    <div class="list-item">e) Disciplina</div>
                                </div>

                                <div class="section">
                                    <div class="section-title">N. Procedura privind utilizarea semnăturii electronice:</div>
                                    <div class="subsection">Se realizează în cazul în care salariatul, în mod regulat și voluntar, își îndeplinește atribuțiile specifice funcției folosind tehnologia informației și comunicațiilor, conform prevederilor actelor normative.</div>
                                </div>

                                <div class="section">
                                    <div class="section-title">O. Formarea profesională:</div>
                                    <div class="subsection">Formarea profesională se realizează prin contracte de calificare profesională pentru dobândirea unei calificări profesionale.</div>
                                </div>

                                <div class="section">
                                    <div class="section-title">P. Condiţiile de muncă:</div>
                                    <div class="subsection">Activitatea se desfăşoară în condiţii normale de muncă, în conformitate cu prevederile legale.</div>
                                </div>

                                <div class="section">
                                    <div class="section-title">Q. Drepturile și obligațiile părților privind securitatea și sănătatea în muncă:</div>
                                    <div class="list-item">a) Echipament individual de protecţie: DA</div>
                                    <div class="list-item">b) Echipament individual de lucru: DA</div>
                                    <div class="list-item">c) Materiale igienico-sanitare: DA</div>
                                    <div class="list-item">d) Alimentaţie de protecţie: DA</div>
                                </div>

                                <div class="section">
                                    <div class="section-title">R. Drepturile şi obligațiile generale ale părților:</div>
                                    <div class="subsection">
                                        <p><strong>1. Drepturi ale salariatului:</strong></p>
                                        <div class="list-item">a) dreptul la salarizare pentru munca depusă</div>
                                        <div class="list-item">b) dreptul la repaus zilnic şi săptămânal</div>
                                        <div class="list-item">c) dreptul la concediu de odihnă anual</div>
                                        <div class="list-item">d) dreptul la egalitate de şanse şi de tratament</div>
                                        <div class="list-item">e) dreptul la securitate şi sănătate în muncă</div>
                                    </div>
                                    <div class="subsection">
                                        <p><strong>2. Obligații ale salariatului:</strong></p>
                                        <div class="list-item">a) obligaţia de a realiza norma de muncă</div>
                                        <div class="list-item">b) obligaţia de a respecta disciplina muncii</div>
                                        <div class="list-item">c) obligaţia de fidelitate faţă de angajator</div>
                                        <div class="list-item">d) obligaţia de a respecta măsurile de securitate şi sănătate</div>
                                    </div>
                                    <div class="subsection">
                                        <p><strong>3. Drepturi ale angajatorului:</strong></p>
                                        <div class="list-item">a) să stabilească atribuțiile de serviciu și norma de muncă</div>
                                        <div class="list-item">b) să dea dispoziții cu caracter obligatoriu</div>
                                        <div class="list-item">c) să exercite controlul asupra modului de îndeplinire</div>
                                        <div class="list-item">d) să constate abaterile disciplinare și să aplice sancțiuni</div>
                                    </div>
                                    <div class="subsection">
                                        <p><strong>4. Obligații ale angajatorului:</strong></p>
                                        <div class="list-item">a) să înmâneze salariatului un exemplar din contract</div>
                                        <div class="list-item">b) să opereze înregistrările prevăzute de lege în REVISAL</div>
                                        <div class="list-item">c) să acorde salariatului toate drepturile ce decurg din contract</div>
                                        <div class="list-item">d) să asigure condiţiile corespunzătoare de muncă</div>
                                    </div>
                                </div>

                                <div class="section">
                                    <div class="section-title">S. Dispoziţii finale:</div>
                                    <div class="list-item">1. Contractul colectiv de muncă aplicabil a fost încheiat la nivelul S.C. Companie-Com Distribuție S.R.L și înregistrat sub nr.53/15.11.2024 la Inspectoratul Teritorial de Muncă al Judeţului Botoșani.</div>
                                    <div class="list-item">2. Prezentul contract individual de muncă s-a încheiat în două exemplare, câte unul pentru fiecare parte.</div>
                                </div>

                                <div class="section">
                                    <div class="section-title">T. Conflictele:</div>
                                    <div class="subsection">Conflictele în legătură cu încheierea, executarea, modificarea, suspendarea sau încetarea prezentului contract pot fi soluționate atât pe cale amiabilă cât și de către instanţa judecătorească competentă, potrivit legii.</div>
                                </div>

                                <div class="signature-section">
                                    <div class="signature-block">
                                        <p><strong>Angajator,</strong></p>
                                        <p>S.C. Companie-Com Distribuţie S.R.L. Botoşani</p>
                                        <p>Reprezentant legal</p>
                                        <div class="signature-line">Semnătura</div>
                                    </div>
                                    <div class="signature-block">
                                        <p><strong>Salariat,</strong></p>
                                        <div class="signature-line">Semnătura</div>
                                        <p style="margin-top: 20px;">Data: ........................</p>
                                    </div>
                                </div>
                            </div>
                        </body>
                    </html>`;
        await page.setContent(html, { waitUntil: "networkidle0" });
        const pdfBuffer = await page.pdf({
                format: "A4",
                displayHeaderFooter: true,

                headerTemplate: `<div></div>`,

               
                footerTemplate: `
                    <div style="
                    font-size:9px;
                    width:100%;
                    text-align:center;
                    font-family:'Times New Roman', serif;
                    padding-bottom:5mm;
                    ">
                    - <span class="pageNumber"></span> -
                    </div>
                `,

                margin: {
                    top: "25mm",
                    bottom: "25mm",
                    left: "20mm",
                    right: "20mm"
                }
            });

    res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": "inline; filename=contract.pdf",
            "Content-Length": pdfBuffer.length
        });

        return res.send(pdfBuffer);

        } catch (error) {
        console.error("Error generating PDF:", error);
        return res.status(500).json({ error: error.message });
        } finally {
        if (browser) await browser.close();
        }
    }
};
