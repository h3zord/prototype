import { FC } from "react";
import { Customer } from "../../../../types/models/customer";
import { Button, Modal } from "../../../../components";
import { useDeleteCustomer, useDeleteInvoice } from "../../api/hooks";
import { Invoice } from "../../../../types/models/invoice";

interface DeleteInvoiceModalProps {
  invoice: Invoice;
  onClose: () => void;
}

const DeleteInvoiceModal: FC<DeleteInvoiceModalProps> = ({
  invoice,
  onClose,
}) => {
  const { mutate: deleteUser, isPending } = useDeleteInvoice({
    onSuccess: () => {
      onClose();
    },
  });

  const handleDelete = () => {
    deleteUser({ id: invoice.id });
  };

  return (
    <Modal title="Deletar Nota Fiscal" onClose={onClose}>
      <div className="space-y-4">
        <p>Tem certeza que deseja deletar a nota fiscal {invoice.nfNumber}?</p>

        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={isPending}>
            Deletar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteInvoiceModal;
