export const exportToPDF = (data) => {
  const doc = new jsPDF();
  doc.text('ZoomETF - Rapport', 10, 10);
  doc.autoTable({ html: '#etf-table' });
  doc.save('rapport.pdf');
};