import { FC } from "react";
import { useDeleteUser } from "../../api/hooks";
import Modal from "../../../../components/ui/modal/Modal";
import { Button } from "../../../../components";
import { User } from "../../../../types/models/user";

interface DeleteUserModalProps {
  user: User;
  onClose: () => void;
}

const DeleteUserModal: FC<DeleteUserModalProps> = ({ user, onClose }) => {
  const { mutate: deleteUser, isPending } = useDeleteUser({
    onSuccess: () => {
      onClose();
    },
  });

  const handleDelete = () => {
    deleteUser({ id: user.id });
  };

  return (
    <Modal title="Deletar Usuário" className="w-3/12" onClose={onClose}>
      <div className="space-y-4">
        <p>Tem certeza que deseja deletar o usuário {user.name}?</p>

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

export default DeleteUserModal;
