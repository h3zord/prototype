import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal, Button, Input } from "../../../../components";
import {
  createPurchaseOrderSchema,
  CreatePurchaseOrderSchemaZod,
} from "../../api/schemas";
import { useUpdateServiceOrderPurchaseOrder } from "../../api/hooks";
import { UpsertServiceOrderPurchaseOrderBody } from "../../api/services";
import { zodResolver } from "@hookform/resolvers/zod";

interface CreatePurchaseOrderModalProps {
  onClose: () => void;
  serviceOrders: any[];
}

const CreatePurchaseOrderModal: React.FC<CreatePurchaseOrderModalProps> = ({
  onClose,
  serviceOrders,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreatePurchaseOrderSchemaZod>({
    resolver: zodResolver(createPurchaseOrderSchema),
    defaultValues: {
      purchaseOrder: "",
    },
  });

  const hasExistingPurchaseOrder = serviceOrders.some(
    (order: any) => order.purchaseOrder && order.purchaseOrder.trim() !== "",
  );

  useEffect(() => {
    if (serviceOrders?.length > 0) {
      const firstPurchaseOrder = serviceOrders[0]?.purchaseOrder || "";
      setValue("purchaseOrder", firstPurchaseOrder);
    }
  }, [serviceOrders, setValue]);

  const updatePurchaseOrderMutation = useUpdateServiceOrderPurchaseOrder({
    onSuccess: () => {
      onClose();
    },
  });

  const submit = (data: CreatePurchaseOrderSchemaZod) => {
    const body: UpsertServiceOrderPurchaseOrderBody = {
      serviceOrderIds: serviceOrders.map(
        (serviceOrder: any) => serviceOrder.id,
      ),
      purchaseOrder: data.purchaseOrder,
    };

    updatePurchaseOrderMutation.mutate(body);
  };

  return (
    <Modal title="Cadastrar Ordem de Compra" onClose={onClose}>
      <form onSubmit={handleSubmit(submit)} className="space-y-8">
        {hasExistingPurchaseOrder && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded">
            Atenção: uma ou mais ordens de serviço selecionadas já possuem uma
            ordem de compra cadastrada. Ao salvar, o valor informado substituirá
            o atual.
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 bg-gray-700 p-4 rounded">
          <Input
            label="Ordem de Compra:"
            register={register("purchaseOrder")}
            placeholder="Digite a Ordem de Compra"
            error={errors?.purchaseOrder}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button type="submit" loading={updatePurchaseOrderMutation.isPending}>
            Cadastrar Ordem de Compra
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreatePurchaseOrderModal;
