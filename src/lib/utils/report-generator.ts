import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper function to format currency
const formatKSh = (amount: number) => {
  return `KSh ${amount.toLocaleString('en-KE', { minimumFractionDigits: 0 })}`;
};

// Helper function to get month name
const getMonthName = (monthIndex: number) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months[monthIndex];
};

// Helper function to get quarter name
const getQuarterName = (quarterIndex: number) => {
  return `Q${quarterIndex + 1}`;
};

interface ReportData {
  propertyName: string;
  year: string;
  period: string; // 'monthly', 'quarterly', 'yearly'
  bookings: any[];
  logs: any[];
  inventory: any[];
}

export const exportFinancialReportPDF = (data: ReportData) => {
  const doc = new jsPDF();
  const generatedDate = new Date().toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // ===================================
  // FILTER DATA BY SELECTED YEAR FIRST
  // ===================================
  const yearFilteredBookings = data.bookings.filter((b: any) => {
    const bookingYear = new Date(b.check_in).getFullYear().toString();
    return bookingYear === data.year;
  });

  const yearFilteredLogs = data.logs.filter((l: any) => {
    const logYear = new Date(l.transaction_date || l.created_at).getFullYear().toString();
    return logYear === data.year;
  });

  let yPosition = 20;

  // ===================================
  // HEADER SECTION
  // ===================================
  doc.setFontSize(22);
  doc.setTextColor(72, 72, 72); // #484848
  doc.text('HostFlow Financial Report', 14, yPosition);
  
  yPosition += 8;
  doc.setFontSize(16);
  doc.setTextColor(0, 132, 137); // #008489
  doc.text(data.propertyName, 14, yPosition);
  
  yPosition += 7;
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(`Year: ${data.year}`, 14, yPosition);
  
  yPosition += 5;
  doc.text(`Report Type: ${data.period.charAt(0).toUpperCase() + data.period.slice(1)}`, 14, yPosition);
  
  yPosition += 5;
  doc.text(`Generated: ${generatedDate}`, 14, yPosition);

  // Decorative line
  yPosition += 3;
  doc.setDrawColor(0, 132, 137);
  doc.setLineWidth(0.5);
  doc.line(14, yPosition, 196, yPosition);

  yPosition += 10;

  // ===================================
  // CALCULATE FINANCIALS BY PERIOD
  // ===================================
  let breakdownData: any[] = [];

  if (data.period === 'monthly') {
    // Monthly breakdown (12 months) - using year-filtered data
    for (let month = 0; month < 12; month++) {
      const monthBookings = yearFilteredBookings.filter(b => {
        const date = new Date(b.check_in);
        return date.getMonth() === month;
      });

      const monthLogs = yearFilteredLogs.filter(l => {
        const date = new Date(l.transaction_date || l.created_at);
        return date.getMonth() === month;
      });

      const revenue = monthBookings.reduce((sum, b) => sum + (Number(b.payout_amount) || 0), 0);
      const expenses = monthLogs.reduce((sum, l) => 
        sum + (Number(l.price_at_time || 0) * Number(l.quantity || 1)), 0
      );
      const profit = revenue - expenses;
      const margin = revenue > 0 ? ((profit / revenue) * 100) : 0;

      breakdownData.push({
        period: getMonthName(month),
        bookings: monthBookings.length,
        revenue,
        expenses,
        profit,
        margin: margin.toFixed(1) + '%'
      });
    }
  } else if (data.period === 'quarterly') {
    // Quarterly breakdown (4 quarters) - using year-filtered data
    for (let quarter = 0; quarter < 4; quarter++) {
      const startMonth = quarter * 3;
      const endMonth = startMonth + 2;

      const quarterBookings = yearFilteredBookings.filter(b => {
        const month = new Date(b.check_in).getMonth();
        return month >= startMonth && month <= endMonth;
      });

      const quarterLogs = yearFilteredLogs.filter(l => {
        const month = new Date(l.transaction_date || l.created_at).getMonth();
        return month >= startMonth && month <= endMonth;
      });

      const revenue = quarterBookings.reduce((sum, b) => sum + (Number(b.payout_amount) || 0), 0);
      const expenses = quarterLogs.reduce((sum, l) => 
        sum + (Number(l.price_at_time || 0) * Number(l.quantity || 1)), 0
      );
      const profit = revenue - expenses;
      const margin = revenue > 0 ? ((profit / revenue) * 100) : 0;

      breakdownData.push({
        period: `${getQuarterName(quarter)} (${getMonthName(startMonth)} - ${getMonthName(endMonth)})`,
        bookings: quarterBookings.length,
        revenue,
        expenses,
        profit,
        margin: margin.toFixed(1) + '%'
      });
    }
  } else {
    // Yearly summary (single row) - using year-filtered data
    const revenue = yearFilteredBookings.reduce((sum, b) => sum + (Number(b.payout_amount) || 0), 0);
    const expenses = yearFilteredLogs.reduce((sum, l) => 
      sum + (Number(l.price_at_time || 0) * Number(l.quantity || 1)), 0
    );
    const profit = revenue - expenses;
    const margin = revenue > 0 ? ((profit / revenue) * 100) : 0;

    breakdownData.push({
      period: `Full Year ${data.year}`,
      bookings: yearFilteredBookings.length,
      revenue,
      expenses,
      profit,
      margin: margin.toFixed(1) + '%'
    });
  }

  // ===================================
  // SUMMARY STATISTICS (using year-filtered data)
  // ===================================
  const totalRevenue = breakdownData.reduce((sum, row) => sum + row.revenue, 0);
  const totalExpenses = breakdownData.reduce((sum, row) => sum + row.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const totalBookings = yearFilteredBookings.length;
  const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

  doc.setFontSize(11);
  doc.setTextColor(72, 72, 72);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary Statistics', 14, yPosition);
  yPosition += 7;

  const summaryData = [
    ['Total Revenue', formatKSh(totalRevenue)],
    ['Total Expenses', formatKSh(totalExpenses)],
    ['Net Profit', formatKSh(totalProfit)],
    ['Total Bookings', totalBookings.toString()],
    ['Average Booking Value', formatKSh(avgBookingValue)],
    ['Profit Margin', totalRevenue > 0 ? `${((totalProfit / totalRevenue) * 100).toFixed(1)}%` : '0%']
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
      0: { fontStyle: 'bold', textColor: [100, 100, 100] },
      1: { fontStyle: 'bold', textColor: [0, 132, 137], halign: 'right' }
    }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // ===================================
  // PERIOD BREAKDOWN TABLE
  // ===================================
  doc.setFontSize(11);
  doc.setTextColor(72, 72, 72);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.period.charAt(0).toUpperCase() + data.period.slice(1)} Breakdown`, 14, yPosition);
  yPosition += 5;

  autoTable(doc, {
    startY: yPosition,
    head: [['Period', 'Bookings', 'Revenue', 'Expenses', 'Profit', 'Margin']],
    body: breakdownData.map(row => [
      row.period,
      row.bookings.toString(),
      formatKSh(row.revenue),
      formatKSh(row.expenses),
      formatKSh(row.profit),
      row.margin
    ]),
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
      0: { cellWidth: 50, fontStyle: 'bold' },
      1: { halign: 'center', cellWidth: 20 },
      2: { halign: 'right', cellWidth: 28 },
      3: { halign: 'right', cellWidth: 28 },
      4: { halign: 'right', cellWidth: 28, fontStyle: 'bold' },
      5: { halign: 'center', cellWidth: 20 }
    },
    alternateRowStyles: {
      fillColor: [247, 247, 247]
    },
    didParseCell: function(data) {
      // Color profit cells based on positive/negative
      if (data.column.index === 4 && data.section === 'body') {
        const profitValue = breakdownData[data.row.index].profit;
        if (profitValue > 0) {
          data.cell.styles.textColor = [34, 139, 34]; // Green
        } else if (profitValue < 0) {
          data.cell.styles.textColor = [255, 90, 95]; // #FF5A5F (Red)
        }
      }
    }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // ===================================
  // TOP EXPENSE CATEGORIES (if space) - using year-filtered data
  // ===================================
  if (yPosition < 240) {
    const expenseByCategory = yearFilteredLogs.reduce((acc: any, log: any) => {
      const category = log.item_name || 'Other';
      const cost = Number(log.price_at_time || 0) * Number(log.quantity || 1);
      acc[category] = (acc[category] || 0) + cost;
      return acc;
    }, {});

    const topExpenses = Object.entries(expenseByCategory)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, amount]: any) => [name, formatKSh(amount)]);

    if (topExpenses.length > 0) {
      doc.setFontSize(11);
      doc.setTextColor(72, 72, 72);
      doc.setFont('helvetica', 'bold');
      doc.text('Top Expense Categories', 14, yPosition);
      yPosition += 5;

      autoTable(doc, {
        startY: yPosition,
        head: [['Category', 'Amount']],
        body: topExpenses,
        headStyles: {
          fillColor: [255, 90, 95], // #FF5A5F
          fontSize: 9,
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        columnStyles: {
          0: { cellWidth: 100 },
          1: { halign: 'right', fontStyle: 'bold' }
        },
        alternateRowStyles: {
          fillColor: [247, 247, 247]
        }
      });
    }
  }

  // ===================================
  // FOOTER
  // ===================================
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
    doc.text(
      'Generated by HostFlow',
      doc.internal.pageSize.width - 14,
      doc.internal.pageSize.height - 10,
      { align: 'right' }
    );
  }

  // ===================================
  // SAVE FILE
  // ===================================
  const filename = `HostFlow_${data.propertyName.replace(/\s+/g, '_')}_${data.period}_${data.year}.pdf`;
  doc.save(filename);
};

// ===================================
// EXPORT SHOPPING LIST (Existing)
// ===================================
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
      Math.max(0, (item.min_stock * 2) - item.quantity).toString()
    ]),
    headStyles: {
      fillColor: [0, 132, 137], // #008489
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