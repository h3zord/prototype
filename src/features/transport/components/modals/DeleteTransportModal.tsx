import { FC } from "react";
import { Button, Modal } from "../../../../components";
import { useDeleteTransport } from "../../api/hook";
import { Transport } from "../../../../types/models/transport";

interface DeleteTransportModalProps {
  transport: Transport;
  onClose: () => void;
}

const DeleteTransportModal: FC<DeleteTransportModalProps> = ({
  transport,
  onClose,
}) => {
  const { mutate: deleteUser, isPending } = useDeleteTransport({
    onSuccess: () => {
      onClose();
    },
  });

  const handleDelete = () => {
    deleteUser({ id: transport.id });
  };

  return (
    <Modal title="Deletar Transporte" className="w-3/12" onClose={onClose}>
      <div className="space-y-4">
        <p>Tem certeza que deseja deletar o transporte {transport.name}?</p>

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

export default DeleteTransportModal;
