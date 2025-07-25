import { FC } from "react";
import { Button, Modal } from "../../../../components";
import { useDeleteProfile } from "../../api/hooks";
import { Profile } from "../../../../types/models/customerprofile";

interface DeleteProfileModalProps {
  profile: Profile;
  idCustomer: number;
  idPrinter: number;
  onClose: () => void;
}

const DeleteProfileModal: FC<DeleteProfileModalProps> = ({
  profile,
  idCustomer,
  idPrinter,
  onClose,
}) => {
  const { mutate: deletePrinter, isPending } = useDeleteProfile({
    onSuccess: () => {
      onClose();
    },
  });

  const handleDelete = () => {
    deletePrinter({ idCustomer, idPrinter, id: profile.id });
  };

  return (
    <Modal title="Deletar Perfil" onClose={onClose}>
      <div className="space-y-4">
        <p>Tem certeza que deseja deletar o perfil {profile.name}?</p>

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

export default DeleteProfileModal;
