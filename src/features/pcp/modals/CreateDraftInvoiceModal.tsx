import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../components/ui/modal/Modal";
import { Button, Input } from "../../../components";
import DateInput from "../../../components/ui/form/DateInput";
import CurrencyInputFixed from "../../../components/ui/form/CurrencyInput";
import {
  useCreateDraftInvoice,
  useUpdateServiceOrderInvoice,
} from "../../invoices/api/hooks";
import { convertStringToNumber } from "../../../helpers/convertStringToNumber";
import InputWithPrefix from "../../../components/ui/form/InputWithPrefix";
import { prefixOptions } from "../../../helpers/options/invoices";
import { useServiceOrdersList } from "../../../features/serviceOrder/api/hooks";
import { ServiceOrderStatus } from "../../../types/models/serviceorder";
import SelectMultiField from "../../../components/ui/form/SelectMultiField";
import { mapToSelectOptions } from "../../../helpers/options/mapToSelectOptions";

// Helper function to separate prefix from serial number
const separateSerialNumber = (serialNumber: string) => {
  if (!serialNumber) return { prefix: null, serialOnly: "" };

  const matchedPrefix = prefixOptions.find((option) =>
    serialNumber.startsWith(option.value),
  );

  if (matchedPrefix) {
    return {
      prefix: matchedPrefix,
      serialOnly: serialNumber.substring(matchedPrefix.value?.length),
    };
  }

  return { prefix: null, serialOnly: serialNumber };
};

interface CreateDraftInvoiceModalProps {
  selectedServiceOrders: any[];
  onClose: () => void;
  existingDraft?: any;
  isEditing?: boolean;
}

interface CreateDraftInvoiceSchema {
  nfNumber: string;
  serialNumber: string;
  serialOnly: string;
  prefix: { value: string; label: string } | null;
  purchaseOrder: string;
  invoiceDate: string;
  billingDate: string;
  shippingPrice: string;
  otherPrice: string;
  discount: string;
  serviceOrders: { value: number; label: string }[];
}

