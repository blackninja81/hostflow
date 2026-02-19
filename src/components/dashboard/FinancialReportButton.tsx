'use client';

import { useState } from 'react';
import { FileText, Download, ChevronDown } from 'lucide-react';
import { exportFinancialReportPDF } from '../../lib/utils/report-generator';

interface FinancialReportButtonProps {
  property: any;
  inventory: any[];
  logs: any[];
  bookings: any[];
  selectedYear: string;
}

export default function FinancialReportButton({
  property,
  inventory,
  logs,
  bookings,
  selectedYear
}: FinancialReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const handleGenerateReport = async (period: 'monthly' | 'quarterly' | 'yearly', selectedMonth?: number) => {
    setIsGenerating(true);
    setIsOpen(false);
    setShowMonthPicker(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      exportFinancialReportPDF({
        propertyName: property.name,
        year: selectedYear,
        period: selectedMonth !== undefined ? 'single-month' : period,
        bookings,
        logs,
        inventory,
        selectedMonth
      });
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isGenerating}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#008489] text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-[#006d73] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <FileText size={18} />
            Export Report
            <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && !isGenerating && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-20 animate-scale-in">
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider">
                Select Report Type
              </p>
            </div>

            <div className="p-2">
              {/* Monthly Report */}
              <button
                onClick={() => handleGenerateReport('monthly')}
                className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-teal-50 transition-all group text-left"
              >
                <div className="p-2 rounded-lg bg-teal-50 text-[#008489] group-hover:bg-[#008489] group-hover:text-white transition-all shrink-0">
                  <FileText size={16} />
                </div>
                <div>
                  <p className="font-black text-sm text-[#484848] mb-0.5">
                    Monthly Breakdown
                  </p>
                  <p className="text-xs text-gray-500">
                    12-month detailed analysis for {selectedYear}
                  </p>
                </div>
              </button>

              {/* Single Month Report */}
              <div className="relative">
                <button
                  onClick={() => setShowMonthPicker(!showMonthPicker)}
                  className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-teal-50 transition-all group text-left"
                >
                  <div className="p-2 rounded-lg bg-teal-50 text-[#008489] group-hover:bg-[#008489] group-hover:text-white transition-all shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-sm text-[#484848] mb-0.5">
                      Single Month Report
                    </p>
                    <p className="text-xs text-gray-500">
                      Detailed report for a specific month
                    </p>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-400 transition-transform ${showMonthPicker ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Month Picker Submenu */}
                {showMonthPicker && (
                  <div className="ml-4 mt-1 p-2 bg-gray-50 rounded-lg grid grid-cols-3 gap-1">
                    {months.map((month, index) => (
                      <button
                        key={month}
                        onClick={() => handleGenerateReport('monthly', index)}
                        className="px-2 py-1.5 text-xs font-bold text-gray-600 hover:bg-[#008489] hover:text-white rounded transition-all"
                      >
                        {month.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quarterly Report */}
              <button
                onClick={() => handleGenerateReport('quarterly')}
                className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-teal-50 transition-all group text-left"
              >
                <div className="p-2 rounded-lg bg-teal-50 text-[#008489] group-hover:bg-[#008489] group-hover:text-white transition-all shrink-0">
                  <FileText size={16} />
                </div>
                <div>
                  <p className="font-black text-sm text-[#484848] mb-0.5">
                    Quarterly Summary
                  </p>
                  <p className="text-xs text-gray-500">
                    Q1-Q4 financial overview for {selectedYear}
                  </p>
                </div>
              </button>

              {/* Yearly Report */}
              <button
                onClick={() => handleGenerateReport('yearly')}
                className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-teal-50 transition-all group text-left"
              >
                <div className="p-2 rounded-lg bg-teal-50 text-[#008489] group-hover:bg-[#008489] group-hover:text-white transition-all shrink-0">
                  <FileText size={16} />
                </div>
                <div>
                  <p className="font-black text-sm text-[#484848] mb-0.5">
                    Annual Report
                  </p>
                  <p className="text-xs text-gray-500">
                    Complete {selectedYear} financial summary
                  </p>
                </div>
              </button>
            </div>

            {/* Footer Tip */}
            <div className="p-3 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <Download size={12} />
                Reports download as PDF
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}