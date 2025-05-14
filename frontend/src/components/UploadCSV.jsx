import { useState } from "react";
import Papa from "papaparse";
import api from "../services/api";

import LoadingSpinner from "./LoadingSpinner";

export default function UploadCSV({ onCsvUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    try {
      // ✅ Parse CSV to JSON rows using PapaParse
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const parsedData = results.data;

          // Upload to backend
          const formData = new FormData();
          formData.append("file", file);
          await api.post("/upload_csv", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          

          alert("✅ CSV Uploaded Successfully");

          // Send first few rows + metadata to parent
          if (onCsvUpload) {
            onCsvUpload({
              data: parsedData.slice(0, 5), // First 5 rows
              meta: {
                rowCount: parsedData.length,
                columnCount: parsedData[0] ? Object.keys(parsedData[0]).length : 0,
                columns: parsedData[0] ? Object.keys(parsedData[0]) : [],
              }
            });
          }
        },
        error: (error) => {
          console.error("Parsing error:", error);
          alert("❌ Failed to parse CSV.");
        },
      });
    } catch (error) {
      console.error(error);
      alert("❌ Failed to upload CSV.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">📄 Upload CSV File</h2>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        {loading ? <LoadingSpinner /> : "Upload"}
      </button>
    </div>
  );
}
