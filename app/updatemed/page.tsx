"use client";

import { useState } from "react";

export default function CSVUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = async () => {
    if (!files.length) {
      alert("Please select at least one CSV file.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    try {
      setIsUploading(true);
      const response = await fetch("http://localhost:3005/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setSuccessMessage(data.message || "CSV uploaded successfully!");
      setFiles([]);
    } catch (error) {
      console.error(error);
      setSuccessMessage("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const closePopup = () => setSuccessMessage(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload CSV Files</h1>

      <input
        type="file"
        accept=".csv"
        multiple
        onChange={handleFileChange}
        className="mb-4 block w-full text-sm text-gray-700 border border-gray-300 rounded p-2"
      />

      {files.length > 0 && (
        <div className="mb-4">
          <strong>Selected files:</strong>
          <ul className="list-disc list-inside">
            {files.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={isUploading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isUploading ? "Uploading..." : "Upload CSV(s)"}
      </button>

      {/* Popup message */}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <p className="mb-4">{successMessage}</p>
            <button
              onClick={closePopup}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
