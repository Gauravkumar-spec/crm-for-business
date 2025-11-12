import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportLeadsToExcel = (leads) => {
  const worksheetData = [
    [
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
    ],
  ];

  leads.forEach((lead, index) => {
    worksheetData.push([
      index + 1,
      lead.name || "",
      lead.mobile || "",
      lead.email || "",
      lead.requirement || "",
      lead.property_type || "",
      lead.budget_min || "",
      lead.budget_max || "",
      lead.preferred_location || "",
      lead.source || "",
      lead.follow_up_date || "",
      lead.notes || "",
      lead.agent_email || "",
      lead.client_id || "",
      new Date().toLocaleString(),
    ]);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  worksheet["!cols"] = worksheetData[0].map((c) => ({ wch: c.length + 5 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "Leads.xlsx");
};
