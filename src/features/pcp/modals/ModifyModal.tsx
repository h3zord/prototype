import { useForm } from "react-hook-form";
import { useUsersList } from "../../users/api/hooks";
import DateInput from "../../../components/ui/form/DateInput";
import { mapToSelectOptions } from "../../../helpers/options/mapToSelectOptions";
import { Button, Modal, SelectField } from "../../../components";
import { getOptionFromValue } from "../../../helpers/options/getOptionFromValue";
import { unitOptions } from "../../../helpers/options/customer";
import type { Resolver } from "react-hook-form";
import { useModifyServiceOrder } from "../../serviceOrder/api/hooks";
import { ModifyServiceOrderBody } from "../../serviceOrder/api/services";
import {
  ModifyServiceOrderFormData,
  modifyServiceOrderSchema,
  OptionalModifyServiceOrderFormData,
  optionalModifyServiceOrderSchema,
} from "../../serviceOrder/api/schemas";
import {
  getServiceOrderStatuses,
  onlyClicheCorrugatedOrderStatusOption,
  onlyDieCutBlockOrderStatusOption,
  serviceOrdeAllStatusOptions,
  serviceOrderClicheStatusOptions,
  serviceOrderDieCutBlockStatusOptions,
} from "../../../helpers/options/serviceorder";
import {
  ServiceOrderProduct,
  ServiceOrderStatus,
} from "../../../types/models/serviceorder";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Unit } from "../../../types/models/customer";

interface ModifyServiceOrderModalProps {
  onClose: () => void;
  selectedServiceOrder: any | any[];
}

type ModifyFormData =
  | ModifyServiceOrderFormData
  | OptionalModifyServiceOrderFormData;

