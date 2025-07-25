import { useForm } from "react-hook-form";
import { Modal, SelectField, Button } from "../../../components";
import { getOptionFromValue } from "../../../helpers/options/getOptionFromValue";
import {
  productTypeAllOptions,
  serviceOrderProductOptions,
  serviceOrdeAllStatusOptions,
} from "../../../helpers/options/serviceorder";
import { mapToSelectOptions } from "../../../helpers/options/mapToSelectOptions";
import { useUsersList } from "../../users/api/hooks";
import RangeDatePicker from "../../../components/ui/form/RangeDatePicker";
import { useCustomersList } from "../../../features/customers/api/hooks";
import { useTransportsList } from "../../../features/transport/api/hook";
import { useServiceOrderTitles } from "../../serviceOrder/api/hooks";
import SelectMultiField from "../../../components/ui/form/SelectMultiField";

export interface InitialValuesProps {
  product: string | null;
  productType: string | null;
  operator: string | null;
  customer: string | null;
  status: string[] | string | null;
  title: string | null;
  subTitle: string | null;
  transport: string | null;
  createdDate: [Date | null, Date | null] | null;
  dispatchedDate: [Date | null, Date | null] | null;
  createdFrom: string | null;
  createdTo: string | null;
  dispatchedFrom: string | null;
  dispatchedTo: string | null;
}

interface FilterMenuModalProps {
  onClose: () => void;
  setFilters: (changedData: Partial<InitialValuesProps>) => void;
  filters: InitialValuesProps;
  statusOptions?: { value: string; label: string }[]; // Nova propriedade para personalizar as opções de status
  productTypeOptions?: { value: string; label: string }[];
  title?: string; // Propriedade opcional para personalizar o título do modal
  isCustomer?: boolean;
}

