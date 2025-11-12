import { useState } from "react";
import * as XLSX from "xlsx";
import { FiUpload, FiEdit3, FiSave } from "react-icons/fi";
import { saveAs } from "file-saver";

const REQUIRED_HEADERS = [
  "agent_email",
  "property_type",
  "property_category",
  "title",
  "location",
  "size_sqft",
  "carpet_area",
  "buildup_area",
  "bhk",
  "floor",
  "total_floor",
  "facing",
  "furnishing",
  "price",
  "maintenance",
  "expected_value",
  "availability",
  "builder",
  "description",
  "covered_parking",
  "open_parking",
  "bathroom",
  "brokerage",
  "images",
  "video",
  "facilities",
  "property_age",
];

function UploadExcelPage() {
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [editingCell, setEditingCell] = useState({ row: null, col: null });
  const [editValue, setEditValue] = useState("");

  // 🟩 Handle File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    const fileType = file.name.split(".").pop().toLowerCase();
    setFileName(file.name);

    if (!["xlsx", "csv", "tsv"].includes(fileType)) {
      setError("Only Excel, CSV, or TSV files are allowed.");
      return;
    }

    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const ws = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(ws, { defval: null });

      if (jsonData.length === 0) {
        setError("Uploaded sheet is empty!");
        return;
      }

      const normalizedRows = jsonData.map((row) => {
        const normalized = {};
        REQUIRED_HEADERS.forEach((header) => {
          normalized[header] = row[header] ?? null;
        });
        return normalized;
      });

      setRows(normalizedRows);
      setError("");
    };

    reader.readAsBinaryString(file);
  };

  // 🟦 Handle Double Click to Edit
  const handleDoubleClick = (rowIndex, col) => {
    setEditingCell({ row: rowIndex, col });
    setEditValue(rows[rowIndex][col] ?? "");
  };

  // 🟧 Handle Input Change in Edit Mode
  const handleInputChange = (e) => {
    setEditValue(e.target.value);
  };

  // 🟥 Handle Blur or Enter to Save Edit
  const handleSaveEdit = (rowIndex, col) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][col] = editValue;
    setRows(updatedRows);
    setEditingCell({ row: null, col: null });
  };

  // 🟩 Export Updated Data to Excel
  const handleSaveToExcel = () => {
    const worksheetData = [REQUIRED_HEADERS];
    rows.forEach((row) => {
      worksheetData.push(REQUIRED_HEADERS.map((h) => row[h] ?? ""));
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Properties");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "Updated_Properties.xlsx");
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FiUpload /> Upload Excel/CSV File
          </h2>
          <p className="text-sm text-gray-500">
            Upload a property list with all required headers. Double-click any cell to edit. Missing fields show in red.
          </p>
        </div>

        <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Choose File
          <input
            type="file"
            accept=".xlsx,.csv,.tsv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {fileName && (
        <p className="text-gray-600 text-sm mb-3">
          📄 Uploaded File: <span className="font-medium">{fileName}</span>
        </p>
      )}

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {rows.length > 0 && (
        <>
          {/* Save Button */}
          <div className="flex justify-end mb-3">
            <button
              onClick={handleSaveToExcel}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <FiSave /> Save Changes
            </button>
          </div>

          {/* Table */}
          <div className="overflow-auto max-h-[70vh] border rounded-lg">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  {REQUIRED_HEADERS.map((header, idx) => (
                    <th
                      key={idx}
                      className="border px-3 py-2 text-left text-sm font-semibold text-gray-700"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {REQUIRED_HEADERS.map((header, j) => {
                      const isEditing = editingCell.row === i && editingCell.col === header;
                      const value = row[header];

                      return (
                        <td
                          key={j}
                          onDoubleClick={() => handleDoubleClick(i, header)}
                          className={`border px-3 py-2 text-sm cursor-pointer ${
                            value === null || value === ""
                              ? "bg-red-100 text-red-700"
                              : "text-gray-800"
                          }`}
                        >
                          {isEditing ? (
                            <input
                              type="text"
                              value={editValue}
                              onChange={handleInputChange}
                              onBlur={() => handleSaveEdit(i, header)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveEdit(i, header);
                              }}
                              autoFocus
                              className="w-full border px-2 py-1 text-sm rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          ) : (
                            value ?? "null"
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default UploadExcelPage;
