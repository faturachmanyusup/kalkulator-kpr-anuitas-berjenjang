import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AmortizationRow } from '../calculator';

export function exportToXlsx(rows: AmortizationRow[], principal: number, tenorYears: number) {
  const fmt = (n: number) => Math.ceil(n);

  const data = [
    ['Pokok Pinjaman', { t: 'n', v: principal, z: '#,##0' }],
    ['Tenor', `${tenorYears} tahun`],
    [],
    ['Bulan', 'Suku Bunga (%)', 'Angsuran Bunga', 'Angsuran Pokok', 'Angsuran Total', 'Sisa Pokok Pinjaman'],
    ...rows.map((r) => [
      `Bulan ${r.month}`,
      r.rate,
      {
        t: 'n',
        v: fmt(r.interestPayment),
        z: '#,##0',
      },
      {
        t: 'n',
        v: fmt(r.principalPayment),
        z: '#,##0',
      },
      {
        t: 'n',
        v: fmt(r.totalPayment),
        z: '#,##0',
      },
      {
        t: 'n',
        v: fmt(r.remainingPrincipal),
        z: '#,##0',
      },
    ]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [14, 16, 18, 18, 16, 20].map((w) => ({ wch: w }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Angsuran KPR');
  XLSX.writeFile(wb, `kpr-${principal.toLocaleString('id-ID')}.xlsx`);
}

export function exportToPdf(rows: AmortizationRow[], principal: number, tenorYears: number) {
  const fmt = (n: number) => Math.ceil(n).toLocaleString('id-ID');
  const doc = new jsPDF({ orientation: 'portrait', format: 'a4' });

  doc.setFontSize(14);
  doc.text('Rincian Angsuran KPR', 14, 15);
  doc.setFontSize(10);
  doc.text(`Pokok Pinjaman: Rp ${principal.toLocaleString('id-ID')}`, 14, 22);
  doc.text(`Tenor: ${tenorYears} tahun`, 14, 28);

  autoTable(doc, {
    startY: 33,
    head: [['Bulan', 'Suku Bunga (%)', 'Angsuran Bunga', 'Angsuran Pokok', 'Angsuran Total', 'Sisa Pokok Pinjaman']],
    body: rows.map((r) => [
      `Bulan ${r.month}`,
      r.rate,
      fmt(r.interestPayment),
      fmt(r.principalPayment),
      fmt(r.totalPayment),
      fmt(r.remainingPrincipal),
    ]),
    theme: 'grid',
    styles: { fontSize: 8, lineWidth: 0.1, lineColor: [100, 116, 139] },
    headStyles: { fillColor: [37, 99, 235], lineWidth: 0.2, lineColor: [255, 255, 255], halign: 'center' },
    columnStyles: { 0: { halign: 'left' }, 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'right' } },
    didParseCell: (data) => {
      if (data.section === 'head' && data.column.index === 0) data.cell.styles.halign = 'left';
    },
  });

  doc.save(`kpr-${principal.toLocaleString('id-ID')}.pdf`);
}
