import React, { useEffect, useRef, useState } from "react";
import { ImageIcon } from "lucide-react";
import {
  useFileQuery,
  FileType,
} from "../../../../../src/features/serviceOrder/api/hooks";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

const SUPPORTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

type PdfPreviewProps = {
  serviceOrderId: number;
  fileType: FileType;
};

const PdfPreview: React.FC<PdfPreviewProps> = ({
  serviceOrderId,
  fileType,
}) => {
  const { data, isFetching } = useFileQuery(serviceOrderId, fileType);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);

  useEffect(() => {
    if (!data?.blob || !containerRef.current) return;

    let isCancelled = false;
    const blob = data.blob;
    const mime = blob.type;
    setMimeType(mime);

    if (mime === "application/pdf") {
      const fileReader = new FileReader();
      fileReader.onload = async function () {
        if (isCancelled) return;

        try {
          const typedArray = new Uint8Array(this.result as ArrayBuffer);
          const pdf = await getDocument({ data: typedArray }).promise;
          if (isCancelled) return;

          const page = await pdf.getPage(1);
          if (isCancelled) return;

          const container = containerRef.current!;
          const canvas = canvasRef.current;
          if (!canvas) return;

          const scaleFactor = 0.95;
          const availableWidth = container.clientWidth * scaleFactor;
          const availableHeight = container.clientHeight * scaleFactor;

          const viewport = page.getViewport({ scale: 1 });
          const scale = Math.min(
            availableWidth / viewport.width,
            availableHeight / viewport.height,
          );

          const scaledViewport = page.getViewport({ scale });

          canvas.width = scaledViewport.width;
          canvas.height = scaledViewport.height;
          canvas.style.width = `${scaledViewport.width}px`;
          canvas.style.height = `${scaledViewport.height}px`;

          const context = canvas.getContext("2d");
          await page.render({
            canvasContext: context!,
            viewport: scaledViewport,
          }).promise;
        } catch (error) {
          console.error("Erro ao renderizar PDF:", error);
        }
      };
      fileReader.readAsArrayBuffer(blob);
    }

    return () => {
      isCancelled = true;
    };
  }, [data]);

  const canPreview = mimeType && SUPPORTED_TYPES.includes(mimeType);

  return (
    <div
      ref={containerRef}
      className="border rounded-[10px] border-black p-1 h-[145px] w-[250px] flex items-center justify-center overflow-hidden bg-gray-50"
    >
      {isFetching ? (
        <span className="text-sm text-gray-500">Carregando…</span>
      ) : canPreview ? (
        mimeType === "application/pdf" ? (
          <div className="h-full w-full flex items-center justify-center">
            <canvas ref={canvasRef} className="h-full max-w-full" />
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <img
              src={data ? URL.createObjectURL(data.blob) : ""}
              alt="Preview"
              className="h-full max-w-full object-contain"
            />
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-2">
          <ImageIcon className="w-12 h-12 text-gray-400" />
          <span className="text-xs text-gray-500 mt-1">Sem visualização</span>
        </div>
      )}
    </div>
  );
};

export default PdfPreview;
