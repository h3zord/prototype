import { Button, Modal } from "../../../components";
import { useInsertMeasureServiceOrder } from "../../serviceOrder/api/hooks";
import {
  insertMeasuresCorrugatedClicheFormSchema,
  transformFormToSchema,
  InsertMeasuresCorrugatedClicheFormInput,
} from "../../serviceOrder/api/schemas";
import ClicheColorsTable from "./ClicheColors";
import { formatPrice } from "../../../helpers/formatter";
import { getLabelFromValue } from "../../../helpers/options/getOptionFromValue";
import { productTypeCorrugatedClicheOptions } from "../../../helpers/options/serviceorder";
import {
  ServiceOrderProduct,
  ServiceOrderProductType,
} from "../../../types/models/serviceorder";
import { makeInsertMeasureBody } from "../helpers/makeInsertMeasureBody";
import { Input } from "../../../components/components/ui/input";
import { usePermission } from "../../../context/PermissionsContext";
import { PermissionType } from "../../permissions/permissionsTable";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Control,
  FieldErrors,
  useForm,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";

interface NewAlterationFormProps {
  register: UseFormRegister<InsertMeasuresCorrugatedClicheFormInput>;
  errors: FieldErrors<InsertMeasuresCorrugatedClicheFormInput>;
  control: Control<InsertMeasuresCorrugatedClicheFormInput>;
  watch: UseFormWatch<InsertMeasuresCorrugatedClicheFormInput>;
}

const NewAlterationForm: React.FC<NewAlterationFormProps> = ({
  register,
  errors,
  control,
  watch,
}) => {
  return (
    <div>
      <div className="bg-gray-700 p-4 rounded">
        <div className="text-xl w-fit text-gray-800 bg-gray-400 px-5 py-1 rounded">
          Clichê
        </div>
        <ClicheColorsTable
          control={control}
          register={register}
          watch={watch}
          errors={errors}
        />
      </div>
    </div>
  );
};

const getDefaultValues = (serviceOrder: any) => {
  const measures =
    serviceOrder?.printerDetails?.corrugatedPrinterDetails?.measures;
  const productType = serviceOrder?.productType;

  // Verificar se existe uma data na ordem de serviço
  const serviceOrderRecordingDate = serviceOrder?.recordingDate
    ? new Date(serviceOrder.recordingDate).toISOString().split("T")[0]
    : null;

  // Data atual formatada como YYYY-MM-DD para o campo de data (fallback)
  const currentDate = new Date().toISOString().split("T")[0];

  if (measures) {
    // Priorizar a data das medidas se existir
    const measuresRecordingDate = measures.recordingDate
      ? new Date(measures.recordingDate).toISOString().split("T")[0]
      : null;

    // Usar a data das medidas, ou a data da ordem de serviço, ou a data atual (nessa ordem de prioridade)
    const finalRecordingDate =
      measuresRecordingDate || serviceOrderRecordingDate || currentDate;

    return {
      productType,
      recordingDate: finalRecordingDate,
      colors: measures?.colors?.map((color: any) => {
        return {
          quantity: color.quantity?.toString() || "", // Converter para string
          width: color.width?.toString() || "", // Converter para string
          height: color.height?.toString() || "", // Converter para string
          tint: color.tint || null, // Manter tint se existir
        };
      }),
    };
  }

  return {
    productType,
    // Usar a data da ordem de serviço, se existir, ou a data atual
    recordingDate: serviceOrderRecordingDate || currentDate,
    colors: [
      {
        quantity: "",
        width: "",
        height: "",
        tint: null,
      },
    ],
  };
};

interface InsertMeasuresCorrugatedClicheModalProps {
  onClose: () => void;
  selectedServiceOrder: any;
}

const InsertMeasuresCorrugatedClicheModal: React.FC<
  InsertMeasuresCorrugatedClicheModalProps
