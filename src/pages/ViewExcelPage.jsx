import { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";

const FIXED_HEADERS = [
  "Lead ID",
  "Full Name",
  "Mobile",
  "Email",
  "Requirement",
  "Property Type",
  "Budget Min (₹)",
  "Budget Max (₹)",
  "Preferred Location",
  "Lead Source",
  "Follow-up Date",
  "Notes",
  "Agent Email",
  "Client ID",
  "Created At",
];

function ViewExcelPage() {
  const [sheetData, setSheetData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [edited, setEdited] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const tableContainerRef = useRef(null);

  // Load Excel data from sessionStorage
  useEffect(() => {
    const fileData = sessionStorage.getItem("excelFile");
    if (!fileData) {
      console.warn("No Excel file found in sessionStorage!");
      setIsLoading(false);
      return;
    }

    try {
      const wb = XLSX.read(fileData, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      let data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      if (data.length > 0) data = data.slice(1);

      const formatted = data.map((row, i) => {
        const filled = FIXED_HEADERS.map((_, j) => row[j] || null);
        filled[0] = i + 1;
        return filled;
      });

      setSheetData([FIXED_HEADERS, ...formatted]);
      setFilteredData([FIXED_HEADERS, ...formatted]);
    } catch (error) {
      console.error("Error reading Excel file:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchTerm) {
      const filtered = sheetData.filter((row, idx) => {
        if (idx === 0) return true;
        return row.some((cell) =>
          String(cell || "").toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(sheetData);
    }
  }, [searchTerm, sheetData]);

  // Handle cell edit
  const handleCellEdit = (rowIdx, colIdx, newValue) => {
    const newData = [...sheetData];
    newData[rowIdx][colIdx] = newValue;
    setSheetData(newData);
    setFilteredData(newData);
    setEdited(true);
  };

  // Save Excel
  const handleSave = () => {
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");
    XLSX.writeFile(wb, "Updated_Leads.xlsx");
    setEdited(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    const csv = sheetData
      .map((row) =>
        row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Leads.csv";
    link.click();
  };

  // Handle scroll events
  const handleScroll = () => {
    setIsScrolling(true);
    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Processing Excel data...</p>
          <p className="text-slate-400 text-sm mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  const headers = filteredData[0] || [];
  const rows = filteredData.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Enhanced Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Lead Sheet
              </h3>
              <p className="text-slate-500 text-sm">Manage and analyze your lead data</p>
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search Data
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search across all columns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                />
                <svg
                  className="w-5 h-5 absolute left-3 top-3 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handleExportCSV}
                className="w-full flex items-center justify-center px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 group"
              >
                <svg className="w-4 h-4 mr-2 text-slate-600 group-hover:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>

              <button
                onClick={handleSave}
                disabled={!edited}
                className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  edited
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                <svg className={`w-4 h-4 mr-2 ${edited ? 'text-white' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {edited ? "Save Changes" : "All Changes Saved"}
              </button>
            </div>

            {/* Enhanced Stats */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Dataset Overview</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Total Records</span>
                  <span className="font-semibold text-slate-900 bg-white px-2 py-1 rounded text-sm">
                    {rows.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Columns</span>
                  <span className="font-semibold text-slate-900 bg-white px-2 py-1 rounded text-sm">
                    {headers.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Search Results</span>
                  <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded text-sm">
                    {filteredData.length - 1}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700">
                💡 <strong>Tip:</strong> Click on any cell to edit its content directly
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Main Table Area */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Lead Data Table</h3>
                <p className="text-slate-500 text-sm mt-1">
                  {rows.length} records • {headers.length} columns
                  {searchTerm && ` • Filtered by: "${searchTerm}"`}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${edited ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                <span className="text-sm text-slate-500">
                  {edited ? 'Unsaved changes' : 'All changes saved'}
                </span>
              </div>
            </div>

            {/* Enhanced Table Container with Custom Scrollbars */}
            <div 
              ref={tableContainerRef}
              className="relative w-full h-[70vh] overflow-auto bg-slate-50"
              onScroll={handleScroll}
            >
              {/* Custom scrollbar styling */}
              <style jsx>{`
                .scroll-container::-webkit-scrollbar {
                  width: 12px;
                  height: 12px;
                }
                .scroll-container::-webkit-scrollbar-track {
                  background: #f1f5f9;
                  border-radius: 6px;
                }
                .scroll-container::-webkit-scrollbar-thumb {
                  background: #cbd5e1;
                  border-radius: 6px;
                  border: 2px solid #f1f5f9;
                }
                .scroll-container::-webkit-scrollbar-thumb:hover {
                  background: #94a3b8;
                }
              `}</style>

              <div className="scroll-container min-w-full inline-block">
                <table className="min-w-full border-collapse">
                  <thead className="bg-slate-50 sticky top-0 z-20">
                    <tr>
                      {headers.map((col, idx) => (
                        <th
                          key={idx}
                          className="border-b border-r border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-900 bg-slate-50/95 backdrop-blur-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate max-w-[120px]">{col}</span>
                            <svg className="w-4 h-4 text-slate-400 opacity-0 hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                            </svg>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {rows.map((row, i) => (
                      <tr 
                        key={i} 
                        className={`hover:bg-slate-50 transition-colors duration-150 ${
                          selectedRow === i ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                        }`}
                        onClick={() => setSelectedRow(i)}
                      >
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className={`border-r border-slate-200 px-4 py-3 text-sm transition-all duration-150 ${
                              !cell 
                                ? 'text-red-600 font-medium bg-red-50' 
                                : 'text-slate-900 hover:bg-white'
                            } ${
                              selectedRow === i ? 'bg-blue-50' : ''
                            }`}
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onBlur={(e) =>
                              handleCellEdit(i + 1, j, e.target.textContent)
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                e.target.blur();
                              }
                            }}
                          >
                            <div className="min-h-[20px] flex items-center">
                              {cell || (
                                <span className="text-red-400 italic">NULL</span>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {rows.length === 0 && (
                  <div className="text-center py-16">
                    <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-slate-500 text-lg font-medium mb-2">No data found</p>
                    <p className="text-slate-400 text-sm">
                      {searchTerm ? 'Try adjusting your search terms' : 'The uploaded Excel file appears to be empty'}
                    </p>
                  </div>
                )}
              </div>

              {/* Scroll Indicator */}
              {isScrolling && (
                <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-3 py-1 rounded-full text-xs font-medium opacity-90 z-30">
                  Scrolling...
                </div>
              )}
            </div>

            {/* Table Footer */}
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-sm text-slate-600">
              <div>
                Showing <span className="font-semibold text-slate-900">{rows.length}</span> records
              </div>
              <div className="flex items-center space-x-4">
                <span>Last column: {headers[headers.length - 1]}</span>
                <span className="text-slate-400">|</span>
                <span>Editable cells</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewExcelPage;