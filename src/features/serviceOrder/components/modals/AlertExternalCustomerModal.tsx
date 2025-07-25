import { Button, Modal } from "../../../../components";

interface AlertExternalCustomerModalProps {
  onClose: () => void;
  serviceOrders: any;
}

const AlertExternalCustomerModal: React.FC<AlertExternalCustomerModalProps> = ({
  onClose,
}) => {
  return (
    <Modal title="Atenção" onClose={onClose}>
      <div className="text-lg pb-2">
        O cliente externo(para faturar) deve ter os mesmo produtos do cliente
        principal.
      </div>
      <div className="flex justify-center mt-10">
        <Button type="button" onClick={onClose}>
          Entendi
        </Button>
      </div>
    </Modal>
  );
};

export default AlertExternalCustomerModal;
