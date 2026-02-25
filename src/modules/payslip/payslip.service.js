import { PayslipModel } from "./payslip.model.js";
import ExcelJS from "exceljs";

export const PayslipService = {
    
    async getAll() {
        const rows = await PayslipModel.all();
        return rows;
    },

    async findBy(luna, anul, id_firma) {
        const rows = await PayslipModel.findBy(luna, anul, id_firma);
        return rows;
    },

    // PayslipService.js
    async export(req, res, next) {
        try {
            const { luna, anul, id_firma } = req.query;

            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Raport Plati');

            sheet.columns = [
                { header: 'ID',       key: 'id',       width: 10 },
                { header: 'Nume',     key: 'nume',     width: 25 },
                { header: 'Prenume',  key: 'prenume',  width: 25 },
                { header: 'Suma',     key: 'suma',     width: 15 },
                { header: 'Luna',     key: 'luna',     width: 10 },
                { header: 'Anul',     key: 'anul',     width: 10 },
            ];

            const fakeData = [
                { id: 1, nume: 'Ionescu',   prenume: 'Alexandru', suma: 3200, luna, anul },
                { id: 2, nume: 'Popescu',   prenume: 'Maria',     suma: 2800, luna, anul },
                { id: 3, nume: 'Georgescu', prenume: 'Ion',       suma: 4100, luna, anul },
                { id: 4, nume: 'Mihai',     prenume: 'Elena',     suma: 3750, luna, anul },
                { id: 5, nume: 'Constantin',prenume: 'Andrei',    suma: 2950, luna, anul },
            ];

            sheet.addRows(fakeData);

            // Style header row
            sheet.getRow(1).eachCell(cell => {
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF4472C4' },
                };
                cell.alignment = { horizontal: 'center' };
            });

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="Raport_Plati_${luna}_${anul}.xlsx"`
            );

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            next({
                status: 500,
                success: false,
                error: error.message || "Eroare server"
            });
        }
    },

    async excelReports(luna, anul, id_firma) {
        const rows =  await PayslipModel.excelReports(luna, anul, id_firma);
        return rows;
    },

    async getByPayrollType(id_modplata, luna, anul, id_firma) {
        const rows = await PayslipModel.getByPayrollType(id_modplata, luna, anul, id_firma);
        return rows;
    }
};