import React, { useRef, useState } from "react";
import { useUploadExternalPDF } from "../api/hooks";
import { Button } from "../../../components";

interface InlinePDFUploaderProps {
  serviceOrder: any;
  initialLabel?: string;
}

const InlinePDFUploader: React.FC<InlinePDFUploaderProps> = ({
  serviceOrder,
  initialLabel,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { mutate } = useUploadExternalPDF({
    onSuccess: () => {
      setIsUploading(false);
    },
    onError: () => {
      setIsUploading(false);
    },
  });

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      mutate({ serviceOrderId: serviceOrder.id, file });
    }
  };

  const buttonText = isUploading
    ? "Enviando..."
    : (initialLabel ?? "Enviar PDF");
  const buttonClass = initialLabel
    ? "bg-red-500 text-white inline-block px-2 py-1 rounded-xl font-semibold border border-red-600"
    : "";

  return (
    <div className="flex items-center">
      <Button
        onClick={handleClick}
        disabled={isUploading}
        className={buttonClass}
      >
        {buttonText}
      </Button>
      <input
        type="file"
        accept="application/pdf"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default InlinePDFUploader;