const FilterMenuModal: React.FC<FilterMenuModalProps> = ({
  onClose,
  setFilters,
  filters,
  statusOptions = serviceOrdeAllStatusOptions, // Usa todas as opções por padrão
  productTypeOptions = productTypeAllOptions,
  title = "Filtrar", // Título padrão
  isCustomer,
}) => {
  const { data: operators, isPending: isOperatorsPending } = useUsersList({
    group: ["Pré-impressão"],
  });

  const { data: customers, isPending: isCustomersPending } = useCustomersList();
  const { data: transports, isPending: isTransportsPending } =
    useTransportsList();

  // Usando o hook useServiceOrderTitles para obter os títulos e subtítulos
  const { data: titlesData, isPending: isTitlesLoading } =
    useServiceOrderTitles({
      product: filters?.product,
      productType: filters?.productType,
      customer: filters?.customer,
      status: Array.isArray(filters?.status)
        ? filters.status.join(",")
        : filters?.status,
      transport: filters?.transport,
      operator: filters?.operator,
    });

  // Convert customers and transports to select options
  const customerOptions = mapToSelectOptions(
    customers || [],
    "fantasyName",
    "id"
  );
  const transportOptions = mapToSelectOptions(
    transports || [],
    "fantasyName",
    "id"
  );

  // Convertendo os títulos e subtítulos para options
  const titleOptions = (titlesData?.titles || []).map((title) => ({
    value: title,
    label: title,
  }));

  const subtitleOptions = (titlesData?.subTitles || []).map((subtitle) => ({
    value: subtitle,
    label: subtitle,
  }));

  const getStatusDefaultValue = () => {
    if (!filters.status) return [];

    const statusArray = Array.isArray(filters.status)
      ? filters.status
      : [filters.status];

    return statusArray
      .map((statusValue) => getOptionFromValue(statusValue, statusOptions))
      .filter(Boolean); // Remove valores null/undefined
  };

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      product: filters?.product
        ? getOptionFromValue(filters.product, serviceOrderProductOptions)
        : null,
      productType: filters?.productType
        ? getOptionFromValue(filters.productType, productTypeOptions)
        : null,
      operator: filters.operator
        ? getOptionFromValue(
            filters.operator,
            mapToSelectOptions(operators || [], "name", "id")
          )
        : null,
      customer: filters.customer
        ? getOptionFromValue(filters.customer, customerOptions)
        : null,
      status: getStatusDefaultValue(),
      title: filters.title
        ? { value: filters.title, label: filters.title }
        : null,
      subTitle: filters.subTitle
        ? { value: filters.subTitle, label: filters.subTitle }
        : null,
      transport: filters.transport
        ? getOptionFromValue(filters.transport, transportOptions)
        : null,
      createdDate: [filters?.createdFrom, filters?.createdTo],
      dispatchedDate: [filters?.dispatchedFrom, filters?.dispatchedTo],
    },
  });

  const submit = (data: { [key: string]: any }) => {
    const [createdFromRaw, createdToRaw] = data.createdDate || [];
    const [dispatchedFromRaw, dispatchedToRaw] = data.dispatchedDate || [];

    const createdFrom = createdFromRaw ? new Date(createdFromRaw) : null;
    const createdTo = createdToRaw ? new Date(createdToRaw) : null;
    const dispatchedFrom = dispatchedFromRaw
      ? new Date(dispatchedFromRaw)
      : null;
    const dispatchedTo = dispatchedToRaw ? new Date(dispatchedToRaw) : null;

    const processedStatus = Array.isArray(data.status)
      ? data.status.map((item: any) => item.value)
      : data.status?.value
        ? [data.status.value]
        : null;

    setFilters({
      product: data.product?.value || null,
      productType: data.productType?.value || null,
      operator: data.operator?.value || null,
      customer: data.customer?.value || null,
      status: processedStatus,
      title: data.title?.value || null,
      subTitle: data.subTitle?.value || null,
      transport: data.transport?.value || null,
      createdFrom: createdFrom?.toISOString() ?? null,
      createdTo: createdTo?.toISOString() ?? null,
      dispatchedFrom: dispatchedFrom?.toISOString() ?? null,
      dispatchedTo: dispatchedTo?.toISOString() ?? null,
    });

    onClose();
  };

  const clearFilters = () => {
    const emptyFilters = {
      product: null,
      productType: null,
      operator: null,
      customer: null,
      status: [],
      title: null,
      subTitle: null,
      transport: null,
      createdDate: null,
      dispatchedDate: null,
      createdFrom: null,
      createdTo: null,
      dispatchedFrom: null,
      dispatchedTo: null,
    };

    reset({
      product: null,
      productType: null,
      operator: null,
      customer: null,
      status: [],
      title: null,
      subTitle: null,
      transport: null,
      createdDate: [],
      dispatchedDate: [],
    });

    setFilters(emptyFilters);
  };

  return (
    <Modal title={title} onClose={onClose} className="h-auto">
      <form onSubmit={handleSubmit(submit)} className="flex flex-col ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 bg-gray-700 p-4 rounded">
          <RangeDatePicker
            label="Intervalo de Despacho:"
            name="dispatchedDate"
            control={control}
          />
          <RangeDatePicker
            label="Intervalo de Criação:"
            name="createdDate"
            control={control}
          />
          <SelectField
            label="Produto:"
            options={serviceOrderProductOptions}
            control={control}
            name="product"
          />
          <SelectField
            label="Tipo de Produto:"
            options={productTypeOptions}
            control={control}
            name="productType"
          />
          <SelectField
            label="Operador:"
            options={mapToSelectOptions(operators || [], "name", "id")}
            control={control}
            name="operator"
            loading={isOperatorsPending}
          />
          {!isCustomer && (
            <SelectField
              label="Cliente:"
              options={customerOptions}
              control={control}
              name="customer"
              loading={isCustomersPending}
            />
          )}
          <SelectMultiField
            label="Status:"
            options={statusOptions}
            control={control}
            name="status"
          />
          <SelectField
            label="Título:"
            options={titleOptions}
            control={control}
            name="title"
            loading={isTitlesLoading}
          />
          <SelectField
            label="Subtítulo:"
            options={subtitleOptions}
            control={control}
            name="subTitle"
            loading={isTitlesLoading}
          />
          <SelectField
            label="Transporte:"
            options={transportOptions}
            control={control}
            name="transport"
            loading={isTransportsPending}
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

export default FilterMenuModal;
