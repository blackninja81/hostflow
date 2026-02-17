import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportLowStockPDF = (items: any[], propertyName: string) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString('en-KE');

  // Header Section
  doc.setFontSize(20);
  doc.setTextColor(72, 72, 72); // #484848
  doc.text(`Restock List: ${propertyName}`, 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text(`Generated on: ${date}`, 14, 30);

  // Table Generation
  autoTable(doc, {
    startY: 40,
    head: [['Item Name', 'Current Stock', 'Min. Threshold', 'Suggested Order']],
    body: items.map(item => [
      item.name,
      item.quantity.toString(),
      item.min_stock.toString(),
      // Logic: Order enough to reach double the min stock
      Math.max(0, (item.min_stock * 2) - item.quantity).toString()
    ]),
    headStyles: { 
      fillColor: [0, 132, 137], // This is your #008489 brand color
      fontSize: 10,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [247, 247, 247]
    },
    margin: { top: 40 }
  });

  doc.save(`Shopping_List_${propertyName.replace(/\s+/g, '_')}.pdf`);
};