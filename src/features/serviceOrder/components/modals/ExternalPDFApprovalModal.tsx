// ExternalPDFApprovalModal.tsx
import React, { useEffect, useState } from "react";
import { Modal, Button } from "../../../../components";
import { useExternalPDF, useUpdateExternalPDFStatus } from "../../api/hooks";

interface ExternalPDFApprovalModalProps {
  serviceOrder: any;
  onClose: () => void;
}

const ExternalPDFApprovalModal: React.FC<ExternalPDFApprovalModalProps> = ({
  serviceOrder,
  onClose,
}) => {
  const {
    data: pdfBlob,
    isLoading: pdfLoading,
    error: pdfError,
  } = useExternalPDF(serviceOrder.id);
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    if (pdfBlob) {
      const objectUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [pdfBlob]);

  const [submitting, setSubmitting] = useState(false);
  const { mutate } = useUpdateExternalPDFStatus({
    onSuccess: () => {
      setSubmitting(false);
      onClose();
    },
    onError: () => {
      setSubmitting(false);
    },
  });

  const handleApprove = () => {
    setSubmitting(true);
    mutate({ serviceOrderId: serviceOrder.id, pdfApprovalStatus: "APROVADO" });
  };

  const handleReject = () => {
    setSubmitting(true);
    mutate({
      serviceOrderId: serviceOrder.id,
      pdfApprovalStatus: "NAO_APROVADO",
    });
  };

  return (
    <Modal title="Ver PDF Externo" onClose={onClose}>
      {pdfLoading ? (
        <div>Carregando PDF...</div>
      ) : pdfError ? (
        <div>Erro ao carregar PDF</div>
      ) : (
        <iframe
          src={pdfUrl ? pdfUrl : undefined}
          style={{ width: "100%", height: "400px" }}
          title="PDF Externo"
        />
      )}
      <div className="flex justify-end gap-4 mt-4">
        <Button onClick={handleReject} variant="danger" disabled={submitting}>
          Não Aprovar
        </Button>
        <Button onClick={handleApprove} disabled={submitting}>
          Aprovar
        </Button>
      </div>
    </Modal>
  );
};

export default ExternalPDFApprovalModal;
