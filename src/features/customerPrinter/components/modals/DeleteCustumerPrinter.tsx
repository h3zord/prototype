import { FC } from "react";
import { Button, Modal } from "../../../../components";
import { useDeletePrinter } from "../../api/hooks";
import { Printer } from "../../../../types/models/customerprinter";

interface DeleteCustomerPrinterModalProps {
  printer: Printer;
  idCustomer: number;
  onClose: () => void;
}

const DeleteCustomerPrinterModal: FC<DeleteCustomerPrinterModalProps> = ({
  printer,
  idCustomer,
  onClose,
}) => {
  const { mutate: deletePrinter, isPending } = useDeletePrinter({
    onSuccess: () => {
      onClose();
    },
  });

  const handleDelete = () => {
    deletePrinter({ idCustomer, id: printer.id });
  };

  return (
    <Modal title="Deletar Impressora" onClose={onClose}>
      <div className="space-y-4">
        <p>Tem certeza que deseja deletar a impressora {printer.name}?</p>

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

export default DeleteCustomerPrinterModal;
