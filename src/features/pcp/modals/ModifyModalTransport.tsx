import { useForm } from "react-hook-form";
import { Modal, SelectField, Button } from "../../../components";
import { mapToSelectOptions } from "../../../helpers/options/mapToSelectOptions";
import { useModifyServiceOrder } from "../../serviceOrder/api/hooks";
import { ModifyServiceOrderBody } from "../../serviceOrder/api/services";
import { modifyTransportOnlySchema } from "../../serviceOrder/api/schemas";
import { useGetCustomerById } from "../../customers/api/hooks";
import { zodResolver } from "@hookform/resolvers/zod";

interface ModifyServiceOrderModalProps {
  onClose: () => void;
  selectedServiceOrder: any;
}

const ModifyServiceOrderTransportModal: React.FC<
  ModifyServiceOrderModalProps
> = ({ onClose, selectedServiceOrder }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(modifyTransportOnlySchema),
    defaultValues: {
      transport: {
        value: selectedServiceOrder.transport.id,
        label: selectedServiceOrder.transport.fantasyName,
      },
    },
  });

  const { data: customer, isPending: isGetCustomerByIdPending } =
    useGetCustomerById(selectedServiceOrder.customerId);

  const customerTransports = customer
    ? [customer.transport, ...(customer.secondaryTransport || [])].filter(
        Boolean,
      )
    : [];

  const modifyServiceOrderMutation = useModifyServiceOrder({
    onSuccess: () => {
      onClose();
    },
  });

  const submit = (data: { transport?: { value?: number } }) => {
    if (!data.transport?.value) return;

    const body: ModifyServiceOrderBody = {
      serviceOrderIds: [selectedServiceOrder.id],
      transportId: data.transport.value,
    };

    modifyServiceOrderMutation.mutate(body);
  };

  return (
    <Modal title="Alterar Transporte" onClose={onClose}>
      <form onSubmit={handleSubmit(submit)} className="space-y-40">
        <div className="grid grid-cols-1 gap-4 bg-gray-700 p-4 rounded">
          <SelectField
            label="Transporte:"
            options={mapToSelectOptions(
              customerTransports,
              "fantasyName",
              "id",
            )}
            control={control}
            name="transport"
            error={errors.transport}
            loading={isGetCustomerByIdPending}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button type="submit" loading={modifyServiceOrderMutation.isPending}>
            Salvar alterações
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ModifyServiceOrderTransportModal;
