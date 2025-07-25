import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Modal, Button, Input } from "../../../../components";
import DateInput from "../../../../components/ui/form/DateInput";
import { useCreateServiceOrderInvoice } from "../../../invoices/api/hooks";
import { UpsertServiceOrderInvoiceBody } from "../../../invoices/api/services";
import CurrencyInputFixed from "../../../../components/ui/form/CurrencyInput";
import { convertStringToNumber } from "../../../../helpers/convertStringToNumber";
import { useUpdateServiceOrderPurchaseOrder } from "../../api/hooks";
import { prefixOptions } from "../../../../helpers/options/invoices";
import InputWithPrefix from "../../../../components/ui/form/InputWithPrefix";

const separateSerialNumber = (serialNumber: string) => {
  if (!serialNumber) return { prefix: null, serialOnly: "" };

  const matchedPrefix = prefixOptions.find((option) =>
    serialNumber.startsWith(option.value),
  );

  if (matchedPrefix) {
    return {
      prefix: matchedPrefix,
      serialOnly: serialNumber.substring(matchedPrefix.value.length),
    };
  }

  return { prefix: null, serialOnly: serialNumber };
};

interface CreateInvoiceFormValues {
  nfNumber: string;
  serialNumber: string;
  serialOnly: string;
  prefix: { value: string; label: string } | null;
  invoiceDate: string;
  billingDate: string;
  shippingPrice: string;
  purchaseOrder: string;
  otherPrice: string;
  discount: string;
}

