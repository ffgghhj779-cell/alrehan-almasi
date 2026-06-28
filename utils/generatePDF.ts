import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateProformaInvoice = (
  items: { name: string; quantity: number }[]
) => {
  const doc = new jsPDF();

  doc.setFillColor(29, 78, 216);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('Proforma Invoice', 105, 20, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Al Rehan Almasi - Premium B2B Supply', 105, 28, { align: 'center' });

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 50);
  doc.text(
    'Quote Reference: AR-' + Math.floor(1000 + Math.random() * 9000),
    14,
    58
  );

  const tableData = items.map((item, index) => [
    (index + 1).toString(),
    item.name,
    item.quantity.toString(),
  ]);

  autoTable(doc, {
    startY: 70,
    head: [['#', 'Item Description', 'Quantity']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [249, 115, 22] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { font: 'helvetica', fontSize: 10 },
  });

  const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
    ?.finalY ?? 70;

  doc.setFillColor(22, 163, 74);
  doc.rect(0, 280, 210, 17, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text(
    'For inquiries: info@alrehan-almasi.com | +966 50 000 0000',
    105,
    290,
    { align: 'center' }
  );

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.text('Thank you for your business.', 14, finalY + 20);

  doc.save('AlRehanAlmasi_Quote.pdf');
};
