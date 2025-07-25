import { FC } from "react";
import { Button, Modal } from "../../../../components";
import { useDeleteCylinder } from "../../api/hooks";
import { Cylinder } from "../../../../types/models/customercylinder";

interface DeleteCylinderModalProps {
  cylinder: Cylinder;
  idCustomer: number;
  idPrinter: number;
  onClose: () => void;
}

const DeleteCylinderModal: FC<DeleteCylinderModalProps> = ({
  cylinder,
  idCustomer,
  idPrinter,
  onClose,
}) => {
  const { mutate: deleteCylinder, isPending } = useDeleteCylinder({
    onSuccess: () => {
      onClose();
    },
  });

  const handleDelete = () => {
    deleteCylinder({ idCustomer, idPrinter, id: cylinder.id });
  };

  return (
    <Modal title="Deletar Cilindro" onClose={onClose}>
      <div className="space-y-4">
        <p>Tem certeza que deseja deletar o cilindro {cylinder.id}?</p>

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

export default DeleteCylinderModal;