const ModifyServiceOrderModal: React.FC<ModifyServiceOrderModalProps> = ({
  onClose,
  selectedServiceOrder,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ModifyFormData>({
    resolver: (Array.isArray(selectedServiceOrder)
      ? zodResolver(optionalModifyServiceOrderSchema)
      : zodResolver(modifyServiceOrderSchema)) as Resolver<ModifyFormData>,
    defaultValues: (() => {
      const so = !Array.isArray(selectedServiceOrder)
        ? selectedServiceOrder
        : selectedServiceOrder.length === 1
          ? selectedServiceOrder[0]
          : null;

      if (!so) return {};

      return {
        operator: {
          value: so.operator.id,
          label: `${so.operator.firstName} ${so.operator.lastName}`,
        },
        transport: {
          value: so.transport.id,
          label: so.transport.fantasyName,
        },
        unit: getOptionFromValue(so.unit, unitOptions),
        status: getOptionFromValue(so.status, getServiceOrderStatuses(so)),
        dispatchDate: so.dispatchDate,
      };
    })(),
  });

  const [hasMultipleProductTypes, setHasMultipleProductTypes] =
    useState<boolean>();

  const [warningStatusMessage, setWarningStatusMessage] = useState<string>();
  const [warningTransportMessage, setWarningTransportMessage] =
    useState<string>();

  const { data: users, isPending: isUsersPending } = useUsersList({
    group: ["Pré-impressão"],
  });

  function getCustomerTransports() {
    const transportsMap = new Map<
      number,
      { id: number; fantasyName: string }
    >();

    if (Array.isArray(selectedServiceOrder)) {
      selectedServiceOrder.forEach(({ customer }) => {
        const { transport, secondaryTransport } = customer;

        if (transport) {
          transportsMap.set(transport.id, transport);
        }

        if (Array.isArray(secondaryTransport)) {
          secondaryTransport.forEach((st) => {
            if (st.transport) {
              transportsMap.set(st.transport.id, st.transport);
            }
          });
        }
      });
    } else {
      const { transport, secondaryTransport } =
        selectedServiceOrder?.customer || {};

      if (transport) {
        transportsMap.set(transport.id, transport);
      }

      if (Array.isArray(secondaryTransport)) {
        secondaryTransport.forEach((st) => {
          if (st.transport) {
            transportsMap.set(st.transport.id, st.transport);
          }
        });
      }
    }

    return Array.from(transportsMap.values());
  }

  const modifyServiceOrderMutation = useModifyServiceOrder({
    onSuccess: () => {
      onClose();
    },
  });

  const submit = (data: ModifyFormData) => {
    let body: ModifyServiceOrderBody;

    if (Array.isArray(selectedServiceOrder)) {
      body = {
        serviceOrderIds: selectedServiceOrder.map(
          (serviceOrder) => serviceOrder.id,
        ),
        operatorId: data?.operator?.value,
        transportId: data?.transport?.value,
        dispatchDate: data?.dispatchDate
          ? new Date(data?.dispatchDate).toISOString()
          : undefined,
        status: data?.status?.value as ServiceOrderStatus,
        unit: data?.unit?.value as Unit,
      };
      console.log(body);
    } else {
      if (
        !data.operator?.value ||
        !data.transport?.value ||
        !data.unit?.value ||
        !data.status?.value ||
        !data.dispatchDate
      )
        return;

      body = {
        serviceOrderIds: [selectedServiceOrder.id],
        operatorId: data.operator.value,
        transportId: data.transport.value,
        dispatchDate: new Date(data.dispatchDate).toISOString(),
        status: data.status.value as ServiceOrderStatus,
        unit: data.unit.value as Unit,
      };
    }

    modifyServiceOrderMutation.mutate(body);
  };

  useEffect(() => {
    if (Array.isArray(selectedServiceOrder)) {
      const hasOnlyClicheCorrugated = selectedServiceOrder.every(
        (serviceOrder) =>
          serviceOrder.product === ServiceOrderProduct.CLICHE_CORRUGATED,
      );

      const hasOnlyDieCutBlock = selectedServiceOrder.every(
        (serviceOrder) =>
          serviceOrder.product === ServiceOrderProduct.DIECUTBLOCK,
      );

      if (!hasOnlyClicheCorrugated && !hasOnlyDieCutBlock) {
        setHasMultipleProductTypes(true);
      }
    }
  }, [selectedServiceOrder]);

  const status = watch("status");

  useEffect(() => {
    if (hasMultipleProductTypes && Array.isArray(selectedServiceOrder)) {
      const isClicheCorrugatedStatus =
        onlyClicheCorrugatedOrderStatusOption.some(
          (option) => option.value === status?.value,
        );

      const isDieCutBlockStatus = onlyDieCutBlockOrderStatusOption.some(
        (option) => option.value === status?.value,
      );

      if (isClicheCorrugatedStatus) {
        const dieCutBlockServiceOrderIds = selectedServiceOrder
          .filter(
            (serviceOrder) =>
              serviceOrder.product === ServiceOrderProduct.DIECUTBLOCK,
          )
          .map((serviceOrder) => serviceOrder.identificationNumber);

        return setWarningStatusMessage(
          `${
            dieCutBlockServiceOrderIds.length > 1
              ? `OS ${dieCutBlockServiceOrderIds.join(", ")} são do tipo "Forma".`
              : `OS ${dieCutBlockServiceOrderIds[0]} é do tipo "Forma".`
          } Não é possivel colocar status de OS do tipo "Clichê Corrugado" em OS do tipo "Forma"`,
        );
      }

      if (isDieCutBlockStatus) {
        const clicheCorrugatedServiceOrderIds = selectedServiceOrder
          .filter(
            (serviceOrder) =>
              serviceOrder.product === ServiceOrderProduct.CLICHE_CORRUGATED,
          )
          .map((serviceOrder) => serviceOrder.identificationNumber);

        return setWarningStatusMessage(
          `${
            clicheCorrugatedServiceOrderIds.length > 1
              ? `OS ${clicheCorrugatedServiceOrderIds.join(", ")} são do tipo "Clichê Corrugado".`
              : `OS ${clicheCorrugatedServiceOrderIds[0]} é do tipo "Cliche Corrugado".`
          } Não é possivel colocar status de OS do tipo "Forma" em OS do tipo "Clichê Corrugado"`,
        );
      }

      return setWarningStatusMessage("");
    }

    return setWarningStatusMessage("");
  }, [hasMultipleProductTypes, selectedServiceOrder, status]);

  useEffect(() => {
    if (Array.isArray(selectedServiceOrder)) {
      if (status?.value === ServiceOrderStatus.DISPATCHED) {
        const serviceOrderIdsNotPreparedToDispatch = selectedServiceOrder
          .filter((serviceOrder) => !serviceOrder.preparedToDispatch)
          .map((serviceOrder) => serviceOrder.identificationNumber);

        if (serviceOrderIdsNotPreparedToDispatch.length > 1) {
          return setWarningStatusMessage(
            `OS ${serviceOrderIdsNotPreparedToDispatch.join(", ")} não estão preparadas para despacho`,
          );
        }

        if (serviceOrderIdsNotPreparedToDispatch.length === 1) {
          return setWarningStatusMessage(
            `OS ${serviceOrderIdsNotPreparedToDispatch[0]} não está preparada para despacho`,
          );
        }
      }
    }
  }, [selectedServiceOrder, status]);

  const transport = watch("transport");

  useEffect(() => {
    if (!transport) {
      return setWarningTransportMessage("");
    }

    if (Array.isArray(selectedServiceOrder)) {
      const customersWithoutTransport = selectedServiceOrder
        .filter(({ customer }) => {
          const primary = customer.transport?.id === transport?.value;

          const secondary = Array.isArray(customer.secondaryTransport)
            ? customer.secondaryTransport.some(
                (st: { transport: { id: number } }) =>
                  st.transport?.id === transport?.value,
              )
            : false;

          return !primary && !secondary;
        })
        .map(({ customer }) => customer.fantasyName);

      if (customersWithoutTransport.length) {
        return setWarningTransportMessage(`
          ${
            customersWithoutTransport.length > 1
              ? `Os clientes ${customersWithoutTransport.join(", ")} não possuem o transporte ${transport.label} cadastrado`
              : `O cliente ${customersWithoutTransport[0]} não possui o transporte ${transport.label} cadastrado`
          }
        `);
      }

      setWarningTransportMessage("");
    }
  }, [selectedServiceOrder, transport]);

  const getServiceOrderStatusesOptions = (serviceOrder: any | any[]) => {
    let options;

    if (Array.isArray(serviceOrder)) {
      const hasOnlyClicheCorrugated = serviceOrder.every(
        (serviceOrder) =>
          serviceOrder.product === ServiceOrderProduct.CLICHE_CORRUGATED,
      );

      const hasOnlyDieCutBlock = serviceOrder.every(
        (serviceOrder) =>
          serviceOrder.product === ServiceOrderProduct.DIECUTBLOCK,
      );

      if (hasOnlyClicheCorrugated) {
        options = serviceOrderClicheStatusOptions;
      } else if (hasOnlyDieCutBlock) {
        options = serviceOrderDieCutBlockStatusOptions;
      } else {
        options = serviceOrdeAllStatusOptions;
      }

      const hasServiceOrderPreparedToDispatch = serviceOrder.some(
        (serviceOrder) => serviceOrder.preparedToDispatch,
      );

      if (!hasServiceOrderPreparedToDispatch) {
        options = options.filter((option) => {
          return option.value !== ServiceOrderStatus.DISPATCHED;
        });
      }
    } else {
      options = getServiceOrderStatuses(serviceOrder);

      if (!serviceOrder.preparedToDispatch) {
        options = options.filter((option) => {
          return option.value !== ServiceOrderStatus.DISPATCHED;
        });
      }
    }

    options = options.filter((option) => {
      return option.value !== ServiceOrderStatus.FINALIZED;
    });

    return options;
  };

  return (
    <Modal title="Alterar Dados de Ordem de Serviço" onClose={onClose}>
      {Array.isArray(selectedServiceOrder) && (
        <div className="mb-2">
          <h4 className="mb-2 font-semibold text-gray-300">
            Ordens de serviço selecionadas ({selectedServiceOrder.length}):
          </h4>

          <ul className="flex flex-wrap gap-2">
            {selectedServiceOrder.map(({ id, title }: any) => (
              <li
                key={id}
                className="rounded bg-gray-600/70 px-3 py-1 text-sm text-gray-100"
              >
                <span className="font-mono">#{id}</span>
                {title && <span className="ml-2 text-gray-400">{title}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit(submit)} className="space-y-3">
        <div className="grid grid-cols-1 gap-4 bg-gray-700 p-4 rounded">
          <SelectField
            label="Status:"
            warning={warningStatusMessage}
            options={getServiceOrderStatusesOptions(selectedServiceOrder)}
            control={control}
            name="status"
            error={errors.status}
          />
          <SelectField
            label="Operador:"
            options={mapToSelectOptions(users, "name", "id")}
            control={control}
            name="operator"
            error={errors.operator}
            loading={isUsersPending}
          />
          <SelectField
            label="Transporte:"
            warning={warningTransportMessage}
            options={mapToSelectOptions(
              getCustomerTransports(),
              "fantasyName",
              "id",
            )}
            control={control}
            name="transport"
            error={errors.transport}
          />
          <SelectField
            label="Unidade:"
            options={unitOptions}
            control={control}
            name="unit"
            error={errors.unit}
          />
          <DateInput
            label="Despacho:"
            name="dispatchDate"
            control={control}
            error={errors?.dispatchDate}
          />
        </div>
        {selectedServiceOrder.length > 1 && (
          <div className="bg-yellow-600/20 border border-yellow-600 p-4 rounded">
            <p className="text-sm text-yellow-200">
              <strong>Atenção:</strong> Preencha somente os campos que você
              deseja editar. As informações dos campos que não forem preenchidas
              não serão alteradas.
            </p>
          </div>
        )}
        <div className="flex justify-end gap-4">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={modifyServiceOrderMutation.isPending}
            disabled={!!(warningStatusMessage || warningTransportMessage)}
          >
            Salvar alterações
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ModifyServiceOrderModal;