interface CreateInvoiceModalProps {
  onClose: () => void;
  serviceOrders: any[];
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  onClose,
  serviceOrders,
}) => {
  const methods = useForm<CreateInvoiceFormValues>({
    defaultValues: {
      nfNumber: "",
      serialNumber: "",
      serialOnly: "",
      prefix: null,
      invoiceDate: "",
      billingDate: "",
      shippingPrice: "",
      purchaseOrder: "",
      otherPrice: "",
      discount: "",
    },
  });
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    setError,
  } = methods;

  const [message, setMessage] = useState<React.ReactNode>("");

  const serviceOrderIds = serviceOrders.map(
    (serviceOrder: any) => serviceOrder.id,
  );

  useEffect(() => {
    if (!serviceOrders?.length) return;

    console.log("All serviceOrders received:", serviceOrders);
    serviceOrders.forEach((order, index) => {
      console.log(`ServiceOrder ${index}:`, {
        id: order.id,
        invoiceDetails: order.invoiceDetails,
        isDraft: order.invoiceDetails?.isDraft,
      });
    });

    const serviceOrderWithDraft = serviceOrders.find(
      (order) => order.invoiceDetails?.isDraft === true,
    );
    const draftInvoice = serviceOrderWithDraft?.invoiceDetails;

    console.log("Found serviceOrderWithDraft:", serviceOrderWithDraft);
    console.log("Draft invoice data:", draftInvoice);

    if (draftInvoice) {
      console.log("AAAAAAAAAAAAAAAAAA: ", draftInvoice);
      setValue("nfNumber", draftInvoice.nfNumber || "");

      const { prefix, serialOnly } = separateSerialNumber(
        draftInvoice.serialNumber || "",
      );
      setValue("serialNumber", draftInvoice.serialNumber || "");
      setValue("prefix", prefix);
      setValue("serialOnly", serialOnly);

      setValue(
        "invoiceDate",
        draftInvoice.invoiceDate
          ? new Date(draftInvoice.invoiceDate).toISOString()
          : "",
      );
      setValue(
        "billingDate",
        draftInvoice.billingDate
          ? new Date(draftInvoice.billingDate).toISOString()
          : "",
      );
      setValue("shippingPrice", draftInvoice.shippingPrice?.toString() || "0");
      setValue("otherPrice", draftInvoice.otherPrice?.toString() || "0");
      setValue("discount", draftInvoice.discount?.toString() || "0");

      if (draftInvoice.purchaseOrder?.length) {
        setValue("purchaseOrder", draftInvoice.purchaseOrder.join(", "));
      }

      setMessage(
        <div className="bg-yellow-600/20 border border-yellow-600 p-4 rounded">
          <p className="text-sm text-yellow-200">
            <strong>Atenção:</strong> Esta será uma pré-nota fiscal (rascunho).
            Ela aparecerá na tela de faturamento para finalização posterior.
          </p>
        </div>,
      );
      return;
    }

    const allPurchaseOrders = serviceOrders.map(
      (order) => order.purchaseOrder?.trim() || "",
    );
    const uniquePurchaseOrders = [...new Set(allPurchaseOrders)];

    const firstDispatchDate = serviceOrders[0]?.dispatchDate || "";
    setValue("invoiceDate", firstDispatchDate);

    // Apenas 1 OS com OC válida
    if (serviceOrders.length === 1 && uniquePurchaseOrders[0] !== "") {
      setValue("purchaseOrder", uniquePurchaseOrders[0]);
      return;
    }

    // Multiplas OS, todas com OC igual e não vazia
    const allFilled = allPurchaseOrders.every((oc) => oc !== "");
    if (uniquePurchaseOrders.length === 1 && allFilled) {
      setValue("purchaseOrder", uniquePurchaseOrders[0]);
    } else {
      // Caso contrário, exibir mensagem de alerta
      const ids = serviceOrders
        .filter((order) => order.purchaseOrder?.trim() !== "")
        .map((order) => `${order.id}`);

      if (ids.length > 0) {
        const formatted =
          ids.length === 1
            ? ids[0]
            : `${ids.slice(0, -1).join(", ")} e ${ids[ids.length - 1]}`;

        const warningMessage = `Atenção: A OS ${formatted} já possu${ids.length > 1 ? "em" : "i"} uma OC cadastrada. O valor será sobrescrito.`;
        setMessage(warningMessage);
      }
    }
  }, [serviceOrders, setValue]);

  const createServiceOrderInvoiceMutation = useCreateServiceOrderInvoice({
    onSuccess: () => {
      onClose();
    },
  });

  const updatePurchaseOrderMutation = useUpdateServiceOrderPurchaseOrder({});

  const submit = (data: any) => {
    if (!data.invoiceDate?.trim()) {
      setError("invoiceDate", {
        type: "manual",
        message: "Data de despacho é obrigatória",
      });
      return;
    }

    const body: UpsertServiceOrderInvoiceBody = {
      serviceOrderIds,
      invoiceDetails: {
        nfNumber: data.nfNumber,
        serialNumber: data.serialNumber,
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
        isDraft: false, // Always set to false when finalizing
      },
    };

    createServiceOrderInvoiceMutation.mutate(body, {
      onSuccess: () => {
        updatePurchaseOrderMutation.mutate({
          serviceOrderIds,
          purchaseOrder: data.purchaseOrder,
        });
      },
    });
  };

  return (
    <Modal title="Cadastrar Nota Fiscal" onClose={onClose}>
      <div className="mb-4">
        <h4 className="mb-2 font-semibold text-gray-300">
          Ordens de serviço selecionadas ({serviceOrders.length}):
        </h4>

        <ul className="flex flex-wrap gap-2">
          {serviceOrders.map(({ id, title }: any) => (
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
      <div className="text-end">
        {message && (
          <div
            className={`p-2 rounded ${
              typeof message === "string" && message.includes("pré-carregados")
                ? "bg-blue-600/20 text-blue-200"
                : "text-red-400"
            }`}
          ></div>
        )}
      </div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(submit)} className="space-y-8">
          <div className="grid grid-cols-3 gap-4 bg-gray-700 p-4 rounded">
            <div>
              <Input
                label="N° NF:"
                register={register("nfNumber", {
                  required: "N° NF é obrigatório",
                  minLength: {
                    value: 1,
                    message: "N° NF é obrigatório",
                  },
                })}
                placeholder="Digite N° NF"
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
                  required: "Ordem de Compra é obrigatória",
                  minLength: {
                    value: 1,
                    message: "Ordem de Compra é obrigatória",
                  },
                })}
                placeholder="Ordem de compra"
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
              label="Despacho:"
              name="invoiceDate"
              control={control}
              error={errors?.invoiceDate}
              noMinDate={true}
            />
            <DateInput
              label="Data faturamento:"
              name="billingDate"
              control={control}
              error={errors?.billingDate}
              noMinDate={true}
            />
            <CurrencyInputFixed
              label="Frete:"
              register={register("shippingPrice", {
                required: "Frete é obrigatório",
                minLength: {
                  value: 1,
                  message: "Frete é obrigatório",
                },
              })}
              endIcon={"R$"}
              placeholder="Digite o preço"
              error={errors?.shippingPrice}
            />
            <CurrencyInputFixed
              label="Outro:"
              register={register("otherPrice")}
              endIcon={"R$"}
              placeholder="Digite o preço"
              error={errors?.otherPrice}
            />
            <CurrencyInputFixed
              label="Desconto:"
              register={register("discount")}
              endIcon={"R$"}
              placeholder="Digite o preço"
              error={errors?.discount}
            />
          </div>
          {typeof message !== "string" && message}

          <div className="flex justify-end gap-4">
            <Button onClick={onClose} type="button" variant="secondary">
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={createServiceOrderInvoiceMutation.isPending}
            >
              Cadastrar nota fiscal
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default CreateInvoiceModal;
