import { Button, Modal } from "../../../components";

interface CantInsertMeasuresModalProps {
  onClose: () => void;
  serviceOrder: any;
}

const CantInsertMeasuresModal: React.FC<CantInsertMeasuresModalProps> = ({
  serviceOrder,
  onClose,
}) => {
  const messageDieCutBlock = (
    <div>
      Em Conferência, Desenvolvimento, CNC, Laminação ou Emborrachamento
    </div>
  );

  const messageCliche = (
    <div>Em Conferência, Pré-impressão, Pré-montagem, Gravação</div>
  );
  return (
    <Modal title="Atenção" onClose={onClose}>
      <div className="text-lg pb-2">
        Só é possível inserir medidas nos seguintes status:
        {serviceOrder?.dieCutBlockDetails ? messageDieCutBlock : messageCliche}
      </div>

      <div className="flex justify-center mt-10">
        <Button type="button" onClick={onClose}>
          Entendi
        </Button>
      </div>
    </Modal>
  );
};

export default CantInsertMeasuresModal;
