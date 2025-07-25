import ModifyServiceOrderTransportModal from "../../../features/pcp/modals/ModifyModalTransport";
import { useModal } from "../../../hooks/useModal";

export const TransportTableInfo = ({ serviceOrder }: any) => {
  const { openModal, closeModal } = useModal();

  const handleModifyClick = () => {
    openModal("modifyServiceOrder", ModifyServiceOrderTransportModal, {
      selectedServiceOrder: serviceOrder,
      onClose: () => {
        closeModal("modifyServiceOrder");
      },
    });
  };

  return serviceOrder.transport?.fantasyName ? (
    <div
      className="hover:text-orange-400 cursor-pointer text-[10px]"
      onClick={handleModifyClick}
    >
      {serviceOrder.transport?.fantasyName}
    </div>
  ) : (
    "-"
  );
};
