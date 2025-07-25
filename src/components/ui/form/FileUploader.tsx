import React from "react";
import { useDropzone } from "react-dropzone";
import { FieldError } from "react-hook-form";
import { IoCloudUpload } from "react-icons/io5";

interface FileUploaderProps {
  onFileUpload: (file: File | string) => void;
  acceptedFormats?: string[];
  label?: string;
  file?: File | string;
  error?: FieldError;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUpload,
  acceptedFormats = [
    "image/jpeg",
    "image/png",

    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    "application/postscript",
    "image/vnd.adobe.photoshop",
    ".ai",
    ".psd",
    ".cdr",

    "application/zip",
    "application/x-rar-compressed",
    ".zip",
    ".rar",

    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
  ],

  label = "Clique ou arraste aqui seu arquivo",
  file = "",
  error,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const newFile = acceptedFiles[0] || null; // Only take the first file
      onFileUpload(newFile);
    },
    accept: acceptedFormats.reduce(
      (acc, format) => {
        if (format.startsWith(".")) {
          acc["application/octet-stream"] = [
            ...(acc["application/octet-stream"] || []),
            format,
          ];
        } else {
          acc[format] = [];
        }
        return acc;
      },
      {} as { [key: string]: string[] },
    ),
    // Only allow single file
  });

  const removeFile = () => {
    onFileUpload("");
  };

  return (
    <div>
      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={`flex items-center justify-center border-dashed border-2 p-4 rounded cursor-pointer ${
          isDragActive ? "border-blue-500" : "border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-lg text-center text-orange-300">
          {isDragActive ? "Solte o arquivo aqui..." : label}
        </p>
        <IoCloudUpload className="px-4 h-20 w-20" />
      </div>

      {/* Uploaded File Display */}
      {file && (
        <div className="text-white mt-2">
          <div className="flex items-center justify-between p-2 border-b border-gray-500">
            <span className="text-sm">
              {typeof file === "string" ? file : file.name}
            </span>
            <button
              type="button"
              className="text-red-500 font-bold px-2"
              onClick={removeFile}
            >
              X
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-red-500 mt-1 text-sm break-words pb-2">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
