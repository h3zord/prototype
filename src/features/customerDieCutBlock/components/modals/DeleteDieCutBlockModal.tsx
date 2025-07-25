import { FC } from "react";
import { Button, Modal } from "../../../../components";
import { useDeleteDieCutBlock } from "../../api/hooks";
import { DieCutBlock } from "../../../../types/models/cutomerdiecutblock";

interface DeleteDieCutBlockModalProps {
  dieCutBlock: DieCutBlock;
  idCustomer: number;
  idPrinter: number;
  idCylinder: number;
  onClose: () => void;
}

const DeleteDieCutBlockModal: FC<DeleteDieCutBlockModalProps> = ({
  dieCutBlock,
  idCustomer,
  idPrinter,
  idCylinder,
  onClose,
}) => {
  const { mutate: deletePrinter, isPending } = useDeleteDieCutBlock({
    onSuccess: () => {
      onClose();
    },
  });

  const handleDelete = () => {
    deletePrinter({ idCustomer, idCylinder, idPrinter, id: dieCutBlock.id });
  };

  return (
    <Modal title="Deletar Faca" onClose={onClose}>
      <div className="space-y-4">
        <p>Tem certeza que deseja deletar a faca {dieCutBlock.distortion}?</p>

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

export default DeleteDieCutBlockModal;
