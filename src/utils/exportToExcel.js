import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportPropertiesToExcel = (properties) => {
  if (!properties || properties.length === 0) {
    alert("No properties available to export!");
    return;
  }

  const worksheetData = [
    [
      "Property ID",
      "Agent Email",
      "Property Type",
      "Property Category",
      "Title",
      "Location",
      "Size (sqft)",
      "Carpet Area",
      "Buildup Area",
      "BHK",
      "Floor",
      "Total Floors",
      "Facing",
      "Furnishing",
      "Price",
      "Maintenance",
      "Expected Value",
      "Availability",
      "Builder",
      "Description",
      "Covered Parking",
      "Open Parking",
      "Bathroom",
      "Brokerage",
      "Images",
      "Video",
      "Facilities",
      "Property Age",
      "Client ID",
      "Created At",
    ],
  ];

  properties.forEach((p, index) => {
    worksheetData.push([
      p.property_id || index + 1,
      p.agent_email || "",
      p.property_type || "",
      p.property_category || "",
      p.title || "",
      p.location || "",
      p.size_sqft || "",
      p.carpet_area || "",
      p.buildup_area || "",
      p.bhk || "",
      p.floor || "",
      p.total_floor || "",
      p.facing || "",
      p.furnishing || "",
      p.price || "",
      p.maintenance || "",
      p.expected_value || "",
      p.availability || "",
      p.builder || "",
      p.description || "",
      p.covered_parking || "",
      p.open_parking || "",
      p.bathroom || "",
      p.brokerage || "",
      Array.isArray(p.images) ? p.images.join(", ") : p.images || "",
      p.video || "",
      Array.isArray(p.facilities) ? p.facilities.join(", ") : p.facilities || "",
      p.property_age || "",
      p.client_id || "",
      new Date().toLocaleString(),
    ]);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  worksheet["!cols"] = worksheetData[0].map((c) => ({ wch: c.length + 5 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Properties");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "Properties.xlsx");
};
