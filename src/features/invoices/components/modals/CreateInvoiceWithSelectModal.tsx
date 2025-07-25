import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Modal, Button, Input } from "../../../../components";
import DateInput from "../../../../components/ui/form/DateInput";
import SelectMultiField from "../../../../components/ui/form/SelectMultiField";
import { mapToSelectOptions } from "../../../../helpers/options/mapToSelectOptions";
import { useServiceOrdersList } from "../../../serviceOrder/api/hooks";
import { ServiceOrderStatus } from "../../../../types/models/serviceorder";
import {
  CreateServiceOrderInvoiceWithSelectSchema,
  createServiceOrderInvoiceWithSelectSchema,
} from "../../api/schemas";
import { useCreateServiceOrderInvoice } from "../../api/hooks";
import { UpsertServiceOrderInvoiceBody } from "../../api/services";
import CurrencyInputFixed from "../../../../components/ui/form/CurrencyInput";
import InputWithPrefix from "../../../../components/ui/form/InputWithPrefix";
import { prefixOptions } from "../../../../helpers/options/invoices";

interface CreateInvoiceWithSelectModalProps {
  onClose: () => void;
  serviceOrders: any;
}

const CreateInvoiceWithSelectModal: React.FC<
  CreateInvoiceWithSelectModalProps
> = ({ onClose }) => {
  const {
    control,
    handleSubmit,
    register,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CreateServiceOrderInvoiceWithSelectSchema>({
    resolver: zodResolver(createServiceOrderInvoiceWithSelectSchema),
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
      serviceOrders: [],
    },
  });

  const { data: serviceOrdersDistpachedList } = useServiceOrdersList({
    statuses: [ServiceOrderStatus.DISPATCHED],
  });

  console.log("serviceOrdersDistpachedList", serviceOrdersDistpachedList);

  const createServiceOrderInvoiceMutation = useCreateServiceOrderInvoice({
    onSuccess: () => {
      onClose();
    },
  });

  const submit = (data: CreateServiceOrderInvoiceWithSelectSchema) => {
    if (!data.invoiceDate?.trim()) {
      setError("invoiceDate", {
        type: "manual",
        message: "Data de despacho é obrigatória",
      });
      return;
    }

    // Função melhorada para parse de valores monetários
    const parseCurrency = (
      value: string | number | undefined | null
    ): number => {
      if (typeof value === "number") {
        return value;
      }
      if (typeof value === "string") {
        // Remove pontos de milhares e substitui vírgula decimal por ponto
        const cleanedValue = value.replace(/\./g, "").replace(",", ".");
        const parsed = parseFloat(cleanedValue);
        return isNaN(parsed) ? 0 : parsed;
      }
      return 0;
    };

    const body: UpsertServiceOrderInvoiceBody = {
      serviceOrderIds: data.serviceOrders.map(
        (serviceOrder) => serviceOrder.value
      ),
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
        shippingPrice: parseCurrency(data.shippingPrice),
        otherPrice: parseCurrency(data.otherPrice),
        discount: parseCurrency(data.discount),
      },
    };

    createServiceOrderInvoiceMutation.mutate(body);
  };

  return (
    <Modal title="Cadastrar Nota Fiscal" onClose={onClose}>
      <form onSubmit={handleSubmit(submit)} className="space-y-8">
        <div className="grid grid-cols-3 gap-4 bg-gray-700 p-4 rounded">
          <div>
            <Input
              label="N° NF:"
              register={register("nfNumber")}
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
            error={errors?.serialNumber}
          />

          <div>
            <Input
              label="Ordem de Compra:"
              register={register("purchaseOrder")}
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
            register={register(`shippingPrice`)}
            endIcon={"R$"}
            placeholder="Digite o preço"
            error={errors?.shippingPrice}
          />
          <CurrencyInputFixed
            label="Outro:"
            register={register(`otherPrice`)}
            endIcon={"R$"}
            placeholder="Digite o preço"
            error={errors?.otherPrice}
          />
          <CurrencyInputFixed
            label="Desconto:"
            register={register(`discount`)}
            endIcon={"R$"}
            placeholder="Digite o preço"
            error={errors?.discount}
          />
          <div className="col-span-3">
            <SelectMultiField
              label="Ordens de Serviço:"
              options={mapToSelectOptions(
                serviceOrdersDistpachedList,
                "identificationNumber",
                "id"
              )}
              control={control}
              name="serviceOrders"
              error={errors?.serviceOrders}
            />
          </div>
        </div>

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
    </Modal>
  );
};

export default CreateInvoiceWithSelectModal;
