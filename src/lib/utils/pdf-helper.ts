import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatKSh = (amount: number) => {
  return `KSh ${amount.toLocaleString('en-KE', { minimumFractionDigits: 0 })}`;
};

export const exportLowStockPDF = (items: any[], propertyName: string) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  let yPosition = 20;

  // ===================================
  // HEADER SECTION
  // ===================================
  doc.setFontSize(22);
  doc.setTextColor(72, 72, 72); // #484848
  doc.text('Shopping List', 14, yPosition);
  
  yPosition += 8;
  doc.setFontSize(16);
  doc.setTextColor(0, 132, 137); // #008489
  doc.text(propertyName, 14, yPosition);
  
  yPosition += 7;
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated: ${date}`, 14, yPosition);
  
  yPosition += 5;
  doc.setTextColor(255, 90, 95); // #FF5A5F (red for urgency)
  doc.setFont('helvetica', 'bold');
  doc.text(`${items.length} items need restocking`, 14, yPosition);
  doc.setFont('helvetica', 'normal');

  // Decorative line
  yPosition += 3;
  doc.setDrawColor(0, 132, 137);
  doc.setLineWidth(0.5);
  doc.line(14, yPosition, 196, yPosition);

  yPosition += 10;

  // ===================================
  // CALCULATE TOTALS
  // ===================================
  let totalItems = 0;
  let totalCost = 0;

  const tableData = items.map(item => {
    const currentStock = Number(item.quantity) || 0;
    const minStock = Number(item.min_stock) || 0;
    const costPerUnit = Number(item.cost_per_unit) || 0;
    
    // Suggested order: Enough to reach 2x minimum stock
    const suggestedOrder = Math.max(0, (minStock * 2) - currentStock);
    const itemCost = suggestedOrder * costPerUnit;
    
    totalItems += suggestedOrder;
    totalCost += itemCost;

    return [
      item.name,
      currentStock.toString(),
      minStock.toString(),
      suggestedOrder.toString(),
      formatKSh(costPerUnit),
      formatKSh(itemCost)
    ];
  });

  // ===================================
  // SUMMARY BOX
  // ===================================
  doc.setFontSize(11);
  doc.setTextColor(72, 72, 72);
  doc.setFont('helvetica', 'bold');
  doc.text('Shopping Summary', 14, yPosition);
  yPosition += 7;

  const summaryData = [
    ['Total Items to Purchase', totalItems.toString()],
    ['Estimated Total Cost', formatKSh(totalCost)]
  ];

  autoTable(doc, {
    startY: yPosition,
    body: summaryData,
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 3
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [100, 100, 100], cellWidth: 60 },
      1: { fontStyle: 'bold', textColor: [0, 132, 137], halign: 'right', cellWidth: 40 }
    }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // ===================================
  // ITEMS TABLE
  // ===================================
  doc.setFontSize(11);
  doc.setTextColor(72, 72, 72);
  doc.setFont('helvetica', 'bold');
  doc.text('Items Needed', 14, yPosition);
  yPosition += 5;

  autoTable(doc, {
    startY: yPosition,
    head: [['Item Name', 'Current', 'Min', 'Order Qty', 'Unit Price', 'Subtotal']],
    body: tableData,
    foot: [[
      { content: 'TOTAL', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } },
      { content: totalItems.toString(), styles: { fontStyle: 'bold', fillColor: [0, 132, 137], textColor: [255, 255, 255] } },
      { content: '', styles: { fillColor: [247, 247, 247] } },
      { content: formatKSh(totalCost), styles: { fontStyle: 'bold', fillColor: [0, 132, 137], textColor: [255, 255, 255] } }
    ]],
    headStyles: {
      fillColor: [0, 132, 137], // #008489
      fontSize: 9,
      fontStyle: 'bold',
      textColor: [255, 255, 255]
    },
    styles: {
      fontSize: 9,
      cellPadding: 4
    },
    columnStyles: {
      0: { cellWidth: 60, fontStyle: 'bold' }, // Item Name
      1: { halign: 'center', cellWidth: 20 },  // Current
      2: { halign: 'center', cellWidth: 20 },  // Min
      3: { halign: 'center', cellWidth: 22, fontStyle: 'bold', fillColor: [255, 250, 240] }, // Order Qty (highlighted)
      4: { halign: 'right', cellWidth: 25 },   // Unit Price
      5: { halign: 'right', cellWidth: 28, fontStyle: 'bold' } // Subtotal
    },
    alternateRowStyles: {
      fillColor: [247, 247, 247]
    },
    footStyles: {
      fillColor: [247, 247, 247],
      textColor: [72, 72, 72],
      fontSize: 10
    },
    didParseCell: function(data) {
      // Highlight items with 0 current stock in red
      if (data.column.index === 1 && data.section === 'body') {
        const currentStock = parseInt(tableData[data.row.index][1]);
        if (currentStock === 0) {
          data.cell.styles.textColor = [255, 90, 95]; // Red
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // ===================================
  // NOTES SECTION
  // ===================================
  if (yPosition < 250) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', 14, yPosition);
    yPosition += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    
    const notes = [
      '• Suggested order quantities are calculated to reach 2× minimum stock levels',
      '• Items with red current stock are completely out of stock (priority)',
      '• Prices shown are based on last recorded cost per unit',
      '• Please verify availability and current prices before ordering'
    ];
    
    notes.forEach(note => {
      doc.text(note, 14, yPosition);
      yPosition += 5;
    });
  }

  // ===================================
  // FOOTER
  // ===================================
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Page number
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
    
    // Branding
    doc.text(
      'Generated by HostFlow',
      doc.internal.pageSize.width - 14,
      doc.internal.pageSize.height - 10,
      { align: 'right' }
    );
    
    // Date
    doc.text(
      date,
      14,
      doc.internal.pageSize.height - 10
    );
  }

  // ===================================
  // SAVE FILE
  // ===================================
  const filename = `Shopping_List_${propertyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};