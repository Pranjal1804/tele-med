"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/patient/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// CHANGED: Replaced non-existent FileCsv icon with FileSpreadsheet
import {
  UploadCloud,
  FileSpreadsheet,
  X,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

type UploadStatus = {
  success: boolean;
  message: string;
};

export default function CSVUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);

  const handleFilesSelected = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      const csvFiles = Array.from(selectedFiles).filter(
        (file) => file.type === "text/csv" || file.name.endsWith(".csv")
      );
      setFiles((prevFiles) => [...prevFiles, ...csvFiles]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    handleFilesSelected(event.dataTransfer.files);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!files.length) {
      setUploadStatus({
        success: false,
        message: "Please select at least one CSV file to upload.",
      });
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    setIsUploading(true);
    try {
      const response = await fetch("https://pharma-find.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "An unknown error occurred during upload."
        );
      }

      setUploadStatus({
        success: true,
        message: data.message || "Files processed successfully!",
      });
      setFiles([]);
    } catch (error: any) {
      setUploadStatus({ success: false, message: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/5">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-balance">
              Upload Store Inventory
            </h1>
            <p className="text-muted-foreground">
              Upload CSV files containing store names, medicine lists, and
              locations.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>File Uploader</CardTitle>
              <CardDescription>
                Drag and drop your CSV files or click to browse.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <label
                htmlFor="file-upload"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                  ${
                    isDragOver
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-accent/50"
                  }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                  <UploadCloud
                    className={`w-10 h-10 mb-3 ${
                      isDragOver ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <p className="mb-2 text-sm font-semibold">
                    {isDragOver
                      ? "Drop your files here!"
                      : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    CSV files only
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />
              </label>

              {files.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Selected Files:</h3>
                  <div className="space-y-2 rounded-md border p-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-accent/50 p-2 rounded-md"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          {/* CHANGED: Replaced non-existent FileCsv icon */}
                          <FileSpreadsheet className="w-4 h-4 text-primary" />
                          <span className="font-mono">{file.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={isUploading || files.length === 0}
                className="w-full"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Uploading...
                  </>
                ) : (
                  `Upload ${files.length} File(s)`
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <AlertDialog
        open={!!uploadStatus}
        onOpenChange={() => setUploadStatus(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {uploadStatus?.success ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-destructive" />
              )}
              {uploadStatus?.success ? "Upload Successful" : "Upload Failed"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {uploadStatus?.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setUploadStatus(null)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
