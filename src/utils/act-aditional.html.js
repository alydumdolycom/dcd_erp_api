// src/templates/act-aditional.html.js
export function actAditionalTemplate() {
  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: "Times New Roman", serif;
      font-size: 14px;
      line-height: 1.6;
      margin: 40px;
    }

    .center {
      text-align: center;
      font-weight: bold;
    }

    .right {
      text-align: right;
    }

    .section {
      margin-top: 20px;
    }

    ul {
      margin-left: 40px;
    }

    .signatures {
      margin-top: 80px;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>

  <div class="right">
    Nr. 2 / 25.02.2026
  </div>

  <h2 class="center">ACT ADIȚIONAL</h2>

  <p class="center">
    de modificare a contractului individual de muncă<br/>
    înregistrat la ITM 2 sub nr. 25.02.2026
  </p>

  <div class="section">
    <p>
      Subsemnatul <b>Manager General</b>, Manager General al
      <b>DISTRIBUTIE SRL</b>, prin prezenta, decid conform art. 41 alin. (3)
      lit. e din Codul Muncii modificarea salariului brut al d-lui/d-nei
      <b>angajat</b>, angajat al societății noastre, de la
      <b>lei</b> la <b>lei</b>,
      începând cu data de <b>01/09/2025</b>.
    </p>
  </div>

  <div class="section">
    <p>Salariul lunar brut în valoare de <b>lei</b> este format din:</p>
    <ul>
      <li>salariul de bază brut: lei;</li>
      <li>spor de vechime: lei;</li>
      <li>spor de repaus săptămânal: lei;</li>
    </ul>
  </div>

  <div class="section">
    <p>
      Salariul se plătește în bani sau prin virament într-un cont bancar, după caz,
      iar data la care se plătește salariul este de 22 ale lunii următoare.
    </p>
  </div>

  <div class="section">
    <p>
      Prezentul act adițional s-a întocmit în 3 exemplare originale,
      două pentru angajator și unul pentru salariat.
    </p>
  </div>

  <div class="signatures">
    <div>
      <b>Angajator</b><br/>
      DISTRIBUTIE SRL
    </div>
    <div>
      <b>Salariat</b><br/>
      angajat
    </div>
  </div>

</body>
</html>
`;
}