const CreateDraftInvoiceModal = ({
  selectedServiceOrders,
  onClose,
  existingDraft,
  isEditing = false,
}: CreateDraftInvoiceModalProps) => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    setError,
    reset,
  } = useForm<CreateDraftInvoiceSchema>();

  useEffect(() => {
    const { prefix, serialOnly } = separateSerialNumber(
      existingDraft?.serialNumber || "",
    );
    reset({
      nfNumber: existingDraft?.nfNumber || "",
      serialNumber: existingDraft?.serialNumber || "",
      prefix,
      serialOnly,
      purchaseOrder: existingDraft?.purchaseOrder?.join(", ") || "",
      invoiceDate: existingDraft?.invoiceDate || "",
      billingDate: existingDraft?.billingDate || "",
      shippingPrice: existingDraft?.shippingPrice?.toString() || "0",
      otherPrice: existingDraft?.otherPrice?.toString() || "0",
      discount: existingDraft?.discount?.toString() || "0",
      serviceOrders: mapToSelectOptions(
        selectedServiceOrders,
        "identificationNumber",
        "id",
      ),
    });
  }, [selectedServiceOrders, existingDraft, reset]);

  console.log("selectedServiceOrder", selectedServiceOrders);

  const createDraftInvoiceMutation = useCreateDraftInvoice({
    onSuccess: () => {
      onClose();
    },
  });

  const updateDraftInvoiceMutation = useUpdateServiceOrderInvoice({
    onSuccess: () => {
      onClose();
    },
  });

  const { data: pcpServiceOrders } = useServiceOrdersList({
    statuses: [
      ServiceOrderStatus.WAITING_PRODUCTION,
      ServiceOrderStatus.PREPRESS,
      ServiceOrderStatus.CREDIT_ANALYSIS,
      ServiceOrderStatus.CONFERENCE,
      ServiceOrderStatus.PREASSEMBLY,
      ServiceOrderStatus.IN_APPROVAL,
      ServiceOrderStatus.RECORDING,
      ServiceOrderStatus.LAYOUT,
      ServiceOrderStatus.IMAGE_PROCESSING,
      ServiceOrderStatus.CNC,
      ServiceOrderStatus.DEVELOPMENT,
      ServiceOrderStatus.LAMINATION,
      ServiceOrderStatus.RUBBERIZING,
    ],
  });

  const submit = (data: CreateDraftInvoiceSchema) => {
    if (!data.serviceOrders || data.serviceOrders.length === 0) {
      setError("serviceOrders", {
        type: "manual",
        message: "Selecione pelo menos uma Ordem de Serviço",
      });
      return;
    }

    if (!data.invoiceDate) {
      setError("invoiceDate", {
        type: "manual",
        message: "Data da Nota Fiscal é obrigatória",
      });
      return;
    }
    const serviceOrderIdsFromMultiSelect = data.serviceOrders?.map(
      (serviceOrder) => serviceOrder.value,
    );

    const serialNumber = data.prefix
      ? `${data.prefix.value}${data.serialOnly}`
      : data.serialOnly;

    console.log(
      "serviceOrderIdsFromMultiSelect",
      serviceOrderIdsFromMultiSelect,
    );

    const invoiceData = {
      serviceOrderIds: serviceOrderIdsFromMultiSelect,
      invoiceDetails: {
        nfNumber: data.nfNumber,
        serialNumber,
        invoiceDate: data.invoiceDate
          ? new Date(data.invoiceDate).toISOString()
          : "",
        billingDate: data.billingDate
          ? new Date(data.billingDate).toISOString()
          : "",
        purchaseOrder: data.purchaseOrder
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
        shippingPrice: convertStringToNumber(data.shippingPrice),
        otherPrice: convertStringToNumber(data.otherPrice),
        discount: convertStringToNumber(data.discount),
        isDraft: true, // Always true for drafts, both creating and editing
      },
    };

    if (isEditing && existingDraft) {
      updateDraftInvoiceMutation.mutate({
        id: existingDraft.id,
        body: invoiceData,
      });
    } else {
      createDraftInvoiceMutation.mutate(invoiceData);
    }
  };

  const serviceOrders = watch("serviceOrders");

  console.log("serviceOrders", serviceOrders);

  const totalServiceOrders = serviceOrders?.length || 0;

  const serviceOrderIds = new Set(serviceOrders?.map((order) => order.value));

  const filteredPcpOrders = selectedServiceOrders?.filter((pcpOrder) =>
    serviceOrderIds.has(pcpOrder.id),
  );

  const customers = [
    ...new Set(filteredPcpOrders?.map((so) => so.customer.fantasyName)),
  ];

  return (
    <Modal
      title={isEditing ? "Editar Pré-Nota Fiscal" : "Faturamento Antecipado"}
      onClose={onClose}
    >
      <div className="mb-4">
        <h4 className="mb-2 font-semibold text-gray-300">
          Ordens de serviço selecionadas ({totalServiceOrders}):
        </h4>

        <ul className="flex flex-wrap gap-2">
          {filteredPcpOrders?.map(({ id, title }: any) => (
            <li
              key={id}
              className="rounded bg-gray-600/70 px-3 py-1 text-sm text-gray-100"
            >
              <span className="font-mono">#{id}</span>
              {title && <span className="ml-2 text-gray-400">{title}</span>}
            </li>
          ))}
        </ul>

        <div className="mt-3 bg-gray-600 p-3 rounded">
          <p className="text-sm text-gray-200">
            <strong>Clientes:</strong> {customers.join(", ")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(submit)} className="space-y-8">
        <div className="grid grid-cols-3 gap-4 bg-gray-700 p-4 rounded">
          <div>
            <Input
              label="Número da NF:"
              register={register("nfNumber", {
                required: "Número da NF é obrigatório",
                minLength: {
                  value: 1,
                  message: "Número da NF é obrigatório",
                },
              })}
              placeholder="Digite o número da NF"
              error={errors?.nfNumber}
            />
          </div>
          <InputWithPrefix
            control={control}
            setValue={setValue}
            name="serialNumber"
            prefixName="prefix"
            inputName="serialOnly"
            options={prefixOptions}
            register={register("serialOnly")}
            error={errors?.serialOnly}
          />
          <div>
            <Input
              label="Ordem de Compra:"
              register={register("purchaseOrder", {
                required: "Ordem de compra é obrigatória",
                minLength: {
                  value: 1,
                  message: "Ordem de compra é obrigatória",
                },
              })}
              placeholder="Digite ordens de compra separadas por vírgula"
              error={errors?.purchaseOrder}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const { value } = e.target;
                e.target.value = value.replace(/\./g, "");
              }}
            />
            <p className="text-xs text-gray-400 mt-1">
              Separe as ordens de compra por vírgula.
            </p>
          </div>
          <DateInput
            label="Data da Nota Fiscal:"
            name="invoiceDate"
            control={control}
            error={errors?.invoiceDate}
            noMinDate={true}
          />
          <DateInput
            label="Data de Faturamento:"
            name="billingDate"
            control={control}
            error={errors?.billingDate}
            noMinDate={true}
          />
          <CurrencyInputFixed
            label="Frete:"
            register={register("shippingPrice", {
              required: "Preço do frete é obrigatório",
              minLength: {
                value: 1,
                message: "Preço do frete é obrigatório",
              },
            })}
            placeholder="0,00"
            error={errors?.shippingPrice}
          />
          <CurrencyInputFixed
            label="Outro:"
            register={register("otherPrice")}
            placeholder="0,00"
            error={errors?.otherPrice}
          />
          <CurrencyInputFixed
            label="Desconto:"
            register={register("discount")}
            placeholder="0,00"
            error={errors?.discount}
          />
          <SelectMultiField
            label="Ordens de Serviço:"
            options={mapToSelectOptions(
              [
                ...selectedServiceOrders,
                ...(pcpServiceOrders || []).filter(
                  (order) =>
                    !selectedServiceOrders.find((so) => so.id === order.id),
                ),
              ],
              "identificationNumber",
              "id",
            )}
            control={control}
            name="serviceOrders"
            error={errors?.serviceOrders}
          />
        </div>

        <div className="bg-yellow-600/20 border border-yellow-600 p-4 rounded">
          <p className="text-sm text-yellow-200">
            <strong>Atenção:</strong> Esta será uma pré-nota fiscal (rascunho).
            Ela aparecerá na tela de faturamento para finalização posterior.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={
              createDraftInvoiceMutation.isPending ||
              updateDraftInvoiceMutation.isPending
            }
          >
            {createDraftInvoiceMutation.isPending ||
            updateDraftInvoiceMutation.isPending
              ? isEditing
                ? "Salvando..."
                : "Criando..."
              : isEditing
                ? "Salvar Alterações"
                : "Criar Pré-Nota"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateDraftInvoiceModal;
