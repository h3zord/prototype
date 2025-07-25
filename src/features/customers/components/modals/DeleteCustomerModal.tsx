import { FC } from "react";
import { Customer } from "../../../../types/models/customer";
import { Button, Modal } from "../../../../components";
import { useDeleteCustomer } from "../../api/hooks";

interface DeleteCustomerModalProps {
  customer: Customer;
  onClose: () => void;
}

const DeleteCustomerModal: FC<DeleteCustomerModalProps> = ({
  customer,
  onClose,
}) => {
  const { mutate: deleteUser, isPending } = useDeleteCustomer({
    onSuccess: () => {
      onClose();
    },
  });

  const handleDelete = () => {
    deleteUser({ id: customer.id });
  };

  return (
    <Modal title="Deletar Cliente" onClose={onClose}>
      <div className="space-y-4">
        <p>Tem certeza que deseja deletar o cliente {customer.name}?</p>

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

export default DeleteCustomerModal;