> = ({ onClose, selectedServiceOrder }) => {
  const { hasPermission } = usePermission();
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InsertMeasuresCorrugatedClicheFormInput>({
    resolver: zodResolver(insertMeasuresCorrugatedClicheFormSchema),
    defaultValues: getDefaultValues(selectedServiceOrder),
  });

  const insertMeasureServiceOrderMutation = useInsertMeasureServiceOrder({
    onSuccess: () => {
      onClose();
    },
  });

  const submit = (formData: InsertMeasuresCorrugatedClicheFormInput) => {
    // Transformar dados do form para o schema da API
    const data = transformFormToSchema(formData);

    const { recordingDate, ...restData } = data;

    const body = makeInsertMeasureBody({
      product: ServiceOrderProduct.CLICHE_CORRUGATED,
      measureData: {
        ...restData,
        id: selectedServiceOrder.id,
        type: ServiceOrderProduct.CLICHE_CORRUGATED,
        productType: replacementProductType
          ? replacementProductType
          : productType,
      },
      recordingDate: recordingDate,
    });

    insertMeasureServiceOrderMutation.mutate(body);
  };

  const customerWithPrice = selectedServiceOrder?.externalCustomer
    ? selectedServiceOrder?.externalCustomer
    : selectedServiceOrder?.customer;

  const productType = selectedServiceOrder?.productType;

  const replacementProductType = selectedServiceOrder.replacementProductType;

  const isNewAlterationReassemblyReplacementReprintOrTest =
    productType === ServiceOrderProductType.NEW ||
    productType === ServiceOrderProductType.ALTERATION ||
    productType === ServiceOrderProductType.REASSEMBLY ||
    productType === ServiceOrderProductType.REPLACEMENT ||
    productType === ServiceOrderProductType.REPRINT ||
    productType === ServiceOrderProductType.TEST;

  const isRepair =
    productType === ServiceOrderProductType.REPAIR ||
    replacementProductType === ServiceOrderProductType.REPAIR;

  const isReassembly =
    productType === ServiceOrderProductType.REASSEMBLY ||
    replacementProductType === ServiceOrderProductType.REASSEMBLY;

  const priceToUseForCliche = isReassembly
    ? customerWithPrice?.clicheReAssemblyPrice
    : customerWithPrice?.clicheCorrugatedPrice;

  const totalCliche =
    (watch("colors") ?? []).reduce((acc: number, color: any) => {
      const quantity =
        typeof color.quantity === "string"
          ? parseFloat(color.quantity)
          : color.quantity;
      const width =
        typeof color.width === "string" ? parseFloat(color.width) : color.width;
      const height =
        typeof color.height === "string"
          ? parseFloat(color.height)
          : color.height;

      if (isNaN(quantity) || isNaN(width) || isNaN(height)) return acc;

      return acc + quantity * width * height;
    }, 0) * priceToUseForCliche || 0;

  let total = 0;
  let formulaTexto = "";

  if (isNewAlterationReassemblyReplacementReprintOrTest && !isRepair) {
    total = totalCliche;
    formulaTexto = `Soma das medidas × ${isReassembly ? "Preço Remontagem" : "Preço Clichê"}`;
  } else if (isRepair) {
    total =
      customerWithPrice?.clicheRepairPrice *
      selectedServiceOrder?.printerDetails?.quantityColorsToRepair;
    formulaTexto = "Quantidade de cores × Preço Conserto";
  }

  return (
    <Modal title="Medidas Clichê Corrugado" onClose={onClose}>
      <form onSubmit={handleSubmit(submit)} className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-xl font-medium">
            Tipo de Produto:{" "}
            {getLabelFromValue(productType, productTypeCorrugatedClicheOptions)}{" "}
            {replacementProductType &&
              `de ${getLabelFromValue(
                replacementProductType,
                productTypeCorrugatedClicheOptions,
              )}`}
          </div>
          <div className="flex items-center">
            <label htmlFor="recordingDate" className="mr-2 text-nowrap">
              Data da Gravação:
            </label>
            <Input
              type="date"
              id="recordingDate"
              className="border border-gray-300 rounded px-2 py-1"
              {...register("recordingDate")}
            />
          </div>
        </div>

        {isNewAlterationReassemblyReplacementReprintOrTest && !isRepair ? (
          <NewAlterationForm
            register={register}
            errors={errors}
            control={control}
            watch={watch}
          />
        ) : null}

        {hasPermission(PermissionType.VIEW_PCP_PRICES) && (
          <>
            {isNewAlterationReassemblyReplacementReprintOrTest && !isRepair ? (
              <div>
                <div>
                  {isReassembly
                    ? `Preço remontagem no cliente = ${formatPrice({ price: customerWithPrice?.clicheReAssemblyPrice, digits: 3 })}`
                    : `Preço clichê no cliente = ${formatPrice({ price: customerWithPrice?.clicheCorrugatedPrice, digits: 3 })}`}
                </div>

                <h3>{`Total: ${formatPrice({ price: total, digits: 3 })}`}</h3>
                <p>
                  <strong>Fórmula:</strong> {formulaTexto}
                </p>
              </div>
            ) : null}

            {isRepair ? (
              <div>
                <div>
                  {`Preço conserto no cliente: ${formatPrice({ price: customerWithPrice?.clicheRepairPrice })}`}
                </div>
                <div>
                  {`Quantidade de cores na OS: ${selectedServiceOrder?.printerDetails?.quantityColorsToRepair}`}
                </div>
                <div>{`Total = Preço conserto no cliente x Qtd cores na OS = ${formatPrice({ price: total })}`}</div>
              </div>
            ) : null}
          </>
        )}

        <div className="flex justify-end gap-4">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={insertMeasureServiceOrderMutation.isPending}
          >
            Salvar alterações
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default InsertMeasuresCorrugatedClicheModal;
