import RangeDatePicker from "../../../components/ui/form/RangeDatePicker";
import { useForm } from "react-hook-form";
import { Modal, SelectField, Button } from "../../../components";
import { mapToSelectOptions } from "../../../helpers/options/mapToSelectOptions";
import { useUsersList } from "../../users/api/hooks";
import { getOptionFromValue } from "../../../helpers/options/getOptionFromValue";
import { useTransportsList } from "../../../features/transport/api/hook";
import { useCustomersList } from "../../../features/customers/api/hooks";
import {
  productTypeAllOptions,
  replacementProductTypeOptions,
  serviceOrderProductOptions,
} from "../../../helpers/options/serviceorder";
import { useInvoiceNumbersList } from "../../../features/invoices/api/hooks";
import { SetStateAction, Dispatch } from "react";

interface FilterWithDateModalProps {
  onClose: () => void;
  setFilters: Dispatch<SetStateAction<FilterState>>;
  filters: FilterState;
  isReplacementMenu?: boolean;
  productTypeOptions?: { value: string; label: string }[];
}

// Define o tipo para o estado de filtros
export interface FilterState {
  dispatchedDate: Date[] | null;
  customer: string | number | null;
  product: string | number | null;
  productType: string | number | null;
  replacementProductType: string | number | null;
  operator: string | number | null;
  transport: string | number | null;
  nfNumber: string | number | null;
}

type ValueAndLabelObject = {
  value: string | number;
  label: string;
};

interface FilterServiceOrderForm {
  dispatchedDate: Date[] | null;
  customer: ValueAndLabelObject | null;
  product: ValueAndLabelObject | null;
  productType: ValueAndLabelObject | null;
  replacementProductType: ValueAndLabelObject | null;
  operator: ValueAndLabelObject | null;
  transport: ValueAndLabelObject | null;
  nfNumber: ValueAndLabelObject | null;
}

const FilterWithDateModal: React.FC<FilterWithDateModalProps> = ({
  onClose,
  setFilters,
  filters,
  productTypeOptions = productTypeAllOptions,
  isReplacementMenu = false,
}) => {
  const { data: operators, isPending: isOperatorsPending } = useUsersList({
    group: ["Pré-impressão"],
  });

  const { data: customers, isPending: isCustomersPending } = useCustomersList();

  const { data: transports, isPending: isTransportPending } =
    useTransportsList();

  const { data: invoiceNumbers, isPending: isInvoiceNumbersPending } =
    useInvoiceNumbersList();

  const initialValues: FilterServiceOrderForm = {
    dispatchedDate: null,
    customer: null,
    product: null,
    productType: null,
    replacementProductType: null,
    operator: null,
    transport: null,
    nfNumber: null,
  };

  const {
    control,
    handleSubmit,
    reset,
    // Removendo errors já que não está sendo usado
  } = useForm<FilterServiceOrderForm>({
    defaultValues: {
      product: filters?.product
        ? getOptionFromValue(filters.product, serviceOrderProductOptions)
        : null,
      productType: filters?.productType
        ? getOptionFromValue(filters.productType, productTypeOptions)
        : null,
      replacementProductType: filters?.replacementProductType
        ? getOptionFromValue(
            filters.replacementProductType,
            replacementProductTypeOptions,
          )
        : null,
      operator: filters?.operator
        ? getOptionFromValue(
            filters.operator,
            mapToSelectOptions(operators || [], "name", "id"),
          )
        : null,
      transport: filters?.transport
        ? getOptionFromValue(
            filters.transport,
            mapToSelectOptions(transports || [], "fantasyName", "id"),
          )
        : null,
      customer: filters?.customer
        ? getOptionFromValue(
            filters.customer,
            mapToSelectOptions(customers || [], "name", "id"),
          )
        : null,
      nfNumber: filters?.nfNumber
        ? getOptionFromValue(
            filters.nfNumber,
            mapToSelectOptions(invoiceNumbers || [], "nfNumber", "id"),
          )
        : null,
      dispatchedDate: filters?.dispatchedDate || null,
    },
  });

  const submit = (data: FilterServiceOrderForm) => {
    const newFilters: FilterState = {
      dispatchedDate: data.dispatchedDate,
      customer: data.customer?.value || null,
      product: data.product?.value || null,
      productType: data.productType?.value || null,
      replacementProductType: data.replacementProductType?.value || null,
      operator: data.operator?.value || null,
      transport: data.transport?.value || null,
      nfNumber: data.nfNumber?.value || null,
    };

    setFilters(newFilters);
    onClose();
  };

  const clearFilters = () => {
    setFilters({
      dispatchedDate: null,
      customer: null,
      product: null,
      productType: null,
      replacementProductType: null,
      operator: null,
      transport: null,
      nfNumber: null,
    });
    reset(initialValues);
  };

  return (
    <Modal title="Filtrar" onClose={onClose} className="h-auto">
      <form onSubmit={handleSubmit(submit)} className="flex flex-col ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 bg-gray-700 p-4 rounded">
          <RangeDatePicker
            label="Intervalo de Despacho:"
            name="dispatchedDate"
            control={control}
          />
          <SelectField
            label="Clientes:"
            options={mapToSelectOptions(customers || [], "name", "id")}
            control={control}
            name="customer"
            loading={isCustomersPending}
          />
          <SelectField
            label="Produto:"
            options={serviceOrderProductOptions}
            control={control}
            name="product"
          />
          <SelectField
            label={
              isReplacementMenu ? "Tipo de Reposição:" : "Tipo de Produto:"
            }
            options={
              isReplacementMenu
                ? replacementProductTypeOptions
                : productTypeOptions
            }
            control={control}
            name={isReplacementMenu ? "replacementProductType" : "productType"}
          />

          <SelectField
            label="Operador:"
            options={mapToSelectOptions(operators || [], "name", "id")}
            control={control}
            name="operator"
            loading={isOperatorsPending}
          />
          <SelectField
            label="Transporte:"
            options={mapToSelectOptions(transports || [], "fantasyName", "id")}
            control={control}
            name="transport"
            loading={isTransportPending}
          />
          <SelectField
            label="Número NF:"
            options={mapToSelectOptions(invoiceNumbers || [], "nfNumber", "id")}
            control={control}
            name="nfNumber"
            loading={isInvoiceNumbersPending}
          />
        </div>
        <div className="flex justify-end space-x-4 mt-20">
          <Button type="button" variant="secondary" onClick={clearFilters}>
            Limpar Filtros
          </Button>
          <Button type="submit" variant="primary">
            Filtrar
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FilterWithDateModal;
